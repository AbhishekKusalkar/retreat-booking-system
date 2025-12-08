import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const teachers = await prisma.teacher.findMany({
      include: {
        retreatAssignments: {
          include: {
            retreat: true,
            retreatDate: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(teachers)
  } catch (error) {
    console.error("[v0] Error fetching teachers:", error)
    return NextResponse.json({ error: "Failed to fetch teachers" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, contactNumber, bio, specializations } = await request.json()

    if (!name || !email || !contactNumber) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const existingTeacher = await prisma.teacher.findUnique({
      where: { email },
    })

    if (existingTeacher) {
      return NextResponse.json({ error: "Teacher with this email already exists" }, { status: 409 })
    }

    const teacher = await prisma.teacher.create({
      data: {
        name,
        email,
        contactNumber,
        bio,
        specializations: specializations || [],
      },
    })

    return NextResponse.json(teacher, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating teacher:", error)
    return NextResponse.json({ error: "Failed to create teacher" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, ...updateData } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Teacher ID required" }, { status: 400 })
    }

    const teacher = await prisma.teacher.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(teacher)
  } catch (error) {
    console.error("[v0] Error updating teacher:", error)
    return NextResponse.json({ error: "Failed to update teacher" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Teacher ID required" }, { status: 400 })
    }

    await prisma.teacher.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting teacher:", error)
    return NextResponse.json({ error: "Failed to delete teacher" }, { status: 500 })
  }
}
