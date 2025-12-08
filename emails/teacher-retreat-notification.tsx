interface TeacherRetreatNotificationProps {
  teacherName: string
  retreatName: string
  retreatLocation: string
  startDate: string
  endDate: string
  role: string
}

export const TeacherRetreatNotificationEmail = ({
  teacherName,
  retreatName,
  retreatLocation,
  startDate,
  endDate,
  role,
}: TeacherRetreatNotificationProps) => (
  <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto" }}>
    <div style={{ backgroundColor: "#009444", color: "white", padding: "20px", borderRadius: "8px 8px 0 0" }}>
      <h1 style={{ margin: "0", fontSize: "24px" }}>New Retreat Assignment</h1>
    </div>

    <div style={{ backgroundColor: "#f9fafb", padding: "30px", borderRadius: "0 0 8px 8px" }}>
      <p style={{ fontSize: "16px", marginBottom: "20px" }}>Dear {teacherName},</p>

      <p style={{ fontSize: "15px", color: "#555", marginBottom: "25px" }}>
        We are pleased to inform you that you have been assigned as a <strong>{role}</strong> for the following retreat:
      </p>

      <div
        style={{
          backgroundColor: "white",
          border: "1px solid #e5e7eb",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "25px",
        }}
      >
        <h2 style={{ color: "#009444", marginTop: "0", fontSize: "18px" }}>{retreatName}</h2>

        <div style={{ marginBottom: "10px" }}>
          <strong>Location:</strong> {retreatLocation}
        </div>
        <div style={{ marginBottom: "10px" }}>
          <strong>Start Date:</strong> {startDate}
        </div>
        <div style={{ marginBottom: "10px" }}>
          <strong>End Date:</strong> {endDate}
        </div>
        <div>
          <strong>Your Role:</strong> {role}
        </div>
      </div>

      <p style={{ fontSize: "15px", color: "#555", marginBottom: "20px" }}>
        Please log into the admin dashboard to view additional details about this retreat and confirm your attendance.
      </p>

      <div style={{ textAlign: "center", marginBottom: "25px" }}>
        <a
          href="https://admin.book.luxurywellnessretreats.in"
          style={{
            display: "inline-block",
            backgroundColor: "#009444",
            color: "white",
            padding: "12px 30px",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          View Details in Admin Panel
        </a>
      </div>

      <p style={{ fontSize: "14px", color: "#666", borderTop: "1px solid #e5e7eb", paddingTop: "20px" }}>
        If you have any questions about this assignment, please contact our team.
      </p>

      <p style={{ fontSize: "12px", color: "#999", marginTop: "20px" }}>
        Best regards,
        <br />
        Luxury Wellness Retreats Team
      </p>
    </div>
  </div>
)

export default TeacherRetreatNotificationEmail
