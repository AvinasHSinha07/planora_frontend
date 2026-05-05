"use client";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Users, Info, ShieldCheck, Clock, Share2, Heart, Tag, User, Star, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { MessageSquare } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  venue?: string;
  eventLink?: string;
  fee: number;
  eventType: string;
  bannerImage?: string;
  tags?: string;
  category?: { name: string };
  organizer?: { name: string; avatar?: string; image?: string };
  participants?: any[];
  reviews?: any[];
  relatedEvents?: any[];
}

export default function EventDetailsClient({ initialData }: { initialData: any }) {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  const { data: event, isLoading } = useQuery<Event>({
    queryKey: ["event", id],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/events/${id}`);
      return data.data;
    },
    initialData: initialData,
  });

  const isParticipant = event?.participants?.some((p: any) => p.userId === session?.user?.id && p.status === "APPROVED");
  const hasAlreadyReviewed = event?.reviews?.some((r: any) => r.userId === session?.user?.id);
  const isExpired = new Date(event?.date) < new Date();

  const reviewMutation = useMutation({
    mutationFn: async (newReview: { eventId: string; rating: number; comment: string }) => {
      const { data } = await axiosInstance.post("/reviews", newReview);
      return data;
    },
    onSuccess: () => {
      toast.success("Review submitted successfully!");
      setReviewComment("");
      setReviewRating(5);
      queryClient.invalidateQueries({ queryKey: ["event", id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to submit review");
    },
  });

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment) return;
    reviewMutation.mutate({
      eventId: event.id,
      rating: reviewRating,
      comment: reviewComment,
    });
  };

  const averageRating = event?.reviews?.length 
    ? (event.reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0) / event.reviews.length).toFixed(1)
    : "0";

  const joinMutation = useMutation({
    mutationFn: async () => {
      if (event.fee > 0) {
        const { data } = await axiosInstance.post("/payments/create-session", { eventId: event.id });
        return data.data;
      } else {
        const { data } = await axiosInstance.post("/participations/join", { eventId: event.id });
        return data;
      }
    },
    onSuccess: (data) => {
      if (event.fee > 0 && data?.url) {
        window.location.href = data.url;
      } else {
        toast.success("Successfully joined the event!");
        queryClient.invalidateQueries({ queryKey: ["event", id] });
        queryClient.invalidateQueries({ queryKey: ["my-participations"] });
        setTimeout(() => {
          router.push("/dashboard/participations");
        }, 1500);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to join event");
    },
  });

  const handleJoin = async () => {
    if (isExpired) {
      toast.error("This event has already ended.");
      return;
    }
    joinMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-24 flex flex-col items-center gap-4 animate-pulse">
        <div className="h-12 w-1/3 bg-muted rounded-full" />
        <div className="h-[400px] w-full bg-muted rounded-3xl" />
      </div>
    );
  }

  if (!event) return <div className="container mx-auto py-24 text-center">Event not found</div>;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Section */}
      <div className="relative w-full h-[40vh] md:h-[50vh] lg:h-[60vh] overflow-hidden">
        <Image 
          src={event.bannerImage || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070"} 
          alt={event.title}
          fill
          className="object-cover"
          priority
          unoptimized={event.bannerImage?.includes("ellaslist.com.au")}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-transparent to-transparent z-10 hidden md:block" />
        
        {/* Fallback pattern if no image */}
        {!event.bannerImage && (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-secondary/10 to-transparent animate-slow-pulse" />
            <div className="absolute inset-0 flex items-center justify-center opacity-30">
               <div className="w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px]" />
            </div>
          </>
        )}

        <div className="container mx-auto h-full px-4 relative z-20 flex flex-col justify-end pb-12">
          <div className="max-w-3xl space-y-4">
            <div className="flex flex-wrap gap-2 animate-in slide-in-from-bottom-4 duration-500">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 backdrop-blur-md px-3 py-1">
                <Tag className="w-3 h-3 mr-1" />
                {event.category?.name || "Event"}
              </Badge>
              <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 border-amber-500/20 backdrop-blur-md px-3 py-1">
                <Star className="w-3 h-3 mr-1 fill-amber-500" />
                {averageRating} ({event.reviews?.length || 0} reviews)
              </Badge>
              <Badge variant="outline" className="backdrop-blur-md px-3 py-1 bg-white/5 border-white/10">
                {event.eventType.replace('_', ' ')}
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground drop-shadow-sm animate-in slide-in-from-bottom-6 duration-700">
              {event.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 relative z-30">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-12 animate-in fade-in duration-1000">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-card/50 backdrop-blur-xl border rounded-3xl shadow-sm">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Date</p>
                <div className="flex items-center gap-2 font-semibold">
                  <Calendar className="w-4 h-4 text-primary" />
                  {format(new Date(event.date), "MMM d, yyyy")}
                </div>
              </div>
              <div className="space-y-1 border-l pl-4">
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Time</p>
                <div className="flex items-center gap-2 font-semibold">
                  <Clock className="w-4 h-4 text-primary" />
                  {format(new Date(event.date), "h:mm a")}
                </div>
              </div>
              <div className="space-y-1 border-l pl-4 hidden md:block">
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Attendees</p>
                <div className="flex items-center gap-2 font-semibold">
                  <Users className="w-4 h-4 text-primary" />
                  {event.participants?.length || 0} Joined
                </div>
              </div>
              <div className="space-y-1 border-l pl-4 hidden md:block">
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Location</p>
                <div className="flex items-center gap-2 font-semibold truncate">
                  <MapPin className="w-4 h-4 text-primary" />
                  {event.venue || "Online"}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-1 bg-primary rounded-full" />
                <h2 className="text-2xl font-bold">Event Overview</h2>
              </div>
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>

              {event.tags && (
                <div className="pt-6 space-y-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Tag className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Discover More</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.split(',').map((tag: string, idx: number) => (
                      <Badge 
                        key={idx} 
                        variant="outline" 
                        className="rounded-full px-4 py-1.5 bg-muted/50 border-primary/10 hover:border-primary/30 transition-colors text-xs font-medium cursor-default"
                      >
                        #{tag.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Organizer */}
            <Card className="rounded-3xl border-primary/10 bg-primary/5 overflow-hidden">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <Avatar className="w-20 h-20 border-4 border-background ring-2 ring-primary/20">
                    <AvatarImage src={event.organizer?.image || event.organizer?.avatar} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                      {event.organizer?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-center md:text-left space-y-2">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <p className="text-xs font-bold text-primary uppercase tracking-tighter">Event Organized By</p>
                      <ShieldCheck className="w-3 h-3 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold">{event.organizer?.name}</h3>
                    <p className="text-muted-foreground max-w-lg">
                      Professional event curator focused on high-impact {event.category?.name?.toLowerCase()} experiences.
                    </p>
                  </div>
                  <Button variant="outline" className="rounded-full px-8 hover:bg-primary hover:text-primary-foreground transition-all">
                    Contact Organizer
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <div className="space-y-10 pt-12 border-t">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-primary">
                    <Star className="w-5 h-5 fill-current" />
                    <span className="text-sm font-black uppercase tracking-widest">Attendee Insights</span>
                  </div>
                  <h2 className="text-3xl font-black tracking-tight uppercase italic">What People <span className="text-primary">Think</span></h2>
                </div>
                <div className="flex items-center gap-3 bg-muted/30 px-6 py-3 rounded-2xl border">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.round(Number(averageRating)) ? "fill-amber-500 text-amber-500" : "text-muted/30"}`} 
                      />
                    ))}
                  </div>
                  <span className="text-xl font-black italic">{averageRating}</span>
                  <span className="text-muted-foreground font-bold text-xs uppercase tracking-wider">
                    ({event.reviews?.length || 0} reviews)
                  </span>
                </div>
              </div>

              {/* Review Submission Form - Conditional */}
              {isParticipant && !hasAlreadyReviewed && (
                <Card className="rounded-[2.5rem] border-primary/20 bg-primary/5 shadow-inner overflow-hidden relative group">
                   <div className="absolute top-0 right-0 p-8 opacity-5">
                      <Star className="w-32 h-32" />
                   </div>
                  <CardContent className="p-10 space-y-8 relative z-10">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black uppercase italic">Share Your Experience</h3>
                      <p className="text-muted-foreground italic">Your feedback helps the community discover the best events.</p>
                    </div>
                    
                    <form onSubmit={handleSubmitReview} className="space-y-8">
                      <div className="flex flex-col gap-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Select Performance Rating</p>
                        <div className="flex gap-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                            >
                              <Star 
                                className={`w-10 h-10 ${star <= reviewRating ? "fill-amber-500 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]" : "text-muted/20"}`} 
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Review Narrative</p>
                         <Textarea 
                          placeholder="How was the atmosphere? What could be improved?"
                          className="min-h-[140px] rounded-[1.5rem] bg-background border-primary/10 focus:border-primary/40 focus:ring-primary/20 transition-all text-lg italic p-6"
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full md:w-fit px-12 h-16 rounded-2xl text-lg font-black uppercase tracking-tight shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                        disabled={reviewMutation.isPending || !reviewComment}
                      >
                        {reviewMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Publish Review"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              {event?.reviews && event.reviews.length > 0 ? (
                <div className="relative px-12">
                   <Carousel className="w-full" opts={{ align: "start" } as any}>
                    <CarouselContent className="-ml-4">
                      {event.reviews.map((review: any) => (
                        <CarouselItem key={review.id} className="pl-4 md:basis-1/2 lg:basis-1/2">
                          <Card className="rounded-[2.5rem] border-none bg-muted/20 hover:bg-muted/30 transition-all duration-500 h-full group">
                            <CardContent className="p-8 flex flex-col justify-between h-full space-y-6">
                              <div className="space-y-6">
                                <div className="flex justify-between items-start">
                                  <div className="flex items-center gap-3">
                                    <Avatar className="w-12 h-12 border-2 border-background shadow-lg">
                                      <AvatarImage src={review.user?.image || review.user?.avatar} />
                                      <AvatarFallback className="font-black bg-primary/10 text-primary">{review.user?.name?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-0.5">
                                      <p className="font-black text-sm uppercase tracking-tight italic">{review.user?.name}</p>
                                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                                        {format(new Date(review.createdAt), "MMM d, yyyy")}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex gap-0.5 bg-background/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                                    {[...Array(5)].map((_, i) => (
                                      <Star 
                                        key={i} 
                                        className={`w-3 h-3 ${i < review.rating ? "fill-amber-500 text-amber-500" : "text-muted/20"}`} 
                                      />
                                    ))}
                                  </div>
                                </div>
                                <p className="text-muted-foreground leading-relaxed italic text-lg line-clamp-4">
                                  "{review.comment}"
                                </p>
                              </div>
                              <div className="pt-4 border-t border-muted-foreground/10">
                                 <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary opacity-50">
                                    <ShieldCheck className="w-3 h-3" /> Verified Attendee
                                 </div>
                              </div>
                            </CardContent>
                          </Card>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="h-12 w-12 border-none bg-background/50 backdrop-blur-xl shadow-xl hover:bg-primary hover:text-white transition-all -left-6" />
                    <CarouselNext className="h-12 w-12 border-none bg-background/50 backdrop-blur-xl shadow-xl hover:bg-primary hover:text-white transition-all -right-6" />
                  </Carousel>
                </div>
              ) : (
                <div className="text-center py-20 bg-muted/10 rounded-[3rem] border-2 border-dashed border-border/50 group hover:border-primary/30 transition-colors">
                  <div className="inline-flex p-6 rounded-full bg-muted/20 mb-4 group-hover:scale-110 transition-transform">
                     <MessageSquare className="w-10 h-10 text-muted-foreground/40" />
                  </div>
                  <p className="text-muted-foreground text-xl italic max-w-sm mx-auto">Be the first to architect a perspective on this event experience.</p>
                </div>
              )}
            </div>

            {/* Related Events Section */}
            {event?.relatedEvents && event.relatedEvents.length > 0 && (
              <div className="space-y-8 pt-8">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-1 bg-primary rounded-full" />
                  <h2 className="text-2xl font-bold">You Might Also Like</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {event.relatedEvents.map((related: any) => (
                    <Card key={related.id} className="group overflow-hidden rounded-3xl border-border/50 hover:shadow-xl transition-all duration-500">
                      <div className="h-40 bg-muted relative overflow-hidden">
                        <Image 
                          src={related.bannerImage || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070"} 
                          alt={related.title}
                          fill
                          unoptimized={related.bannerImage?.includes("ellaslist.com.au")}
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-secondary/10 group-hover:opacity-40 transition-opacity" />
                        <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold z-10">
                          {related.eventType.replace('_', ' ')}
                        </div>
                      </div>
                      <CardHeader className="p-5 pb-2">
                         <Badge variant="secondary" className="w-fit mb-2 text-[10px] uppercase font-black tracking-widest bg-primary/5 text-primary border-none">
                            {related.category?.name}
                         </Badge>
                         <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-1">
                            {related.title}
                         </CardTitle>
                      </CardHeader>
                      <CardContent className="p-5 pt-0">
                         <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                               <Calendar className="w-3 h-3" />
                               {format(new Date(related.date), "MMM d")}
                            </div>
                            <div className="flex items-center gap-1">
                               <MapPin className="w-3 h-3" />
                               {related.venue || "Online"}
                            </div>
                         </div>
                      </CardContent>
                      <CardFooter className="p-5 pt-0 flex justify-between items-center">
                         <span className="font-bold">{related.fee > 0 ? `$${related.fee}` : "Free"}</span>
                         <Button variant="ghost" size="sm" asChild className="rounded-full text-primary hover:text-primary hover:bg-primary/5">
                            <Link href={`/events/${related.id}`}>Details</Link>
                         </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6 animate-in slide-in-from-right-8 duration-700">
              <Card className="overflow-hidden rounded-[2.5rem] border-primary/20 shadow-2xl shadow-primary/5 bg-background/50 backdrop-blur-2xl">
                <div className="bg-primary p-8 text-primary-foreground text-center space-y-1 relative overflow-hidden">
                   {/* Animated background decoration */}
                   <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                   <div className="absolute -left-4 -bottom-4 w-32 h-32 bg-secondary/20 rounded-full blur-2xl" />
                   
                   <p className="text-sm font-medium opacity-90 uppercase tracking-widest">Admission Price</p>
                   <div className="text-5xl font-black flex items-center justify-center gap-1">
                      {event.fee > 0 ? (
                        <>
                          <span className="text-2xl opacity-80 mt-1">$</span>
                          {event.fee}
                        </>
                      ) : (
                        "FREE"
                      )}
                   </div>
                </div>
                
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-2 italic">
                        <Users className="w-4 h-4" /> Limited availability
                      </span>
                      <span className="font-bold text-primary">Selling fast</span>
                    </div>
                    
                    <Button 
                      size="lg" 
                      className="w-full text-lg h-16 rounded-2xl shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-95 transition-all duration-300 font-bold" 
                      onClick={handleJoin}
                      disabled={joinMutation.isPending || isExpired}
                    >
                      {joinMutation.isPending ? (
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      ) : isExpired ? (
                        "Event Expired"
                      ) : event.fee > 0 ? (
                        "Secure Your Spot"
                      ) : (
                        "Register Now"
                      )}
                    </Button>
                  </div>

                  <div className="space-y-4 pt-4">
                    <p className="text-xs text-center text-muted-foreground leading-relaxed">
                      By registering, you agree to Planora's <Link href="/terms" className="underline hover:text-primary">Terms of Service</Link> and <Link href="/privacy" className="underline hover:text-primary">Privacy Policy</Link>.
                    </p>
                    
                    <Separator className="bg-primary/5" />
                    
                    <div className="flex items-center justify-between gap-4 pt-2">
                       <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/5 hover:text-primary transition-colors h-12 w-12 border border-primary/5">
                          <Share2 className="w-5 h-5" />
                       </Button>
                       <Button variant="ghost" size="icon" className="rounded-full hover:bg-destructive/5 hover:text-destructive transition-colors h-12 w-12 border border-destructive/5">
                          <Heart className="w-5 h-5" />
                       </Button>
                       <Button variant="ghost" className="flex-1 rounded-2xl h-12 gap-2 text-muted-foreground border border-primary/5">
                          <Info className="w-4 h-4" /> Save
                       </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Verified Badge */}
              <div className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-sm font-bold tracking-tight">Verified Secure Event</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
