"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GetQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  source?: string;
}

export function GetQuoteModal({ isOpen, onClose, source }: GetQuoteModalProps) {
  const [chatReady, setChatReady] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const showChat = () => {
        const container = document.getElementById("chat-widget-container");
        if (container) {
          container.style.cssText = `
            display: block !important;
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            margin-top: 1.75rem !important;
            right: auto !important;
            bottom: auto !important;
            z-index: 99999 !important;
            max-width: 500px !important;
            max-height: 700px !important;
            width: calc(100% - 32px) !important;
            height: 85vh !important;
            border-radius: 16px !important;
            overflow: hidden !important;
           
            pointer-events: auto !important;
          `;
          
          // Also ensure all child elements can receive pointer events
          const iframes = container.querySelectorAll('iframe');
          iframes.forEach((iframe) => {
            if (iframe instanceof HTMLIFrameElement) {
              iframe.style.pointerEvents = 'auto';
            }
          });
        }
        
        // Set custom variables
        if (window.LC_API && typeof window.LC_API.set_custom_variables === "function") {
          try {
            window.LC_API.set_custom_variables([
              { name: "Source", value: source || "Get Quote Modal" },
              { name: "Page", value: typeof window !== "undefined" ? window.location.pathname : "/" },
            ]);
          } catch (e) {
            console.warn("LiveChat: Could not set custom variables", e);
          }
        } else if (window.LiveChatWidget && typeof window.LiveChatWidget.call === "function") {
          try {
            window.LiveChatWidget.call('set_custom_variables', [
              { name: "Source", value: source || "Get Quote Modal" },
              { name: "Page", value: typeof window !== "undefined" ? window.location.pathname : "/" },
            ]);
          } catch (e) {
            console.warn("LiveChat: Could not set custom variables", e);
          }
        }
        
        if (window.LC_API && typeof window.LC_API.open_chat_window === "function") {
          window.LC_API.open_chat_window();
        }
      };

      // Wait for LiveChat to be ready
      const checkReady = () => {
        if (window.LC_API || window.LiveChatWidget) {
          setChatReady(true);
          
          if (chatReady) {
            setTimeout(showChat, 50);
          } else {
            setTimeout(showChat, 500);
          }
        } else {
          setTimeout(checkReady, 100);
        }
      };
      
      checkReady();
    } else {
      // Hide chat when modal closes
      if (window.LC_API && typeof window.LC_API.hide_chat_window === "function") {
        try {
          window.LC_API.hide_chat_window();
        } catch (e) {
          // Ignore errors
        }
      }
      
      const container = document.getElementById("chat-widget-container");
      if (container) {
        container.style.cssText = "display: none !important;";
      }
    }
  }, [isOpen, source, chatReady]);

  // Add custom overlay styles with blur
  useEffect(() => {
    if (isOpen) {
      const overlayStyleId = "get-quote-modal-overlay-styles";
      let overlayStyle = document.getElementById(overlayStyleId) as HTMLStyleElement;
      
      if (!overlayStyle) {
        overlayStyle = document.createElement("style");
        overlayStyle.id = overlayStyleId;
        document.head.appendChild(overlayStyle);
      }
      overlayStyle.textContent = `
        [data-slot="dialog-overlay"] {
          background-color: rgba(0, 0, 0, 0.6) !important;
          backdrop-filter: blur(8px) !important;
          -webkit-backdrop-filter: blur(8px) !important;
          z-index: 99998 !important;
        }
        [data-slot="dialog-content"] {
          z-index: 99998 !important;
          pointer-events: none !important;
        }
        #chat-widget-container {
          pointer-events: auto !important;
        }
        #chat-widget-container * {
          pointer-events: auto !important;
        }
      `;
    }
  }, [isOpen]);

  // Hide original chat button when modal is open
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const styleId = "get-quote-hide-style";
    let style = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!style) {
      style = document.createElement("style");
      style.id = styleId;
      document.head.appendChild(style);
    }
    
    style.textContent = `
      #chat-widget-container iframe[data-test-id="widget-button"] {
        display: none !important;
      }
      #chat-widget-minimized {
        display: none !important;
      }
      #chat-widget-container {
        pointer-events: auto !important;
      }
      #chat-widget-container * {
        pointer-events: auto !important;
      }
      #chat-widget-container iframe {
        pointer-events: auto !important;
      }
    `;

    return () => {
      // Keep the style for hiding the button
    };
  }, []);

  // Handle escape key and body overflow
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className="max-w-2xl w-full h-[85vh]   p-0 bg-gradient-to-br from-[#0f1f45] via-[#0a1733] to-[#060e23]  flex flex-col "
        showCloseButton={false}
        style={{ pointerEvents: 'none' }}
      >
        <DialogHeader className="px-6 pt-6 mb-6 pb-8  flex-shrink-0 relative z-10" style={{ pointerEvents: 'auto' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 via-red-500 to-orange-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-white">
                  Get Your Quote
                </DialogTitle>
                <p className="text-white/60 text-sm mt-0.5">
                  Chat with our team for a personalized quote
                </p>
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-white/10 text-white/70 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex-1 relative overflow-hidden min-h-0 flex items-center justify-center mt-6">
          {!chatReady && (
            <div className="absolute inset-0  flex items-center justify-center z-9 ">
              <div className="text-center space-y-4">
                <div className="animate-spin w-8 h-8  rounded-full mx-auto" />
                <p className="text-white/70 text-sm">Loading chat...</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

