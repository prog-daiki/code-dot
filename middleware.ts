import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isRootRoute = createRouteMatcher(["/"]);
const isPublicRoute = createRouteMatcher(["/terms", "/privacy"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  if (userId && isRootRoute(req)) {
    let path = "/courses";

    const orgSelection = new URL(path, req.url);
    return NextResponse.redirect(orgSelection);
  }

  if (!userId && !isPublicRoute(req) && !isRootRoute(req)) {
    let path = "/";
    const orgSelection = new URL(path, req.url);
    return NextResponse.redirect(orgSelection);
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
