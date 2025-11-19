import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SupplyCard } from "./SupplyCard";
import { ContactModal } from "./ContactModal";
import { Supply } from "@/types/supply";
import { useSupplies } from "@/hooks/useSupplies";
import { Loader2 } from "lucide-react";
import { CategorySidebar } from "./CategorySidebar";
import { categories } from "@/data/categories";

export function BrowseSupplies() {
  const { supplies, loading } = useSupplies();
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [conditionFilter, setConditionFilter] = useState("all");
  const [zipCodeFilter, setZipCodeFilter] = useState("");
  const [selectedSupply, setSelectedSupply] = useState<Supply | null>(null);

  const filteredSupplies = useMemo(() => {
    return supplies.filter((supply) => {
      const matchesCategory = categoryFilter === "all" || supply.category === categoryFilter;
      const matchesCondition = conditionFilter === "all" || supply.condition === conditionFilter;
      const matchesZip = !zipCodeFilter || supply.owner.zipCode.includes(zipCodeFilter);

      return matchesCategory && matchesCondition && matchesZip;
    });
  }, [supplies, categoryFilter, conditionFilter, zipCodeFilter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-terracotta" />
          <p className="text-muted-foreground">Loading supplies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <CategorySidebar 
        selectedCategory={categoryFilter}
        onCategoryChange={setCategoryFilter}
      />
      
      <div className="flex-1 overflow-auto bg-background">
        <div className="container mx-auto px-6 py-8">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-semibold text-deep-brown mb-2">
              {categoryFilter === "all" ? "All Items" : 
               categories.find(c => c.id === categoryFilter)?.name || "Items"}
            </h1>
            <p className="text-muted-foreground">
              {filteredSupplies.length} {filteredSupplies.length === 1 ? 'item' : 'items'} available
            </p>
          </div>

          {/* Filters */}
          <div className="bg-card border border-border rounded-sm p-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-deep-brown mb-2 block">
                  Condition
                </label>
                <Select value={conditionFilter} onValueChange={setConditionFilter}>
                  <SelectTrigger className="border-border">
                    <SelectValue placeholder="Any Condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Condition</SelectItem>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-deep-brown mb-2 block">
                  ZIP Code
                </label>
                <Input
                  placeholder="Filter by ZIP..."
                  value={zipCodeFilter}
                  onChange={(e) => setZipCodeFilter(e.target.value)}
                  className="border-border"
                />
              </div>
            </div>
          </div>

          {/* Results Grid */}
          {filteredSupplies.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">No supplies found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredSupplies.map((supply) => (
                <SupplyCard
                  key={supply.id}
                  supply={supply}
                  onViewContact={setSelectedSupply}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <ContactModal
        isOpen={!!selectedSupply}
        supply={selectedSupply}
        onClose={() => setSelectedSupply(null)}
      />
    </div>
  );
}
