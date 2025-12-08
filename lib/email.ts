import { Resend } from "resend"
import { BookingConfirmationEmail } from "@/emails/booking-confirmation"
import { PaymentReceiptEmail } from "@/emails/payment-receipt"
import { InfluencerNotificationEmail } from "@/emails/influencer-notification"
import { TeacherRetreatNotificationEmail } from "@/emails/teacher-retreat-notification"

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

function validateEmailConfig(): boolean {
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
    console.warn("[v0] Email service not configured (missing RESEND_API_KEY or RESEND_FROM_EMAIL)")
    return false
  }
  return true
}

interface SendBookingConfirmationProps {
  guestName: string
  guestEmail: string
  bookingId: string
  retreatName: string
  retreatLocation: string
  startDate: string
  endDate: string
  roomType: string
  totalGuests: number
  totalPrice: number
  promoCode?: string
  discount?: number
  checkInTime: string
  checkOutTime: string
}

export async function sendBookingConfirmation(props: SendBookingConfirmationProps) {
  if (!validateEmailConfig() || !resend) {
    console.log("[v0] Email service not configured, skipping booking confirmation")
    return
  }

  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "noreply@retreatbookings.com",
      to: props.guestEmail,
      subject: `Booking Confirmed - ${props.retreatName}`,
      react: BookingConfirmationEmail(props),
    })
    console.log("[v0] Booking confirmation sent:", result)
    return result
  } catch (error) {
    console.error("[v0] Error sending booking confirmation:", error)
    // Don't throw - allow booking to proceed even if email fails
  }
}

interface SendPaymentReceiptProps {
  guestName: string
  guestEmail: string
  bookingId: string
  paymentId: string
  retreatName: string
  amount: number
  paymentType: "DEPOSIT" | "FULL"
  paidAt: string
  remainingBalance?: number
  stripeReceiptUrl?: string
}

export async function sendPaymentReceipt(props: SendPaymentReceiptProps) {
  if (!validateEmailConfig() || !resend) {
    console.log("[v0] Email service not configured, skipping payment receipt")
    return
  }

  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "noreply@retreatbookings.com",
      to: props.guestEmail,
      subject: `Payment Receipt - ${props.retreatName}`,
      react: PaymentReceiptEmail(props),
    })
    console.log("[v0] Payment receipt sent:", result)
    return result
  } catch (error) {
    console.error("[v0] Error sending payment receipt:", error)
    // Don't throw - allow process to continue
  }
}

interface SendInfluencerNotificationProps {
  influencerName: string
  influencerEmail: string
  promoCode: string
  bookingCount: number
  totalCommission: number
  retreatName: string
}

export async function sendInfluencerNotification(props: SendInfluencerNotificationProps) {
  if (!validateEmailConfig() || !resend) {
    console.log("[v0] Email service not configured, skipping influencer notification")
    return
  }

  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "noreply@retreatbookings.com",
      to: props.influencerEmail,
      subject: `New Booking via Your Promo Code - ${props.promoCode}`,
      react: InfluencerNotificationEmail(props),
    })
    console.log("[v0] Influencer notification sent:", result)
    return result
  } catch (error) {
    console.error("[v0] Error sending influencer notification:", error)
    // Don't throw - allow process to continue
  }
}

interface SendTeacherNotificationProps {
  teacherName: string
  teacherEmail: string
  retreatName: string
  retreatLocation: string
  startDate: string
  endDate: string
  role: string
}

export async function sendTeacherNotification(props: SendTeacherNotificationProps) {
  if (!validateEmailConfig() || !resend) {
    console.log("[v0] Email service not configured, skipping teacher notification")
    return
  }

  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "noreply@retreatbookings.com",
      to: props.teacherEmail,
      subject: `New Retreat Assignment - ${props.retreatName}`,
      react: TeacherRetreatNotificationEmail({
        teacherName: props.teacherName,
        retreatName: props.retreatName,
        retreatLocation: props.retreatLocation,
        startDate: props.startDate,
        endDate: props.endDate,
        role: props.role,
      }),
    })
    console.log("[v0] Teacher notification sent:", result)
    return result
  } catch (error) {
    console.error("[v0] Error sending teacher notification:", error)
    throw error
  }
}
