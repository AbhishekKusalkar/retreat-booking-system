import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "./auth"

export interface AuthenticatedRequest extends NextRequest {
  auth?: {
    adminId: string
    email: string
    role: string
  }
}

export function withAuth(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    try {
      const token = req.cookies.get("admin_token")?.value

      if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      const auth = verifyToken(token)
      if (!auth) {
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
      }

      const authenticatedReq = req as AuthenticatedRequest
      authenticatedReq.auth = auth

      return handler(authenticatedReq)
    } catch (error) {
      console.error("[v0] Auth middleware error:", error)
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
    }
  }
}

export function requireRole(...roles: string[]) {
  return (handler: (req: AuthenticatedRequest) => Promise<NextResponse>) => {
    return async (req: AuthenticatedRequest) => {
      const token = req.cookies.get("admin_token")?.value

      if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      const auth = verifyToken(token)
      if (!auth || !roles.includes(auth.role)) {
        return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
      }

      req.auth = auth
      return handler(req)
    }
  }
}
