import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendTeacherNotification } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const { teacherId, retreatId, retreatDateId, role } = await request.json()

    if (!teacherId || !retreatId || !retreatDateId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if assignment already exists
    const existingAssignment = await prisma.teacherRetreatAssignment.findUnique({
      where: {
        teacherId_retreatDateId: {
          teacherId,
          retreatDateId,
        },
      },
    })

    if (existingAssignment) {
      return NextResponse.json({ error: "Teacher already assigned to this retreat date" }, { status: 409 })
    }

    const assignment = await prisma.teacherRetreatAssignment.create({
      data: {
        teacherId,
        retreatId,
        retreatDateId,
        role: role || "Instructor",
      },
      include: {
        teacher: true,
        retreat: true,
        retreatDate: true,
      },
    })

    // Send notification email to teacher
    try {
      const teacher = assignment.teacher
      const retreat = assignment.retreat
      const retreatDate = assignment.retreatDate

      await sendTeacherNotification({
        teacherName: teacher.name,
        teacherEmail: teacher.email,
        retreatName: retreat.name,
        retreatLocation: retreat.location,
        startDate: new Date(retreatDate.startDate).toLocaleDateString(),
        endDate: new Date(retreatDate.endDate).toLocaleDateString(),
        role: role || "Instructor",
      })

      // Mark notification as sent
      await prisma.teacherRetreatAssignment.update({
        where: { id: assignment.id },
        data: {
          notificationSent: true,
          notificationSentAt: new Date(),
        },
      })
    } catch (emailError) {
      console.error("[v0] Error sending teacher notification:", emailError)
      // Continue even if email fails
    }

    return NextResponse.json(assignment, { status: 201 })
  } catch (error) {
    console.error("[v0] Error assigning teacher:", error)
    return NextResponse.json({ error: "Failed to assign teacher" }, { status: 500 })
  }
}
