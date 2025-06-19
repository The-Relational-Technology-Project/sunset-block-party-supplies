
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Heart, UserCheck } from "lucide-react";

interface Member {
  id: string;
  name: string;
  email: string;
  vouched_at: string | null;
  created_at: string;
}

export function MemberVouchingManager() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, vouched_at, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMembers(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading members",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVouchMember = async (member: Member) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Create the vouch record
      const { error: vouchError } = await supabase
        .from('vouches')
        .insert({
          voucher_id: user.id,
          vouched_id: member.id,
          vouch_note: `Vouched by steward via dashboard`
        });

      if (vouchError) throw vouchError;

      // Update the profile to mark as vouched
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          vouched_at: new Date().toISOString(),
          vouched_by: user.id
        })
        .eq('id', member.id);

      if (updateError) throw updateError;

      toast({
        title: "Member vouched successfully!",
        description: `${member.name} is now a vouched member with full community access.`
      });

      fetchMembers();
    } catch (error: any) {
      toast({
        title: "Error vouching member",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading members...</div>;
  }

  if (members.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No members found
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => (
          <TableRow key={member.id}>
            <TableCell className="font-medium">{member.name}</TableCell>
            <TableCell>{member.email}</TableCell>
            <TableCell>
              <Badge variant={member.vouched_at ? 'default' : 'secondary'}>
                {member.vouched_at ? (
                  <>
                    <Heart className="h-3 w-3 mr-1" />
                    Vouched
                  </>
                ) : (
                  <>
                    <UserCheck className="h-3 w-3 mr-1" />
                    Member
                  </>
                )}
              </Badge>
            </TableCell>
            <TableCell>
              {new Date(member.created_at).toLocaleDateString()}
            </TableCell>
            <TableCell>
              {!member.vouched_at && (
                <Button 
                  size="sm" 
                  onClick={() => handleVouchMember(member)}
                  className="bg-pink-600 hover:bg-pink-700"
                >
                  <Heart className="h-4 w-4 mr-1" />
                  Vouch
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
