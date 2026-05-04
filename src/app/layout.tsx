import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import QueryProvider from "@/providers/QueryProvider";
import LenisProvider from "@/providers/LenisProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import PlanoraBot from "@/components/shared/PlanoraBot";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Planora - Premium Event Management",
  description: "A modern platform to discover, manage, and create stunning events.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("antialiased", "font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <body className="flex flex-col font-sans min-h-screen" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <LenisProvider>
              {children}
            </LenisProvider>
            <Toaster position="top-center" richColors />
            <PlanoraBot />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
