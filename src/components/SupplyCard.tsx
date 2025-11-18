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
      case 'excellent': return 'bg-green-50 text-green-700 border-green-200';
      case 'good': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'fair': return 'bg-orange-50 text-orange-700 border-orange-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="h-full hover:shadow-md transition-shadow border-border">
      <CardContent className="p-0">
        <div className="relative aspect-video bg-muted flex items-center justify-center overflow-hidden">
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
            <div className="text-4xl text-muted-foreground">📦</div>
          )}
          {supply.images && supply.images.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-deep-brown/80 text-sand text-xs px-2 py-1 rounded-sm">
              +{supply.images.length - 1} more
            </div>
          )}
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-serif font-semibold text-base text-deep-brown">{supply.name}</h3>
            <Badge className={`${getConditionColor(supply.condition)} text-xs border`}>
              {supply.condition}
            </Badge>
          </div>
          
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {supply.description}
          </p>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              {supply.dateAvailable}
            </div>
            
            <div className="flex flex-wrap gap-1">
              {supply.partyTypes.map((type) => (
                <Badge key={type} variant="outline" className="text-xs border-border">
                  {type}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 bg-terracotta rounded-full flex items-center justify-center text-white text-xs font-semibold">
                {supply.owner.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-deep-brown">
                  {supply.owner.name.split(' ')[0]}
                </div>
                <div className="text-xs text-muted-foreground flex items-center">
                  <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span 
                    className="truncate" 
                    title={supply.location || `${supply.owner.zipCode} area`}
                  >
                    {supply.location || `${supply.owner.zipCode} area`}
                  </span>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={() => onViewContact(supply)}
              size="sm"
              className="bg-terracotta hover:bg-terracotta/90 text-white"
            >
              View
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
