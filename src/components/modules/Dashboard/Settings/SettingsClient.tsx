"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import axiosInstance from "@/lib/axiosInstance";
import { Camera, Loader2, Save, User as UserIcon } from "lucide-react";

export default function SettingsClient() {
  const { data: session, isPending: isSessionLoading } = authClient.useSession();
  const user = session?.user;
  
  const [name, setName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState(user?.image || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await axiosInstance.patch("/users/me", { name, avatar });
      toast.success("Profile updated successfully");
      // Force session refresh if needed, but better-auth usually handles this
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isSessionLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-8">
      <Card className="rounded-3xl border-border/50 overflow-hidden">
        <CardHeader className="bg-muted/30 pb-12 relative">
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal details and how you appear on the platform.</CardDescription>
          
          <div className="absolute -bottom-8 left-8">
             <div className="relative group">
                <Avatar className="w-24 h-24 border-4 border-background shadow-xl">
                   <AvatarImage src={avatar || user?.image} />
                   <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                      {user?.name?.charAt(0)}
                   </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                   <Camera className="w-6 h-6 text-white" />
                </div>
             </div>
          </div>
        </CardHeader>
        <CardContent className="pt-16 space-y-6">
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                 <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                 <Input 
                   id="name" 
                   value={name} 
                   onChange={(e) => setName(e.target.value)} 
                   className="pl-10 rounded-xl"
                   placeholder="Enter your full name"
                 />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                value={user?.email || ""} 
                disabled 
                className="bg-muted/50 rounded-xl cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground italic">Email cannot be changed for security reasons.</p>
            </div>

            <div className="grid gap-2 pt-4">
              <Label htmlFor="avatar">Avatar URL</Label>
              <Input 
                id="avatar" 
                value={avatar} 
                onChange={(e) => setAvatar(e.target.value)} 
                className="rounded-xl"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <Button type="submit" className="w-full rounded-2xl gap-2 mt-4" disabled={isUpdating}>
              {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-border/50">
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
          <CardDescription>Manage your password and security settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl">
             <div>
                <p className="font-bold">Password</p>
                <p className="text-sm text-muted-foreground">Change your password to keep your account secure.</p>
             </div>
             <Button variant="outline" className="rounded-xl border-primary/20 text-primary hover:bg-primary/5">
                Update Password
             </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
