import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const QuickBatchGenerate = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    toast.info("Starting batch illustration generation...");

    try {
      const { data, error } = await supabase.functions.invoke('batch-generate-illustrations');

      if (error) {
        console.error('Error:', error);
        toast.error('Failed to generate illustrations');
        return;
      }

      if (data?.error) {
        toast.error('Generation error: ' + data.error);
        return;
      }

      toast.success(`Generated ${data.successful} of ${data.total} illustrations!`);
      
      // Reload page after a moment
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate illustrations');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleGenerate}
      disabled={isGenerating}
      size="lg"
      className="w-full"
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="h-5 w-5 mr-2" />
          Generate All Illustrations Now
        </>
      )}
    </Button>
  );
};