import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Gift, Users, Heart, Search, Plus, Sparkles, PartyPopper, Cake, CircleDot } from "lucide-react";

interface LandingPageProps {
  onTabChange: (tab: string) => void;
}

export function LandingPage({ onTabChange }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-pink-50 to-blue-100 overflow-hidden">
      {/* Fun Hero Section */}
      <section className="relative container mx-auto px-4 py-20 text-center">
        {/* Floating Party Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 animate-bounce delay-100">
            <CircleDot className="h-8 w-8 text-pink-400" />
          </div>
          <div className="absolute top-32 right-20 animate-bounce delay-300">
            <PartyPopper className="h-6 w-6 text-orange-400" />
          </div>
          <div className="absolute top-16 right-1/3 animate-bounce delay-500">
            <Cake className="h-7 w-7 text-purple-400" />
          </div>
          <div className="absolute bottom-20 left-1/4 animate-bounce delay-700">
            <Gift className="h-6 w-6 text-blue-400" />
          </div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Main Logo/Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-6 rounded-full shadow-2xl animate-pulse">
              <Gift className="h-16 w-16 text-white" />
            </div>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-orange-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-6 leading-tight">
            Community Party Supplies
          </h1>
          
          <p className="text-2xl md:text-3xl text-gray-700 mb-4 font-medium">
            🎉 Share supplies, build community 🎉
          </p>
          
          <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Make amazing parties happen in the Sunset & Richmond neighborhoods! 
            From bounce houses to birthday banners - we've got you covered! 🏖️
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button
              size="lg"
              onClick={() => onTabChange('browse')}
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-xl px-10 py-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Search className="h-6 w-6 mr-3" />
              🔍 Browse Fun Supplies
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => onTabChange('add')}
              className="border-3 border-orange-500 text-orange-600 hover:bg-orange-50 text-xl px-10 py-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Plus className="h-6 w-6 mr-3" />
              🎁 Share Your Goodies
            </Button>
          </div>

          {/* Fun Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">🎈</div>
              <div className="text-2xl font-bold text-gray-800">Share & Save</div>
              <div className="text-gray-600">Why buy when you can borrow?</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-pink-600 mb-2">🏡</div>
              <div className="text-2xl font-bold text-gray-800">Meet Neighbors</div>
              <div className="text-gray-600">Build lasting friendships</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">🎊</div>
              <div className="text-2xl font-bold text-gray-800">Epic Parties</div>
              <div className="text-gray-600">Stress-free celebrations</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Fun Cards */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          How the Magic Works ✨
        </h2>
        <p className="text-center text-gray-600 mb-12 text-lg">It's easier than planning a toddler's nap schedule!</p>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="text-center p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="pt-6">
              <div className="bg-orange-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Gift className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-orange-800">🎁 Share & Borrow</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                From bounce houses to birthday decorations - share what you have and borrow what you need. 
                It's like a toy library but for party supplies! 🎪
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="pt-6">
              <div className="bg-blue-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-blue-800">🏘️ Build Community</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                Connect with neighbors, meet amazing families, and strengthen our awesome 
                Sunset & Richmond community bonds. New friendships await! 🤝
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
            <CardContent className="pt-6">
              <div className="bg-pink-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Heart className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-pink-800">💖 Make Life Easier</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                Save money, reduce waste, and make party planning as easy as Sunday morning. 
                Because busy parents deserve all the help they can get! ☕
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white py-20 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 animate-spin-slow">
            <PartyPopper className="h-12 w-12" />
          </div>
          <div className="absolute bottom-10 right-10 animate-spin-slow">
            <CircleDot className="h-16 w-16" />
          </div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl font-bold mb-6">Ready to Party? 🎉</h2>
          <p className="text-2xl mb-10 opacity-95">
            Join your neighbors in making party planning magical and fun! ✨
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => onTabChange('planner')}
            className="text-xl px-12 py-6 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 bg-white text-purple-600 hover:bg-gray-50"
          >
            <Sparkles className="h-6 w-6 mr-3" />
            🎊 Plan Your Epic Party
          </Button>
        </div>
      </section>
    </div>
  );
}
