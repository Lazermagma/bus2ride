"use client";

import * as React from "react";
import { Code, Copy, Check, Sparkles, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PollEmbedModalProps {
  poll: {
    id: string;
    question: string;
  };
  embedType: "live" | "results";
  isOpen: boolean;
  onClose: () => void;
}

export function PollEmbedModal({ poll, embedType, isOpen, onClose }: PollEmbedModalProps) {
  const [copied, setCopied] = React.useState(false);
  const [origin, setOrigin] = React.useState("https://bus2ride.com");
  
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const embedPath = embedType === "live" 
    ? `/polls/embed/${poll.id}`
    : `/polls/results/embed/${poll.id}`;
  
  const embedCode = `<iframe src="${origin}${embedPath}" width="100%" height="400" frameborder="0" style="border-radius: 12px; max-width: 500px;"></iframe>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const gradient = embedType === "live" 
    ? "from-violet-500 via-purple-500 to-indigo-500"
    : "from-amber-500 via-orange-500 to-yellow-500";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={cn(
        "sm:max-w-2xl border bg-gradient-to-br from-[#0d1d3a] via-[#0a1628] to-[#060e23] p-0 overflow-hidden",
        embedType === "live" ? "border-violet-500/30" : "border-amber-500/30"
      )}>
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-20 pointer-events-none",
          embedType === "live" 
            ? "from-violet-500/20 to-purple-500/10"
            : "from-amber-500/20 to-orange-500/10"
        )} />
        
        <DialogHeader className="relative p-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg",
              embedType === "live" 
                ? "from-violet-500 to-purple-600" 
                : "from-amber-500 to-orange-600"
            )}>
              <Code className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-white mb-1">
                Embed {embedType === "live" ? "Live Poll" : "Poll Results"}
              </DialogTitle>
              <DialogDescription className="text-white/60 text-sm">
                {embedType === "live" 
                  ? "Add interactive voting to your website" 
                  : "Display poll results on your website"}
              </DialogDescription>
            </div>
            <div className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold",
              embedType === "live"
                ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
            )}>
              {embedType === "live" ? "LIVE" : "RESULTS"}
            </div>
          </div>
        </DialogHeader>
        
        <div className="relative p-6 space-y-6">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-white/80 text-sm font-medium mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              Poll Question
            </p>
            <p className="text-white text-base leading-relaxed">{poll.question}</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-white/70 text-sm font-medium">Embed Code</p>
              <button
                onClick={handleCopy}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                  copied
                    ? "bg-green-500/20 text-green-300 border border-green-500/30"
                    : embedType === "live"
                      ? "bg-violet-500/20 text-violet-300 hover:bg-violet-500/30 border border-violet-500/30"
                      : "bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30"
                )}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Code
                  </>
                )}
              </button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-xl" />
              <div className="relative p-4 rounded-xl bg-black/40 border border-white/10 backdrop-blur-sm">
                <code className="text-xs text-emerald-400 break-all leading-relaxed font-mono block select-all">
                  {embedCode}
                </code>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <p className="text-white/50 text-xs mb-1">How to Use</p>
              <p className="text-white text-sm font-medium">Paste into your HTML</p>
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <p className="text-white/50 text-xs mb-1">Responsive</p>
              <p className="text-white text-sm font-medium">Auto-adjusts to screen size</p>
            </div>
          </div>

          <Button
            onClick={handleCopy}
            className={cn(
              "w-full py-3 rounded-xl font-semibold text-base transition-all shadow-lg",
              copied
                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                : `bg-gradient-to-r ${gradient} text-white hover:opacity-90 hover:scale-[1.02]`
            )}
          >
            {copied ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                Code Copied to Clipboard!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5 mr-2" />
                Copy Embed Code
              </>
            )}
          </Button>

          <div className="flex items-center gap-2 text-xs text-white/50 pt-2 border-t border-white/10">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Paste this code into your website's HTML editor</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

