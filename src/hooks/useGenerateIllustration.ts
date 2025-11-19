import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useGenerateIllustration = () => {
  const [loading, setLoading] = useState(false);

  const generateIllustration = async (
    supplyId: string,
    itemName: string,
    description: string,
    imageUrl?: string
  ) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-illustration', {
        body: {
          supplyId,
          itemName,
          description,
          imageUrl
        }
      });

      if (error) {
        console.error('Error generating illustration:', error);
        throw error;
      }

      if (data?.error) {
        if (data.error.includes('Rate limit')) {
          toast.error('Rate limit exceeded. Please try again in a few moments.');
        } else if (data.error.includes('Payment required')) {
          toast.error('AI credits exhausted. Please add credits to continue.');
        } else {
          toast.error('Failed to generate illustration: ' + data.error);
        }
        throw new Error(data.error);
      }

      toast.success('Illustration generated successfully!');
      return data.illustrationUrl;
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate illustration');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { generateIllustration, loading };
};