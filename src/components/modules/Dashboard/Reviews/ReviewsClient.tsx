"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Loader2, MessageSquare, Calendar } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export default function ReviewsClient() {
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["my-reviews"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/reviews/my-reviews");
      return data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed p-8 text-center bg-muted/20">
        <MessageSquare className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <h3 className="text-xl font-bold">No Reviews Yet</h3>
        <p className="text-muted-foreground mt-2 max-w-sm">
          Once attendees start reviewing your events, they will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {reviews.map((review: any) => (
        <Card key={review.id} className="rounded-[2rem] border-border/40 overflow-hidden hover:shadow-2xl transition-all duration-500 group">
          <CardHeader className="bg-muted/30 pb-5 px-6 sm:px-8 pt-6 sm:pt-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
               <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12 border-2 border-background shadow-xl">
                     <AvatarImage src={review.user?.image || review.user?.avatar} />
                     <AvatarFallback className="bg-primary/10 text-primary font-black">{review.user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-0.5">
                     <CardTitle className="text-lg font-black tracking-tight uppercase italic">{review.user?.name}</CardTitle>
                     <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                        {format(new Date(review.createdAt), "MMMM d, yyyy")}
                     </CardDescription>
                  </div>
               </div>
               <div className="flex gap-1 bg-background/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-border/50 w-fit">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3.5 h-3.5 ${i < review.rating ? "fill-amber-500 text-amber-500" : "text-muted/20"}`} 
                    />
                  ))}
               </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 sm:p-8 space-y-6">
             <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 relative group-hover:bg-primary/10 transition-colors duration-500">
                <p className="text-[10px] font-black text-primary mb-1 flex items-center gap-2 uppercase tracking-[0.2em]">
                   <Calendar className="w-3 h-3" />
                   Review Payload:
                </p>
                <Link 
                  href={`/events/${review.event?.id}`}
                  className="text-base font-black italic hover:text-primary transition-colors line-clamp-1"
                >
                  {review.event?.title}
                </Link>
             </div>
             
             <div className="relative">
                <MessageSquare className="absolute -left-2 -top-2 w-10 h-10 text-primary/5 -rotate-12" />
                <p className="text-muted-foreground leading-relaxed italic text-sm sm:text-base relative z-10 pl-2">
                   "{review.comment}"
                </p>
             </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
