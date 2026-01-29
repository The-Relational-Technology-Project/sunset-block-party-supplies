
# Community Book Library Feature

## Overview
Add a community book lending library that allows neighbors to upload photos of their bookshelves, uses AI to scan and extract book titles/authors, and provides a dedicated book discovery interface that's integrated with but visually distinct from the regular supplies catalog.

## Architecture Summary

```text
+------------------+     +-------------------+     +------------------+
|  Bookshelf       | --> | scan-bookshelf    | --> | books table      |
|  Photo Upload    |     | Edge Function     |     | (new DB table)   |
+------------------+     | (Gemini AI)       |     +------------------+
                         +-------------------+              |
                                                           v
                         +-------------------+     +------------------+
                         | Book Discovery UI |<----| useBooks hook    |
                         | (compact list)    |     | (fetch/filter)   |
                         +-------------------+     +------------------+
```

## Key Design Decisions

1. **Separate `books` table** - Books have different fields than supplies (title, author, no cross-streets in display, no illustrations needed). This keeps the data model clean.

2. **"Books" as a special sidebar category** - When selected, it replaces the supply grid with a book-specific discovery UI. Other categories remain for regular supplies.

3. **Privacy-first display** - Book cards show only title, author, condition, and owner name. No location details. Cross-streets only revealed after contact.

4. **Compact list/card view** - More efficient than supply cards. No illustrations. Maybe a small colored accent based on genre or just text-based.

5. **Batch import via AI** - Users upload bookshelf photos, AI extracts all visible titles at once, user reviews and confirms.

---

## Database Changes

### New `books` table

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| title | text | Book title |
| author | text | Author name |
| genre | text | Optional genre/category |
| condition | text | excellent/good/fair |
| house_rules | text[] | Borrowing guidelines |
| owner_id | uuid | FK to profiles |
| lent_out | boolean | Currently borrowed? |
| lender_notes | text | Private owner notes |
| created_at | timestamp | When added |

### RLS Policies

- **SELECT**: Only vouched users can view books (same as supplies)
- **INSERT/UPDATE/DELETE**: Only owner AND vouched

### New RPC Function

`get_books_with_owners()` - Returns books with owner names (similar to supplies RPC)

---

## Frontend Components

### 1. Category Integration

Update `src/data/categories.ts`:
- Add "Books" category with `BookOpen` icon
- Mark it as `isSpecial: true` to trigger different UI behavior

### 2. BrowseSupplies Conditional Rendering

When category is "books":
- Hide the regular supply grid
- Show `<BookLibrary />` component instead
- Different filter bar (search by title/author, condition filter)

### 3. New Components

**`src/components/books/BookLibrary.tsx`**
- Main container for book browsing
- Search bar prominent at top (searches title + author)
- Condition filter dropdown
- Compact card/list grid

**`src/components/books/BookCard.tsx`**
- Compact design: ~150px wide
- Shows: Title (bold), Author (italic), Condition badge
- No location, no illustration
- Click opens BookContactModal

**`src/components/books/BookContactModal.tsx`**
- Similar to ContactModal but simpler
- Shows borrowing guidelines
- Contact form to message owner

**`src/components/books/AddBooks.tsx`**
- Bookshelf photo upload interface
- AI scans and returns list of detected books
- User can review, edit, remove entries
- Bulk confirm to add all

### 4. MySupplies Integration

- Add a "Books" tab/section in MySupplies page
- Show user's books with edit/delete/lent-out toggle

---

## Edge Functions

### `scan-bookshelf` (new)

**Input:**
```json
{
  "imageUrl": "data:image/...",
  "userId": "uuid"
}
```

**Process:**
1. Send image to Gemini 2.5 Flash with prompt to extract all visible book titles and authors
2. Return array of detected books

**Output:**
```json
{
  "books": [
    { "title": "The Purpose of Power", "author": "Alicia Garza" },
    { "title": "Being Mortal", "author": "Atul Gawande" },
    ...
  ]
}
```

**Prompt for AI:**
```
Analyze this bookshelf image. Extract all visible book titles and authors.
Return ONLY valid JSON array with objects containing "title" and "author" keys.
If author is not visible, make your best guess or leave empty.
Order by position in image (left to right, top to bottom).
```

---

## Implementation Phases

### Phase 1: Database & Backend
1. Create `books` table migration with RLS
2. Create `get_books_with_owners` RPC function
3. Create `scan-bookshelf` edge function
4. Deploy and test AI scanning

### Phase 2: Book Browsing UI
1. Add "Books" to categories.ts with special flag
2. Create `BookLibrary` component with search/filter
3. Create `BookCard` compact component
4. Create `BookContactModal` for borrowing requests
5. Modify `BrowseSupplies` to conditionally render books UI

### Phase 3: Add Books Flow
1. Create `AddBooks` component with photo upload
2. Wire up to `scan-bookshelf` edge function
3. Build review/edit interface for detected books
4. Bulk insert to database

### Phase 4: My Books Management
1. Add books section to MySupplies or create MyBooks page
2. Edit, delete, toggle lent-out status
3. Lender notes functionality

### Phase 5: Seed Your Library
1. Import your book list as demo data
2. Associate with your user account

---

## UI Mockup Concepts

### Book Card (Compact)

```text
+------------------------+
| The Purpose of Power   |
| by Alicia Garza        |
| [Excellent]  Sarah M.  |
+------------------------+
```

### Book Library View

```text
+--------------------------------------------------+
| [🔍 Search books by title or author...        ]  |
| Condition: [Any ▼]                               |
+--------------------------------------------------+
| +-----------+ +-----------+ +-----------+        |
| | Title 1   | | Title 2   | | Title 3   |  ...   |
| | Author 1  | | Author 2  | | Author 3  |        |
| | Condition | | Condition | | Condition |        |
| +-----------+ +-----------+ +-----------+        |
+--------------------------------------------------+
```

### Add Books Flow

```text
Step 1: Upload bookshelf photo(s)
        [Choose Photos]

Step 2: Review AI-detected books
        ☑ The Purpose of Power - Alicia Garza
        ☑ Being Mortal - Atul Gawande
        ☐ [Unrecognized] - edit or remove
        [+ Add another photo]

Step 3: Set defaults
        Condition: [Good ▼]
        Guidelines: [Standard borrowing rules...]

        [Add 35 Books to Library]
```

---

## Technical Notes

### Privacy Considerations
- Books table will NOT store cross_streets or neighborhood
- Owner's location only shared after contact initiated
- Book list cannot be easily scraped to reconstruct someone's library since owner names are generic

### Performance
- `useBooks` hook with React Query for caching
- Pagination if library grows large (future enhancement)

### Search
- Client-side filtering initially (title + author substring match)
- Could add full-text search index later if needed

---

## Summary

This plan creates a dedicated book lending library experience that:
- Uses AI to scan bookshelf photos and extract titles automatically
- Integrates seamlessly with the existing category sidebar
- Provides a compact, book-appropriate UI distinct from bulky supply cards
- Protects member privacy by hiding location details until contact
- Allows bulk import and management of personal book collections
- Starts with your book list as demo/seed data
