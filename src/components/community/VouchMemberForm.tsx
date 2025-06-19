
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Heart, Users } from "lucide-react";

export function VouchMemberForm() {
  const [email, setEmail] = useState("");
  const [vouchNote, setVouchNote] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First check if the user exists in profiles
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, name, vouched_at')
        .eq('email', email)
        .maybeSingle();

      if (profileError) throw profileError;

      if (!profile) {
        toast({
          title: "User not found",
          description: "This person needs to create an account first before they can be vouched for.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      if (profile.vouched_at) {
        toast({
          title: "Already vouched",
          description: `${profile.name} is already a vouched member of the community.`,
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Create the vouch record
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error: vouchError } = await supabase
        .from('vouches')
        .insert({
          voucher_id: user.id,
          vouched_id: profile.id,
          vouch_note: vouchNote
        });

      if (vouchError) throw vouchError;

      // Update the profile to mark as vouched
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          vouched_at: new Date().toISOString(),
          vouched_by: user.id
        })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      toast({
        title: "Member vouched successfully!",
        description: `${profile.name} is now a vouched member and can access all community features.`
      });

      setEmail("");
      setVouchNote("");
    } catch (error: any) {
      toast({
        title: "Error vouching member",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-pink-500" />
          Vouch for a Community Member
        </CardTitle>
        <CardDescription>
          As a vouched member, you can vouch for others to join our trusted community. 
          They need to have an account already - encourage them to sign up first!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Member's Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="their@email.com"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="vouchNote">Why are you vouching for them? (Optional)</Label>
            <Textarea
              id="vouchNote"
              value={vouchNote}
              onChange={(e) => setVouchNote(e.target.value)}
              placeholder="Share why you trust this person and think they'd be a great addition to our community..."
              rows={3}
            />
          </div>
          
          <Button type="submit" disabled={loading} className="w-full">
            <Users className="h-4 w-4 mr-2" />
            {loading ? "Vouching Member..." : "Vouch for This Member"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
