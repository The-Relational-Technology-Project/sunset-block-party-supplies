
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Gift, Users, Heart, Search, Plus, Sparkles } from "lucide-react";

interface LandingPageProps {
  onTabChange: (tab: string) => void;
}

export function LandingPage({ onTabChange }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-blue-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            Community Party Supplies
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Share supplies, build community, make amazing parties happen in the Sunset & Richmond
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => onTabChange('browse')}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-lg px-8 py-4"
            >
              <Search className="h-5 w-5 mr-2" />
              Browse Supplies
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => onTabChange('add')}
              className="border-orange-500 text-orange-600 hover:bg-orange-50 text-lg px-8 py-4"
            >
              <Plus className="h-5 w-5 mr-2" />
              Share Your Supplies
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <Gift className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Share & Borrow</h3>
              <p className="text-gray-600">
                From bounce houses to birthday decorations, share what you have and borrow what you need
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Build Community</h3>
              <p className="text-gray-600">
                Connect with neighbors, meet families, and strengthen our Sunset & Richmond community bonds
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <Heart className="h-12 w-12 text-pink-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Make Life Easier</h3>
              <p className="text-gray-600">
                Save money, reduce waste, and make party planning stress-free for busy parents
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">1</span>
              </div>
              <h3 className="font-semibold mb-2">Browse or Plan</h3>
              <p className="text-gray-600">Search available supplies or use our Party Planner to get recommendations</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="font-semibold mb-2">Connect</h3>
              <p className="text-gray-600">Reach out to your neighbors directly to arrange pickup and return</p>
            </div>
            <div className="text-center">
              <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-pink-600">3</span>
              </div>
              <h3 className="font-semibold mb-2">Party!</h3>
              <p className="text-gray-600">Enjoy your amazing party and return supplies to keep the community thriving</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-orange-500 to-blue-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join your neighbors in making party planning easier and more fun!
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => onTabChange('planner')}
            className="text-lg px-8 py-4"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Plan Your Party
          </Button>
        </div>
      </section>
    </div>
  );
}
