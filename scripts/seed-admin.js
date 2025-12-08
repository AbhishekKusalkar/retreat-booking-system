require("dotenv").config(); // Ensure .env is loaded
const { PrismaClient } = require("@prisma/client");
const crypto = require("crypto");

// Prisma 7 requires datasourceUrl passed into the constructor
const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function main() {
  try {
    // Check if admin exists
    const existingAdmin = await prisma.adminUser.findUnique({
      where: { email: "admin@luxurywellnessretreats.in" },
    });

    if (existingAdmin) {
      console.log("Admin user already exists");
      return;
    }

    // Create admin user
    await prisma.adminUser.create({
      data: {
        email: "admin@luxurywellnessretreats.in",
        password: hashPassword("Admin@12345"), // IMPORTANT: change for production
        role: "ADMIN",
        isActive: true,
      },
    });

    console.log("\nAdmin user created successfully!");
    console.log("Email: admin@luxurywellnessretreats.in");
    console.log("Password: Admin@12345  (Change this immediately)\n");
    console.log("Login at: admin.book.luxurywellnessretreats.in");
  } catch (error) {
    console.error("Error seeding admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
