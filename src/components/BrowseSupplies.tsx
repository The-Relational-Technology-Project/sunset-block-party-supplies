import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SupplyCard } from "./SupplyCard";
import { ContactModal } from "./ContactModal";
import { Supply } from "@/types/supply";
import { useSupplies } from "@/hooks/useSupplies";
import { Loader2 } from "lucide-react";
import { CategorySidebar } from "./CategorySidebar";
import { categories } from "@/data/categories";
import { QuickBatchGenerate } from "./steward/QuickBatchGenerate";
import { supabase } from "@/integrations/supabase/client";

export function BrowseSupplies() {
  const { supplies, loading } = useSupplies();
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [conditionFilter, setConditionFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [selectedSupply, setSelectedSupply] = useState<Supply | null>(null);
  const [isSteward, setIsSteward] = useState(false);

  useEffect(() => {
    const checkSteward = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.rpc('is_user_steward', { user_id: user.id });
        setIsSteward(data || false);
      }
    };
    checkSteward();
  }, []);

  const filteredSupplies = useMemo(() => {
    return supplies.filter((supply) => {
      const matchesCategory = categoryFilter === "all" || supply.category === categoryFilter;
      const matchesCondition = conditionFilter === "all" || supply.condition === conditionFilter;
      const matchesAvailability = availabilityFilter === "all" || 
        (availabilityFilter === "available" ? supply.dateAvailable : !supply.dateAvailable);

      return matchesCategory && matchesCondition && matchesAvailability;
    });
  }, [supplies, categoryFilter, conditionFilter, availabilityFilter]);

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
    <div className="min-h-screen flex">
      <CategorySidebar 
        selectedCategory={categoryFilter}
        onCategoryChange={setCategoryFilter}
      />
      
      <div className="flex-1 overflow-auto bg-sand/30">
        <div className="container mx-auto px-6 py-8">
          {/* Filters */}
          <div className="bg-white border border-border rounded-sm p-3 mb-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Condition:
                </label>
                <Select value={conditionFilter} onValueChange={setConditionFilter}>
                  <SelectTrigger className="h-8 w-32 border-border bg-white text-xs">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">Any</SelectItem>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Availability:
                </label>
                <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                  <SelectTrigger className="h-8 w-32 border-border bg-white text-xs">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">Any</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="unavailable">Unavailable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {isSteward && (
                <div className="ml-auto">
                  <QuickBatchGenerate />
                </div>
              )}
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
