"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Calendar as CalendarIcon, MapPin, Tag } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import Link from "next/link";
import Image from "next/image";
import { useDebounce } from "@/hooks/useDebounce";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface EventData {
  id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  fee: number;
  eventType: string;
  category?: { name: string };
  bannerImage?: string;
  tags?: string;
}

export default function EventsPageClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [type, setType] = useState("all");
  const [eventStatus, setEventStatus] = useState("upcoming");
  const [page, setPage] = useState(1);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data, isLoading, error } = useQuery({
    queryKey: ["events", debouncedSearchTerm, category, type, eventStatus, page],
    queryFn: async (): Promise<{ events: EventData[], meta: any }> => {
      const params = new URLSearchParams();
      if (debouncedSearchTerm) params.append("searchTerm", debouncedSearchTerm);
      if (category !== "all") params.append("category", category);
      if (type !== "all") params.append("type", type);
      if (eventStatus !== "all") params.append("status", eventStatus);
      params.append("page", page.toString());
      params.append("limit", "9"); // 9 items per page (3x3 grid)
      
      const { data } = await axiosInstance.get(`/events?${params.toString()}`);
      return data.data;
    },
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/categories");
      return data.data;
    },
  });

  const events = data?.events || [];
  const meta = data?.meta || { totalPages: 1 };
  const categories = categoriesData || [];

  const handleFilterChange = (setter: (val: string) => void, value: string) => {
    setter(value);
    setPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 space-y-6">
        <h1 className="text-4xl font-extrabold tracking-tight">Discover Events</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by title, organizer, or description..." 
                className="pl-10 h-12 rounded-xl"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
              />
          </div>
          
          <Select value={category} onValueChange={(val) => handleFilterChange(setCategory, val)}>
            <SelectTrigger className="h-12 rounded-xl">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                <SelectValue placeholder="Category" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat: any) => (
                <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={type} onValueChange={(val) => handleFilterChange(setType, val)}>
            <SelectTrigger className="h-12 rounded-xl">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Type" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="PUBLIC_FREE">Public Free</SelectItem>
              <SelectItem value="PUBLIC_PAID">Public Paid</SelectItem>
              <SelectItem value="PRIVATE_FREE">Private Free</SelectItem>
              <SelectItem value="PRIVATE_PAID">Private Paid</SelectItem>
            </SelectContent>
          </Select>

          <Select value={eventStatus} onValueChange={(val) => handleFilterChange(setEventStatus, val)}>
            <SelectTrigger className="h-12 rounded-xl">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="past">Past Events</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-[400px] bg-muted animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-24 bg-destructive/5 rounded-2xl border border-destructive/20">
          <p className="text-destructive font-medium text-lg">Failed to load events. Please try again later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events?.map((event) => (
            <Card key={event.id} className="group overflow-hidden rounded-2xl border-border/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
              <div className="h-48 bg-muted relative overflow-hidden">
                <Image 
                  src={event.bannerImage || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070"} 
                  alt={event.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 group-hover:opacity-40 transition-opacity" />
                <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold shadow-sm z-10">
                  {event.eventType.replace('_', ' ')}
                </div>
              </div>
              <CardHeader className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-medium text-primary mb-1">
                  <CalendarIcon className="h-3 w-3" />
                  {new Date(event.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">{event.title}</CardTitle>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {event.venue || "TBA"}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4">
                  {event.description}
                </p>
                {event.tags && (
                  <div className="flex flex-wrap gap-1.5">
                    {event.tags.split(',').slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground font-medium">
                        #{tag.trim()}
                      </span>
                    ))}
                    {event.tags.split(',').length > 3 && (
                      <span className="text-[10px] text-muted-foreground/50">+{event.tags.split(',').length - 3}</span>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between items-center border-t bg-muted/5 p-6">
                <span className="text-2xl font-bold tracking-tight">
                  {event.fee > 0 ? `$${event.fee}` : <span className="text-emerald-600">Free</span>}
                </span>
                <Button asChild size="sm" className="rounded-full px-6">
                  <Link href={`/events/${event.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
          {events?.length === 0 && (
            <div className="col-span-full py-24 text-center border-2 border-dashed rounded-2xl">
              <p className="text-xl font-medium text-muted-foreground">No events match your search criteria.</p>
              <Button variant="link" onClick={() => {setSearchTerm(""); setCategory("all"); setType("all");}}>Clear all filters</Button>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !error && meta.totalPages > 1 && (
        <div className="mt-16 flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-12 w-12"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-2">
            {[...Array(meta.totalPages)].map((_, i) => (
              <Button
                key={i + 1}
                variant={page === i + 1 ? "default" : "outline"}
                className={`w-12 h-12 rounded-full font-bold ${page === i + 1 ? "shadow-lg shadow-primary/20" : ""}`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-12 w-12"
            onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
            disabled={page === meta.totalPages}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
