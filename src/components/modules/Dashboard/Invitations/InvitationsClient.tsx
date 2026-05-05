"use client";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, MapPin, Check, X, Mail, Loader2, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function InvitationsClient() {
  const queryClient = useQueryClient();

  const { data: invitations = [], isLoading } = useQuery({
    queryKey: ["my-invitations"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/invitations/my-invitations");
      return data.data;
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ invitation, status }: { invitation: any; status: string }) => {
      // If event is paid and we are approving, we might need to trigger payment
      if (status === "APPROVED" && invitation.event.fee > 0) {
         toast.info("This is a paid event. Redirecting to payment...");
         const { data } = await axiosInstance.post("/payments/create-session", { eventId: invitation.event.id });
         return { url: data.data?.url };
      }

      const { data } = await axiosInstance.patch(`/invitations/${invitation.id}/status`, { status });
      return { status, data };
    },
    onSuccess: (result: any) => {
      if (result.url) {
        window.location.href = result.url;
        return;
      }
      toast.success(`Invitation ${result.status === "APPROVED" ? "accepted" : "declined"}`);
      queryClient.invalidateQueries({ queryKey: ["my-invitations"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update invitation");
    },
  });

  const handleStatusUpdate = (invitation: any, status: string) => {
    statusMutation.mutate({ invitation, status });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (invitations.length === 0) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed p-8 text-center bg-muted/20">
        <Mail className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <h3 className="text-xl font-bold">No Invitations</h3>
        <p className="text-muted-foreground mt-2 max-w-sm">
          You don't have any pending event invitations at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {invitations.map((invitation: any) => (
        <Card key={invitation.id} className="overflow-hidden rounded-3xl border-border/50 hover:shadow-xl transition-all duration-500 flex flex-col">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start mb-4">
               <Badge variant="secondary" className="bg-primary/5 text-primary border-none">
                  {invitation.event.category?.name}
               </Badge>
               <Badge 
                  variant="outline" 
                  className={`
                    ${invitation.status === "APPROVED" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : ""}
                    ${invitation.status === "PENDING" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" : ""}
                    ${invitation.status === "REJECTED" ? "bg-destructive/10 text-destructive border-destructive/20" : ""}
                  `}
                >
                  {invitation.status}
                </Badge>
            </div>
            <CardTitle className="text-xl line-clamp-1">{invitation.event.title}</CardTitle>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
               <Avatar className="w-5 h-5">
                  <AvatarImage src={invitation.inviter.avatar} />
                  <AvatarFallback>{invitation.inviter.name.charAt(0)}</AvatarFallback>
               </Avatar>
               <span>Invited by <span className="font-bold text-foreground">{invitation.inviter.name}</span></span>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4 flex-1">
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                {format(new Date(invitation.event.date), "MMM d, yyyy • h:mm a")}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                {invitation.event.venue || "Online"}
              </div>
              {invitation.event.fee > 0 && (
                <div className="flex items-center gap-2 text-emerald-600 font-bold">
                  <DollarSign className="w-4 h-4" />
                  Entry Fee: ${invitation.event.fee}
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="p-4 sm:p-6 pt-0 flex flex-col sm:flex-row gap-3">
            {invitation.status === "PENDING" ? (
              <>
                <Button 
                   className="w-full sm:flex-1 rounded-xl sm:rounded-2xl gap-2 h-11 sm:h-12" 
                   onClick={() => handleStatusUpdate(invitation, "APPROVED")}
                   disabled={statusMutation.isPending}
                >
                  {statusMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} 
                  {invitation.event.fee > 0 ? "Pay & Accept" : "Accept"}
                </Button>
                <Button 
                   variant="outline" 
                   className="w-full sm:flex-1 rounded-xl sm:rounded-2xl gap-2 border-destructive/20 text-destructive hover:bg-destructive/5 h-11 sm:h-12"
                   onClick={() => handleStatusUpdate(invitation, "REJECTED")}
                   disabled={statusMutation.isPending}
                >
                  <X className="w-4 h-4" /> Decline
                </Button>
              </>
            ) : (
              <Button variant="ghost" className="w-full rounded-xl sm:rounded-2xl h-11 sm:h-12" disabled>
                Invitation {invitation.status.toLowerCase()}
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
