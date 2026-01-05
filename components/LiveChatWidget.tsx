"use client";

import Script from "next/script";
import { useEffect } from "react";

export function LiveChatWidget() {
  useEffect(() => {
    // Set up ready callbacks when LiveChat loads
    const handleLiveChatReady = () => {
      window.__lc_ready = true;
      
      // Execute any pending callbacks
      if (window.__lc_ready_callbacks && Array.isArray(window.__lc_ready_callbacks)) {
        window.__lc_ready_callbacks.forEach((callback) => {
          try {
            callback();
          } catch (e) {
            console.warn("LiveChat: Error executing ready callback", e);
          }
        });
        window.__lc_ready_callbacks = [];
      }
    };

    // Listen for LiveChat ready events
    if (window.LiveChatWidget) {
      window.LiveChatWidget.on('ready', handleLiveChatReady);
    }

    // Also check periodically if LC_API is available
    const checkLCAPI = setInterval(() => {
      if (window.LC_API && !window.__lc_ready) {
        handleLiveChatReady();
        clearInterval(checkLCAPI);
      }
    }, 500);

    // Cleanup after 30 seconds
    setTimeout(() => {
      clearInterval(checkLCAPI);
    }, 30000);

    return () => {
      if (window.LiveChatWidget) {
        window.LiveChatWidget.off('ready', handleLiveChatReady);
      }
      clearInterval(checkLCAPI);
    };
  }, []);

  return (
    <>
      <Script
        id="livechat-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.__lc = window.__lc || {};
            window.__lc.license = 14025285;
            window.__lc.integration_name = "manual_channels";
            window.__lc.product_name = "livechat";
            ;(function(n,t,c){function i(n){return e._h?e._h.apply(null,n):e._q.push(n)}var e={_q:[],_h:null,_v:"2.0",on:function(){i(["on",c.call(arguments)])},once:function(){i(["once",c.call(arguments)])},off:function(){i(["off",c.call(arguments)])},get:function(){if(!e._h)throw new Error("[LiveChatWidget] You can't use getters before load.");return i(["get",c.call(arguments)])},call:function(){i(["call",c.call(arguments)])},init:function(){var n=t.createElement("script");n.async=!0,n.type="text/javascript",n.src="https://cdn.livechatinc.com/tracking.js",t.head.appendChild(n)}};!n.__lc.asyncInit&&e.init(),n.LiveChatWidget=n.LiveChatWidget||e}(window,document,[].slice))
          `,
        }}
      />
      <noscript>
        <a href="https://www.livechat.com/chat-with/14025285/" rel="nofollow">
          Chat with us
        </a>
        , powered by{" "}
        <a
          href="https://www.livechat.com/?welcome"
          rel="noopener nofollow"
          target="_blank"
        >
          LiveChat
        </a>
      </noscript>
    </>
  );
}
