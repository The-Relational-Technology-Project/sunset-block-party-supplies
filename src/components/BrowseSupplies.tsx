
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SupplyCard } from "./SupplyCard";
import { Supply } from "@/types/supply";
import { Search, Grid, List } from "lucide-react";

interface BrowseSuppliesProps {
  supplies: Supply[];
  onViewContact: (supply: Supply) => void;
}

export function BrowseSupplies({ supplies, onViewContact }: BrowseSuppliesProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [conditionFilter, setConditionFilter] = useState("all");
  const [partyTypeFilter, setPartyTypeFilter] = useState("all");
  const [zipCodeFilter, setZipCodeFilter] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredSupplies = useMemo(() => {
    return supplies.filter((supply) => {
      const matchesSearch = supply.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           supply.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "all" || supply.category === categoryFilter;
      const matchesCondition = conditionFilter === "all" || supply.condition === conditionFilter;
      const matchesPartyType = partyTypeFilter === "all" || 
                              supply.partyTypes.some(type => type.toLowerCase().includes(partyTypeFilter.toLowerCase()));
      const matchesZip = !zipCodeFilter || supply.owner.zipCode.includes(zipCodeFilter);

      return matchesSearch && matchesCategory && matchesCondition && matchesPartyType && matchesZip;
    });
  }, [supplies, searchTerm, categoryFilter, conditionFilter, partyTypeFilter, zipCodeFilter]);

  return (
    <div className="min-h-screen bg-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search supplies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="decorations">Decorations</SelectItem>
                <SelectItem value="inflatables">Inflatables</SelectItem>
                <SelectItem value="costumes">Costumes & Dress-up</SelectItem>
                <SelectItem value="games">Games & Activities</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={conditionFilter} onValueChange={setConditionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Any Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Condition</SelectItem>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={partyTypeFilter} onValueChange={setPartyTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Party Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Party Types</SelectItem>
                <SelectItem value="birthday">Birthday Party</SelectItem>
                <SelectItem value="block">Block Party</SelectItem>
                <SelectItem value="graduation">Graduation Party</SelectItem>
                <SelectItem value="holiday">Holiday Party</SelectItem>
              </SelectContent>
            </Select>
            
            <Input
              placeholder="ZIP Code"
              value={zipCodeFilter}
              onChange={(e) => setZipCodeFilter(e.target.value)}
              maxLength={5}
            />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Available Supplies ({filteredSupplies.length} items)
          </h2>
        </div>

        <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
          {filteredSupplies.map((supply) => (
            <SupplyCard
              key={supply.id}
              supply={supply}
              onViewContact={onViewContact}
            />
          ))}
        </div>

        {filteredSupplies.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No supplies found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or check back later for new listings!</p>
          </div>
        )}
      </div>
    </div>
  );
}
