import { useState, useRef, useEffect } from "react";
import { useChatList, useSendChatMessage } from "@/hooks/use-chat";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function ChatAdvisor() {
  const { data: messages, isLoading } = useChatList();
  const sendMessage = useSendChatMessage();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sendMessage.isPending]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sendMessage.isPending) return;
    sendMessage.mutate({ message: input });
    setInput("");
  };

  return (
    <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-4rem)] flex flex-col max-w-4xl mx-auto border border-border/50 rounded-2xl bg-card shadow-xl overflow-hidden">
      
      {/* Header */}
      <div className="p-4 border-b border-border/50 bg-secondary/30 backdrop-blur-md flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center shadow-lg">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-bold tracking-tight">AI Financial Advisor</h2>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Online and ready to help
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-background/30">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <span className="text-muted-foreground animate-pulse flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Syncing neural nets...
            </span>
          </div>
        ) : messages?.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <Bot className="w-16 h-16 text-muted mb-4" />
            <h3 className="text-xl font-bold mb-2">How can I help you grow your wealth?</h3>
            <p className="text-muted-foreground max-w-md">
              Ask me about budgeting strategies, how to allocate your investments, or analyzing your debt. I have access to your uploaded financial context.
            </p>
            <div className="mt-8 flex flex-wrap gap-2 justify-center max-w-lg">
              {["How should I pay off my debt?", "Analyze my spending", "Am I saving enough?"].map(q => (
                <button 
                  key={q} 
                  onClick={() => setInput(q)}
                  className="px-4 py-2 rounded-full bg-secondary text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages?.map((msg, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={msg.id || i} 
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-secondary text-foreground border border-border'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`
                max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed
                ${msg.role === 'user' 
                  ? 'bg-primary text-primary-foreground rounded-tr-none shadow-md shadow-primary/20' 
                  : 'bg-card border border-border rounded-tl-none shadow-sm'}
              `}>
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </motion.div>
          ))
        )}
        
        {sendMessage.isPending && (
          <div className="flex gap-4">
             <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0 border border-border">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-card border border-border rounded-tl-none">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 bg-card border-t border-border/50 shrink-0">
        <div className="relative flex items-center">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your financial question..."
            className="w-full pl-6 pr-14 py-4 rounded-full bg-secondary border border-transparent focus:outline-none focus:bg-background focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all"
          />
          <button 
            type="submit"
            disabled={!input.trim() || sendMessage.isPending}
            className="absolute right-2 p-2.5 rounded-full bg-primary text-white disabled:opacity-50 hover:scale-105 active:scale-95 transition-transform"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
