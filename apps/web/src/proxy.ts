import { auth } from "@baretext/auth";
import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie && request.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (sessionCookie && request.nextUrl.pathname === "/login") {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (session) {
      return NextResponse.redirect(new URL("/notes", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/notes/:path*", "/settings/:path*", "/login"],
};
