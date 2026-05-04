"use client";

import { useState } from "react";
import { MessageSquare, X } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card";
import { Input } from "../ui/input";
import axiosInstance from "@/lib/axiosInstance";

export default function PlanoraBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!query) return;
    setIsLoading(true);
    setResponse("");
    try {
      const { data } = await axiosInstance.post("/ai/recommend", { preferences: query });
      setResponse(data.data.recommendations || "Here are some recommendations...");
    } catch (e) {
      setResponse("Sorry, I couldn't fetch recommendations right now.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button 
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl p-0"
        onClick={() => setIsOpen(true)}
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-80 shadow-2xl z-50 flex flex-col border-primary/20">
      <CardHeader className="p-4 bg-primary text-primary-foreground rounded-t-xl flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <MessageSquare className="h-4 w-4" /> Planora AI Assistant
        </CardTitle>
        <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-primary-foreground/20 rounded-full" onClick={() => setIsOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-4 flex-1 h-64 overflow-y-auto bg-muted/10 text-sm">
        <div className="bg-muted p-3 rounded-lg mb-4 rounded-tl-none">
          Hi! Tell me what kind of events you like, and I'll suggest some categories and themes.
        </div>
        {query && response && (
           <div className="bg-primary/10 text-primary p-3 rounded-lg mb-4 rounded-tr-none ml-6">
             {query}
           </div>
        )}
        {isLoading && <div className="text-muted-foreground text-xs animate-pulse">Thinking...</div>}
        {response && (
          <div className="bg-muted p-3 rounded-lg mb-4 rounded-tl-none">
            {response}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-3 bg-background border-t">
        <form 
          className="flex w-full gap-2"
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        >
          <Input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="E.g. I love tech startups..." 
            className="flex-1 h-8 text-sm"
          />
          <Button type="submit" size="sm" className="h-8">Send</Button>
        </form>
      </CardFooter>
    </Card>
  );
}
