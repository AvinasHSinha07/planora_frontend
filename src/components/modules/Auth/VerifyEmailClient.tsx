"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function VerifyEmailClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      return;
    }

    const verifyEmail = async () => {
      try {
        const { error } = await authClient.verifyEmail({
          query: {
            token: token,
          }
        });

        if (error) {
          setStatus("error");
          toast.error(error.message || "Email verification failed");
        } else {
          setStatus("success");
          toast.success("Email successfully verified");
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        }
      } catch (err: any) {
        setStatus("error");
        toast.error(err.message || "An error occurred during verification");
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <Card className="w-full max-w-md shadow-xl border-border/50 text-center">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold tracking-tight">Email Verification</CardTitle>
          <CardDescription>
            {status === "loading" && "Verifying your email address..."}
            {status === "success" && "Your email has been verified! Redirecting to login..."}
            {status === "error" && "Verification link is invalid or expired."}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
