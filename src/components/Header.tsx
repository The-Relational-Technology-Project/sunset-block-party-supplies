
import { Gift, Search, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center space-x-2 cursor-pointer" 
            onClick={() => onTabChange('home')}
          >
            <Gift className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Our Party Supplies</h1>
              <p className="text-orange-100 text-sm">Teamwork makes the dream work</p>
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-2">
            <Button
              variant={activeTab === 'browse' ? 'secondary' : 'ghost'}
              onClick={() => onTabChange('browse')}
              className="text-white hover:bg-orange-600"
            >
              <Search className="h-4 w-4 mr-2" />
              Browse Supplies
            </Button>
            <Button
              variant={activeTab === 'add' ? 'secondary' : 'ghost'}
              onClick={() => onTabChange('add')}
              className="text-white hover:bg-orange-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Supply
            </Button>
            <Button
              variant={activeTab === 'planner' ? 'secondary' : 'ghost'}
              onClick={() => onTabChange('planner')}
              className="text-white hover:bg-orange-600"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Party Planner
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
