
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, Heart, UserCheck, Settings } from "lucide-react";
import { JoinRequestsManager } from "./JoinRequestsManager";
import { CommunityOverview } from "./CommunityOverview";
import { BulkCreateUsers } from "./BulkCreateUsers";

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

      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Join Requests
          </TabsTrigger>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Community Overview
          </TabsTrigger>
          <TabsTrigger value="bulk-create" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Bulk Create Users
          </TabsTrigger>
        </TabsList>

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

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Community Overview</CardTitle>
              <CardDescription>
                View all community members and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CommunityOverview />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="bulk-create">
          <BulkCreateUsers />
        </TabsContent>
      </Tabs>
    </div>
  );
}
