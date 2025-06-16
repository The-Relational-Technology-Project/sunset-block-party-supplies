
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  onImageChange: (imageUrl: string | null) => void;
  currentImage?: string;
}

export function ImageUpload({ onImageChange, currentImage }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert("File size must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);
        onImageChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <Label>Supply Image (optional)</Label>
      
      {preview ? (
        <div className="relative">
          <img 
            src={preview} 
            alt="Supply preview" 
            className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
          />
          <Button
            onClick={handleRemoveImage}
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div 
          onClick={handleUploadClick}
          className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-orange-400 transition-colors"
        >
          <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
          <p className="text-gray-500 text-center mb-2">
            Click to upload an image
          </p>
          <p className="text-xs text-gray-400 text-center">
            PNG, JPG up to 5MB
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {!preview && (
        <Button 
          onClick={handleUploadClick}
          variant="outline" 
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          Choose Image
        </Button>
      )}
    </div>
  );
}
