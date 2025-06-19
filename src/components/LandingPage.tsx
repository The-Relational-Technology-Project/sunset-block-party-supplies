import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Gift, Users, Heart, Search, Plus, Sparkles } from "lucide-react";

interface LandingPageProps {
  onTabChange: (tab: string) => void;
}

export function LandingPage({ onTabChange }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-blue-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main Logo/Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-4 rounded-full shadow-lg">
              <Gift className="h-12 w-12 text-white" />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4 leading-tight">
            Community Party Supplies
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 mb-3 font-medium">
            Share supplies, build community 🎉
          </p>
          
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            Make amazing parties happen in the Sunset & Richmond neighborhoods! 
            From bounce houses to birthday banners - we've got you covered.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" onClick={() => onTabChange('browse')} className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-lg px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
              <Search className="h-5 w-5 mr-2" />
              Browse Supplies
            </Button>
            <Button size="lg" variant="outline" onClick={() => onTabChange('add')} className="border-2 border-orange-500 text-orange-600 hover:bg-orange-50 text-lg px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
              <Plus className="h-5 w-5 mr-2" />
              Share Your Items
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl mb-2">🎈</div>
              <div className="text-xl font-bold text-gray-800">Share & Save</div>
              <div className="text-gray-600">Why buy when you can borrow?</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🏡</div>
              <div className="text-xl font-bold text-gray-800">Meet Neighbors</div>
              <div className="text-gray-600">Help each other out</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🎊</div>
              <div className="text-xl font-bold text-gray-800">Great Parties</div>
              <div className="text-gray-600">Stress-free celebrations</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-3 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          How It Works
        </h2>
        <p className="text-center text-gray-600 mb-10 text-lg">Simple, friendly, effective</p>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="text-center p-6 hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="pt-4">
              <div className="bg-orange-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
                <Gift className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-orange-800">Share & Borrow</h3>
              <p className="text-gray-700 leading-relaxed">
                From bounce houses to birthday decorations - share what you have and borrow what you need.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="pt-4">
              <div className="bg-blue-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-blue-800">Build Community</h3>
              <p className="text-gray-700 leading-relaxed">
                Connect with neighbors, meet amazing families, and strengthen our Sunset & Richmond community.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
            <CardContent className="pt-4">
              <div className="bg-pink-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-pink-800">Make Life Easier</h3>
              <p className="text-gray-700 leading-relaxed">
                Save money, reduce waste, and make party planning easier for busy parents.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-95">
            Join your neighbors in making party planning easier and more fun!
          </p>
          <Button size="lg" variant="secondary" onClick={() => onTabChange('planner')} className="text-lg px-10 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 bg-white text-purple-600 hover:bg-gray-50">
            <Sparkles className="h-5 w-5 mr-2" />
            Plan Your Party
          </Button>
        </div>
      </section>
    </div>
  );
}
