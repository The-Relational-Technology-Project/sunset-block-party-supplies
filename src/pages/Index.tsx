
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { CatalogHeader } from "@/components/CatalogHeader";
import { Footer } from "@/components/Footer";
import { LandingPage } from "@/components/LandingPage";
import { BrowseSupplies } from "@/components/BrowseSupplies";
import { AddSupply } from "@/components/AddSupply";

import { StewardDashboard } from "@/components/steward/StewardDashboard";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('browse');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for tab parameter in URL
    const tabParam = searchParams.get('tab');
    if (tabParam && ['browse', 'add', 'steward'].includes(tabParam)) {
      setActiveTab(tabParam);
      // Clear the URL parameter after setting the tab
      setSearchParams({});
    }

    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [searchParams, setSearchParams]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show the inspiring landing page
  if (!user) {
    return <LandingPage onTabChange={setActiveTab} />;
  }

  // If user is authenticated, show the functional interface
  const renderContent = () => {
    switch (activeTab) {
      case 'browse':
        return (
          <AuthGuard requireVouched>
            <BrowseSupplies />
          </AuthGuard>
        );
      case 'add':
        return (
          <AuthGuard requireVouched>
            <AddSupply />
          </AuthGuard>
        );
      case 'steward':
        return (
          <AuthGuard requireSteward>
            <StewardDashboard />
          </AuthGuard>
        );
      default:
        return (
          <AuthGuard requireVouched>
            <BrowseSupplies />
          </AuthGuard>
        );
    }
  };

  return (
    <main className="min-h-screen flex flex-col">
      <CatalogHeader onNavigate={setActiveTab} />
      <div className="flex-1">
        {renderContent()}
      </div>
      <Footer />
    </main>
  );
};

export default Index;
