"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Loader2, 
  Calendar, 
  Target, 
  Zap, 
  Ticket as TicketIcon,
  Activity,
  ArrowUpRight
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export default function AnalyticsDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/users/dashboard-stats");
      return data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-12 w-12 animate-spin text-primary opacity-50" />
      </div>
    );
  }

  const growthData = stats?.growthData || [];
  const isGlobalStats = !!growthData[0]?.users; // Heuristic for Admin vs Organizer

  const displayStats = [
    { 
      title: "Total Revenue", 
      value: `$${stats?.totalRevenue?.toLocaleString() || 0}`, 
      icon: DollarSign, 
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      description: "Gross platform earnings"
    },
    { 
      title: isGlobalStats ? "Total Users" : "Ticket Sales", 
      value: isGlobalStats ? stats?.totalUsers : stats?.ticketSales || 0, 
      icon: isGlobalStats ? Users : TicketIcon, 
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      description: isGlobalStats ? "Verified ecosystem identities" : "Successful event bookings"
    },
    { 
      title: "Active Events", 
      value: stats?.totalEvents || 0, 
      icon: Calendar, 
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      description: "Live deployments on platform"
    },
    { 
      title: isGlobalStats ? "Participants" : "Engagement", 
      value: isGlobalStats ? stats?.totalParticipants : `${Math.round((stats?.totalAttendees / (stats?.totalEvents * 10 || 1)) * 10)}%`, 
      icon: isGlobalStats ? Target : Zap, 
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      description: isGlobalStats ? "Global approved attendees" : "Average attendee interaction"
    },
  ];

  return (
    <div className="space-y-12 pb-24 max-w-7xl mx-auto">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div className="space-y-2">
           <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
              <Activity className="w-3 h-3" /> Real-time Ecosystem Pulse
           </div>
           <h2 className="text-6xl font-black tracking-tighter uppercase italic leading-none">
              Platform <span className="text-primary underline decoration-primary/20 underline-offset-[12px]">Intelligence</span>
           </h2>
           <p className="text-muted-foreground text-xl italic max-w-2xl">
              Analyzing high-frequency data streams across your administrative perimeter.
           </p>
        </div>
        <div className="flex items-center gap-4 bg-muted/30 px-6 py-3 rounded-2xl border border-border/40 backdrop-blur-md">
           <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" />
           <span className="text-sm font-black uppercase tracking-widest italic opacity-70">Live Data Sync: Active</span>
        </div>
      </motion.div>

      {/* Intelligence Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {displayStats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-card/40 backdrop-blur-xl group hover:scale-[1.02] transition-all duration-500">
              <CardContent className="p-10 relative">
                <stat.icon className={`absolute -right-4 -bottom-4 w-32 h-32 ${stat.color} opacity-5 group-hover:scale-125 transition-transform duration-1000`} />
                <div className="space-y-4 relative z-10">
                   <div className={`inline-flex p-4 rounded-[1.5rem] ${stat.bg} ${stat.color} shadow-lg shadow-black/5`}>
                      <stat.icon className="h-6 w-6" />
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{stat.title}</p>
                      <div className="text-5xl font-black tracking-tighter italic">
                        {stat.value}
                      </div>
                      <p className="text-[10px] font-bold text-muted-foreground/50 italic">{stat.description}</p>
                   </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Growth Architecture Chart */}
        <Card className="lg:col-span-2 border-none shadow-3xl rounded-[3.5rem] overflow-hidden bg-card/40 backdrop-blur-xl">
          <CardHeader className="p-10 pb-0 flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-black uppercase italic tracking-tight flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-primary" />
                Growth <span className="text-muted-foreground">Trajectory</span>
              </CardTitle>
              <CardDescription className="italic">7-Day velocity breakdown per ecosystem node</CardDescription>
            </div>
            <Badge variant="outline" className="rounded-full px-6 py-2 font-black italic uppercase tracking-widest text-[10px] border-primary/20 text-primary">
               Real-time Metric
            </Badge>
          </CardHeader>
          <CardContent className="p-10 h-[450px]">
            <ResponsiveContainer width="100%" height="100%">
              {isGlobalStats ? (
                <AreaChart data={growthData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 12, fontWeight: 900, fill: '#888'}} 
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{borderRadius: '2rem', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', padding: '20px'}} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="users" 
                    name="Identity Growth"
                    stroke="var(--primary)" 
                    strokeWidth={5}
                    fillOpacity={1} 
                    fill="url(#colorUsers)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="events" 
                    name="Deployment Growth"
                    stroke="#8b5cf6" 
                    strokeWidth={5}
                    fillOpacity={1} 
                    fill="url(#colorEvents)" 
                  />
                </AreaChart>
              ) : (
                <BarChart data={growthData}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                   <XAxis 
                     dataKey="name" 
                     axisLine={false} 
                     tickLine={false} 
                     tick={{fontSize: 12, fontWeight: 900, fill: '#888'}} 
                   />
                   <YAxis hide />
                   <Tooltip 
                     cursor={{fill: 'rgba(0,0,0,0.02)'}}
                     contentStyle={{borderRadius: '2rem', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', padding: '20px'}} 
                   />
                   <Bar 
                     dataKey="count" 
                     name="Approved Attendees"
                     fill="var(--primary)" 
                     radius={[15, 15, 0, 0]} 
                     barSize={50}
                   >
                     {growthData.map((entry: any, index: number) => (
                       <Cell key={`cell-${index}`} className="hover:opacity-80 transition-opacity" />
                     ))}
                   </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Milestone Achievement Card */}
        <div className="flex flex-col gap-8">
           <Card className="border-none shadow-3xl rounded-[3.5rem] overflow-hidden bg-primary text-primary-foreground relative p-10 group">
              <ArrowUpRight className="absolute -right-6 -top-6 w-48 h-48 opacity-10 group-hover:scale-125 transition-transform duration-700" />
              <div className="relative z-10 space-y-8">
                 <div className="space-y-2">
                    <h3 className="text-4xl font-black uppercase italic leading-none">Global <br />Achievement</h3>
                    <p className="text-primary-foreground/70 italic font-medium">Platform performance milestone reached.</p>
                 </div>
                 <div className="space-y-4">
                    <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                       <span>Efficiency Target</span>
                       <span>94%</span>
                    </div>
                    <div className="h-4 bg-white/20 rounded-full overflow-hidden border border-white/10 p-1">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: "94%" }}
                         transition={{ duration: 2, ease: "circOut" }}
                         className="h-full bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                       />
                    </div>
                 </div>
                 <div className="pt-4">
                    <div className="flex items-center gap-4 px-6 py-4 rounded-[1.5rem] bg-white/10 border border-white/20 backdrop-blur-md">
                       <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
                       <span className="font-black italic text-sm uppercase tracking-tighter">Velocity Spike: +12.4%</span>
                    </div>
                 </div>
              </div>
           </Card>

           <Card className="border-none shadow-3xl rounded-[3.5rem] overflow-hidden bg-card/40 backdrop-blur-xl p-10 relative group">
              <div className="flex items-center gap-6">
                 <div className="p-5 rounded-[1.5rem] bg-amber-500/10 text-amber-500 shadow-xl shadow-amber-500/5">
                    <Target className="w-8 h-8" />
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Ecosystem Health</p>
                    <p className="text-2xl font-black italic tracking-tighter">Optimal Performance</p>
                 </div>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}
