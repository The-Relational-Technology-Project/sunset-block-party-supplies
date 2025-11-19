import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useGenerateIllustration } from "@/hooks/useGenerateIllustration";

interface GenerateIllustrationButtonProps {
  supplyId: string;
  itemName: string;
  description: string;
  imageUrl?: string;
  onGenerated?: () => void;
}

export const GenerateIllustrationButton = ({
  supplyId,
  itemName,
  description,
  imageUrl,
  onGenerated
}: GenerateIllustrationButtonProps) => {
  const { generateIllustration, loading } = useGenerateIllustration();

  const handleGenerate = async () => {
    try {
      await generateIllustration(supplyId, itemName, description, imageUrl);
      onGenerated?.();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  return (
    <Button
      onClick={handleGenerate}
      disabled={loading}
      size="sm"
      variant="outline"
      className="gap-2"
    >
      <Sparkles className="h-4 w-4" />
      {loading ? 'Generating...' : 'Generate Illustration'}
    </Button>
  );
};