import { Card, CardContent } from "@/components/ui/card";
import { Supply } from "@/types/supply";
import { MapPin } from "lucide-react";

interface SupplyCardProps {
  supply: Supply;
  onViewContact: (supply: Supply) => void;
}

export function SupplyCard({ supply, onViewContact }: SupplyCardProps) {
  return (
    <Card 
      className="h-full hover:shadow-sm transition-shadow border-border cursor-pointer"
      onClick={() => onViewContact(supply)}
    >
      <CardContent className="p-0">
        <div className="relative aspect-square bg-muted flex items-center justify-center overflow-hidden">
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
            <div className="text-3xl text-muted-foreground">📦</div>
          )}
        </div>
        
        <div className="p-3">
          <h3 className="font-serif font-medium text-sm text-deep-brown mb-1 line-clamp-2">
            {supply.name}
          </h3>
          
          <div className="flex items-center text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
            <span className="truncate" title={supply.location || `${supply.owner.zipCode} area`}>
              {supply.location || `${supply.owner.zipCode} area`}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
