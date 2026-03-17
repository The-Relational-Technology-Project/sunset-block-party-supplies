import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown, ChevronRight } from "lucide-react";

interface CommunityRequest {
  id: string;
  name: string;
  email: string;
  co_stewards: { name: string; email: string }[];
  reason: string;
  questions: string | null;
  status: string;
  created_at: string;
}

export function CommunityRequestsManager() {
  const [requests, setRequests] = useState<CommunityRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      const { data, error } = await supabase
        .from("community_steward_requests" as any)
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setRequests(data as unknown as CommunityRequest[]);
      }
      setLoading(false);
    };
    fetchRequests();
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (requests.length === 0) {
    return <p className="text-muted-foreground text-sm">No community requests yet.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-8"></TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((req) => (
          <>
            <TableRow
              key={req.id}
              className="cursor-pointer"
              onClick={() => setExpandedId(expandedId === req.id ? null : req.id)}
            >
              <TableCell>
                {expandedId === req.id ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </TableCell>
              <TableCell className="font-medium">{req.name}</TableCell>
              <TableCell>{req.email}</TableCell>
              <TableCell>
                <Badge variant={req.status === "pending" ? "secondary" : "default"}>
                  {req.status}
                </Badge>
              </TableCell>
              <TableCell>{new Date(req.created_at).toLocaleDateString()}</TableCell>
            </TableRow>
            {expandedId === req.id && (
              <TableRow key={`${req.id}-detail`}>
                <TableCell colSpan={5} className="bg-muted/30">
                  <div className="space-y-3 py-2 px-2">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Why they want to start a community</p>
                      <p className="text-sm">{req.reason}</p>
                    </div>
                    {req.questions && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Questions</p>
                        <p className="text-sm">{req.questions}</p>
                      </div>
                    )}
                    {req.co_stewards && req.co_stewards.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Co-stewards</p>
                        <ul className="text-sm space-y-1">
                          {req.co_stewards.map((cs, i) => (
                            <li key={i}>{cs.name} — {cs.email}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </>
        ))}
      </TableBody>
    </Table>
  );
}
