# Complete Setup Roadmap - Luxury Wellness Retreats Booking System

## Overview
This document provides a complete step-by-step guide to set up the entire Luxury Wellness Retreats booking system from scratch, including all required API keys, database setup, and deployment configuration.

---

## Part 1: Prerequisites & Environment Setup

### 1.1 System Requirements
- **Node.js**: v18.17 or higher (https://nodejs.org)
- **npm**: v9 or higher (comes with Node.js)
- **PostgreSQL**: v14 or higher (https://www.postgresql.org/download/)
- **Git**: For version control (https://git-scm.com)
- **Text Editor**: VS Code recommended (https://code.visualstudio.com)

### 1.2 Required API Keys & Services
You'll need accounts and API keys from the following services:

| Service | Purpose | Sign Up | Free Tier |
|---------|---------|---------|-----------|
| **Stripe** | Payment Processing (EUR) | https://stripe.com | Yes (Test Mode) |
| **Resend** | Email Service | https://resend.com | Yes (100 emails/day) |
| **PostgreSQL** | Database | https://www.postgresql.org | Self-hosted |

---

## Part 2: Database Setup

### Step 2.1: Install PostgreSQL

**For Windows:**
1. Download from https://www.postgresql.org/download/windows/
2. Run the installer
3. Set password: `wellness_password_dev` (for local development)
4. Remember the PostgreSQL port (default: 5432)


### Step 2.2: Create Database & User

**Option A: Using pgAdmin GUI**
1. Open pgAdmin (comes with PostgreSQL)
2. Right-click "Databases" → "Create" → "Database"
3. Name: `wellness_retreats`
4. Go to Login/Group Roles → Create user `wellness_user` with password `wellness_password_dev`

**Option B: Using Command Line**
\`\`\`bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE wellness_retreats;

# Create user
CREATE USER wellness_user WITH PASSWORD 'wellness_password_dev';

# Grant privileges
ALTER ROLE wellness_user CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE wellness_retreats TO wellness_user;

# Exit
\q
\`\`\`

### Step 2.3: Verify Database Connection
\`\`\`bash
psql -U wellness_user -d wellness_retreats -h localhost -p 5432
\`\`\`

---

## Part 3: Setting Up Stripe (Payment Processing)

### Step 3.1: Create Stripe Account
1. Go to https://stripe.com
2. Click "Sign Up"
3. Fill in your business details
4. Verify email

### Step 3.2: Get API Keys
1. Log in to Stripe Dashboard
2. Go to: Developers → API Keys
3. Copy both keys in **Test Mode**:
   - **Publishable Key** (starts with `pk_test_`)
   - **Secret Key** (starts with `sk_test_`)

### Step 3.3: Create Webhook Endpoint (Optional but Recommended)
1. In Dashboard: Developers → Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://yourdomain.com/api/payment/webhook`
4. Select events: `payment_intent.succeeded`, `charge.refunded`
5. Copy the **Signing Secret** (starts with `whsec_`)

**For Local Testing:**
\`\`\`bash
# Install Stripe CLI
# https://stripe.com/docs/stripe-cli

# Run in terminal
stripe listen --forward-to localhost:3000/api/payment/webhook

# Copy the signing secret it provides
\`\`\`

---

## Part 4: Setting Up Resend (Email Service)

### Step 4.1: Create Resend Account
1. Go to https://resend.com
2. Sign up with email
3. Verify email address

### Step 4.2: Get API Key
1. Go to Dashboard
2. Click your name → "API Keys"
3. Click "Create API Key"
4. Copy the API key (starts with `re_`)

### Step 4.3: Set Up Sender Email
1. In Dashboard → Domains
2. Add your domain: `luxurywellnessretreats.in`
3. Follow DNS verification steps (provided by Resend)
4. Or use default: `onboarding@resend.dev` for testing

---

## Part 5: Project Setup

### Step 5.1: Download & Extract Project
\`\`\`bash
# Extract the ZIP file you have
cd retreatbookingschema
\`\`\`

### Step 5.2: Install Dependencies
\`\`\`bash
npm install
\`\`\`

### Step 5.3: Create `.env.local` File
\`\`\`bash
cp .env.local.example .env.local
\`\`\`

### Step 5.4: Configure Environment Variables

**Edit `.env.local` with your actual values:**

\`\`\`env
# ============================================
# DATABASE CONFIGURATION
# ============================================
DATABASE_URL="postgresql://wellness_user:wellness_password_dev@localhost:5432/wellness_retreats"

# ============================================
# AUTHENTICATION & SECURITY
# ============================================
JWT_SECRET="your-super-secret-jwt-key-change-in-production-`$(openssl rand -base64 32)`"
NEXT_PUBLIC_API_URL="http://localhost:3000"

# ============================================
# EMAIL SERVICE (Resend)
# ============================================
RESEND_API_KEY="re_YOUR_API_KEY_HERE"
RESEND_FROM_EMAIL="noreply@luxurywellnessretreats.in"

# ============================================
# STRIPE PAYMENT INTEGRATION
# ============================================
STRIPE_SECRET_KEY="sk_test_YOUR_SECRET_KEY_HERE"
STRIPE_PUBLISHABLE_KEY="pk_test_YOUR_PUBLISHABLE_KEY_HERE"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_YOUR_PUBLISHABLE_KEY_HERE"
STRIPE_WEBHOOK_SECRET="whsec_YOUR_WEBHOOK_SECRET_HERE"

# ============================================
# SUBDOMAIN CONFIGURATION
# ============================================
NEXT_PUBLIC_MAIN_DOMAIN="luxurywellnessretreats.in"
NEXT_PUBLIC_BOOKING_DOMAIN="bookings.luxurywellnessretreats.in"
NEXT_PUBLIC_ADMIN_DOMAIN="admin.book.luxurywellnessretreats.in"

# ============================================
# APPLICATION SETTINGS
# ============================================
NODE_ENV="development"
NEXT_PUBLIC_APP_NAME="Luxury Wellness Retreats"
NEXT_PUBLIC_APP_VERSION="2.0.0"

# ============================================
# FEATURE FLAGS
# ============================================
NEXT_PUBLIC_ENABLE_DEMO="true"
\`\`\`

### Step 5.5: Generate Prisma Client & Run Migrations
\`\`\`bash
# Generate Prisma client
npx prisma generate

# Run database migrations (creates tables)
npx prisma migrate dev --name init

# Open Prisma Studio to view database
npx prisma studio
\`\`\`

### Step 5.6: Seed Default Admin User
\`\`\`bash
node scripts/seed-admin.js
\`\`\`

---

## Part 6: Running the Application

### Step 6.1: Start Development Server
\`\`\`bash
npm run dev
\`\`\`

The application will start at:
- **Main Website**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin-login
- **Booking System**: http://localhost:3000/booking/retreat

### Step 6.2: Access Admin Panel
1. Go to: http://localhost:3000/admin-login
2. Email: `admin@example.com`
3. Password: `admin123`

### Step 6.3: Test Payment (Stripe)
Use Stripe test card in payment form:
- **Card Number**: `4242 4242 4242 4242`
- **Expiry**: `12/25`
- **CVC**: `123`

---

## Part 7: Admin Panel Tour

### 7.1 Dashboard
- Overview of bookings, revenue, and system health
- Quick access to all features

### 7.2 Retreats Section
1. **Add Retreat**: Create new retreat
   - Name, Location, Description
   - Base Price (in EUR €)
   - Image & Details
2. **Edit/Delete**: Manage existing retreats

### 7.3 Dates Section
1. Only appears after creating a retreat
2. **Assign Dates**:
   - Select retreat
   - Start & end dates
   - Available capacity

### 7.4 Rooms Section
1. Create room types (Deluxe, Standard, etc.)
2. Set room pricing
3. Set availability per retreat

### 7.5 Teachers Section
1. **Add Teachers**: Name, Email, Phone, Specialization
2. **Assign to Retreat**: Select retreat and dates
3. Teachers receive automated email notifications

### 7.6 Bookings Section
1. View all guest bookings
2. Track booking status
3. Send additional communications

### 7.7 Promo Codes Section
1. Create promo codes
2. Set discount percentage (e.g., 10%)
3. Set expiration dates

### 7.8 Influencers Section
1. Manage influencer partners
2. Track partnerships

---

## Part 8: Booking Flow (Customer Side)

### 8.1 Retreat Selection
1. Customer selects a retreat from catalog
2. Dates dynamically load for that retreat only
3. Price updates based on selected retreat

### 8.2 Guest Information
1. Customer enters name, email, phone
2. No placeholder data needed

### 8.3 Room & Date Selection
1. Choose specific date from available dates for retreat
2. Select room type
3. Add any special requests

### 8.4 Payment
1. Apply promo code (optional) - gets 10% discount
2. Review final price (in EUR €)
3. Complete payment with Stripe

### 8.5 Confirmation
1. Customer receives confirmation email
2. Redirected to thank you page
3. Auto-redirect to main domain after 10 seconds

---

## Part 9: Subdomain Configuration (Production)

### 9.1 DNS Setup
In your domain registrar (e.g., GoDaddy, Namecheap):

\`\`\`
Record Type | Subdomain | Value
-----------|-----------|-------
CNAME      | bookings  | your-vercel-deployment.vercel.app
CNAME      | admin.book| your-vercel-deployment.vercel.app
\`\`\`

### 9.2 Vercel Deployment
1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables (all `.env.local` values)
4. Deploy

### 9.3 Configure Vercel Domains
1. Go to Project Settings → Domains
2. Add `bookings.luxurywellnessretreats.in`
3. Add `admin.book.luxurywellnessretreats.in`
4. Verify DNS records

---

## Part 10: API Keys Quick Reference

### Required API Keys

| Key | Where to Get | Format | Example |
|-----|-------------|--------|---------|
| `DATABASE_URL` | PostgreSQL Setup | postgresql://user:password@host:port/db | postgresql://wellness_user:wellness_password_dev@localhost:5432/wellness_retreats |
| `STRIPE_SECRET_KEY` | Stripe Dashboard → Developers → API Keys | sk_test_... | sk_test_51234567890 |
| `STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard → Developers → API Keys | pk_test_... | pk_test_51234567890 |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard → Developers → Webhooks | whsec_... | whsec_1234567890 |
| `RESEND_API_KEY` | Resend Dashboard → API Keys | re_... | re_1234567890 |
| `JWT_SECRET` | Generate your own | Any random string | use: `openssl rand -base64 32` |

---

## Part 11: Troubleshooting

### Issue: "Database connection failed"
**Solution:**
\`\`\`bash
# Check PostgreSQL is running
psql -U postgres

# Verify DATABASE_URL in .env.local
# Format: postgresql://username:password@host:port/database

# Test connection
psql $DATABASE_URL
\`\`\`

### Issue: "Stripe key is invalid"
**Solution:**
1. Ensure you're using **Test Mode** keys (start with `pk_test_` and `sk_test_`)
2. Copy full keys without spaces
3. Restart `npm run dev`

### Issue: "Email not sending"
**Solution:**
1. Check `RESEND_API_KEY` is correct
2. Verify `RESEND_FROM_EMAIL` is valid
3. For testing: Use `onboarding@resend.dev`
4. Check Resend dashboard for email logs

### Issue: "Admin login not working"
**Solution:**
\`\`\`bash
# Re-seed admin user
node scripts/seed-admin.js

# Or reset with Prisma Studio
npx prisma studio
# Delete AdminUser table entries and re-seed
\`\`\`

### Issue: "Dates not showing in booking"
**Solution:**
1. Ensure retreat is created first
2. Add dates to the retreat in admin panel
3. Dates must be in future

### Issue: "Build errors"
**Solution:**
\`\`\`bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
\`\`\`

---

## Part 12: Production Checklist

- [ ] PostgreSQL database created and backed up
- [ ] All environment variables set in Vercel
- [ ] Stripe switched to Live mode (not test)
- [ ] Resend custom domain verified (not onboarding@resend.dev)
- [ ] JWT_SECRET is strong (use openssl rand -base64 32)
- [ ] Database backups configured
- [ ] SSL/HTTPS enabled on all domains
- [ ] Email templates tested
- [ ] Payment flow tested with real Stripe account
- [ ] Domain DNS records updated
- [ ] CDN/caching configured
- [ ] Monitoring/logging set up

---

## Part 13: Key Features Implemented

✅ Admin authentication with JWT
✅ Role-based access control
✅ Retreat management with EUR pricing
✅ Dynamic date assignment per retreat
✅ Room management
✅ Teacher management & assignment
✅ Automated email notifications
✅ Booking system with EUR pricing
✅ Stripe payments in EUR
✅ Promo code system (10% discount)
✅ Influencer management
✅ Dynamic booking flow (dates change per retreat)
✅ Confirmation emails
✅ Thank you page with auto-redirect
✅ Admin dashboard

---

## Support & Next Steps

1. **Review**: Go through entire admin panel and test each section
2. **Customize**: Add your logo, colors, and branding
3. **Test**: Complete a full booking flow
4. **Deploy**: Push to production when ready
5. **Monitor**: Set up error tracking and analytics

For questions or issues, check the README.md and DEPLOYMENT.md files.
\`\`\`

Now let me also fix the package.json to remove the problematic `tw-animate-css` package that's causing build issues:
