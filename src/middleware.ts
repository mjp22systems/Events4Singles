import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

const isPortalProtected = createRouteMatcher(["/portal(.*)"]);
const isPortalAuth = createRouteMatcher([
  "/portal/sign-in(.*)",
  "/portal/sign-up(.*)",
  "/portal/sign-out",
]);

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = new URL(req.url);

  // D1 redirect check — skip admin, api, and asset paths
  const isInternal = pathname.startsWith("/admin") || pathname.startsWith("/portal") ||
    pathname.startsWith("/api") || pathname.startsWith("/_next") ||
    /\.(css|js|mjs|png|jpg|jpeg|gif|webp|svg|ico|woff2?|ttf|eot|otf|map|txt|xml|json)$/i.test(pathname);

  if (!isInternal) {
    try {
      const { env } = await getCloudflareContext({ async: true });
      if (env.DB) {
        const redir = await env.DB
          .prepare("SELECT to_path FROM redirects WHERE from_path = ?")
          .bind(pathname)
          .first<{ to_path: string }>();
        if (redir) {
          return NextResponse.redirect(new URL(redir.to_path, req.url), 301);
        }
      }
    } catch {
      // CF context unavailable in local dev without wrangler — skip
    }
  }

  if (isPortalProtected(req) && !isPortalAuth(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:woff2|css|js|png|svg|jpg|jpeg|gif|ico|webp|txt|xml|json)$).*)",
  ],
};
