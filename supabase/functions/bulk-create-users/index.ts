import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Get vouched join requests that don't have corresponding auth users
    const { data: joinRequests, error: joinError } = await supabaseAdmin
      .from('join_requests')
      .select('name, email, status')
      .eq('status', 'vouched');

    if (joinError) throw joinError;

    const results = [];

    for (const request of joinRequests || []) {
      try {
        // Check if user already exists in profiles (which means they have an auth account)
        const { data: existingProfile } = await supabaseAdmin
          .from('profiles')
          .select('id')
          .eq('email', request.email)
          .maybeSingle();

        if (existingProfile) {
          results.push({
            email: request.email,
            status: 'already_exists',
            message: 'User already has an account'
          });
          continue;
        }

        // Create auth user
        const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: request.email,
          password: crypto.randomUUID(), // Generate a random password
          email_confirm: true, // Auto-confirm email
          user_metadata: {
            name: request.name
          }
        });

        if (authError) throw authError;

        // The trigger should automatically create the profile, but let's verify
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second for trigger

        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('id')
          .eq('id', authUser.user.id)
          .maybeSingle();

        if (!profile) {
          // Create profile manually if trigger didn't work
          await supabaseAdmin
            .from('profiles')
            .insert({
              id: authUser.user.id,
              name: request.name,
              email: request.email,
              vouched_at: new Date().toISOString(),
              vouched_by: null // System vouched
            });
        } else {
          // Update existing profile to mark as vouched
          await supabaseAdmin
            .from('profiles')
            .update({
              vouched_at: new Date().toISOString(),
              vouched_by: null // System vouched
            })
            .eq('id', authUser.user.id);
        }

        results.push({
          email: request.email,
          status: 'created',
          user_id: authUser.user.id,
          message: 'User account created successfully'
        });

      } catch (error) {
        results.push({
          email: request.email,
          status: 'error',
          message: error.message
        });
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        results,
        summary: {
          total: results.length,
          created: results.filter(r => r.status === 'created').length,
          already_exists: results.filter(r => r.status === 'already_exists').length,
          errors: results.filter(r => r.status === 'error').length
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});