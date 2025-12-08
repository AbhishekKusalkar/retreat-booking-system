# Complete Setup Checklist - Luxury Wellness Retreats

## Prerequisites Installed ✓
- [ ] Node.js 18+ (Check: `node --version`)
- [ ] PostgreSQL 13+ (Check: `psql --version`)
- [ ] Git installed

## Step 1: Database Setup (CRITICAL - This fixes the 500 errors!)

### For Windows:
1. Open pgAdmin 4 (installed with PostgreSQL)
2. Right-click "Databases" → Create → Database
3. Name: `wellness_retreats`
4. Click Save

### For Mac/Linux:
\`\`\`bash
psql -U postgres
CREATE DATABASE wellness_retreats;
CREATE USER wellness_user WITH PASSWORD 'wellness_password_dev';
ALTER ROLE wellness_user WITH CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE wellness_retreats TO wellness_user;
\q
\`\`\`

### Verify Connection:
\`\`\`bash
psql -U wellness_user -d wellness_retreats -h localhost
\`\`\`

## Step 2: Environment Configuration

1. Copy `.env.local.example` to `.env.local`
   \`\`\`bash
   cp .env.local.example .env.local
   \`\`\`

2. **IMPORTANT**: Update `.env.local` with your values:
   \`\`\`env
   DATABASE_URL="postgresql://wellness_user:wellness_password_dev@localhost:5432/wellness_retreats"
   JWT_SECRET="your-secret-key-minimum-32-chars-change-this"
   RESEND_API_KEY="re_xxxxx"  # Get from https://resend.com
   STRIPE_SECRET_KEY="sk_test_xxxxx"  # Get from https://stripe.com
   STRIPE_PUBLISHABLE_KEY="pk_test_xxxxx"  # Get from https://stripe.com
   STRIPE_WEBHOOK_SECRET="whsec_xxxxx"  # Get from https://stripe.com
   \`\`\`

## Step 3: Install Dependencies
\`\`\`bash
npm install
\`\`\`

## Step 4: Run Database Migrations
\`\`\`bash
npx prisma migrate dev --name init
\`\`\`

This creates all necessary tables. If you get errors here, check your DATABASE_URL!

## Step 5: Start Development Server
\`\`\`bash
npm run dev
\`\`\`

## Step 6: Test Admin Login
1. Open http://localhost:3000/admin-login
2. Login with:
   - Email: `admin@example.com`
   - Password: `admin123`
3. The admin user is created automatically on first login attempt

## API Keys Reference

| Service | Where to Get | What For |
|---------|--------------|----------|
| **Stripe** | https://dashboard.stripe.com | Payments in EUR |
| **Resend** | https://resend.com | Booking confirmation emails |
| **JWT_SECRET** | Generate any random string | Admin authentication |

## Common Issues & Fixes

### Error: "500 Internal Server Error" on Login
**Cause**: DATABASE_URL not set or database not initialized
**Fix**:
1. Check `.env.local` has correct DATABASE_URL
2. Run: `npx prisma migrate dev`
3. Restart: `npm run dev`

### Error: "connect ECONNREFUSED 127.0.0.1:5432"
**Cause**: PostgreSQL not running
**Fix**:
- Windows: Start PostgreSQL service from Services
- Mac: `brew services start postgresql@13`
- Linux: `sudo systemctl start postgresql`

### Error: "role 'wellness_user' does not exist"
**Cause**: User not created in PostgreSQL
**Fix**: Follow Step 1 again to create user and database

### "Database not initialized" message on login page
**Fix**: Run `npx prisma migrate dev` to create tables

## Booking Flow URLs

Once running, access:
- Main Site: http://localhost:3000
- Admin Panel: http://localhost:3000/admin-login
- Booking Page: http://localhost:3000/booking/retreat

## Subdomain Testing (Optional - for production testing)

Add to your `/etc/hosts` (Mac/Linux) or `C:\Windows\System32\drivers\etc\hosts` (Windows):
\`\`\`
127.0.0.1 luxurywellnessretreats.local
127.0.0.1 bookings.luxurywellnessretreats.local
127.0.0.1 admin.book.luxurywellnessretreats.local
\`\`\`

Then visit:
- Main: http://luxurywellnessretreats.local:3000
- Bookings: http://bookings.luxurywellnessretreats.local:3000
- Admin: http://admin.book.luxurywellnessretreats.local:3000

## Production Deployment

See DEPLOYMENT.md for:
- Vercel deployment
- Docker deployment
- Environment variable setup
- SSL/HTTPS setup
