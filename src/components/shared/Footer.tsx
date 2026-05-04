"use client";

import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { label: "Discover Events", href: "/events" },
      { label: "Create Event", href: "/dashboard/events" },
      { label: "Pricing", href: "/pricing" },
      { label: "Features", href: "/features" },
    ],
    company: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
    ],
    resources: [
      { label: "Help Center", href: "/help" },
      { label: "Community", href: "/community" },
      { label: "Organizer Guide", href: "/guide" },
      { label: "API Reference", href: "/api-docs" },
    ],
  };

  return (
    <footer className="relative bg-background border-t overflow-hidden">
      {/* Subtle Background Decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-pink/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-yellow/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="text-2xl font-black tracking-tighter flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-pink to-brand-yellow" />
              <span>PLANORA</span>
            </Link>
            <p className="text-muted-foreground max-w-sm leading-relaxed text-sm">
              Empowering creators and organizers to build stunning, memorable experiences. 
              The premium choice for professional event management.
            </p>
            <div className="flex items-center gap-4">
              {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, i) => (
                <Link 
                  key={i} 
                  href="#" 
                  className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all hover:scale-110"
                >
                  <Icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div className="space-y-6">
            <h4 className="font-bold uppercase tracking-widest text-[10px] text-muted-foreground/80">Platform</h4>
            <ul className="space-y-4">
              {footerLinks.platform.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-bold uppercase tracking-widest text-[10px] text-muted-foreground/80">Company</h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="lg:col-span-1 space-y-6">
            <h4 className="font-bold uppercase tracking-widest text-[10px] text-muted-foreground/80">Stay Updated</h4>
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground leading-relaxed">Subscribe for event tips and curated event news.</p>
              <div className="relative group">
                <Input 
                  placeholder="Email address" 
                  className="rounded-xl pr-12 bg-muted/50 border-border/50 focus:border-primary/50 transition-all h-10 text-xs"
                />
                <Button 
                  size="icon" 
                  className="absolute right-1 top-1 h-8 w-8 rounded-lg bg-primary hover:bg-primary/90"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-muted-foreground font-medium">
            © {currentYear} Planora Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            <Link href="/privacy" className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium">
              Terms of Service
            </Link>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Operational
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
