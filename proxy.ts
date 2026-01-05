import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";
import redirectsJson from "./redirects.json";

// Convert JSON to a Map for high-speed lookup (runs once at server start)
const redirectMap = new Map(
  redirectsJson.map(({ source, destination }) => [source, destination]),
);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- LOGIC A: Handle 301 Redirects (Legacy URLs) ---
  const destination = redirectMap.get(pathname);

  if (destination) {
    // If we find a match, redirect immediately. No need to check Auth.
    const url = request.nextUrl.clone();
    url.pathname = destination;
    return NextResponse.redirect(url);
  }

  // --- LOGIC B: Handle Supabase Auth ---
  // If no redirect matched, proceed with your existing Auth check
  const response = await updateSession(request);
  
  // --- LOGIC C: Mark embed routes ---
  if (pathname.includes("/embed/")) {
    response.headers.set("x-is-embed-route", "true");
  }
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
