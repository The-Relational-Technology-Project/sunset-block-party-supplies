import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useBooks } from "@/hooks/useBooks";
import { DetectedBook, BookInsert } from "@/types/book";
import { supabase } from "@/integrations/supabase/client";
import { 
  Upload, Loader2, BookOpen, Camera, Check, X, Plus, 
  Trash2, Edit2, ImagePlus 
} from "lucide-react";
import { compressImage } from "@/lib/imageCompression";

interface AddBooksProps {
  onComplete?: () => void;
}

export function AddBooks({ onComplete }: AddBooksProps) {
  const [step, setStep] = useState<"upload" | "review" | "confirm">("upload");
  const [isScanning, setIsScanning] = useState(false);
  const [detectedBooks, setDetectedBooks] = useState<DetectedBook[]>([]);
  const [condition, setCondition] = useState("good");
  const [houseRules, setHouseRules] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const { toast } = useToast();
  const { addBooks } = useBooks();

  const handleImageUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);

    let tempFilePath: string | null = null;
    try {
      // Convert to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const imageDataUrl = await base64Promise;

      // Compress and upload to storage
      const compressedImage = await compressImage(imageDataUrl);
      const res = await fetch(compressedImage);
      const blob = await res.blob();
      tempFilePath = `tmp/${crypto.randomUUID()}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from('supply-images')
        .upload(tempFilePath, blob, { contentType: 'image/jpeg' });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('supply-images')
        .getPublicUrl(tempFilePath);

      // Call the edge function with the short URL
      const { data, error } = await supabase.functions.invoke("scan-bookshelf", {
        body: { imageUrl: urlData.publicUrl },
      });

      if (error) throw error;

      if (data.books && data.books.length > 0) {
        const newBooks: DetectedBook[] = data.books.map((book: { title: string; author: string }) => ({
          ...book,
          selected: true,
        }));
        
        setDetectedBooks(prev => [...prev, ...newBooks]);
        setStep("review");
        
        toast({
          title: `Found ${data.books.length} books!`,
          description: "Review and edit the detected books below",
        });
      } else {
        toast({
          title: "No books detected",
          description: "Try uploading a clearer image of your bookshelf",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error scanning bookshelf:", error);
      toast({
        title: "Scan failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
      // Clean up temp file from storage
      if (tempFilePath) {
        supabase.storage.from('supply-images').remove([tempFilePath]).catch(() => {});
      }
    }
  }, [toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const toggleBook = (index: number) => {
    setDetectedBooks(prev => 
      prev.map((book, i) => 
        i === index ? { ...book, selected: !book.selected } : book
      )
    );
  };

  const removeBook = (index: number) => {
    setDetectedBooks(prev => prev.filter((_, i) => i !== index));
  };

  const updateBook = (index: number, title: string, author: string) => {
    setDetectedBooks(prev =>
      prev.map((book, i) =>
        i === index ? { ...book, title, author } : book
      )
    );
    setEditingIndex(null);
  };

  const addManualBook = () => {
    setDetectedBooks(prev => [...prev, { title: "", author: "", selected: true }]);
    setEditingIndex(detectedBooks.length);
  };

  const selectedCount = detectedBooks.filter(b => b.selected).length;

  const handleSave = async () => {
    const booksToSave = detectedBooks
      .filter(b => b.selected && b.title.trim())
      .map(b => ({
        title: b.title.trim(),
        author: b.author.trim() || undefined,
        condition,
        house_rules: houseRules.trim() 
          ? houseRules.split("\n").map(r => r.trim()).filter(Boolean)
          : [],
      } as BookInsert));

    if (booksToSave.length === 0) {
      toast({
        title: "No books selected",
        description: "Please select at least one book to add",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      await addBooks.mutateAsync(booksToSave);
      
      toast({
        title: `Added ${booksToSave.length} books!`,
        description: "Your books are now in the community library",
      });

      // Reset state
      setDetectedBooks([]);
      setStep("upload");
      setCondition("good");
      setHouseRules("");
      
      onComplete?.();
    } catch (error) {
      console.error("Error saving books:", error);
      toast({
        title: "Failed to save books",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Step 1: Upload */}
      {step === "upload" && (
        <div className="text-center py-8">
          <div className="mb-6">
            <BookOpen className="h-16 w-16 mx-auto text-terracotta mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Add Books to Your Library
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Upload a photo of your bookshelf and our AI will detect the titles automatically. 
              You can also add books manually.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
                disabled={isScanning}
              />
              <div className="flex items-center gap-2 bg-terracotta hover:bg-terracotta/90 text-white px-6 py-3 rounded-sm transition-colors">
                {isScanning ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Camera className="h-5 w-5" />
                    Scan Bookshelf Photo
                  </>
                )}
              </div>
            </label>

            <Button
              variant="outline"
              onClick={addManualBook}
              disabled={isScanning}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Book Manually
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Review */}
      {step === "review" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Review Books ({selectedCount} selected)
            </h3>
            <div className="flex gap-2">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isScanning}
                />
                <div className="flex items-center gap-1 text-sm text-terracotta hover:underline cursor-pointer">
                  {isScanning ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ImagePlus className="h-4 w-4" />
                  )}
                  Add another photo
                </div>
              </label>
            </div>
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {detectedBooks.map((book, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-white border border-border rounded-sm"
              >
                <Checkbox
                  checked={book.selected}
                  onCheckedChange={() => toggleBook(index)}
                  className="mt-1"
                />
                
                {editingIndex === index ? (
                  <div className="flex-1 space-y-2">
                    <Input
                      value={book.title}
                      onChange={(e) => {
                        const newBooks = [...detectedBooks];
                        newBooks[index].title = e.target.value;
                        setDetectedBooks(newBooks);
                      }}
                      placeholder="Book title"
                      autoFocus
                    />
                    <Input
                      value={book.author}
                      onChange={(e) => {
                        const newBooks = [...detectedBooks];
                        newBooks[index].author = e.target.value;
                        setDetectedBooks(newBooks);
                      }}
                      placeholder="Author"
                    />
                    <Button
                      size="sm"
                      onClick={() => setEditingIndex(null)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{book.title || "(Untitled)"}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {book.author || "(Unknown author)"}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setEditingIndex(index)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => removeBook(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={addManualBook}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add manually
            </Button>
          </div>

          {selectedCount > 0 && (
            <Button
              className="w-full"
              onClick={() => setStep("confirm")}
            >
              Continue with {selectedCount} book{selectedCount !== 1 ? "s" : ""}
            </Button>
          )}
        </div>
      )}

      {/* Step 3: Confirm */}
      {step === "confirm" && (
        <div className="space-y-6">
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep("review")}
              className="mb-4"
            >
              ← Back to review
            </Button>
            <h3 className="text-lg font-semibold">
              Set Defaults for {selectedCount} Books
            </h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Condition</Label>
              <Select value={condition} onValueChange={setCondition}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Borrowing Guidelines (optional)</Label>
              <Textarea
                value={houseRules}
                onChange={(e) => setHouseRules(e.target.value)}
                placeholder="Enter each guideline on a new line, e.g.&#10;Return within 2 weeks&#10;Handle with care"
                rows={4}
              />
            </div>
          </div>

          <Button
            className="w-full"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Add {selectedCount} Book{selectedCount !== 1 ? "s" : ""} to Library
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
