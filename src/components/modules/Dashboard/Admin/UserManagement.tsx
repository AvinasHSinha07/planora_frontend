"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  MoreVertical, 
  Shield, 
  User as UserIcon, 
  Settings2, 
  Trash2, 
  Loader2,
  Filter,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { useDebounce } from "@/hooks/useDebounce";

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const limit = 10;
  
  const debouncedSearch = useDebounce(searchTerm, 500);
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["admin-users", debouncedSearch, roleFilter, page],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/users?searchTerm=${debouncedSearch}&role=${roleFilter}&page=${page}&limit=${limit}`);
      return data.data;
    },
  });

  const changeRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string, role: string }) => {
      const { data } = await axiosInstance.patch(`/users/change-role`, { userId, role });
      return data;
    },
    onSuccess: () => {
      toast.success("User role updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error: any) => {
        toast.error(error.response?.data?.message || "Failed to update role");
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      if (!confirm("Are you sure you want to permanently delete this user?")) return;
      const { data } = await axiosInstance.delete(`/users/${userId}`);
      return data;
    },
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error: any) => {
        toast.error(error.response?.data?.message || "Failed to delete user");
    }
  });

  const users = data?.users || [];
  const meta = data?.meta || { totalPages: 1, total: 0 };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search users..." 
            className="pl-9 h-11"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1); // Reset to first page on search
            }}
          />
          {isFetching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select 
            value={roleFilter} 
            onValueChange={(val) => {
              setRoleFilter(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[160px] h-11">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Roles</SelectItem>
              <SelectItem value="ADMIN">Administrators</SelectItem>
              <SelectItem value="ORGANIZER">Organizers</SelectItem>
              <SelectItem value="USER">Standard Users</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="border shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="py-4">User Identity</TableHead>
                <TableHead className="py-4">Access Level</TableHead>
                <TableHead className="py-4">Joined Date</TableHead>
                <TableHead className="text-right py-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u: any) => (
                <TableRow key={u.id} className="hover:bg-muted/10 transition-colors">
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={u.image || u.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">{u.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">{u.name}</span>
                        <span className="text-xs text-muted-foreground">{u.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge variant={u.role === "ADMIN" ? "default" : u.role === "ORGANIZER" ? "secondary" : "outline"} className="px-3">
                      {u.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 text-sm text-muted-foreground">
                    {format(new Date(u.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 p-2">
                        <DropdownMenuLabel className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider px-2 py-1.5">Change Role</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 px-3 py-2 cursor-pointer" onClick={() => changeRoleMutation.mutate({ userId: u.id, role: 'USER' })}>
                          <UserIcon className="w-4 h-4 text-muted-foreground" /> Set as Standard User
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 px-3 py-2 cursor-pointer" onClick={() => changeRoleMutation.mutate({ userId: u.id, role: 'ORGANIZER' })}>
                          <Settings2 className="w-4 h-4 text-emerald-600" /> Set as Organizer
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 px-3 py-2 cursor-pointer" onClick={() => changeRoleMutation.mutate({ userId: u.id, role: 'ADMIN' })}>
                          <Shield className="w-4 h-4 text-primary" /> Grant Admin Access
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="gap-2 px-3 py-2 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                          onClick={() => deleteUserMutation.mutate(u.id)}
                        >
                          <Trash2 className="w-4 h-4" /> Permanently Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                   <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                      No users found.
                   </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
           <p className="text-sm text-muted-foreground">
             Showing page {page} of {meta.totalPages} ({meta.total} total users)
           </p>
           <div className="flex items-center gap-2">
             <Button 
               variant="outline" 
               size="sm" 
               disabled={page <= 1}
               onClick={() => setPage(p => p - 1)}
               className="gap-1"
             >
               <ChevronLeft className="h-4 w-4" /> Previous
             </Button>
             <div className="flex items-center gap-1 mx-2">
                {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
                  <Button
                    key={p}
                    variant={page === p ? "default" : "ghost"}
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </Button>
                ))}
             </div>
             <Button 
               variant="outline" 
               size="sm" 
               disabled={page >= meta.totalPages}
               onClick={() => setPage(p => p + 1)}
               className="gap-1"
             >
               Next <ChevronRight className="h-4 w-4" />
             </Button>
           </div>
        </div>
      )}
    </div>
  );
}
