"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function RegisterClient() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name,
        role,
      } as any);

      if (error) {
        toast.error(error.message || "Failed to register");
      } else {
        toast.success("Successfully registered! Please login.");
        router.push("/login");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: window.location.origin + "/dashboard"
      });
    } catch (error: any) {
      toast.error("Google registration failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-8 md:py-12">
      <Card className="w-full sm:max-w-md shadow-2xl border-border/50 rounded-[1.5rem] md:rounded-[2rem]">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="mx-auto w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-black text-xl mb-2">P</div>
          <CardTitle className="text-2xl md:text-3xl font-black tracking-tight">Create an Account</CardTitle>
          <CardDescription className="text-sm md:text-base">Join Planora to create and manage stunning events</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold ml-1">Full Name</label>
              <Input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-11 rounded-xl bg-muted/50 border-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold ml-1">Email Address</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 rounded-xl bg-muted/50 border-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold ml-1">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 rounded-xl bg-muted/50 border-none"
              />
            </div>
            
            <div className="space-y-3 pb-2">
              <label className="text-sm font-bold ml-1">I want to...</label>
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
                <Button 
                  type="button"
                  variant={role === "USER" ? "default" : "outline"}
                  className={cn(
                    "rounded-xl h-11 font-bold transition-all",
                    role === "USER" ? "shadow-lg shadow-primary/20" : "border-muted-foreground/20"
                  )}
                  onClick={() => setRole("USER")}
                >
                  Join Events
                </Button>
                <Button 
                  type="button"
                  variant={role === "ORGANIZER" ? "default" : "outline"}
                  className={cn(
                    "rounded-xl h-11 font-bold transition-all",
                    role === "ORGANIZER" ? "shadow-lg shadow-primary/20" : "border-muted-foreground/20"
                  )}
                  onClick={() => setRole("ORGANIZER")}
                >
                  Organize Events
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/20" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted-foreground/20" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
              <span className="bg-card px-4 text-muted-foreground/60">Or continue with</span>
            </div>
          </div>

          <Button variant="outline" type="button" className="w-full h-11 rounded-xl font-bold border-muted-foreground/20 hover:bg-muted/50" onClick={handleGoogleLogin} disabled={isLoading}>
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center text-sm border-t bg-muted/20 rounded-b-[1.5rem] md:rounded-b-[2rem] py-4">
          <p className="text-muted-foreground font-medium">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-bold hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
