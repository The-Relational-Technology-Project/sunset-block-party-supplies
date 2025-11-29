
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user || null;
      console.log("Header: Auth state changed:", event, currentUser);
      setUser(currentUser);
      
      if (currentUser) {
        // Defer Supabase calls with setTimeout to prevent deadlocks
        setTimeout(() => {
          supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single()
            .then(({ data: profile }) => {
              console.log("Header: Updated profile:", profile);
              setUserProfile(profile);
            });
        }, 0);
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
    <header className="bg-gradient-to-r from-primary to-accent shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleTabChange('home')}>
            <Gift className="h-8 w-8 text-primary-foreground" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-primary-foreground">Party Supplies</h1>
              <p className="text-primary-foreground/80 text-xs md:text-sm">Teamwork makes the dream work</p>
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
                    className={`transition-colors ${
                      activeTab === key 
                        ? 'bg-background text-foreground hover:bg-background/90' 
                        : 'text-primary-foreground hover:bg-primary-foreground/10'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {label}
                  </Button>
                ))}
              </nav>
            )}
            
            {user ? <UserProfile /> : <AuthButtons onSuccess={() => onTabChange('browse')} />}
          </div>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-primary-foreground hover:bg-primary-foreground/10" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-primary-foreground/20 pt-4">
            <div className="flex flex-col space-y-2">
              {user ? (
                <>
                  {navigationItems.map(({ key, label, icon: Icon }) => (
                    <Button 
                      key={key} 
                      variant={activeTab === key ? 'secondary' : 'ghost'} 
                      onClick={() => handleTabChange(key)} 
                      className={`w-full justify-start transition-colors ${
                        activeTab === key 
                          ? 'bg-background text-foreground hover:bg-background/90' 
                          : 'text-primary-foreground hover:bg-primary-foreground/10'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {label}
                    </Button>
                  ))}
                  <div className="pt-2 border-t border-primary-foreground/20 mt-2">
                    <UserProfile />
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <AuthButtons onSuccess={() => handleTabChange('browse')} />
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
