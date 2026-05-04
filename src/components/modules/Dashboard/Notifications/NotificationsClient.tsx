"use client";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, BellOff, Check, Loader2, Calendar, Mail, DollarSign, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

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
    onError: () => {
      toast.error("Failed to mark as read");
    },
  });

  const handleMarkAsRead = (id: string) => {
    markAsReadMutation.mutate(id);
  };

  const getIcon = (title: string) => {
     const t = title.toLowerCase();
     if (t.includes("invitation")) return <Mail className="w-5 h-5 text-blue-500" />;
     if (t.includes("payment")) return <DollarSign className="w-5 h-5 text-emerald-500" />;
     if (t.includes("participation") || t.includes("request")) return <UserCheck className="w-5 h-5 text-amber-500" />;
     return <Bell className="w-5 h-5 text-primary" />;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center rounded-3xl border border-dashed p-8 text-center bg-muted/20">
        <BellOff className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <h3 className="text-xl font-bold">All caught up!</h3>
        <p className="text-muted-foreground mt-2 max-w-sm">
          You don't have any notifications at the moment. We'll let you know when something important happens.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-3xl">
      {notifications.map((notification: any) => (
        <Card 
          key={notification.id} 
          className={`
            rounded-2xl border-border/50 transition-all duration-300
            ${notification.isRead ? "bg-muted/10 opacity-70" : "bg-card shadow-md border-l-4 border-l-primary"}
          `}
        >
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className={`p-3 rounded-xl ${notification.isRead ? "bg-muted" : "bg-primary/10"}`}>
                 {getIcon(notification.title)}
              </div>
              <div className="flex-1 space-y-1">
                 <div className="flex justify-between items-start">
                    <h4 className="font-bold text-lg">{notification.title}</h4>
                    <span className="text-xs text-muted-foreground font-mono">
                       {format(new Date(notification.createdAt), "MMM d, h:mm a")}
                    </span>
                 </div>
                 <p className="text-muted-foreground text-sm leading-relaxed">
                    {notification.message}
                 </p>
                 {!notification.isRead && (
                   <div className="pt-3">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-3 rounded-lg text-xs gap-2 hover:bg-primary/5 hover:text-primary"
                        onClick={() => handleMarkAsRead(notification.id)}
                        disabled={markAsReadMutation.isPending}
                      >
                         {markAsReadMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />} Mark as read
                      </Button>
                   </div>
                 )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
