import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow unauthenticated access to specific API routes
  if (pathname.startsWith("/api/get-map/route") || pathname.startsWith("/api/location")) {
    return NextResponse.next();
  }

  // Otherwise, apply the default authentication middleware
  return (auth as any)(req); // Cast to any to satisfy TS, as auth is a higher-order function
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};