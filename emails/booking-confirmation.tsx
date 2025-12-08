import { Body, Button, Container, Head, Hr, Html, Preview, Row, Section, Text } from "@react-email/components"

interface BookingConfirmationEmailProps {
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

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

export const BookingConfirmationEmail = ({
  guestName,
  guestEmail,
  bookingId,
  retreatName,
  retreatLocation,
  startDate,
  endDate,
  roomType,
  totalGuests,
  totalPrice,
  promoCode,
  discount,
  checkInTime,
  checkOutTime,
}: BookingConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Your booking for {retreatName} is confirmed!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Text style={heading}>Booking Confirmed ✓</Text>
          <Text style={paragraph}>Hi {guestName},</Text>
          <Text style={paragraph}>
            Thank you for booking with us! Your reservation for <strong>{retreatName}</strong> is confirmed.
          </Text>

          <Section style={bookingDetails}>
            <Row>
              <Text style={label}>Booking Reference</Text>
              <Text style={value}>{bookingId}</Text>
            </Row>
            <Hr style={hr} />
            <Row>
              <Text style={label}>Retreat</Text>
              <Text style={value}>{retreatName}</Text>
            </Row>
            <Row>
              <Text style={label}>Location</Text>
              <Text style={value}>{retreatLocation}</Text>
            </Row>
            <Hr style={hr} />
            <Row>
              <Text style={label}>Check-in Date & Time</Text>
              <Text style={value}>
                {startDate} at {checkInTime}
              </Text>
            </Row>
            <Row>
              <Text style={label}>Check-out Date & Time</Text>
              <Text style={value}>
                {endDate} at {checkOutTime}
              </Text>
            </Row>
            <Hr style={hr} />
            <Row>
              <Text style={label}>Room Type</Text>
              <Text style={value}>{roomType}</Text>
            </Row>
            <Row>
              <Text style={label}>Number of Guests</Text>
              <Text style={value}>{totalGuests}</Text>
            </Row>
            {promoCode && (
              <>
                <Row>
                  <Text style={label}>Promo Code</Text>
                  <Text style={value}>{promoCode}</Text>
                </Row>
                <Row>
                  <Text style={label}>Discount</Text>
                  <Text style={value}>-€{discount?.toFixed(2)}</Text>
                </Row>
              </>
            )}
            <Hr style={hr} />
            <Row>
              <Text style={{ ...value, ...totalPrice_ }}>Total Price: €{totalPrice.toFixed(2)}</Text>
            </Row>
          </Section>

          <Text style={paragraph}>
            A payment link will be sent separately. If you have any questions, please reply to this email or contact our
            support team.
          </Text>

          <Button style={button} href={`${baseUrl}/booking/thank-you`}>
            View Your Booking
          </Button>

          <Hr style={hr} />
          <Text style={footer}>© 2025 Retreat Bookings. All rights reserved.</Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

const main = {
  backgroundColor: "#f9fafb",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
}

const box = {
  padding: "0 48px",
}

const heading = {
  fontSize: "32px",
  fontWeight: "bold",
  margin: "16px 0",
  color: "#10b981",
}

const paragraph = {
  color: "#525252",
  fontSize: "16px",
  lineHeight: "1.625",
  margin: "16px 0",
}

const bookingDetails = {
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "24px",
  margin: "24px 0",
  backgroundColor: "#f3f4f6",
}

const label = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#374151",
  margin: "8px 0",
}

const value = {
  fontSize: "16px",
  color: "#111827",
  margin: "8px 0",
}

const totalPrice_ = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#10b981",
}

const button = {
  backgroundColor: "#10b981",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 24px",
  margin: "24px 0",
}

const hr = {
  borderColor: "#e5e7eb",
  margin: "24px 0",
}

const footer = {
  color: "#9ca3af",
  fontSize: "14px",
  textAlign: "center" as const,
}
