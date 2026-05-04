"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Edit } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";

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
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

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

interface EditEventDialogProps {
  event: any;
}

export default function EditEventDialog({ event }: EditEventDialogProps) {
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
      title: event.title,
      description: event.description,
      date: format(new Date(event.date), "yyyy-MM-dd'T'HH:mm"),
      venue: event.venue || "",
      eventLink: event.eventLink || "",
      fee: event.fee,
      eventType: event.eventType,
      categoryId: event.categoryId,
    },
  });

  const updateEventMutation = useMutation({
    mutationFn: async (eventData: any) => {
      const { data } = await axiosInstance.patch(`/events/${event.id}`, {
        ...eventData,
        date: new Date(eventData.date).toISOString(),
      });
      return data;
    },
    onSuccess: (data) => {
      if (!data.success) {
        throw new Error(data.message || "Failed to update event");
      }
      toast.success("Event updated successfully");
      queryClient.invalidateQueries({ queryKey: ["my-events"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event", event.id] });
      setOpen(false);
      router.refresh();
    },
    onError: (error: any) => {
      toast.error(error.message || "An error occurred");
    },
  });

  async function onSubmit(data: EventFormValues) {
    updateEventMutation.mutate(data);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setOpen(true); }}>
          Edit Event
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>
            Update the details of your event below. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
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
              render={({ field }) => (
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
                render={({ field }) => (
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
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
                render={({ field }) => (
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
                render={({ field }) => (
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
                render={({ field }) => (
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories?.map((cat: any) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
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
              <Button type="submit" disabled={updateEventMutation.isPending}>
                {updateEventMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
