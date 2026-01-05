"use client";

import { useEffect, useState, useCallback } from "react";
import { X } from "lucide-react";

interface LiveChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  source?: string;
  page?: string;
}

export function LiveChatModal({ isOpen, onClose, source, page }: LiveChatModalProps) {
  const [chatReady, setChatReady] = useState(false);

  const openModal = useCallback(() => {
    const showChat = () => {
      const container = document.getElementById("chat-widget-container");
      if (container) {
        container.style.cssText = `
          display: block !important;
          position: fixed !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;
          right: auto !important;
          bottom: auto !important;
          z-index: 99999 !important;
          max-width: 400px !important;
          max-height: 600px !important;
          width: calc(100% - 32px) !important;
          height: 80vh !important;
          border-radius: 16px !important;
          overflow: hidden !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
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
            { name: "Source", value: source || "Website" },
            { name: "Page", value: page || (typeof window !== "undefined" ? window.location.pathname : "/") },
          ]);
        } catch (e) {
          console.warn("LiveChat: Could not set custom variables", e);
        }
      } else if (window.LiveChatWidget && typeof window.LiveChatWidget.call === "function") {
        try {
          window.LiveChatWidget.call('set_custom_variables', [
            { name: "Source", value: source || "Website" },
            { name: "Page", value: page || (typeof window !== "undefined" ? window.location.pathname : "/") },
          ]);
        } catch (e) {
          console.warn("LiveChat: Could not set custom variables", e);
        }
      }
      
      if (window.LC_API && typeof window.LC_API.open_chat_window === "function") {
        window.LC_API.open_chat_window();
      }
    };

    if (chatReady) {
      setTimeout(showChat, 50);
    } else {
      setTimeout(showChat, 500);
    }
  }, [chatReady, source, page]);

  const closeModal = useCallback(() => {
    if (window.LC_API && typeof window.LC_API.hide_chat_window === "function") {
      window.LC_API.hide_chat_window();
    }
    const container = document.getElementById("chat-widget-container");
    if (container) {
      container.style.cssText = "display: none !important;";
    }
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      openModal();
    }
  }, [isOpen, openModal]);

  useEffect(() => {
    // Wait for LiveChat to be ready
    const checkReady = () => {
      if (window.LC_API) {
        window.__lc_ready = true;
        setChatReady(true);
        
        if (typeof window.LC_API.hide_chat_window === "function") {
          window.LC_API.hide_chat_window();
        }
        
        const container = document.getElementById("chat-widget-container");
        if (container) {
          container.style.cssText = "display: none !important;";
        }
        
        window.__lc_ready_callbacks?.forEach(cb => cb());
        window.__lc_ready_callbacks = [];
      } else {
        setTimeout(checkReady, 100);
      }
    };
    
    checkReady();
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeModal();
      }
    };
    
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
      const container = document.getElementById("chat-widget-container");
      if (container) {
        container.classList.add("lc-modal-active");
      }
    } else {
      const container = document.getElementById("chat-widget-container");
      if (container) {
        container.classList.remove("lc-modal-active");
      }
      document.body.style.overflow = "";
    }
    
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeModal]);

  // Hide original chat button
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const styleId = "livechat-hide-style";
    let style = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!style) {
      style = document.createElement("style");
      style.id = styleId;
      document.head.appendChild(style);
    }
    
    style.textContent = `
      #chat-widget-container:not(.lc-modal-active) {
        display: none !important;
      }
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

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[10000] flex items-center justify-center"
      onClick={closeModal}
      style={{ pointerEvents: 'auto' }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" style={{ pointerEvents: 'auto' }} />
      <button
        onClick={(e) => {
          e.stopPropagation();
          closeModal();
        }}
        className="absolute top-4 right-4 z-[10002] p-2 rounded-full bg-white/10 hover:bg-white/20 
          text-white transition-colors border border-white/20"
        aria-label="Close chat"
      >
        <X className="w-6 h-6" />
      </button>
      
      {!chatReady && (
        <div 
          className="relative z-[10001] w-full max-w-[400px] h-[80vh] max-h-[600px] mx-4 
            bg-gradient-to-br from-[#0f1f45] via-[#0a1733] to-[#060e23] rounded-2xl flex flex-col items-center justify-center gap-4 border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
          <p className="text-white/70 font-medium">Loading chat...</p>
        </div>
      )}
    </div>
  );
}
