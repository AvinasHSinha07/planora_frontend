"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  MessageSquare, 
  Settings, 
  Bell,
  PieChart,
  UserCheck,
  ShieldAlert,
  CreditCard
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Badge } from "@/components/ui/badge";

const sidebarLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/events", label: "My Events", icon: Calendar },
  { href: "/dashboard/participations", label: "My Participations", icon: UserCheck },
  { href: "/dashboard/invitations", label: "Invitations", icon: Users },
  { href: "/dashboard/participants", label: "Participants", icon: UserCheck },
  { href: "/dashboard/reviews", label: "Reviews", icon: MessageSquare },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/payments", label: "Payments", icon: CreditCard },
  { href: "/dashboard/analytics", label: "Analytics", icon: PieChart },
  { href: "/dashboard/admin", label: "Admin Console", icon: ShieldAlert },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const userRole = (session?.user as any)?.role || "USER";

  // Filter links based on role
  const filteredLinks = sidebarLinks.filter(link => {
    if (link.href === "/dashboard/admin" && userRole !== "ADMIN") return false;
    
    // Organizers and Admins see everything else
    if (userRole === "ADMIN" || userRole === "ORGANIZER") return true;
    
    // Basic Users see limited options
    const userOnlyLinks = [
      "/dashboard", 
      "/dashboard/notifications", 
      "/dashboard/settings", 
      "/dashboard/invitations",
      "/dashboard/participations",
      "/dashboard/payments"
    ];
    return userOnlyLinks.includes(link.href);
  });

  return (
    <nav className="flex flex-col space-y-1 bg-card border rounded-xl p-4 shadow-sm h-full">
      <div className="mb-4 px-2">
        <h2 className="text-lg font-semibold tracking-tight">Dashboard</h2>
        {userRole && (
          <Badge variant="outline" className="mt-1 text-[10px] uppercase tracking-wider">
            {userRole}
          </Badge>
        )}
      </div>
      {filteredLinks.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;
        
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
              isActive ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground" : "text-muted-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
