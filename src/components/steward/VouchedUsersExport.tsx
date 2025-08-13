import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Copy, Users } from "lucide-react";

interface VouchedUser {
  name: string;
  email: string;
}

export function VouchedUsersExport() {
  const [vouchedUsers, setVouchedUsers] = useState<VouchedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchVouchedUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('join_requests')
        .select('name, email')
        .eq('status', 'vouched')
        .order('name');

      if (error) throw error;
      setVouchedUsers(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading vouched users",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const copyEmailsList = () => {
    const emailsList = vouchedUsers.map(user => `${user.name} <${user.email}>`).join('\n');
    navigator.clipboard.writeText(emailsList);
    toast({
      title: "Emails copied!",
      description: "The list of vouched users has been copied to your clipboard."
    });
  };

  const copyEmailsOnly = () => {
    const emailsList = vouchedUsers.map(user => user.email).join(', ');
    navigator.clipboard.writeText(emailsList);
    toast({
      title: "Email addresses copied!",
      description: "Email addresses have been copied to your clipboard."
    });
  };

  useEffect(() => {
    fetchVouchedUsers();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading vouched users...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Previously Vouched Users ({vouchedUsers.length})
        </CardTitle>
        <CardDescription>
          These people were previously vouched and can be invited to sign up again.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {vouchedUsers.length === 0 ? (
          <p className="text-gray-500">No vouched users found.</p>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={copyEmailsList} variant="outline">
                <Copy className="h-4 w-4 mr-2" />
                Copy Names & Emails
              </Button>
              <Button onClick={copyEmailsOnly} variant="outline">
                <Copy className="h-4 w-4 mr-2" />
                Copy Emails Only
              </Button>
            </div>
            
            <div className="border rounded-lg p-4 max-h-64 overflow-y-auto">
              <div className="space-y-2">
                {vouchedUsers.map((user, index) => (
                  <div key={index} className="flex justify-between items-center py-1">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-gray-600">{user.email}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded">
              <p><strong>Suggestion:</strong> Send these people an email letting them know they can sign up again at your community site. Since you know them personally, they can just create regular accounts.</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}