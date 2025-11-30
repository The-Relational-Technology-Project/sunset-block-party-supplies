import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface JoinNotificationRequest {
  name: string;
  email: string;
  referralSource?: string;
  crossStreets?: string;
  phoneNumber?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, referralSource, crossStreets, phoneNumber }: JoinNotificationRequest = await req.json();

    console.log("Sending join notification email for:", name);

    const emailResponse = await resend.emails.send({
      from: "Community Supplies <notifications@communitysupplies.org>",
      to: ["josh@relationaltechproject.org"],
      subject: "New Join Request - Community Supplies",
      html: `
        <h2>New Join Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${referralSource ? `<p><strong>Referral Source:</strong> ${referralSource}</p>` : ''}
        ${crossStreets ? `<p><strong>Cross Streets:</strong> ${crossStreets}</p>` : ''}
        ${phoneNumber ? `<p><strong>Phone:</strong> ${phoneNumber}</p>` : ''}
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
