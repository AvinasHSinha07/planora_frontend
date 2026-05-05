"use client";

import { useRef, useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import axiosInstance from "@/lib/axiosInstance";
import { Camera, Loader2, Save, User as UserIcon, Upload } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function SettingsClient() {
  // ─── Hydration & Session State ──────────────────────────────────────────────
  const [mounted, setMounted] = useState(false);
  const { data: session, isPending: isSessionLoading, error: sessionError } = authClient.useSession();
  
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set mounted to true on client-side only
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync state when session data changes
  useEffect(() => {
    if (session?.user) {
      const user = session.user;
      const sessionName = user.name || "";
      const sessionImg = (user as any).image || (user as any).avatar || "";
      
      // We only want to set the state from the session on the initial load
      // or when the session data itself changes (e.g. after authClient.getSession())
      setName(sessionName);
      setAvatarUrl(sessionImg);
      setPreviewUrl(sessionImg);
      
      console.log("Session updated - Name:", sessionName, "Image:", sessionImg);
    }
  }, [session?.user?.name, (session?.user as any)?.image, (session?.user as any)?.avatar]);

  // ─── Handlers ───────────────────────────────────────────────────────────────
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    setUploadProgress(10);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const response = await axiosInstance.post("/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Backend returns { success: true, data: { url: "...", ... } }
      // Axios wraps this in its own 'data' property
      const uploadedUrl = response.data?.data?.url;
      
      if (uploadedUrl) {
        setAvatarUrl(uploadedUrl);
        setPreviewUrl(uploadedUrl);
        toast.success("Image uploaded! Don't forget to Save Changes.");
      } else {
        throw new Error("No URL found in server response");
      }
    } catch (err: any) {
      console.error("Upload error details:", err);
      toast.error(err.response?.data?.message || err.message || "Failed to upload image");
      // Revert to the last saved avatar URL
      setPreviewUrl(avatarUrl);
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) return;

    setIsUpdating(true);
    try {
      await axiosInstance.patch("/users/me", { name, avatar: avatarUrl });
      
      // Refresh the session so Better Auth client state updates
      await authClient.getSession({
        fetchOptions: {
          cache: "no-store",
        }
      });
      
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      console.error("Update error details:", err);
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  // ─── Render Logic ──────────────────────────────────────────────────────────
  
  if (!mounted || isSessionLoading) {
    return (
      <div className="max-w-2xl space-y-8">
        <Card className="rounded-3xl border-border/50 overflow-hidden">
          <div className="h-48 bg-muted animate-pulse" />
          <CardContent className="pt-16 space-y-6">
            <div className="h-10 bg-muted animate-pulse rounded-xl" />
            <div className="h-10 bg-muted animate-pulse rounded-xl" />
            <div className="h-10 bg-muted animate-pulse rounded-xl" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (sessionError) {
    return (
      <div className="p-8 text-center bg-destructive/10 text-destructive rounded-2xl">
        <p className="font-bold">Error loading session</p>
        <p className="text-sm">Please try refreshing the page.</p>
      </div>
    );
  }

  const user = session?.user;
  const initials = (user?.name || "U").charAt(0).toUpperCase();

  return (
    <div className="max-w-2xl space-y-8">
      {/* Profile Section */}
      <Card className="rounded-3xl border-border/50 overflow-hidden shadow-sm">
        <CardHeader className="bg-muted/30 pb-12 sm:pb-16 relative border-b border-border/50">
          <CardTitle className="text-xl sm:text-2xl text-center sm:text-left">Profile Information</CardTitle>
          <CardDescription className="text-center sm:text-left">
            Customize your identity on Planora.
          </CardDescription>

          {/* Avatar & Upload */}
          <div className="absolute left-1/2 sm:left-8 -bottom-10 -translate-x-1/2 sm:translate-x-0">
            <div className="relative group">
              <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-background shadow-xl ring-2 ring-primary/10">
                {/* Use undefined instead of empty string to avoid React warning */}
                <AvatarImage src={previewUrl || undefined} alt={user?.name || ""} />
                <AvatarFallback className="text-xl sm:text-2xl bg-primary/5 text-primary font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-spin" />
                ) : (
                  <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                )}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-16 space-y-6">
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium text-primary">
                <span className="flex items-center gap-1"><Upload className="w-3 h-3" /> Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-1.5" />
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-5">
            <div className="grid gap-2">
              <Label htmlFor="name">Display Name</Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 rounded-xl"
                  placeholder="Your full name"
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email (Verified)</Label>
              <Input
                id="email"
                value={user?.email || ""}
                disabled
                className="bg-muted/50 rounded-xl cursor-not-allowed"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="avatar">Avatar URL</Label>
              <div className="flex gap-2">
                <Input
                  id="avatar"
                  value={avatarUrl}
                  onChange={(e) => {
                    setAvatarUrl(e.target.value);
                    setPreviewUrl(e.target.value);
                  }}
                  className="rounded-xl flex-1"
                  placeholder="Paste URL or upload using the camera icon"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon" 
                  className="rounded-xl shrink-0"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full rounded-2xl h-11 gap-2"
              disabled={isUpdating || isUploading}
            >
              {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card className="rounded-3xl border-border/50">
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Manage your account password.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/50">
            <div>
              <p className="font-semibold">Password</p>
              <p className="text-sm text-muted-foreground">Manage your account security</p>
            </div>
            <Button variant="outline" className="rounded-xl">Change Password</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
