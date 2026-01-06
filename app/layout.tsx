import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import Navigation from "@/components/layout/navigation";
import "./globals.css";
import Footer from "@/components/layout/footer";
import ScrollUtilities from "@/components/scroll-utilities";
import { rootMetadata } from "@/lib/seo/metadata";
import { LiveChatWidget } from "@/components/LiveChatWidget";
import { LiveChatProvider } from "@/components/LiveChatProvider";
import { GetQuoteProvider } from "@/components/GetQuoteProvider";
import Script from 'next/script'
import ClientOnly from "@/components/ClientOnly";
import { headers } from "next/headers";

export const metadata: Metadata = {
  ...rootMetadata({
    defaultTitle: "Bus2Ride",
    description:
      "Premium party buses, limos, and coach buses — clean rides, pro drivers, and fast quotes.",
  }),
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const isEmbedRoute = headersList.get("x-is-embed-route") === "true";

  // For embed routes, return children directly (they return full HTML documents)
  if (isEmbedRoute) {
    return <>{children}</>;
  }

  // For normal routes, wrap with layout
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google tag (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-90TGBE5355"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-90TGBE5355');`,
          }}
        />
      </head>
      <body
        className={`${geistSans.className} antialiased`}
        suppressHydrationWarning={true} // to avoid hydration mismatch warnings
      >
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
        <NextThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Navigation />

          <main>{children}</main>

          <ScrollUtilities />

          <ClientOnly>
            <LiveChatWidget />
            <LiveChatProvider />
            <GetQuoteProvider />
          </ClientOnly>
          <Footer />

        </NextThemeProvider>


      </body>
    </html>
  );
}
