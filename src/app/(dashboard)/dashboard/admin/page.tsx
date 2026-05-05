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
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-10 py-6 px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight uppercase italic leading-none">
           Admin <span className="text-primary underline decoration-primary/20 underline-offset-8">Console</span>
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base italic">
          Platform-wide oversight and moderation controls.
        </p>
      </div>

      <Separator className="bg-border/50" />

      <Tabs defaultValue="overview" className="space-y-6 sm:space-y-10">
        <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
          <TabsList className="inline-flex min-w-full sm:min-w-0 h-12 sm:h-14 bg-muted/30 p-1.5 border border-border/40 rounded-2xl backdrop-blur-md">
            <TabsTrigger value="overview" className="flex items-center gap-2 px-4 sm:px-8 h-full font-black uppercase italic tracking-widest text-[10px] rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
              <LayoutDashboard className="w-4 h-4" /> Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2 px-4 sm:px-8 h-full font-black uppercase italic tracking-widest text-[10px] rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
              <Users className="w-4 h-4" /> Users
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2 px-4 sm:px-8 h-full font-black uppercase italic tracking-widest text-[10px] rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
              <Calendar className="w-4 h-4" /> Events
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2 px-4 sm:px-8 h-full font-black uppercase italic tracking-widest text-[10px] rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
              <DollarSign className="w-4 h-4" /> Payments
            </TabsTrigger>
          </TabsList>
        </div>

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
