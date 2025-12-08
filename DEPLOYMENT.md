# Deployment Guide

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations run: `npx prisma migrate deploy`
- [ ] Admin user created: `node scripts/seed-admin.js`
- [ ] Email service (Resend) tested
- [ ] Stripe keys verified
- [ ] JWT_SECRET changed to production value
- [ ] CORS origins configured
- [ ] SSL certificate installed

## Vercel Deployment

### Step 1: Connect Repository
1. Push code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com)
3. Click "New Project"
4. Select your repository
5. Vercel auto-detects Next.js

### Step 2: Environment Variables
Add in Project Settings → Environment Variables:

\`\`\`
DATABASE_URL=postgresql://...
JWT_SECRET=your-production-secret
RESEND_API_KEY=your-resend-key
RESEND_FROM_EMAIL=noreply@luxurywellnessretreats.in
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
\`\`\`

### Step 3: Database Setup
- Create PostgreSQL database (Vercel Postgres, Neon, or self-hosted)
- Run migrations: `vercel env pull && npx prisma migrate deploy`
- Seed admin user: Use Vercel Functions or manual query

### Step 4: Domain Configuration
In Vercel Project Settings → Domains:

1. Add `luxurywellnessretreats.in`
2. Add `bookings.luxurywellnessretreats.in`
3. Add `admin.book.luxurywellnessretreats.in`

Update DNS records:
\`\`\`
luxurywellnessretreats.in         A    your-vercel-ip
bookings.luxurywellnessretreats.in  A    your-vercel-ip
admin.book.luxurywellnessretreats.in A    your-vercel-ip
\`\`\`

### Step 5: Deploy
Click "Deploy" or push to main branch (auto-deploys)

## Self-Hosted Deployment (Docker)

### Prerequisites
- Docker & Docker Compose
- Ubuntu/CentOS server
- SSL certificate (Let's Encrypt)
- PostgreSQL server

### Step 1: Prepare Server
\`\`\`bash
sudo apt update && sudo apt upgrade -y
sudo apt install docker.io docker-compose nginx -y
sudo usermod -aG docker $USER
\`\`\`

### Step 2: Clone & Configure
\`\`\`bash
git clone https://github.com/yourusername/wellness-retreats.git
cd wellness-retreats
cp .env.local.example .env.local
# Edit .env.local with production values
\`\`\`

### Step 3: Database Setup
\`\`\`bash
# Start PostgreSQL
docker-compose up -d postgres

# Run migrations
docker-compose exec postgres npx prisma migrate deploy

# Seed admin user
docker-compose exec app node scripts/seed-admin.js
\`\`\`

### Step 4: Build & Run
\`\`\`bash
# Build image
docker build -t wellness-retreats:latest .

# Run container
docker run -d \
  --name wellness-app \
  -p 3000:3000 \
  --env-file .env.local \
  wellness-retreats:latest
\`\`\`

### Step 5: Nginx Reverse Proxy
Create `/etc/nginx/sites-available/wellness-retreats`:

\`\`\`nginx
upstream wellness_app {
    server localhost:3000;
}

# Main domain
server {
    server_name luxurywellnessretreats.in;
    
    listen 443 ssl http2;
    ssl_certificate /etc/letsencrypt/live/luxurywellnessretreats.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/luxurywellnessretreats.in/privkey.pem;

    location / {
        proxy_pass http://wellness_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}

# Booking subdomain
server {
    server_name bookings.luxurywellnessretreats.in;
    
    listen 443 ssl http2;
    ssl_certificate /etc/letsencrypt/live/bookings.luxurywellnessretreats.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/bookings.luxurywellnessretreats.in/privkey.pem;

    location / {
        proxy_pass http://wellness_app;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}

# Admin subdomain
server {
    server_name admin.book.luxurywellnessretreats.in;
    
    listen 443 ssl http2;
    ssl_certificate /etc/letsencrypt/live/admin.book.luxurywellnessretreats.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/admin.book.luxurywellnessretreats.in/privkey.pem;

    location / {
        proxy_pass http://wellness_app;
        proxy_set_header Host \$host;
    }
}

# Redirect HTTP to HTTPS
server {
    server_name luxurywellnessretreats.in bookings.luxurywellnessretreats.in admin.book.luxurywellnessretreats.in;
    listen 80;
    return 301 https://\$server_name\$request_uri;
}
\`\`\`

Enable configuration:
\`\`\`bash
sudo ln -s /etc/nginx/sites-available/wellness-retreats /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
\`\`\`

### Step 6: SSL Certificates (Let's Encrypt)
\`\`\`bash
sudo apt install certbot python3-certbot-nginx -y

sudo certbot certonly --nginx \
  -d luxurywellnessretreats.in \
  -d bookings.luxurywellnessretreats.in \
  -d admin.book.luxurywellnessretreats.in
\`\`\`

### Step 7: Auto-renewal
\`\`\`bash
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
\`\`\`

## Monitoring & Maintenance

### Logs
\`\`\`bash
# Vercel
vercel logs

# Docker
docker logs wellness-app -f
\`\`\`

### Database Backups
\`\`\`bash
# Manual backup
pg_dump -U wellness_user wellness_retreats > backup.sql

# Automated daily backup
0 2 * * * pg_dump -U wellness_user wellness_retreats > /backups/backup-$(date +\%Y\%m\%d).sql
\`\`\`

### Performance Monitoring
- Set up uptime monitoring (Uptime Robot)
- Enable application performance monitoring (Sentry)
- Monitor database performance (pgAdmin)
- Track email delivery (Resend dashboard)

### Security Updates
\`\`\`bash
# Update dependencies
npm audit
npm update

# Docker image rebuild
docker build -t wellness-retreats:latest .
docker-compose up -d --force-recreate
\`\`\`

## Troubleshooting

### Application Won't Start
\`\`\`bash
# Check logs
docker logs wellness-app

# Verify database connection
docker-compose exec postgres psql -U wellness_user -d wellness_retreats -c "SELECT 1"

# Rebuild and restart
docker-compose down
docker-compose up -d
\`\`\`

### Email Not Sending
- Verify Resend API key: `curl https://api.resend.com -H "Authorization: Bearer YOUR_KEY"`
- Check sender email in Resend dashboard
- Review email logs in Resend dashboard

### Database Connection Issues
- Verify DATABASE_URL format
- Check firewall rules
- Verify database server is running

### SSL Certificate Errors
\`\`\`bash
# Renew certificate manually
sudo certbot renew --force-renewal

# Check certificate validity
openssl s_client -connect luxurywellnessretreats.in:443
\`\`\`

## Rollback Procedure

### Vercel
In Vercel Dashboard → Deployments:
1. Find previous working deployment
2. Click three dots → Promote to Production

### Docker
\`\`\`bash
# Revert to previous image
docker rm wellness-app
docker run -d --name wellness-app wellness-retreats:previous
\`\`\`

## Support
- Vercel: https://vercel.com/support
- Next.js: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs
\`\`\`

Finally, create a comprehensive architecture document:
