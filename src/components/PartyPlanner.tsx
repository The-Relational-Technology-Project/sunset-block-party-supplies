
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

export function PartyPlanner() {
  const [formData, setFormData] = useState({
    theme: "",
    ageGroup: "",
    guestCount: "",
    budgetRange: "",
    partyStyle: "",
    partyDate: "",
    priorities: [] as string[],
  });

  const priorityOptions = [
    "Decorations",
    "Food & Drinks", 
    "Entertainment",
    "Photo Props",
    "Party Favors",
    "Music & Sound",
    "Seating",
    "Lighting"
  ];

  const handlePriorityToggle = (priority: string) => {
    setFormData(prev => ({
      ...prev,
      priorities: prev.priorities.includes(priority)
        ? prev.priorities.filter(p => p !== priority)
        : [...prev.priorities, priority]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Party plan created! We'll find the perfect supplies from the Outer Sunset community!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-orange-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Party Vision Planner</CardTitle>
            <p className="text-gray-600">
              Tell us about your dream party and we'll find the perfect supplies from the Outer Sunset community!
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="theme">Party Theme (Optional)</Label>
                  <Input
                    id="theme"
                    placeholder="e.g., Beach, Surf, Ocean, Mermaid..."
                    value={formData.theme}
                    onChange={(e) => setFormData(prev => ({ ...prev, theme: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="ageGroup">Age Group</Label>
                  <Select value={formData.ageGroup} onValueChange={(value) => setFormData(prev => ({ ...prev, ageGroup: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Age Group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="toddler">Toddler (1-3)</SelectItem>
                      <SelectItem value="preschool">Preschool (4-5)</SelectItem>
                      <SelectItem value="elementary">Elementary (6-12)</SelectItem>
                      <SelectItem value="teen">Teen (13-17)</SelectItem>
                      <SelectItem value="adult">Adult (18+)</SelectItem>
                      <SelectItem value="mixed">Mixed Ages</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="guestCount">Guest Count</Label>
                  <Input
                    id="guestCount"
                    type="number"
                    placeholder="10"
                    value={formData.guestCount}
                    onChange={(e) => setFormData(prev => ({ ...prev, guestCount: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="budgetRange">Budget Range</Label>
                  <Select value={formData.budgetRange} onValueChange={(value) => setFormData(prev => ({ ...prev, budgetRange: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Moderate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low ($0-50)</SelectItem>
                      <SelectItem value="moderate">Moderate ($50-150)</SelectItem>
                      <SelectItem value="high">High ($150+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="partyStyle">Party Style</Label>
                  <Select value={formData.partyStyle} onValueChange={(value) => setFormData(prev => ({ ...prev, partyStyle: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Casual & Fun" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="casual">Casual & Fun</SelectItem>
                      <SelectItem value="elegant">Elegant & Formal</SelectItem>
                      <SelectItem value="themed">Highly Themed</SelectItem>
                      <SelectItem value="outdoor">Outdoor Adventure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="partyDate">Party Date (Optional)</Label>
                <Input
                  id="partyDate"
                  type="date"
                  value={formData.partyDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, partyDate: e.target.value }))}
                />
              </div>

              <div>
                <Label>What's Most Important? (Select all that apply)</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                  {priorityOptions.map((priority) => (
                    <Button
                      key={priority}
                      type="button"
                      variant={formData.priorities.includes(priority) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePriorityToggle(priority)}
                      className="text-sm"
                    >
                      {priority}
                    </Button>
                  ))}
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-lg py-3"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Create My Party Plan
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
