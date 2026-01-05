declare global {
  interface Window {
    LC_API?: {
      open_chat_window: () => void;
      minimize_chat_window: () => void;
      hide_chat_window: () => void;
      set_custom_variables: (vars: Array<{ name: string; value: string }>) => void;
    };
    __lc?: {
      license: number;
      group?: number;
      integration_name?: string;
      product_name?: string;
      asyncInit?: boolean;
    };
    LiveChatWidget?: {
      _q: any[];
      _h: any;
      _v: string;
      on: (...args: any[]) => void;
      once: (...args: any[]) => void;
      off: (...args: any[]) => void;
      get: (...args: any[]) => any;
      call: (...args: any[]) => void;
      init: () => void;
    };
    __lc_ready?: boolean;
    __lc_ready_callbacks?: Array<() => void>;
    __lc_open_modal?: () => void;
    __lc_close_modal?: () => void;
    __lc_open_modal_callback?: (source?: string, page?: string) => void;
    __lc_open_get_quote_modal?: (source?: string) => void;
  }
}

// Open LiveChat in a centered modal
export function openLiveChatModal(source?: string, page?: string) {
  if (typeof window === "undefined") return;
  
  // Trigger the modal callback if it exists
  if (window.__lc_open_modal_callback) {
    window.__lc_open_modal_callback(source, page);
  }
}

// Open Get Quote modal (separate from LiveChat)
export function openGetQuoteModal(source?: string) {
  if (typeof window === "undefined") return;
  
  // Trigger the Get Quote modal callback if it exists
  if (window.__lc_open_get_quote_modal) {
    window.__lc_open_get_quote_modal(source);
  }
}

// Directly open LiveChat (for original button)
export function openLiveChat(source?: string, page?: string) {
  if (typeof window === "undefined") return;

  const doOpen = () => {
    // Set custom variables if LC_API is available
    if (window.LC_API) {
      if ((source || page) && typeof window.LC_API.set_custom_variables === "function") {
        try {
          window.LC_API.set_custom_variables([
            { name: "Source", value: source || "Website" },
            { name: "Page", value: page || window.location.pathname },
          ]);
        } catch (e) {
          console.warn("LiveChat: Could not set custom variables", e);
        }
      }
      
      // Open chat window using LC_API
      if (typeof window.LC_API.open_chat_window === "function") {
        try {
          window.LC_API.open_chat_window();
          return;
        } catch (e) {
          console.warn("LiveChat: Could not open chat window via LC_API", e);
        }
      }
    }
    
    // Fallback to LiveChatWidget API
    if (window.LiveChatWidget && typeof window.LiveChatWidget.call === "function") {
      try {
        // Set custom variables via LiveChatWidget
        if (source || page) {
          window.LiveChatWidget.call('set_custom_variables', [
            { name: "Source", value: source || "Website" },
            { name: "Page", value: page || window.location.pathname },
          ]);
        }
        // Maximize/open the chat widget
        window.LiveChatWidget.call('maximize');
        return;
      } catch (e) {
        console.warn("LiveChat: Could not open chat window via LiveChatWidget", e);
      }
    }
    
    // Legacy support for custom modal
    if (window.__lc_open_modal) {
      window.__lc_open_modal();
    }
  };

  // Check if LiveChat is ready
  const isReady = () => {
    return (
      (window.LC_API && typeof window.LC_API.open_chat_window === "function") ||
      (window.LiveChatWidget && typeof window.LiveChatWidget.call === "function") ||
      window.__lc_open_modal
    );
  };

  if (isReady()) {
    doOpen();
  } else {
    // Wait for LiveChat to load
    const checkReady = () => {
      if (isReady()) {
        doOpen();
      } else {
        setTimeout(checkReady, 100);
      }
    };
    
    // Start checking after a short delay
    setTimeout(checkReady, 100);
    
    // Also store callback for when LiveChat signals ready
    window.__lc_ready_callbacks = window.__lc_ready_callbacks || [];
    window.__lc_ready_callbacks.push(doOpen);
  }
}
