"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  Check, 
  X, 
  Ban, 
  Trash2, 
  Users, 
  Loader2,
  MoreVertical,
  MailPlus,
  Send
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ManageParticipantsProps {
  eventId: string;
  eventTitle: string;
  triggerType?: "button" | "menuitem";
}

export default function ManageParticipantsDialog({ 
  eventId, 
  eventTitle, 
  triggerType = "button" 
}: ManageParticipantsProps) {
  const [open, setOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["management-data", eventId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/events/${eventId}/management`);
      return data.data;
    },
    enabled: open,
  });

  const participants = data?.participants || [];
  const invitations = data?.invitations || [];

  const updateStatus = async (participantId: string, status: string) => {
    try {
      await axiosInstance.patch(`/participations/${participantId}/status`, { status });
      toast.success(`Participant ${status.toLowerCase()} successfully`);
      queryClient.invalidateQueries({ queryKey: ["management-data", eventId] });
      queryClient.invalidateQueries({ queryKey: ["my-events"] });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const removeParticipant = async (participantId: string) => {
    if (!confirm("Are you sure you want to remove this participant?")) return;
    try {
      await axiosInstance.delete(`/participations/${participantId}`);
      toast.success("Participant removed successfully");
      queryClient.invalidateQueries({ queryKey: ["management-data", eventId] });
      queryClient.invalidateQueries({ queryKey: ["my-events"] });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to remove participant");
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setIsInviting(true);
    try {
      await axiosInstance.post("/invitations/invite", { eventId, email: inviteEmail });
      toast.success("Invitation sent successfully");
      setInviteEmail("");
      queryClient.invalidateQueries({ queryKey: ["management-data", eventId] });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send invitation");
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerType === "menuitem" ? (
          <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setOpen(true); }}>
            Manage Participants
          </DropdownMenuItem>
        ) : (
          <Button variant="outline" size="sm" className="rounded-xl border-primary/20 text-primary hover:bg-primary/5">
            Manage Hub
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-[2rem]">
        <DialogHeader className="p-8 pb-0">
          <div className="flex justify-between items-start">
             <div>
                <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
                  <Users className="w-6 h-6 text-primary" />
                  Management Hub
                </DialogTitle>
                <DialogDescription className="mt-2">
                  Control access and invitations for <span className="text-foreground font-bold font-mono">"{eventTitle}"</span>
                </DialogDescription>
             </div>
          </div>
        </DialogHeader>

        <div className="px-8 mt-6">
           <form onSubmit={handleInvite} className="flex gap-2 p-2 bg-muted/30 rounded-2xl border border-border/50">
              <div className="relative flex-1">
                 <MailPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                 <Input 
                   placeholder="Invite someone by email..." 
                   className="bg-transparent border-none shadow-none focus-visible:ring-0 pl-10"
                   value={inviteEmail}
                   onChange={(e) => setInviteEmail(e.target.value)}
                 />
              </div>
              <Button type="submit" disabled={isInviting || !inviteEmail} className="rounded-xl px-6 gap-2">
                 {isInviting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                 Invite
              </Button>
           </form>
        </div>

        <Tabs defaultValue="participants" className="flex-1 flex flex-col mt-6 overflow-hidden">
          <div className="px-8 border-b">
             <TabsList className="bg-transparent gap-8 p-0 h-auto">
               <TabsTrigger 
                 value="participants" 
                 className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-0 py-3 font-bold"
               >
                 Confirmed Attendees ({participants.length})
               </TabsTrigger>
               <TabsTrigger 
                 value="invitations" 
                 className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-0 py-3 font-bold"
               >
                 Sent Invitations ({invitations.length})
               </TabsTrigger>
             </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto p-8 pt-6">
            <TabsContent value="participants" className="mt-0 space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : participants.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed rounded-[2rem] bg-muted/10">
                  <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground font-medium">No one has joined this event yet.</p>
                </div>
              ) : (
                participants.map((participant: any) => (
                  <div 
                    key={participant.id} 
                    className="flex items-center justify-between p-4 bg-muted/20 border border-border/30 rounded-2xl hover:border-primary/20 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12 border-2 border-background shadow-sm">
                        <AvatarImage src={participant.user.avatar} />
                        <AvatarFallback className="bg-primary/5 text-primary">{participant.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold">{participant.user.name}</p>
                        <p className="text-xs text-muted-foreground italic">{participant.user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge 
                        variant="outline" 
                        className={`
                          px-3 py-1 rounded-full border-none
                          ${participant.status === "APPROVED" ? "bg-emerald-500/10 text-emerald-600" : ""}
                          ${participant.status === "PENDING" ? "bg-amber-500/10 text-amber-600" : ""}
                          ${participant.status === "REJECTED" ? "bg-destructive/10 text-destructive" : ""}
                          ${participant.status === "BANNED" ? "bg-black text-white" : ""}
                        `}
                      >
                        {participant.status}
                      </Badge>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted/50">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 border-border/50 shadow-2xl">
                          {participant.status === "PENDING" && (
                            <>
                              <DropdownMenuItem onClick={() => updateStatus(participant.id, "APPROVED")} className="rounded-xl py-2 cursor-pointer text-emerald-600 focus:bg-emerald-50">
                                <Check className="w-4 h-4 mr-2" /> Approve Request
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateStatus(participant.id, "REJECTED")} className="rounded-xl py-2 cursor-pointer text-amber-600 focus:bg-amber-50">
                                <X className="w-4 h-4 mr-2" /> Reject Request
                              </DropdownMenuItem>
                            </>
                          )}
                          {participant.status === "APPROVED" && (
                            <DropdownMenuItem onClick={() => updateStatus(participant.id, "REJECTED")} className="rounded-xl py-2 cursor-pointer text-amber-600 focus:bg-amber-50">
                              <X className="w-4 h-4 mr-2" /> Revoke Access
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => updateStatus(participant.id, "BANNED")} className="rounded-xl py-2 cursor-pointer text-destructive font-bold focus:bg-destructive/5">
                            <Ban className="w-4 h-4 mr-2" /> Ban from Event
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => removeParticipant(participant.id)} className="rounded-xl py-2 cursor-pointer text-destructive focus:bg-destructive/5">
                            <Trash2 className="w-4 h-4 mr-2" /> Remove Permanent
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="invitations" className="mt-0 space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : invitations.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed rounded-[2rem] bg-muted/10">
                  <MailPlus className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground font-medium">No invitations sent yet.</p>
                </div>
              ) : (
                invitations.map((invitation: any) => (
                  <div 
                    key={invitation.id} 
                    className="flex items-center justify-between p-4 bg-muted/20 border border-border/30 rounded-2xl"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12 border-2 border-background shadow-sm">
                        <AvatarImage src={invitation.invitee.avatar} />
                        <AvatarFallback className="bg-primary/5 text-primary">{invitation.invitee.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold">{invitation.invitee.name}</p>
                        <p className="text-xs text-muted-foreground italic">{invitation.invitee.email}</p>
                      </div>
                    </div>

                    <Badge 
                      variant="outline" 
                      className={`
                        px-3 py-1 rounded-full border-none
                        ${invitation.status === "APPROVED" ? "bg-emerald-500/10 text-emerald-600" : ""}
                        ${invitation.status === "PENDING" ? "bg-amber-500/10 text-amber-600" : ""}
                        ${invitation.status === "REJECTED" ? "bg-destructive/10 text-destructive" : ""}
                      `}
                    >
                      {invitation.status === 'APPROVED' ? 'Accepted' : invitation.status}
                    </Badge>
                  </div>
                ))
              )}
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
