import { categories } from "@/data/categories";
import { cn } from "@/lib/utils";

interface CategorySidebarProps {
  selectedCategory?: string;
  onCategoryChange: (category: string) => void;
}

export const CategorySidebar = ({ selectedCategory, onCategoryChange }: CategorySidebarProps) => {
  return (
    <aside className="w-56 border-r border-border bg-sand shrink-0">
      <div className="sticky top-0 p-4">
        <h2 className="text-sm font-semibold text-deep-brown mb-4">
          Choose a Category
        </h2>
        <nav className="space-y-1">
          <button
            onClick={() => onCategoryChange("all")}
            className={cn(
              "w-full text-left px-3 py-2 text-sm transition-colors rounded-sm",
              selectedCategory === "all" || !selectedCategory
                ? "bg-terracotta/10 text-terracotta font-medium"
                : "text-foreground hover:bg-muted"
            )}
          >
            All Categories
          </button>
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm transition-colors rounded-sm flex items-center gap-2",
                  selectedCategory === category.id
                    ? "bg-terracotta/10 text-terracotta font-medium"
                    : "text-foreground hover:bg-muted"
                )}
              >
                <Icon className="h-4 w-4" />
                {category.name}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
