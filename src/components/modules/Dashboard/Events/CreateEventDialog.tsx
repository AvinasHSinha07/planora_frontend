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
  date: z.string().min(1, "Date is required"),
  venue: z.string().optional(),
  eventLink: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  fee: z.coerce.number().min(0, "Fee cannot be negative"),
  eventType: z.enum(["PUBLIC_FREE", "PUBLIC_PAID", "PRIVATE_FREE", "PRIVATE_PAID"]),
  categoryId: z.string().min(1, "Category is required"),
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
      date: "",
      venue: "",
      eventLink: "",
      fee: 0,
      eventType: "PUBLIC_FREE",
      categoryId: "",
    },
  });
  useEffect(() => {
    if (categories && categories.length > 0 && !form.getValues("categoryId")) {
      form.setValue("categoryId", categories[0].id);
    }
  }, [categories, form]);

 

  const createEventMutation = useMutation({
    mutationFn: async (eventData: any) => {
      const { data } = await axiosInstance.post("/events", {
        ...eventData,
        date: new Date(eventData.date).toISOString(),
      });
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
      toast.error(error.message || "An error occurred");
    },
  });

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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Provide details about the event..." 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>Date & Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="eventType"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>Event Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
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
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="venue"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>Venue (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Convention Center" {...field} />
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
                      <Input placeholder="https://zoom.us/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fee"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>Registration Fee ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" {...field} />
                    </FormControl>
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
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories && categories.length > 0 ? (
                          categories.map((cat: any) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-2 text-xs text-muted-foreground">Loading categories...</div>
                        )}
                      </SelectContent>
                    </Select>
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
