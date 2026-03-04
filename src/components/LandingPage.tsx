import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthModal } from "./auth/AuthModal";
import { Footer } from "./Footer";
import { categories } from "@/data/categories";
import { Skeleton } from "@/components/ui/skeleton";

interface LandingPageProps {
  onTabChange: (tab: string) => void;
}

export function LandingPage({ onTabChange }: LandingPageProps) {
  const [user, setUser] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'login' | 'signup' | null>(null);
  const [illustrations, setIllustrations] = useState<string[]>([]);
  const [loadingIllustrations, setLoadingIllustrations] = useState(true);

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

  useEffect(() => {
    const fetchIllustrations = async () => {
      try {
        const { data, error } = await supabase
          .from('site_config')
          .select('value')
          .eq('key', 'landing_illustrations')
          .single();
        if (!error && data?.value) {
          setIllustrations(data.value as string[]);
        }
      } catch (e) {
        console.error('Failed to fetch illustrations:', e);
      } finally {
        setLoadingIllustrations(false);
      }
    };

    fetchIllustrations();
  }, []);

  return (
    <div className="min-h-screen bg-sand flex flex-col">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8 sm:py-16 text-center relative z-10">
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

          {/* Category Chips */}
          <div className="mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-serif font-semibold text-deep-brown mb-4 sm:mb-6">
              What We're Sharing
            </h2>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <div
                    key={category.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-card border border-border rounded-full text-xs sm:text-sm font-medium text-deep-brown"
                  >
                    <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-terracotta" />
                    {category.name}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Illustration Gallery */}
      {(loadingIllustrations || illustrations.length > 0) && (
        <section className="container mx-auto px-4 pb-8 sm:pb-16">
          <h2 className="text-xl sm:text-2xl font-serif font-semibold text-deep-brown mb-6 text-center">
            A Peek Inside
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 max-w-5xl mx-auto">
            {loadingIllustrations
              ? Array.from({ length: 10 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-sm" />
                ))
              : illustrations.map((url, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-white border border-border rounded-sm overflow-hidden flex items-center justify-center"
                  >
                    <img
                      src={url}
                      alt=""
                      className="w-full h-full object-contain p-3"
                      loading="lazy"
                    />
                  </div>
                ))}
          </div>

          {!user && illustrations.length > 0 && (
            <div className="text-center mt-6 sm:mt-8">
              <Button
                variant="link"
                onClick={() => setModalMode('signup')}
                className="text-terracotta font-medium text-sm sm:text-base"
              >
                Join to browse all →
              </Button>
            </div>
          )}
        </section>
      )}

      <Footer />

      <AuthModal
        isOpen={!!modalMode}
        mode={modalMode}
        onClose={() => setModalMode(null)}
        onSuccess={() => onTabChange('browse')}
      />
    </div>
  );
}
