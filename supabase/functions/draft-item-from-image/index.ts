import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl, userId } = await req.json();

    if (!imageUrl || !userId) {
      throw new Error('Image URL and user ID are required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch user's most recent item for context
    const { data: recentItems } = await supabase
      .from('supplies')
      .select('*')
      .eq('owner_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);

    const recentItem = recentItems?.[0];

    // Build context from recent item
    let contextPrompt = '';
    if (recentItem) {
      contextPrompt = `\n\nThe user's most recent item listing:\n` +
        `Location: ${recentItem.location || 'Not specified'}\n` +
        `Contact: ${recentItem.contact_email || 'Not specified'}\n` +
        `House Rules: ${recentItem.house_rules?.join(', ') || 'None specified'}\n` +
        `Their previous items tend to be in this style of description.`;
    }

    // Call Lovable AI to analyze the image and draft item details
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are an assistant that helps create item listings for a party supply sharing community. 
Analyze the uploaded image and create a draft listing with:
- name: Short, descriptive name (max 60 chars)
- description: Helpful description (2-3 sentences, max 200 chars)
- category: One of: tools, home-diy, art-craft, camping-outdoors, sports, beach-surf, party-events, kitchen, kids, misc
- condition: One of: excellent, good, fair

Return ONLY valid JSON with these exact keys, no markdown formatting.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this party supply item and create a listing.${contextPrompt}`
              },
              {
                type: 'image_url',
                image_url: { url: imageUrl }
              }
            ]
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from AI');
    }

    // Parse the AI response
    let draftedItem;
    try {
      // Remove markdown code blocks if present
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      draftedItem = JSON.parse(cleanContent);
    } catch (e) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Failed to parse AI response');
    }

    // Add context from recent item
    const result = {
      ...draftedItem,
      neighborhood: recentItem?.neighborhood || '',
      crossStreets: recentItem?.cross_streets || '',
      contactEmail: recentItem?.contact_email || '',
      houseRules: recentItem?.house_rules || [],
    };

    console.log('Successfully drafted item:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in draft-item-from-image:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
