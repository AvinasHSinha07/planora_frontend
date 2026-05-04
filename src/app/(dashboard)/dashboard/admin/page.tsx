"use client";

import AdminOverview from "@/components/modules/Dashboard/Admin/AdminOverview";
import UserManagement from "@/components/modules/Dashboard/Admin/UserManagement";
import EventManagement from "@/components/modules/Dashboard/Admin/EventManagement";
import RevenueDashboard from "@/components/modules/Dashboard/Analytics/RevenueDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Users, 
  Calendar, 
  DollarSign, 
  LayoutDashboard
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function AdminPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Admin Console</h1>
        <p className="text-muted-foreground">
          Platform-wide oversight and moderation controls.
        </p>
      </div>

      <Separator />

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="w-full justify-start h-12 bg-muted/50 p-1 border rounded-lg">
          <TabsTrigger value="overview" className="flex items-center gap-2 px-6 h-full font-medium transition-all">
            <LayoutDashboard className="w-4 h-4" /> Overview
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2 px-6 h-full font-medium transition-all">
            <Users className="w-4 h-4" /> Users
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2 px-6 h-full font-medium transition-all">
            <Calendar className="w-4 h-4" /> Events
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2 px-6 h-full font-medium transition-all">
            <DollarSign className="w-4 h-4" /> Payments
          </TabsTrigger>
        </TabsList>

        <div className="min-h-[400px]">
          <TabsContent value="overview" className="mt-0 focus-visible:outline-none">
            <AdminOverview />
          </TabsContent>

          <TabsContent value="users" className="mt-0 focus-visible:outline-none">
            <UserManagement />
          </TabsContent>

          <TabsContent value="events" className="mt-0 focus-visible:outline-none">
            <EventManagement />
          </TabsContent>

          <TabsContent value="payments" className="mt-0 focus-visible:outline-none">
            <RevenueDashboard />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
