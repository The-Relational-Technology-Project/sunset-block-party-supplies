import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthModal } from "./auth/AuthModal";
import { Footer } from "./Footer";
import { categories } from "@/data/categories";

interface LandingPageProps {
  onTabChange: (tab: string) => void;
}

export function LandingPage({ onTabChange }: LandingPageProps) {
  const [user, setUser] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'login' | 'signup' | null>(null);

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

  return (
    <div className="min-h-screen bg-sand flex flex-col relative overflow-hidden">
      {/* Decorative hand-drawn supplies in background */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <img 
          src="/lovable-uploads/hand-drawn-supplies-1.png" 
          alt="" 
          className="absolute top-20 left-10 w-32 h-32 rotate-12 hidden md:block"
        />
        <img 
          src="/lovable-uploads/hand-drawn-supplies-2.png" 
          alt="" 
          className="absolute top-40 right-20 w-28 h-28 -rotate-6 hidden lg:block"
        />
        <img 
          src="/lovable-uploads/hand-drawn-supplies-3.png" 
          alt="" 
          className="absolute bottom-40 left-20 w-36 h-36 rotate-6 hidden md:block"
        />
        <img 
          src="/lovable-uploads/hand-drawn-supplies-4.png" 
          alt="" 
          className="absolute bottom-20 right-32 w-32 h-32 -rotate-12 hidden lg:block"
        />
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8 sm:py-16 text-center flex-1 relative z-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-deep-brown mb-4 sm:mb-6 leading-tight">
            Community Supplies
          </h1>
          
          <p className="text-lg sm:text-xl text-dusk-pink mb-8 sm:mb-12">
            Borrow what you need. Share what you have.
          </p>

          {/* CTAs */}
          {user ? (
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-10 sm:mb-16">
              <Button 
                size="lg" 
                onClick={() => onTabChange('browse')} 
                className="bg-terracotta hover:bg-terracotta/90 text-white text-base px-8 py-6 sm:py-5 rounded-sm min-h-[48px]"
              >
                Browse All Items
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => onTabChange('add')} 
                className="border-2 border-terracotta text-terracotta hover:bg-terracotta/10 text-base px-8 py-6 sm:py-5 rounded-sm min-h-[48px]"
              >
                Add an Item
              </Button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-10 sm:mb-16">
              <Button 
                size="lg" 
                onClick={() => setModalMode('login')} 
                className="bg-terracotta hover:bg-terracotta/90 text-white text-base px-8 py-6 sm:py-5 rounded-sm min-h-[48px]"
              >
                Sign In
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => setModalMode('signup')} 
                className="border-2 border-terracotta text-terracotta hover:bg-terracotta/10 text-base px-8 py-6 sm:py-5 rounded-sm min-h-[48px]"
              >
                Join Our Community
              </Button>
            </div>
          )}

          {/* Categories Grid */}
          <div className="mb-8 sm:mb-16">
            <h2 className="text-xl sm:text-2xl font-serif font-semibold text-deep-brown mb-6 sm:mb-8">
              What We're Sharing
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => onTabChange('browse')}
                    className="bg-card border border-terracotta/20 hover:border-terracotta hover:shadow-md transition-all p-4 sm:p-6 rounded-sm group min-h-[80px] active:scale-95"
                  >
                    <Icon className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 sm:mb-3 text-terracotta" />
                    <div className="text-xs sm:text-sm font-medium text-deep-brown group-hover:text-terracotta transition-colors">
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
