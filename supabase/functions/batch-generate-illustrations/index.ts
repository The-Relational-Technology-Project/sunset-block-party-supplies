import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all supplies without illustrations
    const { data: supplies, error } = await supabase
      .from('supplies')
      .select('id, name, description, images, image_url')
      .is('illustration_url', null);

    if (error) throw error;

    if (!supplies || supplies.length === 0) {
      return new Response(
        JSON.stringify({ message: 'All items already have illustrations', count: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating illustrations for ${supplies.length} items...`);
    const results = [];

    // Generate illustrations one by one
    for (const supply of supplies) {
      try {
        const prompt = `Create a minimalist black and white line drawing illustration of: ${supply.name}. 
        
Style requirements:
- Simple, clean line art similar to technical catalog illustrations
- Black lines on white background
- No shading, no gradients, no color
- Clear, recognizable silhouette
- Product-focused perspective
- Technical drawing aesthetic like McMaster-Carr catalog

Item description: ${supply.description}

Make it simple, iconic, and immediately recognizable.`;

        console.log(`Generating illustration for: ${supply.name}`);

        // Generate the illustration using Lovable AI
        const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash-image',
            messages: [
              {
                role: 'user',
                content: prompt
              }
            ],
            modalities: ['image', 'text']
          }),
        });

        if (!aiResponse.ok) {
          const errorText = await aiResponse.text();
          console.error(`AI error for ${supply.name}:`, aiResponse.status, errorText);
          results.push({ id: supply.id, name: supply.name, success: false, error: errorText });
          continue;
        }

        const aiData = await aiResponse.json();
        const generatedImage = aiData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
        
        if (!generatedImage) {
          console.error(`No image generated for ${supply.name}`);
          results.push({ id: supply.id, name: supply.name, success: false, error: 'No image generated' });
          continue;
        }

        // Update the supply record
        const { error: updateError } = await supabase
          .from('supplies')
          .update({ illustration_url: generatedImage })
          .eq('id', supply.id);

        if (updateError) {
          console.error(`Error updating ${supply.name}:`, updateError);
          results.push({ id: supply.id, name: supply.name, success: false, error: updateError.message });
        } else {
          console.log(`✓ Generated illustration for: ${supply.name}`);
          results.push({ id: supply.id, name: supply.name, success: true });
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (itemError) {
        console.error(`Error processing ${supply.name}:`, itemError);
        results.push({ 
          id: supply.id, 
          name: supply.name, 
          success: false, 
          error: itemError instanceof Error ? itemError.message : 'Unknown error' 
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    console.log(`Batch generation complete: ${successCount}/${supplies.length} successful`);

    return new Response(
      JSON.stringify({ 
        message: 'Batch generation complete',
        total: supplies.length,
        successful: successCount,
        failed: supplies.length - successCount,
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Batch generation error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});