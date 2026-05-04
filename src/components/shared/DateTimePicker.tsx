"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateTimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  disabled?: boolean;
}

export function DateTimePicker({ date, setDate, disabled }: DateTimePickerProps) {
  // Ensure we are working with a Date object even if a string was passed initially
  const d = date instanceof Date ? date : date ? new Date(date) : undefined;
  
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const handleDateSelect = (newSelectedDate: Date | undefined) => {
    if (!newSelectedDate) return;
    const updatedDate = new Date(newSelectedDate);
    if (d) {
      updatedDate.setHours(d.getHours());
      updatedDate.setMinutes(d.getMinutes());
    } else {
      // Default to 12:00 if no time was previously set
      updatedDate.setHours(12);
      updatedDate.setMinutes(0);
    }
    setDate(updatedDate);
  };

  const handleTimeChange = (type: "hour" | "minute", value: string) => {
    const updatedDate = d ? new Date(d) : new Date();
    if (type === "hour") {
      updatedDate.setHours(parseInt(value));
    } else {
      updatedDate.setMinutes(parseInt(value));
    }
    setDate(updatedDate);
  };

  return (
    <div className="w-full">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal h-12 rounded-xl border-muted-foreground/20 bg-muted/5 hover:bg-muted/10 transition-all",
              !d && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-3 h-5 w-5 text-primary" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Event Date & Time</span>
              <span className="text-sm font-bold">
                {d && !isNaN(d.getTime()) ? format(d, "PPP 'at' HH:mm") : "Choose when it starts"}
              </span>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 rounded-2xl border-muted-foreground/20 shadow-2xl overflow-hidden" align="start">
          <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-muted-foreground/10 bg-card">
            {/* Date Section */}
            <div className="p-3">
              <Calendar
                mode="single"
                selected={d}
                onSelect={handleDateSelect}
                initialFocus
                disabled={(day) => day < new Date(new Date().setHours(0, 0, 0, 0))}
                className="rounded-xl"
              />
            </div>

            {/* Time Section */}
            <div className="p-4 flex flex-row sm:flex-col items-center justify-center gap-4 bg-muted/30">
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Hour</span>
                <Select
                  value={d && !isNaN(d.getTime()) ? d.getHours().toString() : "12"}
                  onValueChange={(v) => handleTimeChange("hour", v)}
                >
                  <SelectTrigger className="w-16 h-12 rounded-xl border-muted-foreground/20 bg-background shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent 
                    className="max-h-[200px] rounded-xl" 
                    position="popper"
                    onWheel={(e) => e.stopPropagation()}
                  >
                    {hours.map((h) => (
                      <SelectItem key={h} value={h.toString()}>
                        {h.toString().padStart(2, "0")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <span className="text-primary/30 font-black sm:hidden">:</span>

              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Min</span>
                <Select
                  value={d && !isNaN(d.getTime()) ? d.getMinutes().toString() : "0"}
                  onValueChange={(v) => handleTimeChange("minute", v)}
                >
                  <SelectTrigger className="w-16 h-12 rounded-xl border-muted-foreground/20 bg-background shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent 
                    className="max-h-[200px] rounded-xl" 
                    position="popper"
                    onWheel={(e) => e.stopPropagation()}
                  >
                    {minutes.map((m) => (
                      <SelectItem key={m} value={m.toString()}>
                        {m.toString().padStart(2, "0")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="hidden sm:flex flex-col items-center gap-1 mt-auto pt-4 text-primary">
                <Clock className="h-5 w-5 opacity-20" />
                <span className="text-[9px] font-bold uppercase opacity-20">Time</span>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
