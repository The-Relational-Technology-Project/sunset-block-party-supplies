import { Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthButtons } from "./auth/AuthButtons";
import { UserProfile } from "./auth/UserProfile";

interface CatalogHeaderProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
  onNavigate?: (tab: string) => void;
}

export const CatalogHeader = ({ onSearch, searchQuery = "", onNavigate }: CatalogHeaderProps) => {
  const [user, setUser] = useState<any>(null);
  const [localQuery, setLocalQuery] = useState(searchQuery);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(localQuery);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-sand">
      <div className="container mx-auto px-6 h-16 flex items-center gap-8">
        <button 
          onClick={() => onNavigate?.("home")}
          className="text-xl font-serif font-bold text-deep-brown hover:text-terracotta transition-colors whitespace-nowrap"
        >
          Community Supplies
        </button>

        <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for tools, gear, supplies..."
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              className="pl-10 bg-white border-border"
            />
          </div>
        </form>

        <nav className="hidden md:flex items-center gap-2">
          <Button 
            variant="ghost" 
            onClick={() => onNavigate?.("browse")}
            className="text-sm"
          >
            Browse All
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => onNavigate?.("add")}
            className="text-sm"
          >
            Add Item
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => onNavigate?.("my-supplies")}
            className="text-sm"
          >
            My Items
          </Button>
        </nav>

        <div className="flex items-center gap-2">
          {user ? <UserProfile /> : <AuthButtons />}
        </div>
      </div>
    </header>
  );
};
