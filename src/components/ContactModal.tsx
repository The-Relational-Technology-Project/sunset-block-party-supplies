import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Supply } from "@/types/supply";
import { MapPin, Calendar, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ContactModalProps {
  supply: Supply | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ supply, isOpen, onClose }: ContactModalProps) {
  const [senderName, setSenderName] = useState("");
  const [senderContact, setSenderContact] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!supply || !senderName || !senderContact || !message) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await supabase.functions.invoke('send-contact-message', {
        body: {
          supplyName: supply.name,
          supplyOwnerEmail: supply.contactEmail,
          senderName,
          senderContact,
          message
        }
      });

      if (response.error) throw response.error;

      toast({
        title: "Message sent!",
        description: `Your message has been sent to ${supply.owner.name}`,
      });

      // Reset form and close modal
      setSenderName("");
      setSenderContact("");
      setMessage("");
      onClose();
    } catch (error: any) {
      toast({
        title: "Failed to send message",
        description: error.message || "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!supply) return null;

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-yellow-100 text-yellow-800';
      case 'fair': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Contact about: {supply.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Supply Image */}
          <div className="aspect-video bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center overflow-hidden">
            {supply.image ? (
              <img 
                src={supply.image} 
                alt={supply.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-8xl text-orange-300">📷</div>
            )}
          </div>
          
          {/* Supply Details */}
          <div className="space-y-4">
            <div className="flex gap-2">
              <Badge className={getConditionColor(supply.condition)}>
                {supply.condition}
              </Badge>
              <Badge variant="secondary">available</Badge>
            </div>
            
            <p className="text-gray-700">{supply.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    Available: {supply.dateAvailable}
                  </div>
                  {supply.location && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      {supply.location}
                    </div>
                  )}
                </div>
                
                {supply.partyTypes.length > 0 && (
                  <div className="mt-3">
                    <h5 className="font-medium mb-1">Party Types:</h5>
                    <div className="flex flex-wrap gap-1">
                      {supply.partyTypes.map((type) => (
                        <Badge key={type} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Owner</h4>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {supply.owner.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium">{supply.owner.name}</div>
                    <div className="text-sm text-gray-500">{supply.owner.zipCode}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="border-t pt-6">
            <h4 className="font-semibold mb-4">Send a Message</h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Your Name *</label>
                  <Input
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Your Contact (Email or Phone) *</label>
                  <Input
                    value={senderContact}
                    onChange={(e) => setSenderContact(e.target.value)}
                    placeholder="your@email.com or (555) 123-4567"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Message *</label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Hi! I'm interested in borrowing your supply for... When would be a good time to arrange pickup?"
                  rows={4}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full bg-orange-500 hover:bg-orange-600"
              >
                <Send className="h-4 w-4 mr-2" />
                {isLoading ? "Sending..." : "Send Message"}
              </Button>
            </form>
            
            <p className="text-xs text-gray-500 mt-2">
              Your message will be sent directly to {supply.owner.name}'s email. They'll be able to respond to arrange details about borrowing this supply.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}