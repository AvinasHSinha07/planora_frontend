"use client";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, BellOff, Check, Loader2, Mail, DollarSign, UserCheck, Trash2, CheckCheck } from "lucide-react";
import { toast } from "sonner";
import { format, isToday, isYesterday, startOfDay } from "date-fns";

export default function NotificationsClient() {
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["my-notifications"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/notifications");
      return data.data;
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.patch(`/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-notifications"] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      await axiosInstance.patch("/notifications/read-all");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-notifications"] });
      toast.success("All notifications marked as read");
    },
  });

  const getIcon = (title: string) => {
     const t = title.toLowerCase();
     if (t.includes("invitation")) return <Mail className="w-5 h-5" />;
     if (t.includes("payment")) return <DollarSign className="w-5 h-5" />;
     if (t.includes("participation") || t.includes("request")) return <UserCheck className="w-5 h-5" />;
     return <Bell className="w-5 h-5" />;
  };

  const groupNotifications = () => {
    const groups: Record<string, any[]> = {
      Today: [],
      Yesterday: [],
      Older: []
    };

    notifications.forEach((n: any) => {
      const date = new Date(n.createdAt);
      if (isToday(date)) groups.Today.push(n);
      else if (isYesterday(date)) groups.Yesterday.push(n);
      else groups.Older.push(n);
    });

    return groups;
  };

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-4xl">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-muted animate-pulse rounded-3xl" />
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex h-[500px] flex-col items-center justify-center rounded-[3rem] border border-dashed p-12 text-center bg-muted/20">
        <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-6">
           <BellOff className="h-10 w-10 text-muted-foreground/30" />
        </div>
        <h3 className="text-2xl font-black uppercase tracking-tight">Pure Silence</h3>
        <p className="text-muted-foreground mt-4 max-w-sm text-lg italic">
          You're all caught up. We'll let you know when the next big thing happens.
        </p>
      </div>
    );
  }

  const groups = groupNotifications();
  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  return (
    <div className="max-w-4xl space-y-10 pb-24">
      {/* Header Actions */}
      <div className="flex items-center justify-between bg-card/50 backdrop-blur-xl border p-6 rounded-[2.5rem] shadow-sm">
         <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
               <Bell className="w-6 h-6" />
            </div>
            <div>
               <h2 className="text-xl font-bold">Activity Center</h2>
               <p className="text-sm text-muted-foreground font-medium">You have {unreadCount} unread updates</p>
            </div>
         </div>
         {unreadCount > 0 && (
           <Button 
             variant="outline" 
             className="rounded-2xl gap-2 font-bold h-12 px-6 border-primary/20 text-primary hover:bg-primary/5"
             onClick={() => markAllAsReadMutation.mutate()}
             disabled={markAllAsReadMutation.isPending}
           >
              {markAllAsReadMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCheck className="w-4 h-4" />}
              Mark all as read
           </Button>
         )}
      </div>

      {/* Notification Groups */}
      {Object.entries(groups).map(([label, items]) => items.length > 0 && (
        <div key={label} className="space-y-4">
           <div className="flex items-center gap-4 px-4">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
              <div className="h-[1px] flex-1 bg-border/50" />
           </div>
           
           <div className="space-y-3">
              {items.map((n: any) => (
                <Card 
                  key={n.id} 
                  className={`
                    rounded-[2rem] border-border/40 transition-all duration-500 group relative overflow-hidden
                    ${n.isRead ? "bg-muted/10 opacity-75 grayscale-[0.5]" : "bg-card shadow-lg hover:shadow-2xl border-l-8 border-l-primary"}
                  `}
                >
                  <CardContent className="p-6">
                    <div className="flex gap-6 items-center">
                       <div className={`
                         h-14 w-14 shrink-0 rounded-2xl flex items-center justify-center transition-all duration-500
                         ${n.isRead ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary group-hover:scale-110 group-hover:rotate-6"}
                       `}>
                          {getIcon(n.title)}
                       </div>
                       
                       <div className="flex-1 space-y-1">
                          <div className="flex justify-between items-start">
                             <h4 className={`font-black text-lg tracking-tight ${n.isRead ? "text-muted-foreground" : "text-foreground"}`}>
                                {n.title}
                             </h4>
                             <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                                {format(new Date(n.createdAt), "h:mm a")}
                             </span>
                          </div>
                          <p className="text-muted-foreground leading-relaxed">
                             {n.message}
                          </p>
                       </div>

                       {!n.isRead && (
                         <Button 
                           variant="ghost" 
                           size="icon" 
                           className="h-10 w-10 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-primary/10 hover:text-primary"
                           onClick={() => markAsReadMutation.mutate(n.id)}
                           disabled={markAsReadMutation.isPending}
                         >
                            <Check className="w-5 h-5" />
                         </Button>
                       )}
                    </div>
                  </CardContent>
                </Card>
              ))}
           </div>
        </div>
      ))}
    </div>
  );
}
