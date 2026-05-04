"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Calendar, 
  DollarSign, 
  ArrowUpRight, 
  Search, 
  Download,
  Loader2,
  CheckCircle2,
  Clock,
  XCircle,
  Users,
  ShieldCheck,
  Zap
} from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function PaymentsClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: session } = authClient.useSession();
  const userRole = (session?.user as any)?.role || "USER";

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["payments", userRole],
    queryFn: async () => {
      let endpoint = "/payments/my-payments";
      if (userRole === "ORGANIZER") endpoint = "/payments/organizer-payments";
      if (userRole === "ADMIN") endpoint = "/payments/all-payments";
      
      const { data } = await axiosInstance.get(endpoint);
      return data.data;
    },
  });

  const filteredPayments = payments.filter((p: any) => 
    p.event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.stripeSessionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAmount = payments.reduce((acc: number, p: any) => acc + p.amount, 0);

  const exportToCSV = () => {
    const headers = ["Event", "Category", "Date", "Amount", "Status", "Payer", "Transaction ID"];
    const rows = filteredPayments.map((p: any) => [
      p.event.title,
      p.event.category?.name || "N/A",
      format(new Date(p.createdAt), "yyyy-MM-dd"),
      p.amount.toFixed(2),
      p.status,
      p.user?.name || "Self",
      p.stripeSessionId
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row: any) => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `planora_${userRole.toLowerCase()}_payments_${format(new Date(), "yyyy_MM_dd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20 gap-1.5 px-3 py-1 rounded-full font-bold uppercase tracking-wider text-[10px]">
            <CheckCircle2 className="w-3 h-3" />
            Succeeded
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20 gap-1.5 px-3 py-1 rounded-full font-bold uppercase tracking-wider text-[10px]">
            <Clock className="w-3 h-3" />
            Pending
          </Badge>
        );
      default:
        return (
          <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20 gap-1.5 px-3 py-1 rounded-full font-bold uppercase tracking-wider text-[10px]">
            <XCircle className="w-3 h-3" />
            Failed
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const statConfig = {
    USER: { title: "Total Spending", icon: DollarSign, color: "bg-primary" },
    ORGANIZER: { title: "Total Revenue", icon: Zap, color: "bg-emerald-500" },
    ADMIN: { title: "Global Volume", icon: ShieldCheck, color: "bg-purple-500" },
  }[userRole as "USER" | "ORGANIZER" | "ADMIN"] || { title: "Total Volume", icon: DollarSign, color: "bg-primary" };

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-3">
         <Card className={`rounded-[2.5rem] border-none ${statConfig.color} text-white shadow-2xl overflow-hidden relative group`}>
            <CardContent className="p-8">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
                  <statConfig.icon className="w-32 h-32" />
               </div>
               <p className="text-sm font-black uppercase tracking-widest opacity-80">{statConfig.title}</p>
               <h3 className="text-5xl font-black mt-2">${totalAmount.toFixed(2)}</h3>
               <p className="text-xs mt-4 font-bold opacity-60 italic">Calculated across {payments.length} events</p>
            </CardContent>
         </Card>

         <Card className="rounded-[2.5rem] border-border/40 shadow-xl bg-card/50 backdrop-blur-xl relative overflow-hidden group">
            <CardContent className="p-8">
               <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6">
                  <Users className="w-6 h-6" />
               </div>
               <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                  {userRole === "USER" ? "Invitations Received" : "Total Participants"}
               </p>
               <h3 className="text-3xl font-black mt-1">
                  {userRole === "USER" ? "12" : payments.length}
               </h3>
               <p className="text-xs mt-2 text-muted-foreground font-medium italic">Active engagement metrics</p>
            </CardContent>
         </Card>

         <Card className="rounded-[2.5rem] border-border/40 shadow-xl bg-card/50 backdrop-blur-xl relative overflow-hidden group">
            <CardContent className="p-8">
               <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-6">
                  <ArrowUpRight className="w-6 h-6" />
               </div>
               <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">Latest Transaction</p>
               <h3 className="text-2xl font-black mt-1 truncate max-w-full italic text-primary">
                  {payments[0]?.event.title || "No data available"}
               </h3>
               <p className="text-xs mt-2 text-muted-foreground font-medium italic">
                  {payments[0] ? format(new Date(payments[0].createdAt), "MMMM do, yyyy") : "Start interacting now"}
               </p>
            </CardContent>
         </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card/30 backdrop-blur-md p-4 rounded-3xl border shadow-sm">
         <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
               placeholder={userRole === "USER" ? "Search by event..." : "Search by event or customer name..."}
               className="pl-12 rounded-2xl bg-background/50 border-none h-12 focus-visible:ring-primary/30"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <Button 
            variant="outline" 
            className="rounded-2xl gap-2 h-12 px-6 font-bold border-primary/20 hover:bg-primary/5 transition-all"
            onClick={exportToCSV}
            disabled={filteredPayments.length === 0}
         >
            <Download className="w-4 h-4" />
            Export Audit Log
         </Button>
      </div>

      {/* Table */}
      <Card className="rounded-[3rem] overflow-hidden border-border/40 shadow-2xl bg-card">
         <CardHeader className="border-b bg-muted/30 px-8 py-6">
            <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-3 italic">
               <CreditCard className="w-5 h-5 text-primary" />
               {userRole === "USER" ? "Purchase History" : "Revenue Streams"}
            </CardTitle>
         </CardHeader>
         <CardContent className="p-0">
            <Table>
               <TableHeader>
                  <TableRow className="hover:bg-transparent border-none">
                     <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Event & Category</TableHead>
                     {(userRole === "ORGANIZER" || userRole === "ADMIN") && (
                        <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Customer</TableHead>
                     )}
                     <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date</TableHead>
                     <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Amount</TableHead>
                     <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Status</TableHead>
                     <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Reference</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {filteredPayments.map((p: any) => (
                     <TableRow key={p.id} className="group hover:bg-muted/30 transition-colors border-border/20">
                        <TableCell className="px-8 py-6">
                           <div className="flex items-center gap-4">
                              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black uppercase">
                                 {p.event.title.charAt(0)}
                              </div>
                              <div>
                                 <p className="font-bold text-lg tracking-tight group-hover:text-primary transition-colors line-clamp-1">{p.event.title}</p>
                                 <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{p.event.category?.name}</p>
                              </div>
                           </div>
                        </TableCell>
                        
                        {(userRole === "ORGANIZER" || userRole === "ADMIN") && (
                           <TableCell className="py-6">
                              <div className="flex items-center gap-3">
                                 <Avatar className="w-8 h-8 border">
                                    <AvatarImage src={p.user?.image || p.user?.avatar} />
                                    <AvatarFallback>{p.user?.name?.charAt(0) || "U"}</AvatarFallback>
                                 </Avatar>
                                 <div>
                                    <p className="text-sm font-bold tracking-tight">{p.user?.name || "Private User"}</p>
                                    <p className="text-[10px] text-muted-foreground">{p.user?.email}</p>
                                 </div>
                              </div>
                           </TableCell>
                        )}

                        <TableCell className="py-6">
                           <div className="flex items-center gap-2 text-muted-foreground font-bold text-xs italic">
                              <Calendar className="w-3 h-3" />
                              {format(new Date(p.createdAt), "MMM d, yyyy")}
                           </div>
                        </TableCell>
                        <TableCell className="py-6 text-center font-black text-lg">
                           ${p.amount.toFixed(2)}
                        </TableCell>
                        <TableCell className="py-6 text-center">
                           {getStatusBadge(p.status)}
                        </TableCell>
                        <TableCell className="px-8 py-6 text-right">
                           <code className="text-[10px] bg-muted px-2 py-1 rounded-md text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors font-mono">
                              {p.stripeSessionId?.substring(0, 16)}...
                           </code>
                        </TableCell>
                     </TableRow>
                  ))}
                  {filteredPayments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={userRole === "USER" ? 5 : 6} className="h-48 text-center text-muted-foreground italic">
                        No financial records found in this vault.
                      </TableCell>
                    </TableRow>
                  )}
               </TableBody>
            </Table>
         </CardContent>
      </Card>
    </div>
  );
}
