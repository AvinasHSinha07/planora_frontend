"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  X,
  Send,
  Loader2,
  Calendar,
  Zap,
  MessageSquareText,
  RotateCcw,
  Info,
  ChevronDown,
  Bot,
  User,
  ArrowDownCircle,
  Ticket
} from "lucide-react";
import { ChatServices, TChatMessage } from "@/lib/chat";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────
type TDisplayMessage = {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: Date;
};

// ── Quick Prompt Chips ─────────────────────────────────────────────────────────
const QUICK_PROMPTS = [
  { text: "🌟 Trending Events", icon: Sparkles },
  { text: "🎟️ Free Experiences", icon: Ticket },
  { text: "📅 Host an Event", icon: Calendar },
  { text: "🚀 Planora Elite", icon: Zap }
];

// ── Greeting ──────────────────────────────────────────────────────────────────
const INITIAL_MESSAGE: TDisplayMessage = {
  id: "init",
  role: "model",
  content:
    "Welcome to **Planora**. I am your dedicated AI Concierge. I am synchronized with our latest events and community data to help you discover elite experiences. How may I elevate your journey today?",
  timestamp: new Date(),
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const renderMarkdown = (text: string) => {
  let html = text.replace(/\*\*(.*?)\*\*/g, "<strong class='font-bold text-primary'>$1</strong>");
  html = html.replace(/\n/g, "<br />");
  return html;
};

const formatTime = (date: Date) =>
  date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const toApiHistory = (msgs: TDisplayMessage[]): TChatMessage[] =>
  msgs.slice(1).map((m) => ({ role: m.role, parts: m.content }));

// ── Main Component ─────────────────────────────────────────────────────────────
export default function PlanoraBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<TDisplayMessage[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [isNearBottom, setIsNearBottom] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    if (scrollContainerRef.current) {
      const { scrollHeight, clientHeight } = scrollContainerRef.current;
      scrollContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior
      });
    }
  }, []);

  // Handle scrolling and "New Message" indicator
  useEffect(() => {
    if (isNearBottom) {
      const timer = setTimeout(() => scrollToBottom(), 100);
      return () => clearTimeout(timer);
    }
  }, [messages, isNearBottom, scrollToBottom]);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 150;
    setIsNearBottom(isAtBottom);
  };

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => {
        inputRef.current?.focus();
        scrollToBottom("auto");
      }, 100);
    }
  }, [isOpen, scrollToBottom]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMsg: TDisplayMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: text.trim(),
        timestamp: new Date(),
      };

      const apiHistory = toApiHistory(messages);
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsLoading(true);
      setIsNearBottom(true);

      try {
        const result = await ChatServices.sendMessage(text.trim(), apiHistory);
        const botMsg: TDisplayMessage = {
          id: `model-${Date.now()}`,
          role: "model",
          content: result.reply,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMsg]);
      } catch (err) {
        console.error("[PlanoraBot] Error:", err);
        toast.error("Concierge offline. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleReset = () => {
    setMessages([{ ...INITIAL_MESSAGE, timestamp: new Date() }]);
    setInput("");
  };

  return (
    <>
      {/* ── Trigger Button ── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 pointer-events-none">
        <AnimatePresence>
          {!isOpen && hasUnread && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="hidden md:flex items-center gap-3 bg-background/80 backdrop-blur-2xl border border-primary/20 shadow-[0_20px_50px_rgba(0,0,0,0.2)] px-6 py-4 rounded-[2rem] pointer-events-auto"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary animate-pulse">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Concierge</p>
                <p className="text-[14px] font-bold text-foreground">Need event assistance?</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full hover:bg-muted"
                onClick={(e) => {
                  e.stopPropagation();
                  setHasUnread(false);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05, rotate: isOpen ? 90 : 0 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen((v) => !v)}
          className={cn(
            "pointer-events-auto relative w-16 h-16 rounded-[2rem] flex items-center justify-center transition-all duration-500 shadow-[0_15px_35px_rgba(0,0,0,0.2)]",
            isOpen 
              ? "bg-foreground text-background" 
              : "bg-primary text-white"
          )}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div key="close" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }}>
                <X className="h-8 w-8" />
              </motion.div>
            ) : (
              <motion.div key="open" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
                <MessageSquareText className="h-8 w-8" />
              </motion.div>
            )}
          </AnimatePresence>
          
          {hasUnread && !isOpen && (
            <span className="absolute -top-1 -right-1 flex h-6 w-6">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-6 w-6 bg-primary border-4 border-background flex items-center justify-center text-[10px] font-bold">1</span>
            </span>
          )}
        </motion.button>
      </div>

      {/* ── Chat Panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9, filter: "blur(20px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 100, scale: 0.9, filter: "blur(20px)" }}
            className="fixed bottom-28 right-6 z-50 w-[min(480px,calc(100vw-32px))] flex flex-col rounded-[3rem] overflow-hidden bg-background/95 backdrop-blur-3xl border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] ring-1 ring-white/20"
            style={{ height: "min(720px, calc(100vh - 160px))" }}
          >
            {/* Header */}
            <div className="relative p-8 flex-shrink-0 border-b border-white/5 bg-gradient-to-b from-primary/5 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl rotate-3">
                      <Bot className="h-8 w-8" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-background" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black tracking-tight text-foreground">PlanoraBot</h3>
                    <div className="flex items-center gap-1.5">
                      <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Online Concierge</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-muted/50 rounded-2xl p-1">
                  <Button variant="ghost" size="icon" onClick={handleReset} className="h-10 w-10 rounded-xl hover:bg-background text-muted-foreground hover:text-primary">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-10 w-10 rounded-xl hover:bg-background text-muted-foreground">
                    <ChevronDown className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollContainerRef}
              onScroll={handleScroll}
              data-lenis-prevent
              className="flex-1 overflow-y-auto px-6 py-8 space-y-10 scroll-smooth"
            >
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={cn(
                      "flex gap-4",
                      msg.role === "user" ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <div className={cn(
                      "h-10 w-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-sm",
                      msg.role === "user" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    )}>
                      {msg.role === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                    </div>

                    <div className={cn(
                      "flex flex-col gap-2 max-w-[80%]",
                      msg.role === "user" ? "items-end" : "items-start"
                    )}>
                      <div className={cn(
                        "px-6 py-4 rounded-[1.5rem] text-[15px] leading-relaxed font-medium shadow-sm transition-all hover:shadow-md",
                        msg.role === "user" 
                          ? "bg-primary text-primary-foreground rounded-tr-none" 
                          : "bg-muted/30 border border-white/5 text-foreground rounded-tl-none"
                      )}>
                        <div 
                          className="prose prose-sm prose-invert max-w-none"
                          dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} 
                        />
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-tighter">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="flex gap-4"
                >
                  <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="bg-muted/30 px-6 py-4 rounded-[1.5rem] rounded-tl-none flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Scroll Indicator */}
            <AnimatePresence>
              {!isNearBottom && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  onClick={() => scrollToBottom()}
                  className="absolute bottom-32 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 text-xs font-bold"
                >
                  <ArrowDownCircle className="h-4 w-4" />
                  New Messages
                </motion.button>
              )}
            </AnimatePresence>

            {/* Input Footer */}
            <div className="p-8 bg-gradient-to-t from-background via-background to-transparent flex-shrink-0 space-y-6">
              {messages.length === 1 && !isLoading && (
                <div className="grid grid-cols-2 gap-3">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt.text}
                      onClick={() => sendMessage(prompt.text)}
                      className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider px-4 py-3 rounded-2xl bg-muted/50 border border-white/5 hover:border-primary/50 hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary group text-left"
                    >
                      <prompt.icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                      {prompt.text}
                    </button>
                  ))}
                </div>
              )}

              <form onSubmit={handleSubmit} className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask your concierge anything..."
                  disabled={isLoading}
                  className="w-full h-16 pl-6 pr-20 bg-muted/50 border border-white/5 rounded-3xl text-[15px] font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/30 disabled:opacity-50"
                />
                <Button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  className="absolute right-2.5 top-2.5 h-11 w-11 rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/30 active:scale-90 transition-transform"
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                </Button>
              </form>

              <div className="flex items-center justify-center gap-2 opacity-20 hover:opacity-50 transition-opacity">
                <Info className="h-3 w-3" />
                <span className="text-[9px] font-black uppercase tracking-widest">Planora Concierge • AI Assisted</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
