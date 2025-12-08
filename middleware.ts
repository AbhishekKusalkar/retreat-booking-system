import { type NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || ""

  // Handle subdomain routing
  if (host.includes("bookings.luxurywellnessretreats.in") || host.includes("bookings.localhost")) {
    // Route to booking subdomain
    const url = request.nextUrl.clone()
    url.pathname = "/booking" + url.pathname
    return NextResponse.rewrite(url)
  }

  if (host.includes("admin.book.luxurywellnessretreats.in") || host.includes("admin.localhost")) {
    // Route to admin subdomain
    const url = request.nextUrl.clone()
    url.pathname = "/admin" + url.pathname
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
