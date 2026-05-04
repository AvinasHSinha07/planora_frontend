"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4 justify-between">
        <Link href="/" className="font-bold text-2xl tracking-tighter text-primary flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">P</div>
          Planora
        </Link>
        <nav className="hidden md:flex gap-8">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">Home</Link>
          <Link href="/events" className="text-sm font-medium hover:text-primary transition-colors">Events</Link>
          {session && <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">Dashboard</Link>}
          <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">About</Link>
        </nav>
        <div className="flex items-center gap-4">
          {isPending ? (
            <div className="h-8 w-20 bg-muted animate-pulse rounded-full" />
          ) : session ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium hidden sm:inline-block">Hi, {session.user.name.split(' ')[0]}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>Logout</Button>
            </div>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">Login</Link>
              <Button asChild size="sm" className="rounded-full">
                <Link href="/register">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
