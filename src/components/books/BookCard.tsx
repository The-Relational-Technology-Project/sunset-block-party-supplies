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
      className="w-full text-left bg-white border border-border rounded-sm p-3 hover:shadow-md hover:border-terracotta/30 transition-all duration-200 group"
    >
      <h3 className="font-medium text-sm text-foreground leading-tight line-clamp-2 group-hover:text-terracotta transition-colors">
        {book.title}
      </h3>
      {book.author && (
        <p className="text-xs text-muted-foreground mt-1 italic line-clamp-1">
          by {book.author}
        </p>
      )}
      <div className="flex items-center justify-between mt-2 gap-1">
        <Badge 
          variant="outline" 
          className={cn(
            "text-[10px] px-1.5 py-0 capitalize",
            conditionColors[book.condition] || "bg-gray-100 text-gray-800"
          )}
        >
          {book.condition}
        </Badge>
        <span className="text-[10px] text-muted-foreground truncate max-w-[60px]">
          {book.ownerName?.split(' ')[0] || 'Anonymous'}
        </span>
      </div>
    </button>
  );
}
