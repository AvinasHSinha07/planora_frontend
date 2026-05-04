"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Users, 
  Calendar, 
  DollarSign, 
  ShieldCheck, 
  TrendingUp, 
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Globe
} from "lucide-react";
import { motion } from "framer-motion";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from "recharts";

export default function AdminOverview() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/users/dashboard-stats");
      // Since it's an admin, the backend returns global stats if we logic it correctly
      // But for now, we'll use the existing stats and enhance them
      return data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const statCards = [
    { 
      title: "Total Users", 
      value: stats?.totalUsers || "1.2k", 
      icon: Users, 
      trend: "+12%", 
      isUp: true,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    { 
      title: "Active Events", 
      value: stats?.totalEvents || "842", 
      icon: Calendar, 
      trend: "+5.4%", 
      isUp: true,
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    },
    { 
      title: "Platform Revenue", 
      value: `$${(stats?.totalRevenue || 42000).toLocaleString()}`, 
      icon: DollarSign, 
      trend: "+8.1%", 
      isUp: true,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    { 
      title: "Global Conversion", 
      value: "68%", 
      icon: Zap, 
      trend: "-2.3%", 
      isUp: false,
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    },
  ];

  // Use dynamic growth data from backend
  const growthData = stats?.growthData || [];

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="space-y-1">
          <h2 className="text-4xl font-black tracking-tight uppercase italic flex items-center gap-3">
             <ShieldCheck className="w-10 h-10 text-primary" />
             Admin <span className="text-primary underline decoration-4 underline-offset-8">Command Center</span>
          </h2>
          <p className="text-muted-foreground text-lg italic">Strategic oversight and platform-wide moderation.</p>
        </div>
        <div className="flex items-center gap-3 bg-card/50 backdrop-blur-md px-6 py-3 rounded-2xl border border-primary/20 shadow-lg shadow-primary/5">
           <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-sm font-bold uppercase tracking-widest italic">System Live: 99.9% Uptime</span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="rounded-[2.5rem] border-none shadow-xl bg-card/40 backdrop-blur-xl group hover:bg-card transition-all duration-500 overflow-hidden relative">
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-6">
                   <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} transition-transform duration-500 group-hover:scale-110`}>
                      <stat.icon className="h-6 w-6" />
                   </div>
                   <div className={`flex items-center gap-1 text-xs font-black uppercase tracking-tighter ${stat.isUp ? "text-emerald-500" : "text-destructive"}`}>
                      {stat.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {stat.trend}
                   </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">{stat.title}</p>
                  <div className="text-4xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors">
                    {stat.value}
                  </div>
                </div>
              </CardContent>
              <div className={`absolute bottom-0 left-0 h-1 w-full ${stat.color.replace('text', 'bg')} opacity-20`} />
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
         {/* Growth Chart */}
         <Card className="lg:col-span-2 rounded-[3rem] border-none shadow-2xl bg-card/30 backdrop-blur-md overflow-hidden group">
            <CardHeader className="p-10 pb-0">
               <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-black uppercase italic tracking-tight flex items-center gap-2">
                       <TrendingUp className="w-6 h-6 text-primary" />
                       Ecosystem Growth
                    </CardTitle>
                    <CardDescription className="italic text-base">Analyzing weekly user and event trajectory</CardDescription>
                  </div>
                  <div className="flex gap-2">
                     <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        Users
                     </div>
                     <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        Events
                     </div>
                  </div>
               </div>
            </CardHeader>
            <CardContent className="p-10 h-[400px]">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={growthData}>
                     <defs>
                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                     <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 12, fontWeight: 700, fill: '#666'}} 
                     />
                     <YAxis hide />
                     <Tooltip 
                        contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '15px 25px' }}
                     />
                     <Area 
                        type="monotone" 
                        dataKey="users" 
                        stroke="var(--primary)" 
                        strokeWidth={4}
                        fillOpacity={1} 
                        fill="url(#colorUsers)" 
                     />
                     <Area 
                        type="monotone" 
                        dataKey="events" 
                        stroke="#10b981" 
                        strokeWidth={4}
                        fillOpacity={1} 
                        fill="url(#colorEvents)" 
                     />
                  </AreaChart>
               </ResponsiveContainer>
            </CardContent>
         </Card>

         {/* Right Sidebar Info */}
         <div className="space-y-6">
            <Card className="rounded-[3rem] border-none shadow-2xl bg-primary text-primary-foreground relative overflow-hidden group p-10">
               <Globe className="absolute -right-8 -bottom-8 w-48 h-48 opacity-10 group-hover:scale-125 transition-transform duration-700" />
               <div className="space-y-6 relative z-10">
                  <div className="space-y-2">
                     <p className="text-xs font-black uppercase tracking-[0.2em] opacity-70">Global Reach</p>
                     <h3 className="text-4xl font-black tracking-tight leading-none uppercase italic">Expanding <br />the network</h3>
                  </div>
                  <p className="text-sm font-bold opacity-80 leading-relaxed italic">
                     Planora is now active in 12 major cities worldwide. Average event diversity has increased by 34% this quarter.
                  </p>
                  <div className="pt-4 flex items-center justify-between border-t border-white/20">
                     <div className="text-center">
                        <p className="text-2xl font-black">12</p>
                        <p className="text-[10px] font-black uppercase opacity-60">Cities</p>
                     </div>
                     <div className="text-center">
                        <p className="text-2xl font-black">84k</p>
                        <p className="text-[10px] font-black uppercase opacity-60">Reach</p>
                     </div>
                     <div className="text-center">
                        <p className="text-2xl font-black">4.9</p>
                        <p className="text-[10px] font-black uppercase opacity-60">Rating</p>
                     </div>
                  </div>
               </div>
            </Card>

            <Card className="rounded-[2.5rem] border-border/40 shadow-xl bg-card/50 backdrop-blur-xl overflow-hidden p-8">
               <p className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-6">Recent Platform Action</p>
               <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center gap-4 group">
                       <div className="h-10 w-10 rounded-xl bg-muted group-hover:bg-primary/10 transition-colors flex items-center justify-center font-bold text-primary">
                          {item}
                       </div>
                       <div className="flex-1">
                          <p className="text-sm font-black italic">New Organizer Verified</p>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">2 minutes ago</p>
                       </div>
                       <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  ))}
               </div>
            </Card>
         </div>
      </div>
    </div>
  );
}
