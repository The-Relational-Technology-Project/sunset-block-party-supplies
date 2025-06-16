
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Supply } from "@/types/supply";
import { MapPin, Calendar, Mail, Phone } from "lucide-react";

interface ContactModalProps {
  supply: Supply | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ supply, isOpen, onClose }: ContactModalProps) {
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{supply.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="aspect-video bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
            <div className="text-8xl text-orange-300">📷</div>
          </div>
          
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
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    {supply.owner.location}
                  </div>
                </div>
                
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
                
                <div className="space-y-2">
                  <Button 
                    className="w-full bg-orange-500 hover:bg-orange-600" 
                    onClick={() => window.open(`mailto:contact@example.com?subject=Interest in ${supply.name}`)}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.open('tel:+1234567890')}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Owner
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
