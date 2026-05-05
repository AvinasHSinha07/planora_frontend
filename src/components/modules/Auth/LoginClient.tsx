"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = authClient.useSession();

  if (session) {
    router.push("/dashboard");
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "Failed to login");
      } else {
        toast.success("Successfully logged in");
        router.push("/dashboard");
        router.refresh();
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
      toast.error("Google login failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <Card className="w-full max-w-md shadow-xl border-border/50">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Welcome Back</CardTitle>
          <CardDescription>Login to your Planora account to manage events</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Password</label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted-foreground/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button variant="outline" type="button" className="w-full" onClick={handleGoogleLogin}>
            Google
          </Button>

          <div className="flex flex-col space-y-2 pt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted-foreground/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Demo Accounts
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs hover:text-foreground"
                disabled={isLoading}
                onClick={() => {
                  const creds = { email: "admin@planora.com", password: "admin123" };
                  setEmail(creds.email);
                  setPassword(creds.password);
                  // Trigger login manually
                  authClient.signIn.email({ ...creds }).then(({ data, error }) => {
                    if (error) toast.error(error.message || "Failed to login");
                    else {
                      toast.success("Successfully logged in");
                      router.push("/dashboard");
                      router.refresh();
                    }
                  });
                }}
              >
                Admin
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs hover:text-foreground"
                disabled={isLoading}
                onClick={() => {
                  const creds = { email: "organizer@planora.com", password: "organizer123" };
                  setEmail(creds.email);
                  setPassword(creds.password);
                  authClient.signIn.email({ ...creds }).then(({ data, error }) => {
                    if (error) toast.error(error.message || "Failed to login");
                    else {
                      toast.success("Successfully logged in");
                      router.push("/dashboard");
                      router.refresh();
                    }
                  });
                }}
              >
                Organizer
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs hover:text-foreground"
                disabled={isLoading}
                onClick={() => {
                  const creds = { email: "user@example.com", password: "password123" };
                  setEmail(creds.email);
                  setPassword(creds.password);
                  authClient.signIn.email({ ...creds }).then(({ data, error }) => {
                    if (error) toast.error(error.message || "Failed to login");
                    else {
                      toast.success("Successfully logged in");
                      router.push("/dashboard");
                      router.refresh();
                    }
                  });
                }}
              >
                User
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center text-sm">
          <p className="text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
