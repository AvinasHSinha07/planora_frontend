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
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card/50 p-4 sm:p-6 rounded-3xl border border-border/40 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search users..." 
            className="pl-11 h-12 rounded-2xl bg-background/50 border-none focus-visible:ring-primary/20"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
          {isFetching && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="bg-background/50 p-3 rounded-2xl flex items-center gap-2 border border-border/10 flex-1 sm:flex-initial">
             <Filter className="w-4 h-4 text-primary" />
             <Select 
               value={roleFilter} 
               onValueChange={(val) => {
                 setRoleFilter(val);
                 setPage(1);
               }}
             >
               <SelectTrigger className="border-none bg-transparent h-6 focus:ring-0 w-full sm:w-[140px] text-xs font-black uppercase tracking-widest p-0 shadow-none">
                 <SelectValue placeholder="All Roles" />
               </SelectTrigger>
               <SelectContent className="rounded-2xl border-none shadow-3xl">
                 <SelectItem value="ALL">All Roles</SelectItem>
                 <SelectItem value="ADMIN">Administrators</SelectItem>
                 <SelectItem value="ORGANIZER">Organizers</SelectItem>
                 <SelectItem value="USER">Standard Users</SelectItem>
               </SelectContent>
             </Select>
          </div>
        </div>
      </div>

      <div className="rounded-[2.5rem] border border-border/40 bg-card overflow-hidden shadow-2xl hidden md:block">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground">User Identity</TableHead>
                <TableHead className="py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Access Level</TableHead>
                <TableHead className="py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Joined Date</TableHead>
                <TableHead className="text-right py-6 px-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u: any) => (
                <TableRow key={u.id} className="group transition-colors duration-500 hover:bg-muted/30">
                  <TableCell className="py-6 px-8">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-11 w-11 border-2 border-background shadow-xl">
                        <AvatarImage src={u.image || u.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary font-black">{u.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <span className="font-black text-sm italic uppercase tracking-tight group-hover:text-primary transition-colors">{u.name}</span>
                        <span className="text-[10px] text-muted-foreground font-bold truncate">{u.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-6">
                    <Badge 
                      variant={u.role === "ADMIN" ? "default" : u.role === "ORGANIZER" ? "secondary" : "outline"} 
                      className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest italic"
                    >
                      {u.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-6">
                     <span className="text-xs font-bold text-muted-foreground italic">
                        {format(new Date(u.createdAt), "MMM d, yyyy")}
                     </span>
                  </TableCell>
                  <TableCell className="text-right py-6 px-8">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-none shadow-3xl bg-card">
                        <DropdownMenuLabel className="text-[10px] uppercase text-muted-foreground/60 font-black tracking-widest px-3 py-2">Authorization Overrides</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-border/50 mx-2" />
                        <DropdownMenuItem className="gap-3 rounded-xl px-3 py-2.5 cursor-pointer font-bold focus:bg-primary/10 focus:text-primary" onClick={() => changeRoleMutation.mutate({ userId: u.id, role: 'USER' })}>
                          <UserIcon className="w-4 h-4 text-muted-foreground" /> Set as Standard User
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-3 rounded-xl px-3 py-2.5 cursor-pointer font-bold focus:bg-emerald-50 focus:text-emerald-600" onClick={() => changeRoleMutation.mutate({ userId: u.id, role: 'ORGANIZER' })}>
                          <Settings2 className="w-4 h-4 text-emerald-600" /> Set as Organizer
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-3 rounded-xl px-3 py-2.5 cursor-pointer font-black focus:bg-primary/10 focus:text-primary" onClick={() => changeRoleMutation.mutate({ userId: u.id, role: 'ADMIN' })}>
                          <Shield className="w-4 h-4 text-primary" /> Grant Admin Access
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border/50 mx-2" />
                        <DropdownMenuItem 
                          className="gap-3 rounded-xl px-3 py-2.5 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive font-bold"
                          onClick={() => deleteUserMutation.mutate(u.id)}
                        >
                          <Trash2 className="w-4 h-4" /> Permanently Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </div>

      {/* Mobile - User Cards */}
      <div className="md:hidden space-y-4">
         {users.map((u: any) => (
            <Card key={u.id} className="rounded-[1.5rem] border border-border/40 bg-card/50 backdrop-blur-xl overflow-hidden shadow-lg group">
               <CardContent className="p-5 space-y-5">
                  <div className="flex justify-between items-start">
                     <div className="flex items-center gap-4 min-w-0">
                        <Avatar className="h-12 w-12 border-2 border-background shadow-lg">
                           <AvatarImage src={u.image || u.avatar} />
                           <AvatarFallback className="bg-primary/10 text-primary font-black">{u.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                           <span className="font-black text-base italic uppercase tracking-tight group-hover:text-primary transition-colors truncate">{u.name}</span>
                           <span className="text-[10px] text-muted-foreground font-bold truncate">{u.email}</span>
                        </div>
                     </div>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-primary/10 transition-colors">
                              <MoreVertical className="w-4 h-4" />
                           </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-none shadow-3xl bg-card">
                           <DropdownMenuLabel className="text-[10px] uppercase text-muted-foreground/60 font-black tracking-widest px-3 py-2">Authorization</DropdownMenuLabel>
                           <DropdownMenuItem className="rounded-xl font-bold" onClick={() => changeRoleMutation.mutate({ userId: u.id, role: 'USER' })}>Set as Standard</DropdownMenuItem>
                           <DropdownMenuItem className="rounded-xl font-bold" onClick={() => changeRoleMutation.mutate({ userId: u.id, role: 'ORGANIZER' })}>Set as Organizer</DropdownMenuItem>
                           <DropdownMenuItem className="rounded-xl font-black" onClick={() => changeRoleMutation.mutate({ userId: u.id, role: 'ADMIN' })}>Grant Admin</DropdownMenuItem>
                           <DropdownMenuSeparator />
                           <DropdownMenuItem className="rounded-xl font-bold text-destructive" onClick={() => deleteUserMutation.mutate(u.id)}>Delete Account</DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-border/10">
                     <Badge 
                        variant={u.role === "ADMIN" ? "default" : u.role === "ORGANIZER" ? "secondary" : "outline"} 
                        className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest italic"
                     >
                        {u.role}
                     </Badge>
                     <span className="text-[10px] font-bold text-muted-foreground italic">
                        Joined {format(new Date(u.createdAt), "MMM d, yyyy")}
                     </span>
                  </div>
               </CardContent>
            </Card>
         ))}
      </div>

      {/* Pagination Controls */}
      {meta.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4 py-8 bg-card/30 rounded-[2rem] border border-border/10 shadow-inner">
           <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
             Trace: Page <span className="text-primary">{page}</span> of {meta.totalPages} • <span className="text-foreground">{meta.total}</span> Registered Identities
           </p>
           <div className="flex flex-wrap items-center justify-center gap-2">
             <Button 
               variant="outline" 
               size="sm" 
               disabled={page <= 1}
               onClick={() => setPage(p => p - 1)}
               className="rounded-xl h-10 px-4 border-border/40 hover:bg-primary/10 hover:text-primary transition-all font-bold uppercase text-[10px] tracking-widest"
             >
               <ChevronLeft className="h-4 w-4 mr-1" /> Prev
             </Button>
             
             <div className="flex items-center gap-1.5 overflow-x-auto max-w-[200px] sm:max-w-none scrollbar-hide py-1">
                {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
                  <Button
                    key={p}
                    variant={page === p ? "default" : "ghost"}
                    size="sm"
                    className={`h-10 w-10 rounded-xl font-black text-[10px] transition-all ${page === p ? "shadow-lg shadow-primary/20 scale-110" : "hover:bg-primary/5 text-muted-foreground"}`}
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
               className="rounded-xl h-10 px-4 border-border/40 hover:bg-primary/10 hover:text-primary transition-all font-bold uppercase text-[10px] tracking-widest"
             >
               Next <ChevronRight className="h-4 w-4 ml-1" />
             </Button>
           </div>
        </div>
      )}
    </div>
  );
}
