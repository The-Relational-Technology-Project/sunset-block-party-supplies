import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function RefreshIllustrations() {
  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      // Get a fresh random set using the existing RPC
      const { data, error } = await supabase.rpc('get_public_illustrations');
      if (error) throw error;

      const urls = (data || []).map((row: { illustration_url: string }) => row.illustration_url);

      // Update the cached set in site_config
      const { error: updateError } = await supabase
        .from('site_config')
        .update({ value: urls, updated_at: new Date().toISOString() })
        .eq('key', 'landing_illustrations');

      if (updateError) throw updateError;

      toast.success(`Landing page illustrations refreshed (${urls.length} items)`);
    } catch (e: any) {
      toast.error("Failed to refresh illustrations: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="outline" onClick={handleRefresh} disabled={loading} className="gap-2">
      <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
      {loading ? "Refreshing…" : "Refresh Landing Illustrations"}
    </Button>
  );
}
