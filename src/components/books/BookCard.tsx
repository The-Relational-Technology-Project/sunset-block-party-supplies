import { Book } from "@/types/book";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BookCardProps {
  book: Book;
  onClick: () => void;
}

const conditionColors: Record<string, string> = {
  excellent: "bg-green-100 text-green-800 border-green-200",
  good: "bg-blue-100 text-blue-800 border-blue-200",
  fair: "bg-amber-100 text-amber-800 border-amber-200",
};

export function BookCard({ book, onClick }: BookCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-transparent hover:bg-sand/30 rounded-sm px-3 py-2 hover:shadow-sm transition-all duration-200 group border-b border-border/50 last:border-b-0"
    >
      <h3 className="font-medium text-sm text-foreground leading-snug group-hover:text-terracotta transition-colors">
        {book.title}
      </h3>
      {book.author && (
        <p className="text-xs text-muted-foreground mt-0.5 italic">
          {book.author}
        </p>
      )}
      <Badge 
        variant="outline" 
        className={cn(
          "text-[10px] px-1.5 py-0 capitalize mt-1.5",
          conditionColors[book.condition] || "bg-gray-100 text-gray-800"
        )}
      >
        {book.condition}
      </Badge>
    </button>
  );
}
