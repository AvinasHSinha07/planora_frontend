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
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Star, 
  Trash2, 
  Calendar, 
  Loader2, 
  Eye,
  Filter,
  Crown,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { useDebounce } from "@/hooks/useDebounce";

export default function EventManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [feeFilter, setFeeFilter] = useState("ALL");
  const [featuredFilter, setFeaturedFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const limit = 10;
  
  const debouncedSearch = useDebounce(searchTerm, 500);
  const queryClient = useQueryClient();

  const isUnoptimized = (url: string) => url?.includes("ellaslist.com.au");

  const { data, isLoading, isFetching } = useQuery({

    queryKey: ["admin-events", debouncedSearch, feeFilter, featuredFilter, page],
    queryFn: async () => {
      // isFeatured=true if FEATURED, false if STANDARD, omitted if ALL
      let featuredParam = "";
      if (featuredFilter === "FEATURED") featuredParam = "&isFeatured=true";
      if (featuredFilter === "STANDARD") featuredParam = "&isFeatured=false";
      
      const { data } = await axiosInstance.get(`/events?searchTerm=${debouncedSearch}&type=${feeFilter}&page=${page}&limit=${limit}${featuredParam}`);
      return data.data;
    },
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const { data } = await axiosInstance.patch(`/events/${eventId}/toggle-featured`);
      return data;
    },
    onSuccess: () => {
      toast.success("Featured status updated");
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: async (eventId: string) => {
        if (!confirm("Are you sure you want to delete this event? This action cannot be undone.")) return;
        const { data } = await axiosInstance.delete(`/events/${eventId}`);
        return data;
    },
    onSuccess: () => {
        toast.success("Event deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["admin-events"] });
    },
  });

  const events = data?.events || [];
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
      <div className="flex flex-col xl:flex-row gap-4 items-center justify-between bg-card/50 p-4 sm:p-6 rounded-3xl border border-border/40 shadow-sm">
        <div className="relative w-full xl:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search events..." 
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

        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <div className="bg-background/50 p-3 rounded-2xl flex items-center gap-2 border border-border/10 flex-1 sm:flex-initial">
            <Filter className="w-4 h-4 text-primary" />
            <Select 
              value={feeFilter} 
              onValueChange={(val) => {
                setFeeFilter(val);
                setPage(1);
              }}
            >
              <SelectTrigger className="border-none bg-transparent h-6 focus:ring-0 w-full sm:w-[100px] text-[10px] font-black uppercase tracking-widest p-0 shadow-none">
                <SelectValue placeholder="Pricing" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-none shadow-3xl">
                <SelectItem value="ALL">All Pricing</SelectItem>
                <SelectItem value="FREE">Free Only</SelectItem>
                <SelectItem value="PAID">Paid Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-background/50 p-3 rounded-2xl flex items-center gap-2 border border-border/10 flex-1 sm:flex-initial">
             <Star className="w-4 h-4 text-amber-500" />
             <Select 
               value={featuredFilter} 
               onValueChange={(val) => {
                 setFeaturedFilter(val);
                 setPage(1);
               }}
             >
               <SelectTrigger className="border-none bg-transparent h-6 focus:ring-0 w-full sm:w-[100px] text-[10px] font-black uppercase tracking-widest p-0 shadow-none">
                 <SelectValue placeholder="Status" />
               </SelectTrigger>
               <SelectContent className="rounded-2xl border-none shadow-3xl">
                 <SelectItem value="ALL">All Status</SelectItem>
                 <SelectItem value="FEATURED">Featured</SelectItem>
                 <SelectItem value="STANDARD">Standard</SelectItem>
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
                <TableHead className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Event Details</TableHead>
                <TableHead className="py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Organizer</TableHead>
                <TableHead className="py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Economics</TableHead>
                <TableHead className="text-center py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Featured</TableHead>
                <TableHead className="text-right py-6 px-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event: any) => (
                <TableRow key={event.id} className="group transition-colors duration-500 hover:bg-muted/30">
                  <TableCell className="py-6 px-8">
                    <div className="flex items-center gap-4">
                      <div className="relative h-14 w-24 rounded-xl overflow-hidden bg-muted flex-shrink-0 border border-border/40 shadow-lg">
                        <Image 
                          src={event.bannerImage || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=200"} 
                          alt={event.title}
                          fill
                          unoptimized={isUnoptimized(event.bannerImage)}
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                      <div className="flex flex-col min-w-0 max-w-[250px]">
                        <span className="font-black text-sm italic uppercase tracking-tight group-hover:text-primary transition-colors truncate">{event.title}</span>
                        <span className="text-[10px] text-muted-foreground font-black flex items-center gap-1 mt-1 uppercase tracking-widest">
                          <Calendar className="w-3 h-3 text-primary" />
                          {format(new Date(event.date), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-6">
                    <span className="text-sm font-black italic text-foreground/80">{event.organizer.name}</span>
                  </TableCell>
                  <TableCell className="py-6">
                    <Badge variant={event.fee > 0 ? "secondary" : "outline"} className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest italic">
                      {event.fee > 0 ? `$${event.fee}` : "Free Entry"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center py-6">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className={`h-10 w-10 p-0 rounded-full transition-all ${event.isFeatured ? "text-amber-500 bg-amber-50 shadow-inner" : "text-muted-foreground/30 hover:bg-amber-50 hover:text-amber-500"}`}
                      onClick={() => toggleFeaturedMutation.mutate(event.id)}
                    >
                      {event.isFeatured ? <Crown className="h-5 w-5 fill-amber-500" /> : <Star className="h-5 w-5" />}
                    </Button>
                  </TableCell>
                  <TableCell className="text-right py-6 px-8">
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
                        <Link href={`/events/${event.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-10 w-10 p-0 rounded-full text-destructive hover:bg-destructive/10 transition-colors"
                        onClick={() => deleteEventMutation.mutate(event.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </div>

      {/* Mobile - Event Cards */}
      <div className="md:hidden space-y-4">
         {events.map((event: any) => (
            <Card key={event.id} className="rounded-[1.5rem] border border-border/40 bg-card/50 backdrop-blur-xl overflow-hidden shadow-lg group">
               <CardContent className="p-0">
                  <div className="relative h-40 w-full overflow-hidden">
                     <Image 
                        src={event.bannerImage || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=400"} 
                        alt={event.title}
                        fill
                        unoptimized={isUnoptimized(event.bannerImage)}
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                     />
                     <div className="absolute top-4 right-4 flex gap-2">
                        <Button 
                           variant="secondary" 
                           size="icon" 
                           className={`h-10 w-10 rounded-full backdrop-blur-md border-none ${event.isFeatured ? "bg-amber-500 text-white" : "bg-black/20 text-white"}`}
                           onClick={() => toggleFeaturedMutation.mutate(event.id)}
                        >
                           {event.isFeatured ? <Crown className="h-5 w-5 fill-white" /> : <Star className="h-5 w-5" />}
                        </Button>
                     </div>
                  </div>
                  <div className="p-6 space-y-4">
                     <div className="space-y-1">
                        <div className="flex items-center justify-between gap-4">
                           <h4 className="font-black text-lg italic uppercase tracking-tight truncate group-hover:text-primary transition-colors">{event.title}</h4>
                           <Badge variant={event.fee > 0 ? "secondary" : "outline"} className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase italic shrink-0">
                              {event.fee > 0 ? `$${event.fee}` : "Free"}
                           </Badge>
                        </div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 italic">
                           <Calendar className="w-3 h-3 text-primary" />
                           {format(new Date(event.date), "MMM d, yyyy")} • By {event.organizer.name}
                        </p>
                     </div>
                     <div className="flex items-center gap-2 pt-2">
                        <Button asChild variant="outline" className="flex-1 rounded-xl h-10 font-black uppercase text-[10px] tracking-widest italic border-border/40">
                           <Link href={`/events/${event.id}`}>
                              <Eye className="w-4 h-4 mr-2" /> View Audit
                           </Link>
                        </Button>
                        <Button 
                           variant="ghost" 
                           size="icon" 
                           className="h-10 w-10 rounded-xl text-destructive hover:bg-destructive/10 border border-destructive/10"
                           onClick={() => deleteEventMutation.mutate(event.id)}
                        >
                           <Trash2 className="w-4 h-4" />
                        </Button>
                     </div>
                  </div>
               </CardContent>
            </Card>
         ))}
      </div>

      {/* Pagination Controls */}
      {meta.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4 py-8 bg-card/30 rounded-[2rem] border border-border/10 shadow-inner">
           <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
             Trace: Page <span className="text-primary">{page}</span> of {meta.totalPages} • <span className="text-foreground">{meta.total}</span> Platform Events
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
