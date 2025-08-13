
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { HouseRules } from "@/components/HouseRules";
import { ImageUpload } from "@/components/ImageUpload";
import { supabase } from "@/integrations/supabase/client";

export function AddSupply() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    condition: "",
    zipCode: "",
    location: "",
    contactEmail: "",
    partyTypes: [] as string[],
    image: null as string | null,
  });

  const [houseRules, setHouseRules] = useState<string[]>([]);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handlePartyTypeChange = (partyType: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      partyTypes: checked 
        ? [...prev.partyTypes, partyType]
        : prev.partyTypes.filter(type => type !== partyType)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.category || !formData.condition || !formData.contactEmail) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to add supplies");
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('supplies')
        .insert([
           {
            name: formData.name,
            description: formData.description,
            category: formData.category,
            condition: formData.condition || 'good',
            party_types: formData.partyTypes,
            zip_code: formData.zipCode,
            location: formData.location,
            contact_email: formData.contactEmail,
            image_url: formData.image,
            house_rules: houseRules,
            owner_id: user.id
          }
        ])
        .select();

      if (error) {
        console.error('Error adding supply:', error);
        if (error.message.includes('vouched')) {
          toast.error("You must be vouched by a steward before you can add supplies");
        } else {
          toast.error("Error adding supply: " + error.message);
        }
        return;
      }

      toast.success("Supply added successfully! Thanks for sharing with the community!");
      
      // Reset form
      setFormData({
        name: "",
        description: "",
        category: "",
        condition: "",
        zipCode: "",
        location: "",
        contactEmail: "",
        partyTypes: [],
        image: null,
      });
      setHouseRules([]);
      
    } catch (error) {
      console.error('Error:', error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 py-4 md:py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-xl md:text-2xl">Share Your Supplies</CardTitle>
            <p className="text-gray-600 text-sm md:text-base">Help families in the Outer Sunset create amazing birthday parties!</p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Supply Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Beach Ball Birthday Decorations"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what's included, condition, and any special details..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    required
                  />
                </div>

                <ImageUpload 
                  onImageChange={(imageUrl) => setFormData(prev => ({ ...prev, image: imageUrl }))}
                  currentImage={formData.image}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="decorations">Decorations</SelectItem>
                        <SelectItem value="inflatables">Inflatables</SelectItem>
                        <SelectItem value="costumes">Costumes & Dress-up</SelectItem>
                        <SelectItem value="games">Games & Activities</SelectItem>
                        <SelectItem value="tableware">Tableware</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="condition">Condition</Label>
                    <Select value={formData.condition} onValueChange={(value) => setFormData(prev => ({ ...prev, condition: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Good" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="zipCode">ZIP Code (e.g., 94122)</Label>
                    <Input
                      id="zipCode"
                      placeholder="e.g., 94122"
                      value={formData.zipCode}
                      onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
                      maxLength={5}
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Location (Cross Streets or Landmark)</Label>
                    <Input
                      id="location"
                      placeholder="e.g., 46th Ave & Judah St"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="contactEmail">Contact Email *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="Best email to reach you about this supply"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">People interested in borrowing your supply will send messages to this email</p>
                </div>

                <div>
                  <Label>Party Types (Select all that apply)</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    {[
                      'Birthday Party',
                      'Block Party', 
                      'Graduation Party',
                      'Holiday Party'
                    ].map((partyType) => (
                      <div key={partyType} className="flex items-center space-x-2">
                        <Checkbox
                          id={partyType}
                          checked={formData.partyTypes.includes(partyType)}
                          onCheckedChange={(checked) => handlePartyTypeChange(partyType, checked as boolean)}
                        />
                        <Label htmlFor={partyType} className="text-sm font-normal">
                          {partyType}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <HouseRules 
                  rules={houseRules}
                  onRulesChange={setHouseRules}
                />
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-lg py-3"
              >
                {isLoading ? "Adding Supply..." : "Share My Supply"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
