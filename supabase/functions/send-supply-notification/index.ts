import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SupplyNotificationRequest {
  itemName: string;
  category: string;
  ownerName: string;
  ownerEmail: string;
  description: string;
  neighborhood?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { itemName, category, ownerName, ownerEmail, description, neighborhood }: SupplyNotificationRequest = await req.json();

    console.log("Sending supply notification email for:", itemName);

    const emailResponse = await resend.emails.send({
      from: "Community Supplies <notifications@communitysupplies.org>",
      to: ["josh@relationaltechproject.org"],
      subject: `New Supply Added: ${itemName}`,
      html: `
        <h2>New Supply Item</h2>
        <p><strong>Item:</strong> ${itemName}</p>
        <p><strong>Category:</strong> ${category}</p>
        <p><strong>Description:</strong> ${description}</p>
        ${neighborhood ? `<p><strong>Neighborhood:</strong> ${neighborhood}</p>` : ''}
        <hr>
        <p><strong>Owner:</strong> ${ownerName}</p>
        <p><strong>Email:</strong> ${ownerEmail}</p>
        <p>View the <a href="https://communitysupplies.org">catalog</a> to see all supplies.</p>
      `,
    });

    console.log("Supply notification email sent:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-supply-notification function:", error);
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
