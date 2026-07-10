import { NextRequest, NextResponse } from "next/server";

/**
 * Agent-native URL surface: any page URL with `.md` appended serves that page
 * as clean markdown (e.g. /chatgpt.md, /index.md). Rewritten to the md API.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (
    pathname.endsWith(".md") &&
    !pathname.startsWith("/api/") &&
    !pathname.startsWith("/_next/")
  ) {
    const slug = pathname.slice(1, -3) || "index";
    const url = req.nextUrl.clone();
    url.pathname = `/api/md/${slug}`;
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/(.*\\.md)"],
};
