import { NextRequest, NextResponse } from "next/server";

const COUNTRY_COOKIE = "bk_country";

/**
 * Agent-native URL surface: any page URL with `.md` appended serves that page
 * as clean markdown (e.g. /chatgpt.md, /index.md). Rewritten to the md API.
 *
 * Also stamps a `bk_country` cookie from Vercel's edge geo header so
 * server components (e.g. PricingKits) can show PHP-first pricing to
 * Philippines visitors and USD-first to everyone else, without a client
 * round-trip. Defaults to PH off-Vercel (local dev) since that's the
 * business's home market.
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

  const res = NextResponse.next();
  if (!req.cookies.has(COUNTRY_COOKIE)) {
    const country = req.headers.get("x-vercel-ip-country") ?? "PH";
    res.cookies.set(COUNTRY_COOKIE, country, {
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
    });
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
