
import { Gift, Search, Plus, Sparkles, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { key: 'browse', label: 'Browse Supplies', icon: Search },
    { key: 'add', label: 'Add Supply', icon: Plus },
    { key: 'planner', label: 'Party Planner', icon: Sparkles },
  ];

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center space-x-2 cursor-pointer" 
            onClick={() => handleTabChange('home')}
          >
            <Gift className="h-8 w-8" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Community Party Supplies</h1>
              <p className="text-orange-100 text-xs md:text-sm">Teamwork makes the dream work</p>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-2">
            {navigationItems.map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                variant={activeTab === key ? 'secondary' : 'ghost'}
                onClick={() => handleTabChange(key)}
                className="text-white hover:bg-orange-600"
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </Button>
            ))}
          </nav>

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
              {navigationItems.map(({ key, label, icon: Icon }) => (
                <Button
                  key={key}
                  variant={activeTab === key ? 'secondary' : 'ghost'}
                  onClick={() => handleTabChange(key)}
                  className="w-full justify-start text-white hover:bg-orange-600"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {label}
                </Button>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
