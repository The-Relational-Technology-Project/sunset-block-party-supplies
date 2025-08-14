import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface MultipleImageUploadProps {
  onImagesChange: (images: string[]) => void;
  currentImages?: string[];
  maxImages?: number;
}

export function MultipleImageUpload({ 
  onImagesChange, 
  currentImages = [], 
  maxImages = 4 
}: MultipleImageUploadProps) {
  const [images, setImages] = useState<string[]>(currentImages);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages: string[] = [];
    const remainingSlots = maxImages - images.length;
    const filesToProcess = Math.min(files.length, remainingSlots);

    let processedCount = 0;

    for (let i = 0; i < filesToProcess; i++) {
      const file = files[i];
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert(`File "${file.name}" is too large. Maximum size is 5MB.`);
        continue;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        newImages.push(result);
        processedCount++;
        
        if (processedCount === filesToProcess) {
          const updatedImages = [...images, ...newImages];
          setImages(updatedImages);
          onImagesChange(updatedImages);
        }
      };
      reader.readAsDataURL(file);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const canAddMore = images.length < maxImages;

  return (
    <div className="space-y-4">
      <Label>Supply Images (optional, up to {maxImages})</Label>
      
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative">
              <img 
                src={image} 
                alt={`Supply image ${index + 1}`} 
                className="w-full h-32 object-contain rounded-lg border-2 border-gray-200 bg-gray-50"
              />
              <Button
                onClick={() => handleRemoveImage(index)}
                variant="destructive"
                size="sm"
                className="absolute top-1 right-1 h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {canAddMore && (
        <>
          <div 
            onClick={handleUploadClick}
            className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-orange-400 transition-colors"
          >
            <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-gray-500 text-center mb-1 text-sm">
              Click to upload images
            </p>
            <p className="text-xs text-gray-400 text-center">
              PNG, JPG up to 5MB each ({images.length}/{maxImages})
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          <Button 
            onClick={handleUploadClick}
            variant="outline" 
            className="w-full"
            disabled={!canAddMore}
          >
            <Upload className="h-4 w-4 mr-2" />
            Add Images ({images.length}/{maxImages})
          </Button>
        </>
      )}
    </div>
  );
}