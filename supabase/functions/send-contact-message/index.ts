import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Define validation schema
const ContactRequestSchema = z.object({
  senderName: z.string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  senderContact: z.string()
    .trim()
    .min(1, "Contact information is required")
    .max(255, "Contact information must be less than 255 characters")
    .refine(
      (val) => {
        // Check if it's either a valid email or a phone number
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[\d\s\-\+\(\)]{7,20}$/;
        return emailRegex.test(val) || phoneRegex.test(val);
      },
      "Must be a valid email address or phone number"
    ),
  message: z.string()
    .trim()
    .min(1, "Message is required")
    .max(2000, "Message must be less than 2000 characters"),
  supplyId: z.string().uuid("Invalid supply ID"),
  supplyName: z.string().trim().min(1).max(200),
  supplyOwnerId: z.string().uuid("Invalid owner ID"),
  supplyOwnerEmail: z.string().email("Invalid owner email"),
});

type ContactRequest = z.infer<typeof ContactRequestSchema>;

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const rawBody = await req.json();
    
    // Validate input data
    const validationResult = ContactRequestSchema.safeParse(rawBody);
    
    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error.errors);
      return new Response(
        JSON.stringify({ 
          error: "Invalid input data",
          details: validationResult.error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        }),
        { 
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }

    const requestData: ContactRequest = validationResult.data;
    
    console.log("Validated contact request for supply:", requestData.supplyName);

    // Store the supply request in the database
    const { data: supplyRequest, error: dbError } = await supabase
      .from('supply_requests')
      .insert({
        supply_id: requestData.supplyId,
        supply_name: requestData.supplyName,
        supply_owner_id: requestData.supplyOwnerId,
        sender_name: requestData.senderName,
        sender_contact: requestData.senderContact,
        message: requestData.message,
        status: 'pending'
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error(`Failed to save supply request: ${dbError.message}`);
    }

    console.log("Supply request saved:", supplyRequest);

    // Send email notification to supply owner
    const emailResponse = await resend.emails.send({
      from: "Party Supplies Community <onboarding@resend.dev>",
      to: [requestData.supplyOwnerEmail],
      subject: `Interest in your supply: ${requestData.supplyName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f97316;">Someone is interested in your supply!</h2>
          
          <div style="background: #fff7ed; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #ea580c;">Supply: ${requestData.supplyName}</h3>
          </div>

          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #374151;">Message from ${requestData.senderName}:</h4>
            <p style="line-height: 1.6; color: #6b7280;">${requestData.message.replace(/\n/g, '<br>')}</p>
          </div>

          <div style="background: #fef3f2; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #dc2626;">Contact Information:</h4>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Name:</strong> ${requestData.senderName}</p>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Contact:</strong> ${requestData.senderContact}</p>
          </div>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #6b7280; font-size: 14px;">
            This message was sent through the Party Supplies Community platform. 
            Please reply directly to coordinate sharing your supply.
          </p>
        </div>
      `,
    });

    console.log("Contact email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      emailResponse,
      supplyRequest: supplyRequest
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-message function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);