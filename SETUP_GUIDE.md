# Luxury Wellness Retreats - Setup Guide

## System Overview

This system includes:
- Guest booking interface (bookings.luxurywellnessretreats.in)
- Admin panel with role-based access (admin.book.luxurywellnessretreats.in)
- Main website (luxurywellnessretreats.in)
- Teacher management system
- Automated email notifications

## Installation Steps

### 1. Environment Variables

Create a `.env.local` file with the following:

\`\`\`env
DATABASE_URL="postgresql://user:password@localhost:5432/wellness_retreats"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
RESEND_API_KEY="your-resend-api-key"
RESEND_FROM_EMAIL="noreply@luxurywellnessretreats.in"
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
\`\`\`

### 2. Database Setup

\`\`\`bash
npx prisma migrate dev --name init
\`\`\`

### 3. Create First Admin User

Run this command to seed an admin user:

\`\`\`bash
node scripts/seed-admin.js
\`\`\`

### 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

## Subdomain Configuration

### For Local Development

Add to your `/etc/hosts` file:

\`\`\`
127.0.0.1 luxurywellnessretreats.in
127.0.0.1 bookings.luxurywellnessretreats.in
127.0.0.1 admin.book.luxurywellnessretreats.in
\`\`\`

### For Production

Configure your DNS records:

\`\`\`
A record: luxurywellnessretreats.in → your-server-ip
A record: bookings.luxurywellnessretreats.in → your-server-ip
A record: admin.book.luxurywellnessretreats.in → your-server-ip
\`\`\`

## Authentication

### Admin Panel Access

1. Navigate to `admin.book.luxurywellnessretreats.in`
2. Login with your admin credentials
3. First-time users should change their password

### Role Levels

- **ADMIN**: Full access to all features and user management
- **MANAGER**: Can manage retreats, teachers, and bookings
- **VIEWER**: Read-only access to dashboards

## Teacher Management

### Adding Teachers

1. Go to Admin → Teachers
2. Click "Add Teacher"
3. Enter teacher details (name, email, contact number)
4. Add specializations separated by commas

### Assigning Teachers to Retreats

1. Go to Admin → Teachers → Assign Teachers
2. Select teacher, retreat, and specific date
3. Choose the teacher's role
4. System automatically sends notification email

### Teacher Notifications

Teachers receive automated emails with:
- Retreat name and location
- Start and end dates
- Their assigned role
- Link to admin dashboard

## Email Setup

### Using Resend

1. Sign up at https://resend.com
2. Create API key
3. Add to environment variables as `RESEND_API_KEY`
4. Set sender email as `RESEND_FROM_EMAIL`

## Stripe Integration

1. Create a Stripe account at https://stripe.com
2. Get your API keys from Stripe dashboard
3. Add to environment variables
4. Test in development with Stripe test keys

## Backup & Security

- Always backup your PostgreSQL database regularly
- Change default admin password after first login
- Use strong JWT_SECRET in production
- Enable SSL/TLS on production domain
- Regularly update dependencies: `npm update`

## Troubleshooting

### Email Not Sending

- Check RESEND_API_KEY is set correctly
- Verify RESEND_FROM_EMAIL is valid
- Check email sender domain is verified in Resend

### Admin Can't Login

- Verify JWT_SECRET is set
- Check admin user exists in database
- Verify database connection

### Subdomain Not Working

- Check DNS records are pointing to correct server
- Verify middleware.ts is configured
- Check browser's host resolution

## Support

For issues, check the error logs:

\`\`\`bash
npm run dev > logs.txt 2>&1
