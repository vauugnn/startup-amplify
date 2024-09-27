import { NextRequest, NextResponse } from "next/server";
import { fetchAuthSession } from "aws-amplify/auth/server";
import {
  runWithAmplifyServerContext,
  UNREACHABLE_ROUTES_WHEN_AUTHENTICATED,
} from "@/lib/utils";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const { authenticated } = await runWithAmplifyServerContext({
    nextServerContext: { request, response },
    operation: async (contextSpec) => {
      try {
        const session = await fetchAuthSession(contextSpec);
        return {
          authenticated: session.tokens !== undefined,
        };
      } catch (error) {
        return {
          authenticated: false,
        };
      }
    },
  });

  if (
    !authenticated &&
    !UNREACHABLE_ROUTES_WHEN_AUTHENTICATED.includes(request.nextUrl.pathname) &&
    !(request.nextUrl.pathname === "/auth")
  ) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  if (
    authenticated &&
    UNREACHABLE_ROUTES_WHEN_AUTHENTICATED.includes(request.nextUrl.pathname)
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
