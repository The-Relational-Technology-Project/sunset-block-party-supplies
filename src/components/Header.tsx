
import { Gift, Search, Plus, Sparkles, Menu, X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AuthButtons } from "./auth/AuthButtons";
import { UserProfile } from "./auth/UserProfile";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log("Header: Current user:", user);
      setUser(user);
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        console.log("Header: User profile:", profile);
        setUserProfile(profile);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user || null;
      console.log("Header: Auth state changed:", event, currentUser);
      setUser(currentUser);
      
      if (currentUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single();
        console.log("Header: Updated profile:", profile);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const navigationItems = [{
    key: 'browse',
    label: 'Browse Supplies',
    icon: Search
  }, {
    key: 'add',
    label: 'Add Supply',
    icon: Plus
  }, {
    key: 'planner',
    label: 'Party Planner',
    icon: Sparkles
  }];

  // Add steward dashboard for stewards
  console.log("Header: Checking steward status:", userProfile?.role);
  if (userProfile?.role === 'steward') {
    console.log("Header: Adding steward dashboard to navigation");
    navigationItems.push({
      key: 'steward',
      label: 'Steward Dashboard',
      icon: Shield
    });
  }

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleTabChange('home')}>
            <Gift className="h-8 w-8" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Party Supplies</h1>
              <p className="text-orange-100 text-xs md:text-sm">Teamwork makes the dream work</p>
            </div>
          </div>
          
          {/* Desktop Navigation & Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <nav className="flex space-x-2">
                {navigationItems.map(({ key, label, icon: Icon }) => (
                  <Button 
                    key={key} 
                    variant={activeTab === key ? 'secondary' : 'ghost'} 
                    onClick={() => handleTabChange(key)} 
                    className={`text-white transition-colors ${
                      activeTab === key 
                        ? 'bg-white text-orange-500 hover:bg-gray-100 hover:text-orange-600' 
                        : 'hover:bg-orange-600 hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {label}
                  </Button>
                ))}
              </nav>
            )}
            
            {user ? <UserProfile /> : <AuthButtons />}
          </div>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-white hover:bg-orange-600" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-orange-300 pt-4">
            <div className="flex flex-col space-y-2">
              {user ? (
                <>
                  {navigationItems.map(({ key, label, icon: Icon }) => (
                    <Button 
                      key={key} 
                      variant={activeTab === key ? 'secondary' : 'ghost'} 
                      onClick={() => handleTabChange(key)} 
                      className={`w-full justify-start text-white transition-colors ${
                        activeTab === key 
                          ? 'bg-white text-orange-500 hover:bg-gray-100 hover:text-orange-600' 
                          : 'hover:bg-orange-600 hover:text-white'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {label}
                    </Button>
                  ))}
                  <div className="pt-2 border-t border-orange-300 mt-2">
                    <UserProfile />
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <AuthButtons />
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
