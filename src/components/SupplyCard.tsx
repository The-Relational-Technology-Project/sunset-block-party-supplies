
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Supply } from "@/types/supply";
import { Calendar, MapPin } from "lucide-react";

interface SupplyCardProps {
  supply: Supply;
  onViewContact: (supply: Supply) => void;
}

export function SupplyCard({ supply, onViewContact }: SupplyCardProps) {
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-yellow-100 text-yellow-800';
      case 'fair': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div className="relative aspect-video bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center overflow-hidden">
          {supply.images && supply.images.length > 0 ? (
            <img 
              src={supply.images[0]} 
              alt={supply.name}
              className="w-full h-full object-contain"
            />
          ) : supply.image ? (
            <img 
              src={supply.image} 
              alt={supply.name}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-6xl text-orange-300">📷</div>
          )}
          {supply.images && supply.images.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
              +{supply.images.length - 1} more
            </div>
          )}
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg">{supply.name}</h3>
            <div className="flex gap-1">
              <Badge className={getConditionColor(supply.condition)}>
                {supply.condition}
              </Badge>
              <Badge variant="secondary">available</Badge>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {supply.description}
          </p>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              {supply.dateAvailable}
            </div>
            
            <div className="flex flex-wrap gap-1">
              {supply.partyTypes.map((type) => (
                <Badge key={type} variant="outline" className="text-xs">
                  {type}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                {supply.owner.name.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-medium">{supply.owner.name}</div>
                <div className="text-xs text-gray-500 flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {supply.location || `${supply.owner.zipCode} area`}
                </div>
              </div>
            </div>
            
            <Button 
              onClick={() => onViewContact(supply)}
              className="bg-orange-500 hover:bg-orange-600"
            >
              View & Contact
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
