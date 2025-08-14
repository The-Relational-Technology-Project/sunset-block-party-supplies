
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User, LogOut, Shield, Heart, Package, Settings } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

interface Profile {
  id: string;
  name: string;
  email: string;
  role: 'member' | 'steward';
  vouched_at: string | null;
}

export function UserProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (data) setProfile(data);
      }
    };

    fetchProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setProfile(null);
      } else if (event === 'SIGNED_IN' && session) {
        fetchProfile();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Signed out", description: "You've been signed out successfully." });
    }
  };

  if (!profile) return null;

  const isVouched = !!profile.vouched_at;
  const isSteward = profile.role === 'steward';

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 text-white hover:bg-orange-600">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">{profile.name}</span>
            {isSteward && <Shield className="h-4 w-4 text-yellow-200" />}
            {isVouched && <Heart className="h-4 w-4 text-pink-200" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5 text-sm">
            <div className="font-medium">{profile.name}</div>
            <div className="text-muted-foreground">{profile.email}</div>
            <div className="text-xs mt-1 flex gap-2">
              {isSteward && <span className="text-yellow-600">Steward</span>}
              {isVouched && <span className="text-green-600">Vouched</span>}
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => window.location.href = '/profile'}>
            <Settings className="mr-2 h-4 w-4" />
            Profile Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => window.location.href = '/my-supplies'}>
            <Package className="mr-2 h-4 w-4" />
            My Supplies
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
