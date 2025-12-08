# Quick Start Guide - Local Development Setup

## Overview
This guide will help you set up the Luxury Wellness Retreats booking system on your local machine in 10 easy steps.

---

## ⚡ Step 1: Prerequisites

Before starting, make sure you have installed:
- **Node.js** (v18 or higher) - Download from https://nodejs.org
- **PostgreSQL** (v12 or higher) - Download from https://www.postgresql.org/download/
- **Git** - Download from https://git-scm.com/download

To verify installation, run:
\`\`\`bash
node --version
psql --version
git --version
\`\`\`

---

## 📦 Step 2: Install Dependencies

Navigate to your project folder and install all required packages:

\`\`\`bash
cd retreatbookingschema
npm install
\`\`\`

This will download all dependencies listed in `package.json`.

---

## 🗄️ Step 3: Set Up PostgreSQL Database

### Create Database & User

Open PostgreSQL command line and run:

\`\`\`sql
-- Create the database
CREATE DATABASE wellness_retreats;

-- Create a user
CREATE USER wellness_user WITH PASSWORD 'wellness_password_dev';

-- Grant privileges
ALTER ROLE wellness_user WITH CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE wellness_retreats TO wellness_user;
\`\`\`

### Connect as new user to verify

\`\`\`bash
psql -U wellness_user -d wellness_retreats -h localhost
\`\`\`

If successful, you should see a `wellness_retreats=#` prompt. Type `\q` to exit.

---

## 🔐 Step 4: Configure Environment Variables

Create a `.env.local` file in your project root:

\`\`\`bash
# Copy the example file
cp .env.local.example .env.local
\`\`\`

Edit `.env.local` with your settings. Here's the **MINIMUM** you need for local development:

\`\`\`env
# Database - Already created in Step 3
DATABASE_URL="postgresql://wellness_user:wellness_password_dev@localhost:5432/wellness_retreats"

# Authentication - You can use these defaults for development
JWT_SECRET="dev-secret-key-change-in-production-12345"
NEXT_PUBLIC_API_URL="http://localhost:3000"

# Email - Get from Resend.com (optional for now, testing will work without)
RESEND_API_KEY="re_test_key"
RESEND_FROM_EMAIL="noreply@luxurywellnessretreats.in"

# Stripe - Get from stripe.com dashboard (optional for now)
STRIPE_SECRET_KEY="sk_test_xxxxx"
STRIPE_PUBLISHABLE_KEY="pk_test_xxxxx"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_xxxxx"

# Subdomains - For local development, use localhost
NEXT_PUBLIC_MAIN_DOMAIN="localhost:3000"
NEXT_PUBLIC_BOOKING_DOMAIN="localhost:3000"
NEXT_PUBLIC_ADMIN_DOMAIN="localhost:3000"

# Application Settings
NODE_ENV="development"
NEXT_PUBLIC_APP_NAME="Luxury Wellness Retreats"
NEXT_PUBLIC_ENABLE_DEMO="true"
\`\`\`

---

## 🗂️ Step 5: Initialize Database Schema

Run Prisma migrations to create all tables:

\`\`\`bash
npx prisma migrate dev --name init
\`\`\`

This command:
- Creates all database tables
- Generates Prisma client
- Shows you the migration status

You should see: "✔ Generated Prisma Client"

---

## 👤 Step 6: Create Default Admin User

Run the seed script to create your first admin account:

\`\`\`bash
node scripts/seed-admin.js
\`\`\`

Or, visit this URL in your browser while the dev server is running:
\`\`\`
http://localhost:3000/api/admin/auth/seed
\`\`\`

You should see a success message with the created credentials.

---

## 🚀 Step 7: Start Development Server

Launch the Next.js development server:

\`\`\`bash
npm run dev
\`\`\`

You should see:
\`\`\`
> dev
> next dev

  ▲ Next.js 16.0.3
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 1234ms
\`\`\`

---

## 🌐 Step 8: Access the Application

The application runs on `http://localhost:3000` with three main areas:

### 📍 Main Website
- URL: http://localhost:3000
- Description: Main retreat booking interface for guests

### 📋 Admin Panel
- URL: http://localhost:3000/admin-login
- Login with:
  - **Email**: `admin@example.com`
  - **Password**: `admin123`
- Features: Manage retreats, bookings, teachers, promo codes

### 📚 API Routes
- Base URL: http://localhost:3000/api
- Documentation available in `/ARCHITECTURE.md`

---

## 🎯 Step 9: Verify Everything Works

### Check Admin Login:
1. Go to http://localhost:3000/admin-login
2. Enter credentials (admin@example.com / admin123)
3. You should see the admin dashboard

### Check Database:
\`\`\`bash
psql -U wellness_user -d wellness_retreats
\`\`\`

Then in psql:
\`\`\`sql
SELECT * FROM "AdminUser";
SELECT * FROM "Retreat";
\q
\`\`\`

### Check API:
Open in browser: http://localhost:3000/api/retreats
Should return a JSON response with retreat data

---

## 📧 Step 10: Optional - Set Up Email (For Testing)

If you want to test email notifications:

1. **Get Resend API Key**:
   - Go to https://resend.com
   - Sign up for free account
   - Create API key
   - Verify sender domain

2. **Update `.env.local`**:
   \`\`\`env
   RESEND_API_KEY="re_your_actual_key_here"
   RESEND_FROM_EMAIL="noreply@luxurywellnessretreats.in"
   \`\`\`

3. **Restart dev server**:
   \`\`\`bash
   # Press Ctrl+C to stop
   # Run again
   npm run dev
   \`\`\`

---

## 🛠️ Common Issues & Solutions

### Issue: "DATABASE_URL is invalid"
**Solution**: Check PostgreSQL is running and database exists
\`\`\`bash
psql -U wellness_user -d wellness_retreats -h localhost
\`\`\`

### Issue: "Port 3000 is already in use"
**Solution**: Use a different port
\`\`\`bash
npm run dev -- -p 3001
\`\`\`

### Issue: "Cannot find module '@prisma/client'"
**Solution**: Reinstall dependencies
\`\`\`bash
rm -rf node_modules package-lock.json
npm install
\`\`\`

### Issue: Admin login not working
**Solution**: Recreate the admin user
\`\`\`bash
node scripts/seed-admin.js
\`\`\`

### Issue: Email not sending
**Solution**: Check RESEND_API_KEY is correct and verified

---

## 📁 Project Structure

\`\`\`
retreatbookingschema/
├── app/
│   ├── admin/                 # Admin dashboard pages
│   ├── admin-login/           # Login page
│   ├── booking/               # Guest booking pages
│   ├── api/                   # API routes
│   └── page.tsx              # Main home page
├── prisma/
│   └── schema.prisma         # Database schema
├── lib/
│   ├── auth.ts               # Authentication utilities
│   ├── email.ts              # Email service
│   └── prisma.ts             # Database client
├── scripts/
│   └── seed-admin.js         # Create admin user
├── .env.local.example        # Environment template
└── package.json              # Dependencies
\`\`\`

---

## 🔑 User Roles & Permissions

### ADMIN (Full Access)
- Manage all retreats
- Manage all bookings
- Manage teachers
- Manage users and roles
- View all reports

### MANAGER (Manage Content)
- Manage retreats
- Manage bookings
- Manage teachers
- View reports

### VIEWER (Read Only)
- View retreats
- View bookings
- View teachers
- View reports (no export)

---

## 🚢 Next Steps After Setup

1. **Add Retreats**: Go to Admin → Retreats → Add Retreat
2. **Add Rooms**: Go to Admin → Rooms → Add Room
3. **Add Teachers**: Go to Admin → Teachers → Add Teacher
4. **Test Booking**: Go to http://localhost:3000 and try booking a retreat
5. **Configure Stripe**: Add Stripe keys for payment testing

---

## 📞 Support & Help

If you encounter issues:

1. Check console logs:
   \`\`\`bash
   # See detailed logs
   npm run dev
   \`\`\`

2. Check database:
   \`\`\`bash
   psql -U wellness_user -d wellness_retreats
   SELECT * FROM "AdminUser";
   \`\`\`

3. Check environment file:
   - Ensure `.env.local` exists
   - Verify all required variables are set
   - No spaces around `=` in env file

4. Restart everything:
   \`\`\`bash
   # Kill dev server (Ctrl+C)
   # Clear cache
   rm -rf .next
   # Start fresh
   npm run dev
   \`\`\`

---

## ✅ Setup Complete!

You're now ready to:
- ✅ Run the application locally
- ✅ Access the admin panel
- ✅ Create and manage retreats
- ✅ Manage teachers and assignments
- ✅ Test the booking system

**Happy coding! 🎉**
