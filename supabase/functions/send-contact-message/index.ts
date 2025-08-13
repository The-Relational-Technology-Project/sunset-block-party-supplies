import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactRequest {
  supplyName: string;
  supplyOwnerEmail: string;
  senderName: string;
  senderContact: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { supplyName, supplyOwnerEmail, senderName, senderContact, message }: ContactRequest = await req.json();

    if (!supplyName || !supplyOwnerEmail || !senderName || !senderContact || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const emailResponse = await resend.emails.send({
      from: "Party Supplies Community <onboarding@resend.dev>",
      to: [supplyOwnerEmail],
      subject: `Interest in your supply: ${supplyName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f97316;">Someone is interested in your supply!</h2>
          
          <div style="background: #fff7ed; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #ea580c;">Supply: ${supplyName}</h3>
          </div>

          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #374151;">Message from ${senderName}:</h4>
            <p style="line-height: 1.6; color: #6b7280;">${message}</p>
          </div>

          <div style="background: #fef3f2; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #dc2626;">Contact Information:</h4>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Name:</strong> ${senderName}</p>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Contact:</strong> ${senderContact}</p>
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

    return new Response(JSON.stringify({ success: true, emailResponse }), {
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