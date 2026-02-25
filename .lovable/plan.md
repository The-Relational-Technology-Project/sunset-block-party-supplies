

## Fix Image Upload: Storage URL + Error Handling

### Root Cause (Updated)
The primary failure is **NOT image size** -- it's the Zod validation `.max(5000)` on the `imageUrl` field in the edge function. Even a compressed base64 data URL is ~270,000 characters, so validation rejects it before AI analysis even begins. There's also a broken error handling pattern that can cause the spinner to hang.

### Solution: Upload to Supabase Storage, pass short URL

Upload the compressed image to a Supabase Storage bucket, then pass the short public URL (~150 chars) to the edge function. This fixes both the validation limit and any future body size concerns.

### Files to Change

**1. Database migration: Create `supply-images` storage bucket**
- Create a public storage bucket called `supply-images`
- Add RLS policy allowing authenticated users to upload files
- Add RLS policy allowing public read access (so the AI gateway can fetch the image)

**2. Modify `src/components/AddSupply.tsx`**
- After compressing the image, upload it to `supply-images` bucket with a temp filename
- Get the public URL and pass that to the edge function instead of base64
- Fix error handling: wrap the async callback body in its own try/catch so errors from `compressImage` or `invoke` are properly caught and show a toast instead of hanging
- Clean up the temp file from storage after AI responds (success or failure)

**3. No changes needed to edge functions**
- The `.max(5000)` validation is actually correct for URLs (just not for base64 data URLs)
- The AI gateway already accepts standard image URLs

**4. Apply same pattern to bookshelf scanner (`src/components/books/AddBooks.tsx`)**
- If it also sends base64 data URLs, apply the same storage-upload approach

### Flow After Fix

```text
Phone photo (4MB)
  -> compress in browser (~200KB JPEG)
  -> upload to Supabase Storage bucket "supply-images"
  -> get public URL (~150 chars, e.g. https://mbmmfgivhqzhjyneyelu.supabase.co/storage/v1/object/public/supply-images/tmp/abc123.jpg)
  -> send URL to edge function (passes .max(5000) validation easily)
  -> AI analyzes image via URL
  -> delete temp file from storage
```

### Error Handling Fix

Move the try/catch inside the `reader.onloadend` async callback so that errors from `compressImage` and `supabase.functions.invoke` are properly caught, show a toast, and reset the loading spinner -- instead of becoming unhandled promise rejections.
