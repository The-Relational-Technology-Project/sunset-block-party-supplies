
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Supply } from "@/types/supply";

export function useSupplies() {
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSupplies = async () => {
    try {
      // First get supplies data
      const { data: suppliesData, error } = await supabase
        .from('supplies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Then get owner info for each supply using our secure function
      const suppliesWithOwners = await Promise.all(
        (suppliesData || []).map(async (item: any) => {
          let ownerName = 'Unknown';
          let ownerZipCode = '00000';
          
          if (item.owner_id) {
            try {
              const { data: ownerData } = await supabase
                .rpc('get_supply_owner_info', { owner_id_param: item.owner_id });
              
              if (ownerData && ownerData.length > 0) {
                ownerName = ownerData[0].name || 'Unknown';
                ownerZipCode = ownerData[0].zip_code || '00000';
              }
            } catch (ownerError) {
              console.log('Could not fetch owner info:', ownerError);
            }
          }

          return {
            id: item.id,
            name: item.name,
            description: item.description,
            category: item.category,
            condition: item.condition as 'excellent' | 'good' | 'fair',
            partyTypes: item.party_types || [],
            dateAvailable: item.date_available || new Date().toISOString().split('T')[0],
            location: item.location,
            contactEmail: item.contact_email,
            image: item.image_url,
            images: item.images || (item.image_url ? [item.image_url] : []),
            illustration_url: item.illustration_url,
            houseRules: item.house_rules || [],
            ownerId: item.owner_id,
            owner: {
              name: ownerName,
              zipCode: ownerZipCode,
              location: `${ownerZipCode === '00000' ? 'Unknown' : ownerZipCode} area`,
              avatar: ''
            }
          };
        })
      );

      setSupplies(suppliesWithOwners);
    } catch (error: any) {
      toast({
        title: "Error loading supplies",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupplies();
  }, []);

  return { supplies, loading, refetch: fetchSupplies };
}
