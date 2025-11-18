import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { HouseRules } from "@/components/HouseRules";
import { MultipleImageUpload } from "@/components/MultipleImageUpload";
import { supabase } from "@/integrations/supabase/client";
import { categories } from "@/data/categories";

export function AddSupply() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [customPartyType, setCustomPartyType] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    condition: "good",
    zipCode: "",
    location: "",
    contactEmail: "",
    partyTypes: [] as string[],
    images: [] as string[],
  });

  const [houseRules, setHouseRules] = useState<string[]>([]);

  useEffect(() => {
    const getUserAndProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setUserProfile(profile);
          setFormData(prev => ({
            ...prev,
            contactEmail: profile.email || user.email || "",
            zipCode: profile.zip_code || "",
          }));
        }
      }
    };
    getUserAndProfile();
  }, []);

  const handlePartyTypeChange = (partyType: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      partyTypes: checked 
        ? [...prev.partyTypes, partyType]
        : prev.partyTypes.filter(type => type !== partyType)
    }));
  };

  const handleAddCustomPartyType = () => {
    if (customPartyType.trim() && !formData.partyTypes.includes(customPartyType.trim())) {
      setFormData(prev => ({
        ...prev,
        partyTypes: [...prev.partyTypes, customPartyType.trim()]
      }));
      setCustomPartyType("");
    }
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
            images: formData.images,
            image_url: formData.images[0] || null,
            house_rules: houseRules,
            owner_id: user.id
          }
        ])
        .select();

      if (error) throw error;

      toast.success("Item added successfully!");
      
      setFormData({
        name: "",
        description: "",
        category: "",
        condition: "good",
        zipCode: userProfile?.zip_code || "",
        location: "",
        contactEmail: userProfile?.email || user?.email || "",
        partyTypes: [],
        images: [],
      });
      setHouseRules([]);
      
      navigate('/?tab=browse');
    } catch (error: any) {
      console.error('Error adding supply:', error);
      toast.error(error.message || "Failed to add item. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const partyTypeOptions = [
    "Birthday",
    "Baby Shower",
    "Wedding",
    "Holiday",
    "BBQ",
    "Sports",
    "School Event",
    "Other"
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-semibold text-deep-brown mb-2">
            Add an Item
          </h1>
          <p className="text-muted-foreground">
            Share an item with your neighbors
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-card border border-border rounded-sm p-6 space-y-6">
            <h2 className="text-lg font-serif font-semibold text-deep-brown">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="name" className="text-deep-brown font-medium">
                  Item Name *
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., Folding Tables (2)"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="border-border mt-1"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description" className="text-deep-brown font-medium">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the item, its condition, and any important details..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="border-border mt-1 min-h-[100px]"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category" className="text-deep-brown font-medium">
                  Category *
                </Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className="border-border mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(c => c.id !== 'all').map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="condition" className="text-deep-brown font-medium">
                  Condition *
                </Label>
                <Select value={formData.condition} onValueChange={(value) => setFormData(prev => ({ ...prev, condition: value }))}>
                  <SelectTrigger className="border-border mt-1">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-sm p-6 space-y-4">
            <h2 className="text-lg font-serif font-semibold text-deep-brown">Photos</h2>
            <p className="text-sm text-muted-foreground">Add photos to help others see what you're sharing</p>
            <MultipleImageUpload
              currentImages={formData.images}
              onImagesChange={(images) => setFormData(prev => ({ ...prev, images }))}
            />
          </div>

          <div className="bg-card border border-border rounded-sm p-6 space-y-6">
            <h2 className="text-lg font-serif font-semibold text-deep-brown">Location & Contact</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="zipCode" className="text-deep-brown font-medium">
                  ZIP Code
                </Label>
                <Input
                  id="zipCode"
                  placeholder="94122"
                  value={formData.zipCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
                  className="border-border mt-1"
                />
              </div>

              <div>
                <Label htmlFor="location" className="text-deep-brown font-medium">
                  Neighborhood / Intersection
                </Label>
                <Input
                  id="location"
                  placeholder="e.g., 46th & Judah"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="border-border mt-1"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="contactEmail" className="text-deep-brown font-medium">
                  Contact Email *
                </Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="your-email@example.com"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                  className="border-border mt-1"
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-sm p-6 space-y-4">
            <h2 className="text-lg font-serif font-semibold text-deep-brown">Suitable For (Optional)</h2>
            <p className="text-sm text-muted-foreground">What types of events or occasions is this item good for?</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {partyTypeOptions.map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={formData.partyTypes.includes(type)}
                    onCheckedChange={(checked) => handlePartyTypeChange(type, checked as boolean)}
                  />
                  <span className="text-sm text-foreground">{type}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Add custom type..."
                value={customPartyType}
                onChange={(e) => setCustomPartyType(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomPartyType())}
                className="border-border"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddCustomPartyType}
                className="shrink-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="bg-card border border-border rounded-sm p-6 space-y-4">
            <h2 className="text-lg font-serif font-semibold text-deep-brown">Borrowing Guidelines (Optional)</h2>
            <p className="text-sm text-muted-foreground">Set any rules or expectations for borrowing this item</p>
            <HouseRules rules={houseRules} onRulesChange={setHouseRules} />
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? "Adding Item..." : "Add Item"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
