# Troubleshooting Guide

## Build Issues

### CSS Error: "expected ':' after declaration"
**Fix**: Already resolved - removed tw-animate-css from package.json

### Error: "Module not found: @prisma/client"
\`\`\`bash
npm install
npm install @prisma/client prisma
\`\`\`

## Runtime Issues

### Login Returns 500 Error
Check console logs:
\`\`\`bash
# Terminal should show:
[v0] Login request received
[v0] Attempting login with: admin@example.com
# If you see database errors, DATABASE_URL is wrong
\`\`\`

**Steps to fix**:
1. Verify DATABASE_URL in `.env.local`
2. Test connection:
   \`\`\`bash
   psql "$DATABASE_URL"
   \`\`\`
3. If connection fails, check PostgreSQL is running
4. Run migrations: `npx prisma migrate dev`

### "Prisma not connected"
\`\`\`bash
# Check Prisma client
npx prisma db push

# If migrations fail, check status
npx prisma migrate status

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset
\`\`\`

## Database Issues

### PostgreSQL Won't Start
**Mac**:
\`\`\`bash
brew services start postgresql@13
# or
pg_ctl -D /usr/local/var/postgres start
\`\`\`

**Linux**:
\`\`\`bash
sudo systemctl start postgresql
sudo systemctl status postgresql
\`\`\`

**Windows**:
- Open Services (services.msc)
- Find "postgresql-x64-13"
- Right-click → Start

### Wrong Database URL
Check format:
\`\`\`
postgresql://username:password@localhost:5432/database_name
\`\`\`

### Table Creation Failed
\`\`\`bash
# Drop and recreate database
npx prisma migrate reset
\`\`\`

## Email Issues

### Emails Not Sending
1. Check RESEND_API_KEY is valid
2. Check RESEND_FROM_EMAIL matches Resend domain
3. Test: Make a booking and check email service logs

### STRIPE_WEBHOOK_SECRET Invalid
1. Go to https://dashboard.stripe.com/webhooks
2. Create new webhook for events:
   - payment_intent.succeeded
   - payment_intent.payment_failed
3. Copy webhook signing secret to `.env.local`

## Admin Panel Issues

### Can't Access Admin Dashboard
1. Verify login token exists: Open DevTools → Application → Cookies
2. Should see `admin_token` cookie
3. If missing, login again
4. Check token expiry: 7 days from login

### Roles Not Working
\`\`\`bash
# Check database has role assignments
npx prisma db execute --stdin < check-roles.sql
# (create check-roles.sql with: SELECT * FROM "AdminUser" WHERE role = 'ADMIN';)
\`\`\`

## Performance Issues

### Slow Database Queries
\`\`\`bash
# Enable query logging
DATABASE_LOG=query npm run dev
\`\`\`

### Memory Leaks
\`\`\`bash
# Restart dev server
# or use: npm run dev -- --turbo (if using Turbopack)
\`\`\`

## Contact & Support

If issues persist:
1. Check all environment variables are set
2. Ensure PostgreSQL is running
3. Run `npx prisma migrate status`
4. Check log output for exact error message
5. Verify API keys are valid at their respective services
