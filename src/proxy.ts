import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

const PUBLIC_PATHS = ["/", "/login", "/register", "/privacy", "/terms", "/disclaimer"];
const ADMIN_PREFIX = "/admin";
const AUTH_REQUIRED_PREFIXES = ["/dashboard", "/onboarding", "/admin"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isPublic =
    PUBLIC_PATHS.some((p) => pathname === p) || pathname.startsWith("/api/auth");

  if (isPublic) return NextResponse.next();

  const needsAuth = AUTH_REQUIRED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!needsAuth) return NextResponse.next();

  if (!req.auth) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith(ADMIN_PREFIX) && req.auth.user.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};
