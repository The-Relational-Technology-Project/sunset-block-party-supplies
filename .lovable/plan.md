

## Client-Side Image Compression for Phone Uploads

### Problem
Phone cameras produce 4-5MB images. When converted to base64 (33% size increase), they exceed the 2MB Supabase Edge Function request body limit, causing "Failed to analyze image" errors.

### Solution
Add a `compressImage` utility function that uses the browser's Canvas API to resize and compress images before sending them to the AI. This happens entirely in the browser -- no extra libraries needed.

### How It Works
1. User selects a photo (up to 5MB accepted)
2. Before sending to AI, the image is drawn onto a canvas at a max dimension of 1200px
3. The canvas exports as JPEG at 0.7 quality, typically producing images under 200KB
4. The compressed base64 string is sent to the edge function (well within the 2MB limit)
5. The original full-quality image is still stored for display purposes

### Files to Change

**1. Create `src/lib/imageCompression.ts`**
- Export an `async compressImage(dataUrl: string, maxDimension?: number, quality?: number): Promise<string>` function
- Uses `HTMLImageElement` + `HTMLCanvasElement` to resize and re-encode as JPEG
- Defaults: max 1200px dimension, 0.7 JPEG quality

**2. Modify `src/components/AddSupply.tsx`**
- Import `compressImage`
- In `handleImageUpload`, after reading the file as a data URL, compress it before passing to the `draft-item-from-image` edge function
- Keep the original data URL for display/storage, only use compressed version for AI analysis

### Technical Detail

```text
compressImage flow:
  dataUrl -> Image element -> Canvas (max 1200px) -> toDataURL('image/jpeg', 0.7) -> compressed string
```

No new dependencies required -- Canvas API is available in all modern browsers including mobile Safari and Chrome.
