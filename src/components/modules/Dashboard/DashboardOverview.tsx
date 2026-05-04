"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { Calendar, Users, Activity, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";

export default function DashboardOverview() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const role = (user as any)?.role || "USER";

  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/users/dashboard-stats");
      return data.data;
    },
  });

  const getGreeting = () => {
    if (role === "ADMIN") return "Platform Oversight";
    if (role === "ORGANIZER") return "Event Management";
    return "Event Discovery";
  };

  const getDescription = () => {
    if (role === "ADMIN") return "Monitor system health, users, and global events.";
    if (role === "ORGANIZER") return "Track your upcoming events and participant engagement.";
    return "Discover exciting events and manage your invitations.";
  };

  return (
    <div className="space-y-6">
      <div className="bg-primary/10 rounded-2xl p-8 border border-primary/20 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-black tracking-tight">Welcome back, {user?.name?.split(' ')[0] || 'User'}!</h2>
          <p className="text-muted-foreground mt-2 text-lg">{getGreeting()} — {getDescription()}</p>
        </div>
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Calendar className="h-32 w-32 rotate-12" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {role === "ORGANIZER" ? "Organized Events" : "Participations"}
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : (role === "ORGANIZER" ? stats?.totalEvents : stats?.totalParticipations) || 0}
            </div>
            <p className="text-xs text-muted-foreground">Lifetime activity</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {role === "ORGANIZER" ? "Total Attendees" : "Network Connections"}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : (role === "ORGANIZER" ? stats?.totalAttendees : stats?.totalParticipations) || 0}
            </div>
            <p className="text-xs text-muted-foreground">Engagement reach</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Invitations</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats?.pendingInvitations || 0}
            </div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
