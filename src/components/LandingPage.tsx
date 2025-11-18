import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthModal } from "./auth/AuthModal";
import { Footer } from "./Footer";
import { categories } from "@/data/categories";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface LandingPageProps {
  onTabChange: (tab: string) => void;
  onSearch?: (query: string) => void;
}

export function LandingPage({ onTabChange, onSearch }: LandingPageProps) {
  const [user, setUser] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'login' | 'signup' | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
    onTabChange('browse');
  };

  return (
    <div className="min-h-screen bg-sand flex flex-col">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center flex-1">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-deep-brown mb-6 leading-tight">
            Community Supplies
          </h1>
          
          <p className="text-xl text-dusk-pink mb-12">
            Borrow what you need. Share what you have.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for tools, gear, supplies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg border-2 border-border bg-card"
              />
            </div>
          </form>

          {/* CTAs */}
          {user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button 
                size="lg" 
                onClick={() => onTabChange('browse')} 
                className="bg-terracotta hover:bg-terracotta/90 text-white text-base px-8 rounded-sm"
              >
                Browse All Items
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => onTabChange('add')} 
                className="border-2 border-terracotta text-terracotta hover:bg-terracotta/10 text-base px-8 rounded-sm"
              >
                Add an Item
              </Button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button 
                size="lg" 
                onClick={() => setModalMode('login')} 
                className="bg-terracotta hover:bg-terracotta/90 text-white text-base px-8 rounded-sm"
              >
                Sign In
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => setModalMode('signup')} 
                className="border-2 border-terracotta text-terracotta hover:bg-terracotta/10 text-base px-8 rounded-sm"
              >
                Join Our Community
              </Button>
            </div>
          )}

          {/* Categories Grid */}
          <div className="mb-16">
            <h2 className="text-2xl font-serif font-semibold text-deep-brown mb-8">
              Top Categories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => onTabChange('browse')}
                    className="bg-card border border-terracotta/20 hover:border-terracotta hover:shadow-md transition-all p-6 rounded-sm group"
                  >
                    <Icon className="h-8 w-8 mx-auto mb-3 text-terracotta" />
                    <div className="text-sm font-medium text-deep-brown group-hover:text-terracotta transition-colors">
                      {category.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <AuthModal
        isOpen={!!modalMode}
        mode={modalMode}
        onClose={() => setModalMode(null)}
      />
    </div>
  );
}
