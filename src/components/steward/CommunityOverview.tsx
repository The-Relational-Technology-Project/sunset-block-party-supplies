
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Users, Heart, Shield, UserCheck } from "lucide-react";

interface CommunityStats {
  totalMembers: number;
  vouchedMembers: number;
  stewards: number;
  recentJoins: number;
}

interface Member {
  id: string;
  name: string;
  email: string;
  role: 'member' | 'steward';
  vouched_at: string | null;
  created_at: string;
}

export function CommunityOverview() {
  const [stats, setStats] = useState<CommunityStats>({
    totalMembers: 0,
    vouchedMembers: 0,
    stewards: 0,
    recentJoins: 0
  });
  const [recentMembers, setRecentMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCommunityData = async () => {
    try {
      const { data: members, error } = await supabase
        .from('profiles')
        .select('id, name, email, role, vouched_at, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const allMembers = members || [];
      const vouchedCount = allMembers.filter(m => m.vouched_at).length;
      const stewardCount = allMembers.filter(m => m.role === 'steward').length;
      const recentCount = allMembers.filter(m => {
        const joinDate = new Date(m.created_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return joinDate > weekAgo;
      }).length;

      setStats({
        totalMembers: allMembers.length,
        vouchedMembers: vouchedCount,
        stewards: stewardCount,
        recentJoins: recentCount
      });

      setRecentMembers(allMembers.slice(0, 10));
    } catch (error: any) {
      toast({
        title: "Error loading community data",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunityData();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading community overview...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMembers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vouched Members</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.vouchedMembers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stewards</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.stewards}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Joins</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentJoins}</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Members Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Members</CardTitle>
          <CardDescription>Latest members to join the community</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    <Badge variant={member.role === 'steward' ? 'default' : 'secondary'}>
                      {member.role === 'steward' && <Shield className="h-3 w-3 mr-1" />}
                      {member.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={member.vouched_at ? 'default' : 'outline'}>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
