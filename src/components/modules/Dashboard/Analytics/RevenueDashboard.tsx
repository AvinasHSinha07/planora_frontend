"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { motion } from "framer-motion";
import { 
  DollarSign, 
  TrendingUp, 
  Percent, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight, 
  CreditCard,
  RotateCcw,
  Loader2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function RevenueDashboard() {
  const { data: revenue, isLoading } = useQuery({
    queryKey: ["revenue-analytics"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/admin/revenue");
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

  const stats = [
    {
      label: "Gross Platform Volume",
      value: `$${revenue?.grossVolume?.toLocaleString() || 0}`,
      sub: `${revenue?.completedTransactions} completed transactions`,
      icon: DollarSign,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      trend: "+12.4%",
      isUp: true
    },
    {
      label: "Platform Commissions",
      value: `$${revenue?.platformCommission?.toLocaleString() || 0}`,
      sub: "Net earnings (10% fee)",
      icon: TrendingUp,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      trend: "+8.1%",
      isUp: true
    },
    {
      label: "Refund Rate",
      value: `${revenue?.refundRate}%`,
      sub: `${revenue?.refundedTransactions} refunds processed`,
      icon: RotateCcw,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      trend: "-2.3%",
      isUp: false
    },
    {
      label: "Average Order Value",
      value: `$${Math.round(revenue?.grossVolume / (revenue?.completedTransactions || 1))}`,
      sub: "Per successful checkout",
      icon: Activity,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      trend: "+4.5%",
      isUp: true
    }
  ];

  return (
    <div className="space-y-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
           <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
              <CreditCard className="w-3 h-3" /> Financial Operations Center
           </div>
           <h2 className="text-6xl font-black tracking-tighter uppercase italic leading-none">
              Revenue <span className="text-primary underline decoration-primary/20 underline-offset-[12px]">Architecture</span>
           </h2>
           <p className="text-muted-foreground text-xl italic max-w-2xl">
              Real-time auditing of global transaction flows and fiscal health metrics.
           </p>
        </div>
      </div>

      {/* Financial Metrics Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
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
                <div className="space-y-6 relative z-10">
                   <div className="flex items-center justify-between">
                     <div className={`inline-flex p-4 rounded-[1.5rem] ${stat.bg} ${stat.color} shadow-lg shadow-black/5`}>
                        <stat.icon className="h-6 w-6" />
                     </div>
                     <div className={cn(
                       "flex items-center gap-1 text-[10px] font-black px-3 py-1 rounded-full",
                       stat.isUp ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                     )}>
                       {stat.isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                       {stat.trend}
                     </div>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{stat.label}</p>
                      <div className="text-5xl font-black tracking-tighter italic">
                        {stat.value}
                      </div>
                      <p className="text-[10px] font-bold text-muted-foreground/50 italic">{stat.sub}</p>
                   </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Transaction List Placeholder/Note */}
      <Card className="border-none shadow-3xl rounded-[3.5rem] overflow-hidden bg-card/40 backdrop-blur-xl p-10 border border-white/5">
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-2xl font-black uppercase italic tracking-tight">Recent <span className="text-muted-foreground">Transactions</span></h3>
           <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">View All Ledger</button>
        </div>
        <div className="space-y-4">
           {[1, 2, 3].map((i) => (
             <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors">
               <div className="flex items-center gap-4">
                 <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                   <DollarSign className="h-5 w-5" />
                 </div>
                 <div>
                   <p className="font-bold">Transaction #PLN-8492{i}</p>
                   <p className="text-[10px] font-black text-muted-foreground uppercase opacity-50">Stripe Payment • 2 mins ago</p>
                 </div>
               </div>
               <div className="text-right">
                 <p className="font-black text-emerald-500">+$129.00</p>
                 <p className="text-[10px] font-black text-muted-foreground uppercase opacity-50">Approved</p>
               </div>
             </div>
           ))}
        </div>
      </Card>
    </div>
  );
}
