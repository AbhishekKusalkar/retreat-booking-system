import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateToken, verifyPassword } from "@/lib/auth"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    console.log("[v0] Login request received")

    if (!body) {
      return NextResponse.json({ error: "Request body is empty" }, { status: 400 })
    }

    let parsedData
    try {
      parsedData = JSON.parse(body)
    } catch (parseError) {
      console.error("[v0] JSON parse error:", parseError)
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }

    const { email, password } = parsedData

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }

    console.log("[v0] Attempting login for:", email)

    let admin
    try {
      admin = await prisma.adminUser.findUnique({
        where: { email },
      })
    } catch (dbError) {
      console.error("[v0] Database error:", dbError)
      return NextResponse.json(
        { error: "Database connection failed. Please check your DATABASE_URL environment variable." },
        { status: 500 },
      )
    }

    if (!admin) {
      console.log("[v0] Admin not found for email:", email)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    if (!verifyPassword(password, admin.password)) {
      console.log("[v0] Password verification failed for:", email)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    if (!admin.isActive) {
      console.log("[v0] Admin account inactive:", email)
      return NextResponse.json({ error: "Admin account is inactive" }, { status: 403 })
    }

    // Update last login
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { lastLogin: new Date() },
    })

    const token = generateToken({
      adminId: admin.id,
      email: admin.email,
      role: admin.role,
    })

    const cookieStore = await cookies()
    cookieStore.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
    })

    console.log("[v0] Login successful for:", email)
    return NextResponse.json({
      success: true,
      token,
      admin: { id: admin.id, email: admin.email, role: admin.role },
    })
  } catch (error) {
    console.error("[v0] Unexpected login error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: `Login failed: ${errorMessage}` }, { status: 500 })
  }
}
