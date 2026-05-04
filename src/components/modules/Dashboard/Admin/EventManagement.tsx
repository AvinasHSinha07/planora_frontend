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
      <div className="flex flex-col xl:flex-row gap-4 items-center justify-between">
        <div className="relative w-full xl:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search events..." 
            className="pl-9 h-11"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
          {isFetching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
               <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select 
              value={feeFilter} 
              onValueChange={(val) => {
                setFeeFilter(val);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[120px] h-11">
                <SelectValue placeholder="All Pricing" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Pricing</SelectItem>
                <SelectItem value="FREE">Free Only</SelectItem>
                <SelectItem value="PAID">Paid Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Select 
            value={featuredFilter} 
            onValueChange={(val) => {
              setFeaturedFilter(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[130px] h-11">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="FEATURED">Featured</SelectItem>
              <SelectItem value="STANDARD">Standard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="border shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="py-4">Event Details</TableHead>
                <TableHead className="py-4">Organizer</TableHead>
                <TableHead className="py-4">Economics</TableHead>
                <TableHead className="text-center py-4">Featured</TableHead>
                <TableHead className="text-right py-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event: any) => (
                <TableRow key={event.id} className="hover:bg-muted/5 transition-colors">
                  <TableCell className="py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative h-12 w-20 rounded-md overflow-hidden bg-muted flex-shrink-0 border">
                        <Image 
                          src={event.bannerImage || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=200"} 
                          alt={event.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col min-w-0 max-w-[250px]">
                        <span className="font-semibold text-sm truncate">{event.title}</span>
                        <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1 mt-0.5 uppercase tracking-wider">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(event.date), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="text-sm font-medium">{event.organizer.name}</span>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge variant={event.fee > 0 ? "secondary" : "outline"} className="px-3">
                      {event.fee > 0 ? `$${event.fee}` : "Free Entry"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center py-4">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className={`h-9 w-9 p-0 ${event.isFeatured ? "text-amber-500 hover:text-amber-600 bg-amber-50" : "text-muted-foreground/30 hover:text-muted-foreground"}`}
                      onClick={() => toggleFeaturedMutation.mutate(event.id)}
                    >
                      {event.isFeatured ? <Crown className="h-5 w-5 fill-amber-500" /> : <Star className="h-5 w-5" />}
                    </Button>
                  </TableCell>
                  <TableCell className="text-right py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild variant="ghost" size="sm" className="h-9 w-9 p-0">
                        <Link href={`/events/${event.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-9 w-9 p-0 text-destructive hover:bg-destructive/10"
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
      </Card>

      {/* Pagination Controls */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
           <p className="text-sm text-muted-foreground">
             Showing page {page} of {meta.totalPages} ({meta.total} total events)
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
