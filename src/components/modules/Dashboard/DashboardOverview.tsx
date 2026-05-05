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
    if (role === "ADMIN") return "System Intelligence";
    if (role === "ORGANIZER") return "Event Logistics";
    return "Event Discovery";
  };

  const getDescription = () => {
    if (role === "ADMIN") return "Orchestrating the platform's global ecosystem.";
    if (role === "ORGANIZER") return "Managing your upcoming events and participant engagement.";
    return "Discovering exciting events and managing your invitations.";
  };

  return (
    <div className="space-y-6 md:space-y-10">
      <div className="bg-primary/10 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 border border-primary/20 relative overflow-hidden group">
        <div className="relative z-10">
          <h2 className="text-2xl md:text-4xl font-black tracking-tight uppercase italic leading-tight">
            Welcome, <br className="xs:hidden" /> {user?.name?.split(' ')[0] || 'Member'}!
          </h2>
          <p className="text-muted-foreground mt-2 text-sm md:text-xl italic">
            {getGreeting()} — <br className="hidden xs:block md:hidden" /> {getDescription()}
          </p>
        </div>
        <div className="absolute top-0 right-0 p-4 md:p-10 opacity-5 md:opacity-10 group-hover:scale-110 transition-transform duration-700">
          <Calendar className="h-32 w-32 md:h-40 md:w-40 rotate-12 text-primary" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        <Card className="rounded-[1.5rem] md:rounded-[2rem] border-none shadow-xl bg-card/50 backdrop-blur-md overflow-hidden relative group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-border/10">
            <CardTitle className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
              {role === "ADMIN" ? "Global Identities" : (role === "ORGANIZER" ? "Managed Events" : "Participations")}
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="pt-4 md:pt-6">
            <div className="text-3xl md:text-4xl font-black tracking-tighter">
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : (role === "ADMIN" ? stats?.totalUsers : (role === "ORGANIZER" ? stats?.totalEvents : stats?.totalParticipations)) || 0}
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-2 italic">Active platform presence</p>
          </CardContent>
        </Card>

        <Card className="rounded-[1.5rem] md:rounded-[2rem] border-none shadow-xl bg-card/50 backdrop-blur-xl overflow-hidden relative group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-border/10">
            <CardTitle className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
              {role === "ADMIN" ? "Global Content" : (role === "ORGANIZER" ? "Total Reach" : "Network Growth")}
            </CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="pt-4 md:pt-6">
            <div className="text-3xl md:text-4xl font-black tracking-tighter">
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : (role === "ADMIN" ? stats?.totalEvents : (role === "ORGANIZER" ? stats?.totalAttendees : stats?.totalParticipations)) || 0}
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-2 italic">Ecosystem deployment</p>
          </CardContent>
        </Card>

        <Card className="rounded-[1.5rem] md:rounded-[2rem] border-none shadow-xl bg-primary text-primary-foreground overflow-hidden relative group sm:col-span-2 md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-white/10">
            <CardTitle className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] opacity-80">
               {role === "ADMIN" ? "Global Revenue" : "Attention Required"}
            </CardTitle>
            <Activity className="h-4 w-4 opacity-80" />
          </CardHeader>
          <CardContent className="pt-4 md:pt-6">
            <div className="text-3xl md:text-4xl font-black tracking-tighter">
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : (role === "ADMIN" ? `$${(stats?.totalRevenue || 0).toLocaleString()}` : stats?.pendingInvitations || 0)}
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-2 italic">Real-time status</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
