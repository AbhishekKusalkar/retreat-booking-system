import { Body, Button, Container, Head, Hr, Html, Preview, Row, Section, Text } from "@react-email/components"

interface InfluencerNotificationEmailProps {
  influencerName: string
  influencerEmail: string
  guestName: string
  promoCode: string
  retreatName: string
  retreatLocation: string
  startDate: string
  endDate: string
  discountPercentage: number
  discountAmount: number
  bookingValue: number
  commissionAmount?: number
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

export const InfluencerNotificationEmail = ({
  influencerName,
  influencerEmail,
  guestName,
  promoCode,
  retreatName,
  retreatLocation,
  startDate,
  endDate,
  discountPercentage,
  discountAmount,
  bookingValue,
  commissionAmount,
}: InfluencerNotificationEmailProps) => (
  <Html>
    <Head />
    <Preview>New booking with your promo code {promoCode}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Text style={heading}>New Booking Alert</Text>
          <Text style={paragraph}>Hi {influencerName},</Text>
          <Text style={paragraph}>Great news! A guest just booked using your exclusive promo code.</Text>

          <Section style={notificationBox}>
            <Row>
              <Text style={label}>Promo Code</Text>
              <Text style={value}>{promoCode}</Text>
            </Row>
            <Hr style={hr} />
            <Row>
              <Text style={label}>Guest Name</Text>
              <Text style={value}>{guestName}</Text>
            </Row>
            <Row>
              <Text style={label}>Retreat Booked</Text>
              <Text style={value}>{retreatName}</Text>
            </Row>
            <Row>
              <Text style={label}>Location</Text>
              <Text style={value}>{retreatLocation}</Text>
            </Row>
            <Row>
              <Text style={label}>Dates</Text>
              <Text style={value}>
                {startDate} to {endDate}
              </Text>
            </Row>
            <Hr style={hr} />
            <Row>
              <Text style={label}>Original Booking Value</Text>
              <Text style={value}>${bookingValue.toFixed(2)}</Text>
            </Row>
            <Row>
              <Text style={label}>Discount Applied ({discountPercentage}%)</Text>
              <Text style={{ ...value, color: "#10b981" }}>-${discountAmount.toFixed(2)}</Text>
            </Row>
            {commissionAmount !== undefined && (
              <Row>
                <Text style={label}>Your Commission</Text>
                <Text style={{ ...value, ...commission }}>${commissionAmount.toFixed(2)}</Text>
              </Row>
            )}
          </Section>

          <Text style={paragraph}>
            Thank you for promoting our retreats! Your commission will be processed within 5 business days of the
            retreat completion.
          </Text>

          <Button style={button} href={`${baseUrl}/influencer/dashboard`}>
            View Your Dashboard
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

const notificationBox = {
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

const commission = {
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
