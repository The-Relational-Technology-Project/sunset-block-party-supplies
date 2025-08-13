
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { LandingPage } from "@/components/LandingPage";
import { BrowseSupplies } from "@/components/BrowseSupplies";
import { AddSupply } from "@/components/AddSupply";
import { PartyPlanner } from "@/components/PartyPlanner";
import { StewardDashboard } from "@/components/steward/StewardDashboard";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for tab parameter in URL
    const tabParam = searchParams.get('tab');
    if (tabParam && ['browse', 'add', 'planner', 'steward'].includes(tabParam)) {
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
      case 'planner':
        return (
          <AuthGuard requireVouched>
            <PartyPlanner />
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
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Community Party Supplies!</h1>
            <p className="text-lg text-gray-600 mb-6">Choose an option from the navigation above to get started.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setActiveTab('browse')}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg shadow-md transition-colors"
              >
                Browse Supplies
              </button>
              <button 
                onClick={() => setActiveTab('add')}
                className="border-2 border-orange-500 text-orange-600 hover:bg-orange-50 px-6 py-3 rounded-lg shadow-md transition-colors"
              >
                Share Your Items
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthGuard>
        <Header activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="container mx-auto px-4 py-8">
          {renderContent()}
        </main>
      </AuthGuard>
    </div>
  );
};

export default Index;
