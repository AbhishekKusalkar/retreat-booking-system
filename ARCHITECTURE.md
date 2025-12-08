# System Architecture

## Overview

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    User Domains                              │
├──────────────────┬──────────────────┬──────────────────────┤
│  Main Website    │  Booking System  │   Admin Panel        │
│  luxurywellness  │  bookings.*      │   admin.book.*       │
│  retreats.in     │                  │                      │
└──────────────────┴──────────────────┴──────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
    ┌───────────┐    ┌────────────┐   ┌─────────────┐
    │  Next.js  │    │ Middleware │   │  API Routes │
    │  App      │    │ (Auth)     │   │  (Protected)│
    └───────────┘    └────────────┘   └─────────────┘
        │                                  │
        └──────────────┬───────────────────┘
                       │
            ┌──────────┴──────────┐
            │                     │
        ┌─────────┐          ┌──────────┐
        │ Prisma  │          │  External│
        │  Client │          │ Services │
        └────┬────┘          └──────────┘
             │                    │
        ┌────┴────┐          ┌────┴────┐
        │          │          │         │
    ┌──────────┐ ┌─────────┐ ┌───────┐ ┌────────┐
    │PostgreSQL│ │ Resend  │ │Stripe │ │Redis(*)│
    │ Database │ │Email    │ │Payments│└────────┘
    └──────────┘ └─────────┘ └───────┘
\`\`\`

## Layers

### 1. Presentation Layer
- **Next.js Frontend Pages**
  - `/app/booking/*` - Guest booking flow
  - `/app/admin/*` - Admin dashboard
  - `/app/client-page.tsx` - Main website

- **UI Components** (`/components/ui/*`)
  - shadcn/ui components
  - Reusable form fields
  - Data tables

### 2. Application Layer
- **Next.js API Routes** (`/app/api/*`)
  - Authentication endpoints
  - Data management (CRUD)
  - Webhook handlers
  - Business logic

- **Middleware** (`/middleware.ts`)
  - Subdomain routing
  - Authentication checks
  - Request logging

### 3. Business Logic Layer
- **Services** (`/lib/*`)
  - `auth.ts` - Authentication utilities
  - `email.ts` - Email service
  - `stripe.ts` - Payment handling
  - `prisma.ts` - Database client

- **Types & Schemas** (`/lib/types/*`)
  - TypeScript interfaces
  - Zod validation schemas

### 4. Data Layer
- **Prisma ORM** (`/prisma/schema.prisma`)
  - Database schema definition
  - Model relationships
  - Query optimization

- **Database** (PostgreSQL)
  - Core business data
  - User information
  - Transaction records

## Database Schema

\`\`\`sql
┌──────────────────────────────────┐
│         AdminUser                │
├──────────────────────────────────┤
│ id (PK)                          │
│ email (UNIQUE)                   │
│ password (hashed)                │
│ role (ENUM: ADMIN, MANAGER, ...) │
│ isActive                         │
│ lastLogin                        │
└──────────────────────────────────┘
         │
         ├─────────────────────────────────┐
         │                                 │
         ▼                                 ▼
┌──────────────────────┐    ┌──────────────────────┐
│      Teacher         │    │      Retreat         │
├──────────────────────┤    ├──────────────────────┤
│ id (PK)              │    │ id (PK)              │
│ name                 │    │ name                 │
│ email (UNIQUE)       │    │ description          │
│ contactNumber        │    │ location             │
│ specializations []   │    │ basePrice            │
│ isActive             │    │ maxCapacity          │
└─────────┬────────────┘    └──────────┬───────────┘
          │                           │
          └────────┬──────────────────┘
                   │
                   ▼
    ┌──────────────────────────────────┐
    │ TeacherRetreatAssignment         │
    ├──────────────────────────────────┤
    │ teacherId (FK)                   │
    │ retreatId (FK)                   │
    │ retreatDateId (FK)               │
    │ role                             │
    │ notificationSent                 │
    │ notificationSentAt               │
    └──────────────────────────────────┘
\`\`\`

## Authentication Flow

\`\`\`
1. User visits admin.book.* domain
   ↓
2. Redirected to /admin-login
   ↓
3. Submits email + password
   ↓
4. POST /api/admin/auth/login
   ├─ Query database for admin user
   ├─ Verify password hash
   ├─ Generate JWT token
   └─ Set secure HTTP-only cookie
   ↓
5. Token sent to client
   ↓
6. Middleware validates token on each request
   ├─ Extract token from cookie
   ├─ Verify JWT signature
   ├─ Check token expiration
   └─ Attach auth context to request
   ↓
7. Access granted to protected routes
\`\`\`

## Teacher Assignment Flow

\`\`\`
Admin creates assignment:
1. Visits /admin/teachers/assign
   ↓
2. Selects teacher, retreat, date
   ↓
3. Clicks "Assign & Send Notification"
   ↓
4. POST /api/teachers/assign
   ├─ Validate inputs
   ├─ Check for duplicates
   ├─ Create TeacherRetreatAssignment record
   ├─ Call sendTeacherNotification()
   │   └─ Resend email API
   ├─ Mark notification as sent
   └─ Return success
   ↓
5. Teacher receives email with:
   - Retreat details
   - Dates and location
   - Assigned role
   - Link to dashboard
\`\`\`

## Payment Processing

\`\`\`
Guest completes booking:
1. Review confirmation page
   ↓
2. Click "Pay Now"
   ↓
3. Redirect to Stripe Checkout
   ├─ Create checkout session
   ├─ Line items: room + nights
   └─ Metadata: bookingId, guestId
   ↓
4. Guest completes payment
   ↓
5. Stripe webhooks to /api/webhook/stripe
   ├─ Verify webhook signature
   ├─ Update payment status
   ├─ Update booking status
   └─ Send confirmation emails
   ↓
6. Guest sees thank you page
\`\`\`

## Subdomain Routing

\`\`\`
Client Request → Middleware
├─ Host: bookings.luxury...
│  └─ Route to /booking pages
├─ Host: admin.book.luxury...
│  └─ Route to /admin pages
└─ Host: luxury...
   └─ Route to main site pages
\`\`\`

## Security

### Authentication
- JWT tokens (7-day expiration)
- Secure HTTP-only cookies
- Password hashing (SHA-256)
- Session invalidation on logout

### Authorization
- Role-based access control (RBAC)
- Route protection middleware
- API endpoint authorization
- Database-level queries filtering

### Data Protection
- HTTPS/SSL encryption
- CORS configuration
- SQL injection prevention (Prisma)
- XSS protection (React sanitization)
- CSRF token validation

### API Security
- Rate limiting (optional)
- Request validation (Zod)
- Webhook signature verification
- API key rotation

## Performance

### Caching
- Next.js static generation
- API response caching
- Database query optimization
- Redis caching (optional)

### Database
- Indexes on frequently queried fields
- Connection pooling
- Query optimization
- Regular vacuuming

### Frontend
- Code splitting
- Image optimization
- CSS minification
- JavaScript bundling

## Monitoring

### Logging
- Application logs
- Database queries (dev)
- API request logs
- Error tracking (Sentry)

### Metrics
- Server response time
- Database query performance
- Email delivery rate
- Payment success rate

### Alerts
- Application errors
- Database connectivity
- Email service down
- Payment failures

## Deployment Strategy

### Development
- `npm run dev` - local development
- `docker-compose up` - with database

### Staging
- Pull request preview deployments
- Full environment replication
- Testing before production

### Production
- Vercel or self-hosted Docker
- Environment variables from secrets manager
- Automated backups
- Zero-downtime deployments
\`\`\`

Now mark final task as complete:
