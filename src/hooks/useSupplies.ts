
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
      const { data, error } = await supabase
        .from('supplies')
        .select(`
          *,
          profiles:owner_id (
            name,
            zip_code
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedSupplies: Supply[] = (data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        category: item.category,
        condition: item.condition as 'excellent' | 'good' | 'fair',
        partyTypes: item.party_types || [],
        dateAvailable: item.date_available || new Date().toISOString().split('T')[0],
        location: item.location,
        image: item.image_url,
        houseRules: item.house_rules || [],
        owner: {
          name: item.profiles?.name || 'Unknown',
          zipCode: item.profiles?.zip_code || '00000',
          location: `${item.profiles?.zip_code || 'Unknown'} area`,
          avatar: ''
        }
      }));

      setSupplies(transformedSupplies);
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
