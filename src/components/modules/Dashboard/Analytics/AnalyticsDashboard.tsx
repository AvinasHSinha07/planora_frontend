"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, DollarSign, Loader2, Calendar, Target, Zap, Badge } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  Cell
} from "recharts";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function AnalyticsDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/users/dashboard-stats");
      return data.data;
    },
  });

  const avgAttendance = stats?.totalEvents > 0 
    ? Math.round((stats.totalAttendees / (stats.totalEvents * 100)) * 100) // Mock logic for %
    : 0;

  const displayStats = [
    { 
      title: "Total Revenue", 
      value: `$${stats?.totalRevenue?.toLocaleString() || 0}`, 
      icon: DollarSign, 
      trend: "+12.5%",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    { 
      title: "Ticket Sales", 
      value: stats?.ticketSales || 0, 
      icon: TicketIcon, 
      trend: "+8.2%",
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    { 
      title: "Active Events", 
      value: stats?.totalEvents || 0, 
      icon: Calendar, 
      trend: "+5.1%",
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    },
    { 
      title: "Avg. Engagement", 
      value: `${avgAttendance || 78}%`, 
      icon: Zap, 
      trend: "+2.4%",
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    },
  ];

  // Mock chart data based on real stats
  const chartData = [
    { name: "Jan", sales: (stats?.totalRevenue || 0) * 0.1 },
    { name: "Feb", sales: (stats?.totalRevenue || 0) * 0.15 },
    { name: "Mar", sales: (stats?.totalRevenue || 0) * 0.25 },
    { name: "Apr", sales: (stats?.totalRevenue || 0) * 0.2 },
    { name: "May", sales: (stats?.totalRevenue || 0) * 0.3 },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-4xl font-black tracking-tight">Performance <span className="text-primary">Analytics</span></h2>
          <p className="text-muted-foreground mt-1 text-lg">Real-time insights into your event ecosystem.</p>
        </div>
        <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-2xl border border-border/50">
           <Calendar className="w-4 h-4 text-muted-foreground" />
           <span className="text-sm font-bold">Last 30 Days</span>
        </div>
      </motion.div>

      {/* Quick Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {displayStats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-none shadow-lg shadow-black/5 rounded-[2rem] overflow-hidden bg-card/50 backdrop-blur-sm group hover:bg-card transition-all duration-500">
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-4">
                   <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} transition-colors duration-500`}>
                      <stat.icon className="h-6 w-6" />
                   </div>
                   <Badge  className="bg-emerald-500/10 text-emerald-600 border-none">
                      {stat.trend}
                   </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{stat.title}</p>
                  <div className="text-3xl font-black tracking-tighter">
                    {stat.value}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Main Growth Chart */}
        <Card className="md:col-span-2 border-none shadow-xl shadow-black/5 rounded-[2.5rem] overflow-hidden bg-card/50 backdrop-blur-sm">
          <CardHeader className="p-8 pb-0">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Revenue Growth
            </CardTitle>
            <CardDescription>Monthly performance breakdown</CardDescription>
          </CardHeader>
          <CardContent className="p-8 h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600}} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}} 
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="var(--primary)" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Secondary Info Card */}
        <Card className="border-none shadow-xl shadow-black/5 rounded-[2.5rem] overflow-hidden bg-primary text-primary-foreground relative">
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <Target className="w-32 h-32" />
           </div>
           <CardHeader className="p-8">
              <CardTitle className="text-2xl font-black leading-tight">Achievement <br />Unlocked</CardTitle>
              <CardDescription className="text-primary-foreground/70">You've reached the Top 5% of organizers this month!</CardDescription>
           </CardHeader>
           <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                 <div className="flex justify-between text-sm font-bold">
                    <span>Platform Rank</span>
                    <span>94/100</span>
                 </div>
                 <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "94%" }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-white"
                    />
                 </div>
              </div>
              <Button variant="secondary" className="w-full rounded-2xl h-12 font-bold group">
                 View Milestone Report
              </Button>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}

function TicketIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2" />
      <path d="M13 17v2" />
      <path d="M13 11v2" />
    </svg>
  )
}
