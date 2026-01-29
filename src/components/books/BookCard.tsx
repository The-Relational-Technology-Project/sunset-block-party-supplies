import { Book } from "@/types/book";

interface BookCardProps {
  book: Book;
  onClick: () => void;
}

export function BookCard({ book, onClick }: BookCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-transparent hover:bg-sand/30 rounded-sm px-3 py-2.5 hover:shadow-sm transition-all duration-200 group border-b border-border/30 last:border-b-0"
    >
      <h3 className="font-medium text-sm text-foreground leading-snug group-hover:text-terracotta transition-colors">
        {book.title}
      </h3>
      {book.author && (
        <p className="text-xs text-muted-foreground mt-0.5">
          {book.author}
        </p>
      )}
    </button>
  );
}
