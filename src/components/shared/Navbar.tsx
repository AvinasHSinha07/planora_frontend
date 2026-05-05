"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { useQueryClient } from "@tanstack/react-query";
import { Menu, Home, Calendar, LayoutDashboard, Info, LogOut, Users, CreditCard, Settings, ShieldAlert, UserCheck, MessageSquare, Bell, PieChart } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await authClient.signOut();
    queryClient.clear();
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/events", label: "Events" },
    ...(session ? [{ href: "/dashboard", label: "Dashboard" }] : []),
    { href: "/about", label: "About" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4 justify-between">
        <div className="flex items-center gap-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden hover:bg-primary/10 transition-colors">
                <Menu className="h-6 w-6 text-primary" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[380px] p-0 border-r-primary/10">
              <div className="flex flex-col h-full bg-background">
                <SheetHeader className="p-6 border-b border-primary/5">
                  <SheetTitle className="text-left">
                    <Link href="/" onClick={() => setIsOpen(false)} className="font-black text-2xl tracking-tighter text-primary flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">P</div>
                      Planora
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                
                <div className="flex-1 overflow-y-auto py-6">
                  <nav className="px-4 space-y-2">
                    {navLinks.map((link) => {
                      const Icon = link.label === "Home" ? Home : 
                                   link.label === "Events" ? Calendar : 
                                   link.label === "Dashboard" ? LayoutDashboard : Info;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-4 px-4 py-3 rounded-xl text-lg font-bold text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all group"
                        >
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <Icon className="w-5 h-5" />
                          </div>
                          {link.label}
                        </Link>
                      );
                    })}

                    {/* Dashboard Sub-links for Mobile */}
                    {session && (
                      <div className="mt-6 pt-6 border-t border-primary/5">
                        <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Management</p>
                        <div className="space-y-1">
                          {[
                            { href: "/dashboard", label: "Overview", icon: LayoutDashboard, roles: ["ADMIN", "ORGANIZER", "USER"] },
                            { href: "/dashboard/admin", label: "Admin Console", icon: ShieldAlert, roles: ["ADMIN"] },
                            { href: "/dashboard/events", label: "My Events", icon: Calendar, roles: ["ADMIN", "ORGANIZER"] },
                            { href: "/dashboard/participations", label: "My Participations", icon: UserCheck, roles: ["ADMIN", "ORGANIZER", "USER"] },
                            { href: "/dashboard/invitations", label: "Invitations", icon: Users, roles: ["ADMIN", "ORGANIZER", "USER"] },
                            { href: "/dashboard/participants", label: "Participants", icon: UserCheck, roles: ["ADMIN", "ORGANIZER"] },
                            { href: "/dashboard/reviews", label: "Reviews", icon: MessageSquare, roles: ["ADMIN", "ORGANIZER"] },
                            { href: "/dashboard/notifications", label: "Notifications", icon: Bell, roles: ["ADMIN", "ORGANIZER", "USER"] },
                            { href: "/dashboard/payments", label: "Payments", icon: CreditCard, roles: ["ADMIN", "ORGANIZER", "USER"] },
                            { href: "/dashboard/analytics", label: "Analytics", icon: PieChart, roles: ["ADMIN", "ORGANIZER"] },
                            { href: "/dashboard/settings", label: "Settings", icon: Settings, roles: ["ADMIN", "ORGANIZER", "USER"] },
                          ].filter(link => link.roles.includes((session.user as any).role || "USER")).map((subLink) => {
                            const SubIcon = subLink.icon;
                            return (
                              <Link
                                key={subLink.href}
                                href={subLink.href}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-bold text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
                              >
                                <SubIcon className="w-4 h-4" />
                                {subLink.label}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </nav>
                </div>

                <div className="p-6 border-t border-primary/5 bg-muted/20">
                  {session ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 px-2">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                          {session.user.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <p className="text-sm font-bold text-foreground leading-none">{session.user.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">{session.user.email}</p>
                        </div>
                      </div>
                      <Button variant="outline" onClick={handleLogout} className="w-full h-11 rounded-xl font-bold border-primary/10 hover:bg-primary/5 text-primary">
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <Button asChild variant="outline" className="h-11 rounded-xl font-bold border-primary/10 hover:bg-primary/5" onClick={() => setIsOpen(false)}>
                        <Link href="/login">Login</Link>
                      </Button>
                      <Button asChild className="h-11 rounded-xl font-bold shadow-lg shadow-primary/20" onClick={() => setIsOpen(false)}>
                        <Link href="/register">Sign Up</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/" className="font-bold text-2xl tracking-tighter text-primary flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-sm">P</div>
            <span className="hidden xs:inline-block">Planora</span>
          </Link>
        </div>

        <nav className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium hover:text-primary transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          <div className="hidden sm:flex items-center gap-4">
            {isPending ? (
              <div className="h-8 w-20 bg-muted animate-pulse rounded-full" />
            ) : session ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium hidden lg:inline-block">Hi, {session.user.name.split(' ')[0]}</span>
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
          {!session && !isPending && (
            <Button asChild size="sm" className="rounded-full sm:hidden">
              <Link href="/register">Sign Up</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

