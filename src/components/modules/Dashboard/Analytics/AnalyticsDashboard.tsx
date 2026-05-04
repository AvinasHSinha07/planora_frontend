"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, DollarSign, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";

export default function AnalyticsDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/users/dashboard-stats");
      return data.data;
    },
  });

  const displayStats = [
    { title: "Total Revenue", value: `$${stats?.totalRevenue || 0}`, icon: DollarSign, trend: "+12.5%" },
    { title: "Ticket Sales", value: stats?.ticketSales || 0, icon: BarChart3, trend: "+8.2%" },
    { title: "Active Events", value: stats?.totalEvents || 0, icon: TrendingUp, trend: "+5.1%" },
    { title: "Avg. Attendance", value: "85%", icon: Users, trend: "+2.4%" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground">Deep dive into your event performance data.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {displayStats.map((stat, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stat.value}
              </div>
              <p className="text-xs text-emerald-500 font-medium mt-1">{stat.trend} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="p-8 h-[400px] flex items-center justify-center border-dashed">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
          <p className="text-muted-foreground">Detailed analytics charts will appear here as you host more events.</p>
        </div>
      </Card>
    </div>
  );
}
