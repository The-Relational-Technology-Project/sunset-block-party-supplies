
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, Heart, UserCheck, Settings } from "lucide-react";
import { JoinRequestsManager } from "./JoinRequestsManager";
import { MemberVouchingManager } from "./MemberVouchingManager";
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Join Requests & Vouching
          </TabsTrigger>
          <TabsTrigger value="vouching" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Additional Vouching
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
              <CardTitle>Join Requests & Vouching</CardTitle>
              <CardDescription>
                Review applications and vouch for new community members. When you vouch for someone,
                they become a trusted member who can access all community features.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <JoinRequestsManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vouching">
          <Card>
            <CardHeader>
              <CardTitle>Additional Member Vouching</CardTitle>
              <CardDescription>
                Vouch for existing members who haven't been vouched yet, or members who joined 
                through other means but need community vouching.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MemberVouchingManager />
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
