"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  Legend
} from "recharts";
import { 
  DollarSign, 
  Ticket, 
  Zap, 
  Target, 
  Loader2, 
  TrendingUp, 
  Calendar as CalendarIcon,
  Crown
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE", "#00C49F"];

export default function CustomerAnalytics() {
  const { data: payments = [], isLoading: paymentsLoading } = useQuery({
    queryKey: ["my-payments"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/payments/my-payments");
      return data.data;
    },
  });

  const { data: participations = [], isLoading: partsLoading } = useQuery({
    queryKey: ["my-participations"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/participations/my-participations");
      return data.data;
    },
  });

  if (paymentsLoading || partsLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // Data Processing: Category Breakdown
  const categoryDataMap: Record<string, number> = {};
  payments.forEach((p: any) => {
    const catName = p.event.category?.name || "Other";
    categoryDataMap[catName] = (categoryDataMap[catName] || 0) + p.amount;
  });
  const categoryData = Object.entries(categoryDataMap).map(([name, value]) => ({ name, value }));

  // Data Processing: Monthly Spending
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyDataMap: Record<string, number> = {};
  payments.forEach((p: any) => {
    const date = new Date(p.createdAt);
    const month = monthNames[date.getMonth()];
    monthlyDataMap[month] = (monthlyDataMap[month] || 0) + p.amount;
  });
  const monthlyData = monthNames.map(name => ({ name, amount: monthlyDataMap[name] || 0 })).filter(d => d.amount > 0 || monthNames.indexOf(d.name) <= new Date().getMonth());

  const totalSpent = payments.reduce((acc: number, p: any) => acc + p.amount, 0);
  const approvedParts = participations.filter((p: any) => p.status === "APPROVED").length;

  return (
    <div className="space-y-10 sm:space-y-12 pb-24 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-3 text-center sm:text-left"
      >
        <h2 className="text-4xl sm:text-5xl font-black tracking-tight uppercase italic leading-[0.9]">Personal <span className="text-primary underline decoration-primary/20 underline-offset-[8px]">Insights</span></h2>
        <p className="text-muted-foreground text-sm sm:text-lg italic">Analyzing your journey through the Planora ecosystem.</p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
         <Card className="rounded-[2rem] sm:rounded-[2.5rem] border-none bg-primary text-primary-foreground shadow-2xl relative overflow-hidden group">
            <CardContent className="p-6 sm:p-10">
               <DollarSign className="absolute -right-4 -bottom-4 w-24 h-24 sm:w-32 sm:h-32 opacity-10 group-hover:scale-125 transition-transform duration-700" />
               <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest opacity-70">Total Spending</p>
               <h3 className="text-4xl sm:text-5xl font-black mt-2 leading-none">${totalSpent.toFixed(2)}</h3>
               <p className="text-[10px] mt-4 font-bold opacity-50 italic">Across {payments.length} events</p>
            </CardContent>
         </Card>

         <Card className="rounded-[2rem] sm:rounded-[2.5rem] border-border/40 shadow-xl bg-card/50 backdrop-blur-xl relative overflow-hidden group">
            <CardContent className="p-6 sm:p-10">
               <Ticket className="absolute -right-4 -bottom-4 w-24 h-24 sm:w-32 sm:h-32 text-primary/5 group-hover:scale-125 transition-transform duration-700" />
               <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-muted-foreground">Events Attended</p>
               <h3 className="text-3xl sm:text-4xl font-black mt-2 leading-none">{approvedParts}</h3>
               <p className="text-[10px] mt-4 text-primary font-black uppercase tracking-wider italic">Rate: {participations.length > 0 ? Math.round((approvedParts / participations.length) * 100) : 0}%</p>
            </CardContent>
         </Card>

         <Card className="rounded-[2rem] sm:rounded-[2.5rem] border-border/40 shadow-xl bg-card/50 backdrop-blur-xl relative overflow-hidden group sm:col-span-2 lg:col-span-1">
            <CardContent className="p-6 sm:p-10">
               <Crown className="absolute -right-4 -bottom-4 w-24 h-24 sm:w-32 sm:h-32 text-amber-500/5 group-hover:scale-125 transition-transform duration-700" />
               <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-muted-foreground">Loyalty Status</p>
               <h3 className="text-2xl sm:text-3xl font-black mt-2 text-amber-500 leading-none">Elite Member</h3>
               <p className="text-[10px] mt-4 text-muted-foreground font-medium italic">Top 15% of platform</p>
            </CardContent>
         </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
         {/* Category Chart */}
         <Card className="rounded-[2.5rem] sm:rounded-[3rem] border-border/40 shadow-2xl bg-card overflow-hidden group">
            <CardHeader className="p-6 sm:p-8 border-b bg-muted/20">
               <CardTitle className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-3">
                  <Target className="w-5 h-5 text-primary" />
                  Category Breakdown
               </CardTitle>
               <CardDescription className="text-[10px] sm:text-xs">Where your investment goes</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-8 h-[300px] sm:h-[400px]">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                     <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius="60%"
                        outerRadius="80%"
                        paddingAngle={8}
                        dataKey="value"
                     >
                        {categoryData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="stroke-background" />
                        ))}
                     </Pie>
                     <Tooltip 
                        contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '15px 25px', fontWeight: 'bold' }}
                     />
                     <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                  </PieChart>
               </ResponsiveContainer>
            </CardContent>
         </Card>

         {/* Spending Over Time */}
         <Card className="rounded-[2.5rem] sm:rounded-[3rem] border-border/40 shadow-2xl bg-card overflow-hidden group">
            <CardHeader className="p-6 sm:p-8 border-b bg-muted/20">
               <CardTitle className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                  Expenditure Velocity
               </CardTitle>
               <CardDescription className="text-[10px] sm:text-xs">Visualizing your event budget</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-8 h-[300px] sm:h-[400px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                     <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fontWeight: 900, fill: '#666'}} 
                     />
                     <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fontWeight: 900, fill: '#666'}} 
                        tickFormatter={(val) => `$${val}`}
                        hide={window.innerWidth < 640}
                     />
                     <Tooltip 
                        cursor={{fill: 'rgba(0,0,0,0.02)'}}
                        contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '15px 25px', fontWeight: 'bold' }}
                     />
                     <Bar 
                        dataKey="amount" 
                        fill="var(--primary)" 
                        radius={[8, 8, 0, 0]} 
                        barSize={window.innerWidth < 640 ? 20 : 32}
                     >
                        {monthlyData.map((entry, index) => (
                           <Cell key={`cell-${index}`} className="hover:opacity-80 transition-opacity" />
                        ))}
                     </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </CardContent>
         </Card>
      </div>

      {/* Discovery Section */}
      <Card className="rounded-[2.5rem] sm:rounded-[4rem] border-border/40 shadow-3xl bg-muted/10 overflow-hidden relative group">
         <div className="absolute top-0 right-0 p-8 sm:p-12 opacity-5 pointer-events-none">
            <Zap className="w-32 h-32 sm:w-48 sm:h-48" />
         </div>
         <CardContent className="p-8 sm:p-16 flex flex-col xl:flex-row items-center gap-10 sm:gap-16">
            <div className="flex-1 space-y-6 text-center xl:text-left">
               <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest mx-auto xl:mx-0">
                  <Zap className="w-4 h-4" />
                  Next Goal
               </div>
               <h3 className="text-3xl sm:text-5xl font-black tracking-tighter leading-[0.9] uppercase italic">Ready for <br />your next <span className="text-primary underline decoration-4 underline-offset-8">Adventure?</span></h3>
               <p className="text-muted-foreground text-base sm:text-xl max-w-lg italic mx-auto xl:mx-0">
                  Based on your interest in <strong>{categoryData[0]?.name || "Tech"}</strong>, we've found 3 exclusive events starting this week.
               </p>
               <Button asChild size="lg" className="rounded-full h-14 sm:h-16 px-8 sm:px-12 text-base sm:text-lg font-black uppercase tracking-tight shadow-xl shadow-primary/20 hover:scale-105 transition-all w-full sm:w-auto">
                  <Link href="/events">Explore New Horizons</Link>
               </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 w-full sm:w-auto shrink-0">
               <div className="space-y-4">
                  <div className="h-32 w-32 sm:h-40 sm:w-40 rounded-[2rem] sm:rounded-[3rem] bg-card border shadow-lg flex flex-col items-center justify-center p-4 sm:p-6 text-center">
                     <p className="text-2xl sm:text-3xl font-black text-primary">12</p>
                     <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Days since <br/> last event</p>
                  </div>
                  <div className="h-28 w-32 sm:h-32 sm:w-40 rounded-[2rem] sm:rounded-[3rem] bg-emerald-500 text-white shadow-lg flex flex-col items-center justify-center p-4 sm:p-6 text-center">
                     <p className="text-xl sm:text-2xl font-black italic">Free</p>
                     <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest opacity-80 mt-1 leading-tight">Access to <br/> Elite Mixer</p>
                  </div>
               </div>
               <div className="space-y-4 pt-10 sm:pt-12">
                  <div className="h-32 w-32 sm:h-40 sm:w-40 rounded-[2rem] sm:rounded-[3rem] bg-purple-500 text-white shadow-lg flex flex-col items-center justify-center p-4 sm:p-6 text-center">
                     <Crown className="w-6 h-6 sm:w-8 sm:h-8 mb-2" />
                     <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest opacity-80 leading-tight">VIP Pass <br/> unlocked</p>
                  </div>
               </div>
            </div>
         </CardContent>
      </Card>
    </div>
   
  );
}


