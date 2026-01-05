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
  const [origin, setOrigin] = React.useState<string | null>(null);
  const [mounted, setMounted] = React.useState(false);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  
  React.useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  // Listen for height messages from iframe
  React.useEffect(() => {
    if (!mounted || !iframeRef.current) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'poll-embed-height' && iframeRef.current) {
        iframeRef.current.style.height = `${event.data.height}px`;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [mounted]);

  const embedPath = embedType === "live" 
    ? `/polls/embed/${poll.id}`
    : `/polls/results/embed/${poll.id}`;
  
  const embedCode = origin 
    ? `<iframe id="poll-embed-${poll.id}" src="${origin}${embedPath}" width="100%" height="400" frameborder="0" style="border-radius: 12px; max-width: 500px; min-height: 300px; border: none; display: block;" scrolling="no"></iframe>
<script>
(function() {
  var iframe = document.getElementById('poll-embed-${poll.id}');
  if (!iframe) return;
  function updateHeight() {
    window.addEventListener('message', function(e) {
      if (e.data && e.data.type === 'poll-embed-height') {
        iframe.style.height = e.data.height + 'px';
      }
    });
  }
  iframe.addEventListener('load', updateHeight);
  updateHeight();
})();
</script>`
    : "";

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
        "w-[95vw] sm:w-[90vw] md:w-[85vw] lg:max-w-3xl max-w-none border bg-gradient-to-br from-[#0d1d3a] via-[#0a1628] to-[#060e23] p-0 overflow-hidden",
        embedType === "live" ? "border-violet-500/30" : "border-amber-500/30"
      )}>
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-20 pointer-events-none",
          embedType === "live" 
            ? "from-violet-500/20 to-purple-500/10"
            : "from-amber-500/20 to-orange-500/10"
        )} />
        
        <DialogHeader className="relative p-4 sm:p-6 pb-4 border-b border-white/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className={cn(
              "w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg flex-shrink-0",
              embedType === "live" 
                ? "from-violet-500 to-purple-600" 
                : "from-amber-500 to-orange-600"
            )}>
              <Code className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl sm:text-2xl font-bold text-white mb-1">
                Embed {embedType === "live" ? "Live Poll" : "Poll Results"}
              </DialogTitle>
              <DialogDescription className="text-white/60 text-sm">
                {embedType === "live" 
                  ? "Add interactive voting to your website" 
                  : "Display poll results on your website"}
              </DialogDescription>
            </div>
            <div className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold flex-shrink-0",
              embedType === "live"
                ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
            )}>
              {embedType === "live" ? "LIVE" : "RESULTS"}
            </div>
          </div>
        </DialogHeader>
        
        <div className="relative p-4 sm:p-6 space-y-4 sm:space-y-6 max-h-[85vh] overflow-y-auto">
          <div className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-white/80 text-sm font-medium mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400 flex-shrink-0" />
              Poll Question
            </p>
            <p className="text-white text-sm sm:text-base leading-relaxed break-words">{poll.question}</p>
          </div>
          
          {/* Preview Section */}
          {mounted && origin && (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <p className="text-white/70 text-sm font-medium">Preview</p>
                <span className="text-xs text-white/40">What visitors will see</span>
              </div>
              <div className="relative rounded-xl border-2 border-dashed border-white/20 bg-gradient-to-br from-white/5 to-white/[0.02] p-2 sm:p-4 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_70%)]" />
                <div className="relative w-full flex justify-center">
                  <div className="w-full" style={{ maxWidth: "500px", margin: "0 auto" }}>
                    <iframe
                      ref={iframeRef}
                      src={`${origin}${embedPath}`}
                      className="w-full rounded-lg border border-white/10 bg-transparent"
                      style={{ 
                        minHeight: "300px",
                        border: "none",
                        display: "block"
                      }}
                      title="Embed Preview"
                      loading="lazy"
                      allow="clipboard-write"
                      scrolling="no"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {!mounted && (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <p className="text-white/70 text-sm font-medium">Preview</p>
                <span className="text-xs text-white/40">What visitors will see</span>
              </div>
              <div className="relative rounded-xl border-2 border-dashed border-white/20 bg-gradient-to-br from-white/5 to-white/[0.02] p-2 sm:p-4 overflow-hidden">
                <div className="w-full flex justify-center" style={{ maxWidth: "500px", margin: "0 auto", minHeight: "300px" }}>
                  <div className="w-full flex items-center justify-center bg-white/5 rounded-lg">
                    <p className="text-white/40 text-sm">Loading preview...</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {origin && (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <p className="text-white/70 text-sm font-medium">Embed Code</p>
                <button
                  onClick={handleCopy}
                  className={cn(
                    "flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all w-full sm:w-auto",
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
                <div className="relative p-3 sm:p-4 rounded-xl bg-black/40 border border-white/10 backdrop-blur-sm overflow-x-auto">
                  <code className="text-[10px] sm:text-xs text-emerald-400 break-all leading-relaxed font-mono block select-all whitespace-pre-wrap">
                    {embedCode}
                  </code>
                </div>
              </div>
            </div>
          )}
          
          {!origin && (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <p className="text-white/70 text-sm font-medium">Embed Code</p>
              </div>
              <div className="relative">
                <div className="relative p-3 sm:p-4 rounded-xl bg-black/40 border border-white/10 backdrop-blur-sm">
                  <div className="text-xs text-white/40">Loading embed code...</div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-white/10">
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <p className="text-white/50 text-xs mb-1">How to Use</p>
              <p className="text-white text-sm font-medium">Paste into your HTML</p>
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <p className="text-white/50 text-xs mb-1">Responsive</p>
              <p className="text-white text-sm font-medium">Auto-adjusts to screen size</p>
            </div>
          </div>

          {origin && (
            <Button
              onClick={handleCopy}
              disabled={!origin}
              className={cn(
                "w-full py-3 rounded-xl font-semibold text-sm sm:text-base transition-all shadow-lg",
                copied
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                  : `bg-gradient-to-r ${gradient} text-white hover:opacity-90 hover:scale-[1.02]`,
                !origin && "opacity-50 cursor-not-allowed"
              )}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Code Copied to Clipboard!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Copy Embed Code
                </>
              )}
            </Button>
          )}

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs text-white/50 pt-2 border-t border-white/10">
            <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="break-words">Paste this code into your website's HTML editor</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

