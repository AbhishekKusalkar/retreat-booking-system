import { Body, Container, Head, Hr, Html, Preview, Row, Section, Text } from "@react-email/components"

interface PaymentReceiptEmailProps {
  guestName: string
  guestEmail: string
  bookingId: string
  retreatName: string
  paymentId: string
  amount: number
  paymentType: "deposit" | "full"
  paymentDate: string
  paymentMethod: string
  depositAmount?: number
  remainingBalance?: number
}

export const PaymentReceiptEmail = ({
  guestName,
  guestEmail,
  bookingId,
  retreatName,
  paymentId,
  amount,
  paymentType,
  paymentDate,
  paymentMethod,
  depositAmount,
  remainingBalance,
}: PaymentReceiptEmailProps) => (
  <Html>
    <Head />
    <Preview>Payment receipt for {retreatName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Text style={heading}>Payment Receipt</Text>
          <Text style={paragraph}>Hi {guestName},</Text>
          <Text style={paragraph}>Thank you for your payment! Below is your receipt for {retreatName}.</Text>

          <Section style={receiptBox}>
            <Row>
              <Text style={label}>Receipt Number</Text>
              <Text style={value}>{paymentId}</Text>
            </Row>
            <Row>
              <Text style={label}>Booking Reference</Text>
              <Text style={value}>{bookingId}</Text>
            </Row>
            <Hr style={hr} />
            <Row>
              <Text style={label}>Retreat</Text>
              <Text style={value}>{retreatName}</Text>
            </Row>
            <Hr style={hr} />
            <Row>
              <Text style={label}>Payment Type</Text>
              <Text style={value}>{paymentType === "deposit" ? "Deposit" : "Full Payment"}</Text>
            </Row>
            <Row>
              <Text style={label}>Payment Date</Text>
              <Text style={value}>{paymentDate}</Text>
            </Row>
            <Row>
              <Text style={label}>Payment Method</Text>
              <Text style={value}>{paymentMethod}</Text>
            </Row>
            <Hr style={hr} />
            <Row>
              <Text style={label}>Amount Paid</Text>
              <Text style={{ ...value, ...amount_ }}>${amount.toFixed(2)}</Text>
            </Row>
            {paymentType === "deposit" && remainingBalance !== undefined && (
              <Row>
                <Text style={label}>Remaining Balance</Text>
                <Text style={{ ...value, color: "#dc2626" }}>${remainingBalance.toFixed(2)}</Text>
              </Row>
            )}
          </Section>

          {paymentType === "deposit" && (
            <Text
              style={{
                ...paragraph,
                backgroundColor: "#fef3c7",
                padding: "16px",
                borderRadius: "8px",
                color: "#92400e",
              }}
            >
              <strong>Note:</strong> This is a deposit payment. Your booking is reserved. The final balance is due{" "}
              <strong>30 days before your retreat date</strong>.
            </Text>
          )}

          <Text style={paragraph}>
            This receipt confirms that your payment has been received and processed. If you have any questions about
            this receipt or your booking, please contact us.
          </Text>

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

const receiptBox = {
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

const amount_ = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#10b981",
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
