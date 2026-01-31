import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Chat() {
  const { profile } = useAuth();
  const displayName = profile?.full_name ?? "there";
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hello ${displayName}! I'm your Propied AI assistant. Ask me about property prices, recent listings, or market trends.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const conversationIdRef = useRef<number | null>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Create conversation on mount if not exists (simplified for MVP)
  useEffect(() => {
    const initChat = async () => {
       try {
         const res = await fetch("/api/conversations", { 
           method: "POST", 
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({ title: "New Chat" }) 
         });
         const data = await res.json();
         conversationIdRef.current = data.id;
       } catch (e) {
         console.error("Failed to init chat", e);
       }
    };
    initChat();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !conversationIdRef.current) return;

    const userMessage = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      // Connect to SSE endpoint
      const response = await fetch(`/api/conversations/${conversationIdRef.current}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: userMessage }),
      });

      if (!response.ok) throw new Error("Failed to send");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      // Optimistically add empty assistant message
      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { value, done } = await reader!.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
        
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                assistantMessage += data.content;
                // Update the last message
                setMessages(prev => {
                  const newMsgs = [...prev];
                  newMsgs[newMsgs.length - 1] = { role: "assistant", content: assistantMessage };
                  return newMsgs;
                });
              }
            } catch (e) {
              // ignore parse errors for non-json chunks
            }
          }
        }
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I encountered an error processing your request." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-theme(spacing.24))] flex flex-col bg-card rounded-2xl border border-border shadow-sm overflow-hidden animate-in fade-in duration-500">
      <div className="p-4 border-b border-border bg-muted/30">
        <h2 className="font-display font-bold text-lg flex items-center gap-2">
          <Bot className="h-5 w-5 text-accent" />
          AI Assistant
        </h2>
        <p className="text-xs text-muted-foreground">Powered by internal data context</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={cn("flex gap-3 max-w-[80%]", m.role === "user" ? "ml-auto flex-row-reverse" : "")}>
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
              m.role === "user" ? "bg-primary text-primary-foreground" : "bg-accent/10 text-accent"
            )}>
              {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>
            <div className={cn(
              "p-4 rounded-2xl text-sm leading-relaxed",
              m.role === "user" 
                ? "bg-primary text-primary-foreground rounded-tr-none" 
                : "bg-muted text-foreground rounded-tl-none"
            )}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 max-w-[80%]">
             <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center">
               <Bot className="h-4 w-4 animate-pulse" />
             </div>
             <div className="bg-muted p-4 rounded-2xl rounded-tl-none">
               <div className="flex gap-1">
                 <span className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce"></span>
                 <span className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce delay-100"></span>
                 <span className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce delay-200"></span>
               </div>
             </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-background border-t border-border">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Ask about properties..." 
            className="rounded-xl flex-1 border-input bg-secondary/50 focus:bg-background transition-colors"
          />
          <Button type="submit" disabled={isLoading || !input.trim()} size="icon" className="rounded-xl bg-primary text-primary-foreground">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
