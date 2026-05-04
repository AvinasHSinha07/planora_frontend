"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, Plus } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import ImageUpload from "@/components/shared/ImageUpload";
import { DateTimePicker } from "@/components/shared/DateTimePicker";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";

const eventFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.date({
    message: "Event date and time is required",
  }),
  venue: z.string().optional(),
  eventLink: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  fee: z.coerce.number().min(0, "Fee cannot be negative"),
  eventType: z.enum(["PUBLIC_FREE", "PUBLIC_PAID", "PRIVATE_FREE", "PRIVATE_PAID"]),
  categoryId: z.string().min(1, "Category is required"),
  bannerImage: z.string().url("Banner image is required").min(1, "Banner image is required"),
  tags: z.string().optional(),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

export default function CreateEventDialog() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/categories");
      return data.data;
    }
  });
 const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema as any),
    defaultValues: {
      title: "",
      description: "",
      date: new Date(),
      venue: "",
      eventLink: "",
      fee: 0,
      eventType: "PUBLIC_FREE",
      categoryId: "",
      bannerImage: "",
      tags: "",
    },
  });
  useEffect(() => {
    if (categories && categories.length > 0 && !form.getValues("categoryId")) {
      form.setValue("categoryId", categories[0].id);
    }
  }, [categories, form]);

 

  const createEventMutation = useMutation({
    mutationFn: async (values: any) => {
      // Clean up the data before sending
      const eventData = {
        ...values,
        date: values.date instanceof Date ? values.date.toISOString() : new Date(values.date).toISOString(),
        // Ensure tags is either a valid string or null
        tags: values.tags?.trim() || null,
        // Ensure fee is a number
        fee: parseFloat(values.fee.toString()) || 0,
      };

      const { data } = await axiosInstance.post("/events", eventData);
      return data;
    },
    onSuccess: (data) => {
      if (!data.success) {
        throw new Error(data.message || "Failed to create event");
      }
      toast.success("Event created successfully");
      queryClient.invalidateQueries({ queryKey: ["my-events"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      setOpen(false);
      form.reset();
      router.refresh();
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.message || error.message || "An error occurred";
      console.error("[CreateEvent] Request Failed:", error.response?.data || error);
      toast.error(errorMsg);
    },
  });

  const [isArchitecting, setIsArchitecting] = useState(false);
  const [isTagging, setIsTagging] = useState(false);

  const handleAiArchitect = async () => {
    const bullets = form.getValues("description");
    if (!bullets || bullets.length < 10) {
      toast.error("Please provide a few bullet points in the description first.");
      return;
    }

    setIsArchitecting(true);
    try {
      const { data } = await axiosInstance.post("/ai/architect", { bullets });
      form.setValue("description", data.data.description);
      toast.success("AI Architect has refined your description!");
    } catch (error) {
      toast.error("AI Architect failed. Please try again.");
    } finally {
      setIsArchitecting(false);
    }
  };

  const handleAiTagging = async () => {
    const description = form.getValues("description");
    if (!description || description.length < 20) {
      toast.error("Please provide a description first so AI can suggest tags.");
      return;
    }

    setIsTagging(true);
    try {
      const { data } = await axiosInstance.post("/ai/tags", { description });
      form.setValue("tags", data.data.tags);
      toast.success("Smart Tags generated!");
    } catch (error) {
      toast.error("Smart Tagging failed.");
    } finally {
      setIsTagging(false);
    }
  };

  async function onSubmit(data: EventFormValues) {
    createEventMutation.mutate(data);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto" data-lenis-prevent>
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new event. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((d) => onSubmit(d))} className="space-y-6">
            <FormField
              control={form.control}
              name="bannerImage"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Event Banner</FormLabel>
                  <FormControl>
                    <ImageUpload 
                      value={field.value} 
                      onChange={field.onChange} 
                      disabled={createEventMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Event Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Tech Conference 2026" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Description</FormLabel>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleAiArchitect}
                      disabled={isArchitecting}
                      className="h-7 text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary hover:bg-primary/5 gap-1.5"
                    >
                      {isArchitecting ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Architecting...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3 w-3" />
                          Architect with AI
                        </>
                      )}
                    </Button>
                  </div>
                  <FormControl>
                    <Textarea 
                      placeholder="Provide details or bullet points..." 
                      className="resize-none min-h-[120px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription className="text-[10px] italic">
                    Tip: Enter bullet points and click &quot;Architect with AI&quot; for a premium description.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Smart Tags (Optional)</FormLabel>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleAiTagging}
                      disabled={isTagging}
                      className="h-7 text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary hover:bg-primary/5 gap-1.5"
                    >
                      {isTagging ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3 w-3" />
                          Suggest Tags
                        </>
                      )}
                    </Button>
                  </div>
                  <FormControl>
                    <Input placeholder="tech, networking, conference" {...field} />
                  </FormControl>
                  <FormDescription className="text-[10px] italic">
                    Separate tags with commas. Used for better search and discovery.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* New Full-Width Row for Date & Time to avoid overlap */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }: { field: any }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date & Time</FormLabel>
                  <FormControl>
                    <DateTimePicker 
                      date={field.value} 
                      setDate={field.onChange} 
                      disabled={createEventMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="eventType"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>Event Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 rounded-xl">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="PUBLIC_FREE">Public (Free)</SelectItem>
                        <SelectItem value="PUBLIC_PAID">Public (Paid)</SelectItem>
                        <SelectItem value="PRIVATE_FREE">Private (Free)</SelectItem>
                        <SelectItem value="PRIVATE_PAID">Private (Paid)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 rounded-xl">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl">
                        {categories && categories.length > 0 ? (
                          categories.map((cat: any) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-2 text-xs text-muted-foreground">Loading...</div>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="venue"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>Venue (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Convention Center" className="h-11 rounded-xl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="eventLink"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>Online Link (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://zoom.us/..." className="h-11 rounded-xl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="fee"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>Registration Fee ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" className="h-11 rounded-xl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createEventMutation.isPending}>
                {createEventMutation.isPending ? "Creating..." : "Create Event"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
