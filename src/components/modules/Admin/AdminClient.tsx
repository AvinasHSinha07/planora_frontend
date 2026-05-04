"use client";

import { useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Calendar as CalendarIcon, AlertTriangle, ShieldCheck, Trash2, Ban, Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

export default function AdminClient() {
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("users");

  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/admin/stats");
      return data.data;
    },
  });

  const { data: users } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/admin/users");
      return data.data;
    },
    enabled: activeTab === "users",
  });

  const { data: events } = useQuery({
    queryKey: ["admin-events"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/admin/events");
      return data.data;
    },
    enabled: activeTab === "events",
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      await axiosInstance.delete(`/admin/users/${userId}`);
    },
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete user");
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: async (eventId: string) => {
      await axiosInstance.delete(`/admin/events/${eventId}`);
    },
    onSuccess: () => {
      toast.success("Event deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete event");
    },
  });

  const toggleFeatureMutation = useMutation({
    mutationFn: async ({ eventId, isFeatured }: { eventId: string; isFeatured: boolean }) => {
      await axiosInstance.patch(`/admin/events/${eventId}/feature`, { isFeatured });
    },
    onSuccess: () => {
      toast.success("Feature status updated");
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update feature status");
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Console</h2>
          <p className="text-muted-foreground">Manage users, moderate events, and view system health.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.users || "..."}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Events</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.events || "..."}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">${stats?.revenue?.toLocaleString() || "0"}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">Online</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="events">Event Moderation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map((user: any) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>{user.role}</Badge>
                      </TableCell>
                      <TableCell>{format(new Date(user.createdAt), "MMM d, yyyy")}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:bg-destructive/10"
                          title="Delete User"
                          disabled={deleteUserMutation.isPending}
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this user? This cannot be undone.")) {
                              deleteUserMutation.mutate(user.id);
                            }
                          }}
                        >
                          {deleteUserMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!users?.length && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                        No users found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Title</TableHead>
                    <TableHead>Organizer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events?.map((event: any) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium line-clamp-1">{event.title}</TableCell>
                      <TableCell>{event.organizer?.name || "Unknown"}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{event.eventType.replace('_', ' ')}</Badge>
                      </TableCell>
                      <TableCell>{format(new Date(event.date), "MMM d, yyyy")}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className={event.isFeatured ? "text-amber-500" : "text-muted-foreground"}
                            title={event.isFeatured ? "Unfeature Event" : "Feature Event"}
                            disabled={toggleFeatureMutation.isPending}
                            onClick={() => toggleFeatureMutation.mutate({ eventId: event.id, isFeatured: !event.isFeatured })}
                          >
                            {toggleFeatureMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Star className={cn("h-4 w-4", event.isFeatured && "fill-current")} />}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive hover:bg-destructive/10"
                            title="Delete Event"
                            disabled={deleteEventMutation.isPending}
                            onClick={() => {
                              if (confirm("Delete this event?")) {
                                deleteEventMutation.mutate(event.id);
                              }
                            }}
                          >
                            {deleteEventMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!events?.length && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                        No events found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
