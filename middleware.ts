import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Solo ADMIN puede acceder a /admin
    if (pathname.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      // Requiere login para las rutas del matcher
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  // Rutas que requieren autenticacion
  matcher: ["/admin/:path*", "/checkout", "/checkout/:path*"],
};
