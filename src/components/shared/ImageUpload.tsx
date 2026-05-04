"use client";

import { useState } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

export default function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await axiosInstance.post("/upload/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        onChange(data.data.url);
        toast.success("Image uploaded successfully");
      } else {
        toast.error("Failed to upload image");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    onChange("");
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center gap-4">
        {value ? (
          <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-border/50 group">
            <Image
              src={value}
              alt="Upload"
              fill
              className="object-cover"
            />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 p-1.5 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              type="button"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="w-full">
            <label className={`
              flex flex-col items-center justify-center w-full h-48 
              border-2 border-dashed rounded-2xl cursor-pointer
              transition-all duration-300
              ${uploading ? "bg-muted/50 border-primary/20" : "bg-muted/20 border-border/50 hover:bg-muted/30 hover:border-primary/30"}
            `}>
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {uploading ? (
                  <Loader2 className="w-10 h-10 text-primary animate-spin mb-3" />
                ) : (
                  <Upload className="w-10 h-10 text-muted-foreground mb-3" />
                )}
                <p className="mb-2 text-sm text-muted-foreground font-bold">
                  {uploading ? "Uploading..." : "Click to upload banner"}
                </p>
                <p className="text-xs text-muted-foreground/60 font-medium">PNG, JPG or WebP (Max 5MB)</p>
              </div>
              <input 
                type="file" 
                className="hidden" 
                onChange={handleUpload} 
                disabled={disabled || uploading} 
                accept="image/*"
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
