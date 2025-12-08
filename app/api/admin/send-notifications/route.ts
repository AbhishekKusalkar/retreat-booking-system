import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendTeacherNotification } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    // Get all pending notifications
    const pendingAssignments = await prisma.teacherRetreatAssignment.findMany({
      where: {
        notificationSent: false,
      },
      include: {
        teacher: true,
        retreat: true,
        retreatDate: true,
      },
    })

    if (pendingAssignments.length === 0) {
      return NextResponse.json({ message: "No pending notifications", sent: 0 })
    }

    let successCount = 0
    let failedCount = 0

    for (const assignment of pendingAssignments) {
      try {
        await sendTeacherNotification({
          teacherName: assignment.teacher.name,
          teacherEmail: assignment.teacher.email,
          retreatName: assignment.retreat.name,
          retreatLocation: assignment.retreat.location,
          startDate: new Date(assignment.retreatDate.startDate).toLocaleDateString(),
          endDate: new Date(assignment.retreatDate.endDate).toLocaleDateString(),
          role: assignment.role,
        })

        // Mark as sent
        await prisma.teacherRetreatAssignment.update({
          where: { id: assignment.id },
          data: {
            notificationSent: true,
            notificationSentAt: new Date(),
          },
        })

        successCount++
      } catch (error) {
        console.error(`[v0] Failed to send notification for teacher ${assignment.teacher.email}:`, error)
        failedCount++
      }
    }

    return NextResponse.json({
      message: "Batch notification process completed",
      sent: successCount,
      failed: failedCount,
    })
  } catch (error) {
    console.error("[v0] Error processing notifications:", error)
    return NextResponse.json({ error: "Failed to process notifications" }, { status: 500 })
  }
}
