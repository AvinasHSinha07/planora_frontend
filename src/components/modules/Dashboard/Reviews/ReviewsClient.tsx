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
        <Card key={review.id} className="rounded-3xl border-border/50 overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="bg-muted/30 pb-4">
            <div className="flex justify-between items-start">
               <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 border-2 border-background shadow-sm">
                     <AvatarImage src={review.user?.image || review.user?.avatar} />
                     <AvatarFallback>{review.user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                     <CardTitle className="text-base font-bold">{review.user?.name}</CardTitle>
                     <CardDescription className="text-xs">
                        {format(new Date(review.createdAt), "MMM d, yyyy")}
                     </CardDescription>
                  </div>
               </div>
               <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3.5 h-3.5 ${i < review.rating ? "fill-amber-500 text-amber-500" : "text-muted/30"}`} 
                    />
                  ))}
               </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
             <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                <p className="text-sm font-medium text-primary mb-1 flex items-center gap-2">
                   <Calendar className="w-3 h-3" />
                   Review for:
                </p>
                <Link 
                  href={`/events/${review.event?.id}`}
                  className="font-bold hover:underline decoration-primary/30"
                >
                  {review.event?.title}
                </Link>
             </div>
             
             <p className="text-muted-foreground leading-relaxed italic">
                "{review.comment}"
             </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
