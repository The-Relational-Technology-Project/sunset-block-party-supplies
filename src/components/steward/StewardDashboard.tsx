
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, Heart, UserCheck, Settings, Package } from "lucide-react";
import { JoinRequestsManager } from "./JoinRequestsManager";
import { CommunityOverview } from "./CommunityOverview";
import { BulkCreateUsers } from "./BulkCreateUsers";
import { VouchedUsersExport } from "./VouchedUsersExport";
import { SupplyRequestsManager } from "./SupplyRequestsManager";

export function StewardDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-8 w-8 text-orange-500" />
        <div>
          <h1 className="text-3xl font-bold">Steward Dashboard</h1>
          <p className="text-gray-600">Manage community applications and member vouching</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            New Users
          </TabsTrigger>
          <TabsTrigger value="supply-requests" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Supply Requests
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Join Requests
          </TabsTrigger>
          <TabsTrigger value="vouched-users" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Vouched Users
          </TabsTrigger>
          <TabsTrigger value="bulk-create" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Bulk Create
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>New Users</CardTitle>
              <CardDescription>
                View all community members and their join details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CommunityOverview />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="supply-requests">
          <Card>
            <CardHeader>
              <CardTitle>Supply Requests</CardTitle>
              <CardDescription>
                Recent requests from people wanting to borrow supplies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SupplyRequestsManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>Join Requests</CardTitle>
              <CardDescription>
                Review and approve applications from people who want to join the community.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <JoinRequestsManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vouched-users">
          <VouchedUsersExport />
        </TabsContent>
        
        <TabsContent value="bulk-create">
          <BulkCreateUsers />
        </TabsContent>
      </Tabs>
    </div>
  );
}
