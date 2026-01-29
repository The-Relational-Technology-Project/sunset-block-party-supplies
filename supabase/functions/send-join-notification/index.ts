import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// HTML escape function to prevent XSS in email templates
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Input validation schema
const JoinNotificationSchema = z.object({
  name: z.string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  email: z.string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),
  referralSource: z.string()
    .trim()
    .max(500, "Referral source must be less than 500 characters")
    .optional(),
  crossStreets: z.string()
    .trim()
    .max(200, "Cross streets must be less than 200 characters")
    .optional(),
  phoneNumber: z.string()
    .trim()
    .max(30, "Phone number must be less than 30 characters")
    .regex(/^[\d\s\-\+\(\)]*$/, "Invalid phone number format")
    .optional(),
});

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const rawBody = await req.json();
    
    // Validate input
    const validationResult = JoinNotificationSchema.safeParse(rawBody);
    
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

    const { name, email, referralSource, crossStreets, phoneNumber } = validationResult.data;

    console.log("Sending join notification email for:", name);

    // Escape all user input for safe HTML rendering
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeReferralSource = referralSource ? escapeHtml(referralSource) : null;
    const safeCrossStreets = crossStreets ? escapeHtml(crossStreets) : null;
    const safePhoneNumber = phoneNumber ? escapeHtml(phoneNumber) : null;

    const emailResponse = await resend.emails.send({
      from: "Community Supplies <notifications@communitysupplies.org>",
      to: ["josh@relationaltechproject.org"],
      subject: "New Join Request - Community Supplies",
      html: `
        <h2>New Join Request</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        ${safeReferralSource ? `<p><strong>Referral Source:</strong> ${safeReferralSource}</p>` : ''}
        ${safeCrossStreets ? `<p><strong>Cross Streets:</strong> ${safeCrossStreets}</p>` : ''}
        ${safePhoneNumber ? `<p><strong>Phone:</strong> ${safePhoneNumber}</p>` : ''}
        <p>Check the <a href="https://communitysupplies.org/steward">steward dashboard</a> for more details.</p>
      `,
    });

    console.log("Join notification email sent:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-join-notification function:", error);
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
