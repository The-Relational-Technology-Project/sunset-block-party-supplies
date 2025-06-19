
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Copy, Check } from "lucide-react";

export function InviteMember() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generateInviteLink = () => {
    const baseUrl = window.location.origin;
    const encodedData = btoa(JSON.stringify({ inviterName: "Current Member" }));
    return `${baseUrl}?invite=${encodedData}`;
  };

  const copyInviteLink = async () => {
    const link = generateInviteLink();
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setInviteLink(link);
      toast({
        title: "Invite link copied!",
        description: "Share this link with people you'd like to vouch for."
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually.",
        variant: "destructive"
      });
    }
  };

  const handleDirectInvite = async () => {
    if (!name.trim() || !email.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both name and email.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Check if a join request already exists for this email
      const { data: existingRequest } = await supabase
        .from('join_requests')
        .select('id, status')
        .eq('email', email.trim())
        .maybeSingle();

      if (existingRequest) {
        toast({
          title: "Already requested",
          description: `${email} has already submitted a join request.`,
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Create a pre-vouched join request
      const { error } = await supabase
        .from('join_requests')
        .insert({
          name: name.trim(),
          email: email.trim(),
          intro: `Invited by community member`,
          connection_context: `Vouched for by existing member`,
          status: 'vouched',
          voucher_id: user.id,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString()
        });

      if (error) throw error;

      // Create or update profile
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email.trim())
        .maybeSingle();

      let profileId = existingProfile?.id;

      if (!profileId) {
        const { data: newProfile, error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: crypto.randomUUID(),
            name: name.trim(),
            email: email.trim(),
            vouched_at: new Date().toISOString(),
            vouched_by: user.id
          })
          .select('id')
          .single();

        if (profileError) throw profileError;
        profileId = newProfile.id;
      } else {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            vouched_at: new Date().toISOString(),
            vouched_by: user.id
          })
          .eq('id', profileId);

        if (updateError) throw updateError;
      }

      // Create vouch record
      const { error: vouchError } = await supabase
        .from('vouches')
        .insert({
          voucher_id: user.id,
          vouched_id: profileId,
          vouch_note: `Direct invitation vouching`
        });

      if (vouchError) throw vouchError;

      toast({
        title: "Invitation sent!",
        description: `${name} has been vouched for and can now sign up with full access.`
      });

      setName("");
      setEmail("");
    } catch (error: any) {
      toast({
        title: "Error sending invitation",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Invite Someone You Trust
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="invite-name">Their Name</Label>
            <Input
              id="invite-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
            />
          </div>
          <div>
            <Label htmlFor="invite-email">Their Email</Label>
            <Input
              id="invite-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="their@email.com"
            />
          </div>
          <Button 
            onClick={handleDirectInvite} 
            disabled={loading}
            className="w-full bg-pink-600 hover:bg-pink-700"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Vouch & Invite
          </Button>
          <p className="text-sm text-gray-600">
            By inviting someone, you're vouching for them as a trusted community member.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Or Share an Invite Link</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={copyInviteLink}
            variant="outline"
            className="w-full"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy Invite Link
              </>
            )}
          </Button>
          {inviteLink && (
            <div className="mt-3 p-3 bg-gray-50 rounded text-sm break-all">
              {inviteLink}
            </div>
          )}
          <p className="text-sm text-gray-600 mt-2">
            Anyone with this link can request to join, and it will show that you referred them.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
