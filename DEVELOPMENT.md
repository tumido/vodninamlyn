# Svatba - Development Documentation

## Project Overview

A Czech wedding website with RSVP functionality and admin dashboard. Built as a static site with client-side Supabase integration for data persistence.

**Tech Stack:**
- Next.js 16.1.1 (App Router, static export)
- React 19.2.3
- TypeScript 5
- Tailwind CSS v4
- Zod 4.3.5 (validation)
- Supabase 2.71.3 (PostgreSQL 17, Auth)
- Sentry (error tracking, performance monitoring, session replay)

**Architecture:**
- Static export (`output: 'export'`)
- No Next.js API routes
- Direct client-to-Supabase communication
- GitHub Actions CI/CD → GitHub Pages deployment

---

## Quick Start

### Prerequisites
- Node.js 20+
- Docker Desktop (for local Supabase)

### Local Development

```bash
# Install dependencies
npm install

# Start Supabase (requires Docker)
supabase start

# Start Next.js dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

Create `.env.local`:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_anon_key>
NEXT_PUBLIC_ADMIN_USER=<admin_email>

# Sentry (optional - for error tracking)
NEXT_PUBLIC_SENTRY_DSN=<your_sentry_dsn>
NEXT_PUBLIC_SENTRY_ORG=<your_sentry_org>
NEXT_PUBLIC_SENTRY_PROJECT_ID=<your_sentry_project_id>
SENTRY_AUTH_TOKEN=<your_sentry_auth_token>
```

For local development with `supabase start`, use the credentials from `supabase status`.

---

## Architecture

### Static Export Model

The app compiles to static HTML/CSS/JS (`next.config.ts` has `output: 'export'`). This means:
- No server-side rendering at runtime
- No Next.js API routes
- All data fetching happens client-side via Supabase
- Deployable to any static host (GitHub Pages, Netlify, etc.)

### Data Flow

```
Frontend (React)
    ↓
Supabase Client (@supabase/supabase-js)
    ↓
Supabase REST API / RPC / Auth
    ↓
PostgreSQL 17 Database
```

All database operations go through:
1. **RPC Functions** - `submit_rsvp()` for public RSVP submissions
2. **REST API** - Direct table queries for admin dashboard (auth required)
3. **Auth** - Password-based admin authentication

---

## Database Schema

### Table: `rsvps`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Auto-generated |
| `created_at` | TIMESTAMPTZ | NOT NULL | Submission timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL | Auto-updated by trigger |
| `name` | TEXT | NOT NULL, MIN 2 chars | Guest name |
| `primary_rsvp_id` | UUID | FK → rsvps(id) | NULL for primary guest, references primary for additional guests |
| `attending` | TEXT | NOT NULL, 'yes'\|'no' | Attendance status |
| `accommodation` | TEXT | 'roof'\|'own-tent'\|'no-sleep' | Lodging preference |
| `drink_choice` | TEXT | 'pivo'\|'vino'\|'nealko'\|'other' | Beverage choice |
| `custom_drink` | TEXT | MAX 100 chars | Custom drink if `drink_choice='other'` |
| `dietary_restrictions` | TEXT | MAX 500 chars | Dietary needs |
| `children_count` | INTEGER | DEFAULT 0, 0-99 | Number of children |
| `pets_count` | INTEGER | DEFAULT 0, 0-99 | Number of pets |
| `message` | TEXT | MAX 1000 chars | Guest message |

**Indexes:**
- `idx_rsvps_created_at` - Submission date sorting
- `idx_rsvps_attending` - Filter by attendance
- `idx_rsvps_primary_id` - Group by submission

**Row-Level Security:**
- Public: INSERT (anyone can submit)
- Authenticated: SELECT, UPDATE, DELETE (admin only)

### View: `rsvp_submissions`

Formatted view for admin display. Each row is one attendee with computed fields:
- `attendee_id`, `attendee_name`
- `primary_rsvp_id`, `primary_name`, `is_primary`
- All form data duplicated for each guest in a submission

### Function: `submit_rsvp()`

Public RPC function for RSVP submission.

**Parameters:**
- `names` TEXT[] - Array of guest names
- `attending` TEXT - 'yes' or 'no'
- `accommodation` TEXT - Optional lodging choice
- `drinkChoice` TEXT - Optional drink preference
- `customDrink` TEXT - Optional custom drink
- `dietaryRestrictions` TEXT - Optional dietary info
- `childrenCount` INTEGER - Optional number of children (default 0)
- `petsCount` INTEGER - Optional number of pets (default 0)
- `message` TEXT - Optional message

**Logic:**
1. Creates primary record for first name
2. Creates additional guest records for remaining names
3. All guests reference primary via `primary_rsvp_id`
4. All guests duplicate form data
5. Returns primary UUID

**Usage:**
```typescript
const { data, error } = await supabase.rpc('submit_rsvp', {
  names: ['Jan Novák', 'Anna Nováková'],
  attending: 'yes',
  accommodation: 'roof',
  drinkChoice: 'pivo',
  // ...
});
```

---

## Project Structure

```
app/
├── components/
│   ├── admin/              # Admin dashboard components
│   │   ├── RsvpStatsCards.tsx
│   │   ├── RsvpTable.tsx
│   │   ├── RsvpTableRow.tsx
│   │   └── EditRsvpModal.tsx
│   ├── forms/
│   │   └── RSVPForm.tsx    # Main RSVP form (used on public page and admin edit)
│   ├── sections/           # Public page sections
│   │   ├── Hero.tsx
│   │   ├── KeyInfo.tsx
│   │   ├── AdditionalInfo.tsx
│   │   ├── Accommodation.tsx
│   │   ├── Schedule.tsx
│   │   ├── FAQ.tsx
│   │   ├── RSVP.tsx
│   │   ├── ThankYou.tsx
│   │   ├── Footer.tsx
│   │   └── Spacer.tsx
│   └── ui/                 # Reusable primitives
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Select.tsx
│       ├── Textarea.tsx
│       ├── FormField.tsx
│       ├── ChipInput.tsx   # For name array input
│       ├── Icon.tsx
│       ├── Section.tsx
│       ├── Mill.tsx        # Animated SVG mill
│       ├── ScrollReveal.tsx
│       ├── SquigglyLine.tsx
│       ├── Tooltip.tsx
│       ├── Modal.tsx
│       └── ActionButton.tsx
├── hooks/
│   ├── useAuth.ts          # Auth state management
│   ├── useRsvpData.ts      # Fetch/delete RSVPs
│   ├── useRsvpStats.ts     # Calculate statistics
│   ├── useRsvpEditor.ts    # Edit RSVP modal logic
│   ├── usePageTracking.ts  # Page view tracking
│   ├── useSectionTracking.ts  # Section visibility tracking
│   └── useIntersectionObserver.ts  # Intersection observer utility
├── lib/
│   ├── monitoring/         # Comprehensive monitoring system
│   │   ├── core/
│   │   │   ├── logger.ts   # Structured logging with Sentry
│   │   │   ├── performance.ts  # Performance measurement with spans
│   │   │   └── metrics.ts  # Event tracking and business metrics
│   │   ├── dashboardMetrics.ts  # Dashboard-specific gauge metrics
│   │   ├── errorHandling.ts  # Supabase error handling
│   │   ├── types.ts        # Monitoring type definitions
│   │   └── index.ts        # Unified export
│   ├── errors/
│   │   ├── ErrorBoundary.tsx
│   │   └── useErrorHandler.ts
│   ├── utils/
│   │   ├── businessMetrics.ts
│   │   ├── formStyles.ts
│   │   ├── stats.ts
│   │   └── zodHelpers.ts
│   ├── supabase.ts         # Supabase client init
│   ├── types.ts            # TypeScript types
│   ├── constants.ts        # Wedding data & labels
│   ├── validations.ts      # Zod schemas
│   └── formatters.ts       # Data formatting utilities
├── admin/
│   ├── page.tsx            # Admin dashboard
│   └── login/
│       └── page.tsx        # Admin login
├── layout.tsx              # Root layout
├── page.tsx                # Public homepage
├── global-error.tsx        # Global error boundary
├── not-found.tsx           # 404 page
├── manifest.ts             # PWA manifest
└── globals.css             # Tailwind + custom styles

supabase/
├── migrations/
│   ├── 20260114155913_create_rsvps_table.sql
│   └── 20260116005051_add_children_and_pets_fields.sql
├── seed.sql
└── config.toml

instrumentation-client.ts   # Sentry client initialization
next.config.ts              # Next.js config with Sentry integration
```

---

## Key Files

### [app/lib/types.ts](app/lib/types.ts)
All TypeScript type definitions:
- `AttendingStatus`, `AccommodationType`, `DrinkChoice` enums
- `RSVPFormData` - Form submission data
- `RsvpSubmission` - Database record from view
- `WeddingInfo` - Wedding information structure

### [app/lib/constants.ts](app/lib/constants.ts)
Wedding data constants:
- Couple names, wedding date
- Venue details with coordinates
- Schedule timeline
- Czech label mappings for UI

### [app/lib/validations.ts](app/lib/validations.ts)
Zod validation schemas:
- `baseRsvpSchema` - Shared validation with conditional logic
- `rsvpSchema` - Public form (includes names array)
- `rsvpEditSchema` - Admin editing (single record)

### [app/lib/supabase.ts](app/lib/supabase.ts)
Supabase client initialization:
```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

### [app/components/forms/RSVPForm.tsx](app/components/forms/RSVPForm.tsx)
Main RSVP form component:
- Conditional field rendering based on attendance
- Dynamic drink field (custom option)
- Name management via ChipInput
- Edit mode support for admin
- Zod validation with real-time error display

---

## Component Patterns

### Server vs Client Components

- **Server Components (default):** All pages and static sections
- **Client Components (`"use client"`):** Interactive UI requiring hooks/state
  - Forms, modals, tables
  - Hooks: useAuth, useRsvpData, etc.
  - UI components with state: ChipInput, Modal, etc.

### Form Validation

All forms use Zod schemas with TypeScript types inferred:
```typescript
const schema = z.object({
  name: z.string().min(2, "Jméno musí mít alespoň 2 znaky"),
  // ...
});

type FormData = z.infer<typeof schema>;
```

Conditional validation example:
```typescript
.refine(
  (data) => data.attending !== 'yes' || data.accommodation,
  { message: "Vyberte možnost noclegu", path: ['accommodation'] }
)
```

### Error Handling

Use `useErrorHandler` hook for consistent error display:
```typescript
const { handleError, showSuccess } = useErrorHandler();

try {
  // operation
  showSuccess('Úspěch!');
} catch (error) {
  handleError(error, 'Chyba');
}
```

---

## Authentication

Admin authentication uses Supabase Auth with password-based login:

```typescript
// Login
const { error } = await supabase.auth.signInWithPassword({
  email: process.env.NEXT_PUBLIC_ADMIN_USER,
  password: userPassword,
});

// Get current user
const { data: { user } } = await supabase.auth.getUser();

// Logout
await supabase.auth.signOut();
```

Protected admin routes check auth state and redirect to `/admin/login` if not authenticated.

---

## Styling

### Tailwind CSS v4

Using `@tailwindcss/postcss` v4 with `@import "tailwindcss"` in [app/globals.css](app/globals.css).

### Custom Theme

**Colors:**
- Beige: `#ebe1d1` (primary background)
- Green: `#41644a` (accent, buttons)
- Orange: `#e9762b` (secondary accent)
- Amber: `#fbbf24` (highlights)

**Typography:**
- Default Sans: `var(--font-offside)` (Offside Google Font)
- Serif: `var(--font-bilbo)` (Bilbo)
- Mono: `var(--font-geist-mono)` (Geist Mono)

### Animations

```css
@keyframes appear {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes draw-line {
  from { stroke-dashoffset: 1000; }
  to { stroke-dashoffset: 0; }
}
```

ScrollReveal component for viewport-triggered animations.

---

## Monitoring & Error Tracking

### Sentry Integration

The app uses Sentry for comprehensive error tracking, performance monitoring, and session replay.

**Configuration Files:**
- `instrumentation-client.ts` - Client-side Sentry initialization with integrations
- `next.config.ts` - Webpack plugin with source map upload for stack traces

**Features:**
- Error tracking with full stack traces
- Session replays (10% sample rate, 100% on error)
- Performance monitoring with transaction tracing
- Console logging integration (log, warn, error levels)
- Supabase integration for database operation tracing
- User context tracking (PII enabled for better debugging)

### Monitoring System (`app/lib/monitoring/`)

A unified, modular monitoring system that consolidates logging, performance tracking, and metrics into a single import point. Recently refactored from scattered utility files into a clean, functional architecture.

**Module Structure:**
```
app/lib/monitoring/
├── index.ts                # Main entry point, unified exports
├── types.ts                # Shared type definitions and enums
├── dashboardMetrics.ts     # Dashboard-specific gauge metrics
├── errorHandling.ts        # Supabase error handling utilities
└── core/
    ├── logger.ts          # Structured logging with Sentry
    ├── metrics.ts         # Event tracking and business metrics
    └── performance.ts     # Performance monitoring with spans
```

**Core Modules:**

#### 1. Logger (`core/logger.ts`)

Structured logging with automatic Sentry integration using a functional API:

```typescript
import { logger } from '@/app/lib/monitoring';

// Available functions: debug(), info(), warn(), error()
logger.info('RSVP submission started', {
  component: 'RSVPForm',
  operation: 'rsvp.submit',
  metadata: { guestCount: 2 }
});

logger.error('Database error', error, {
  component: 'useRsvpData',
  operation: 'db.query'
});

logger.debug('Detailed debugging info', { data: someData });
```

**Behavior:**
- All levels log to console with formatted output
- `error()` → Captures to Sentry via `captureException()` or `captureMessage()`
- `warn()` → Captures to Sentry with warning level
- `info()` and `debug()` → Sentry breadcrumbs only (not captured as events)
- Development mode: Full console logging
- Production mode: Console + Sentry integration

#### 2. Performance (`core/performance.ts`)

Measure operation performance with Sentry spans using a functional API:

```typescript
import { performance, OperationType } from '@/app/lib/monitoring';

// Async operations (most common)
const result = await performance.measureAsync(
  OperationType.RSVP_FETCH,
  'fetch_all_rsvps',
  async () => {
    return await supabase.from('rsvps').select('*');
  }
);

// Synchronous operations
const value = performance.measure(
  OperationType.RSVP_SUBMIT,
  'validate_form',
  () => {
    return schema.parse(formData);
  }
);

// Manual metrics recording
performance.recordMetric('form.submission.time', 1234.56);
performance.setGauge('rsvp.total', 42);
```

**Features:**

- Automatic slow operation detection with configurable thresholds
- Distribution metrics for performance analysis in Sentry
- Automatic status setting (ok/internal_error)
- Development mode: console.debug only (no Sentry overhead)
- Production mode: Full Sentry span tracking with timing

**Configurable Thresholds:**

- `AUTH_LOGIN`: 3000ms
- `AUTH_LOGOUT`: 500ms
- `AUTH_CHECK`: 1000ms
- `RSVP_SUBMIT`: 3000ms
- `RSVP_FETCH`: 2000ms
- `RSVP_UPDATE`: 2000ms
- `RSVP_DELETE`: 1500ms

#### 3. Metrics (`core/metrics.ts`)

Event tracking and business metrics using a functional API:

```typescript
import {
  metrics,
  MetricEvent
} from '@/app/lib/monitoring';

// Generic event tracking
metrics.track(MetricEvent.PAGE_VIEW, { path: '/admin' });
metrics.track(MetricEvent.RSVP_FORM_STARTED);

// Specific tracking functions (convenience wrappers)
metrics.trackRsvpSubmission(true, { guestCount: 2, attending: 'yes' });
metrics.trackValidationError('email', 'invalid_format', 'Neplatný email');
metrics.trackFormAbandonment({
  formName: 'rsvp',
  lastField: 'accommodation',
  completionPercentage: 60,
  timeSpentMs: 45000
});
metrics.trackPageView('/admin', { userId: 'admin@example.com' });
metrics.trackSectionView('hero');
metrics.trackAdminOperation('delete_rsvp', true, { rsvpId: '123' });
```

**Available Functions:**

- `track(event, data?)` - Generic event tracking with MetricEvent enum
- `trackRsvpSubmission(success, data)` - RSVP form submissions
- `trackValidationError(field, errorType, errorMessage)` - Form validation errors
- `trackFormAbandonment(data)` - Form abandonment events with completion %
- `trackPageView(path, metadata?)` - Page view tracking
- `trackSectionView(sectionName)` - Section visibility tracking
- `trackAdminOperation(operation, success, metadata?)` - Admin actions

**MetricEvent Enum:**

- `RSVP_FORM_STARTED` - User started filling RSVP form
- `RSVP_FORM_SUBMITTED` - RSVP form submitted
- `ADMIN_LOGIN_ATTEMPT` - Admin login attempt
- `PAGE_VIEW` - Page view event
- `SECTION_VIEWED` - Section scrolled into view

#### 4. Dashboard Metrics (`dashboardMetrics.ts`)

Gauge metrics for business analytics:

```typescript
import { updateDashboardMetrics } from '@/lib/monitoring';

// Update all dashboard metrics after data fetch
updateDashboardMetrics(rsvpData);
```

**Metrics Tracked:**
- `rsvp.total` - Total submissions
- `rsvp.attending` / `rsvp.not_attending` - Attendance counts
- `rsvp.attendance_rate` - Percentage attending
- `rsvp.total_guests` - Total guest count
- `rsvp.dietary_restrictions` - Count with dietary needs
- `rsvp.accommodation_needed` - Guests needing accommodation
- `rsvp.children_count` / `rsvp.pets_count` - Children and pets
- `rsvp.drink.[choice]` - Drink preference distribution
- `rsvp.accommodation.[type]` - Accommodation type distribution

#### 5. Error Handling (`errorHandling.ts`)

Unified error handling for Supabase operations:

```typescript
import { handleSupabaseError } from '@/lib/monitoring';

const { data, error } = await supabase.from('rsvps').select('*');
if (error) {
  const message = handleSupabaseError(error, 'useRsvpData', 'fetch_rsvps');
  // Returns user-friendly Czech message
}
```

### Global Error Boundary

`app/global-error.tsx` catches unhandled errors:
- Automatically logs to Sentry via `captureException()`
- Displays user-friendly error page in Czech
- Provides retry and page reload options

### Usage in Components

All monitoring functionality is imported from the unified `@/app/lib/monitoring` module:

```typescript
'use client';

import {
  logger,
  performance,
  metrics,
  OperationType,
  MetricEvent
} from '@/app/lib/monitoring';

export function RSVPForm() {
  const handleSubmit = async (data: RSVPFormData) => {
    // Log the operation start
    logger.info('Starting RSVP submission', {
      component: 'RSVPForm',
      operation: 'rsvp.submit'
    });

    // Track form submission event
    metrics.track(MetricEvent.RSVP_FORM_SUBMITTED);

    // Measure performance with Sentry span
    const result = await performance.measureAsync(
      OperationType.RSVP_SUBMIT,
      'submit_rsvp_form',
      async () => {
        return await supabase.rpc('submit_rsvp', data);
      }
    );

    // Track submission success/failure
    metrics.trackRsvpSubmission(!result.error, {
      guestCount: data.names.length,
      attending: data.attending
    });

    if (result.error) {
      logger.error('RSVP submission failed', result.error, {
        component: 'RSVPForm'
      });
    }
  };
}
```

**Best Practices:**

- Import from `@/app/lib/monitoring` for all monitoring needs
- Use namespace imports (`logger.info`, `performance.measureAsync`, `metrics.track`)
- Use `OperationType` enum for performance tracking
- Use `MetricEvent` enum for event tracking
- Always log errors with context for better debugging

---

## Deployment

### GitHub Actions Workflow

[.github/workflows/deploy.yml](.github/workflows/deploy.yml):

1. **Detect Changes** - Filter changed files (app/ vs supabase/)
2. **Build** - If app files changed:
   - Build Next.js with Supabase env vars
   - Upload to GitHub Pages artifact
3. **Migrate** - If supabase files changed:
   - Link to Supabase project
   - Push migrations via `supabase db push`
4. **Deploy** - Deploy artifact to GitHub Pages

**Required GitHub Secrets:**
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- `NEXT_PUBLIC_ADMIN_USER` - Admin email for authentication
- `SUPABASE_ACCESS_TOKEN` - Supabase access token for migrations
- `SUPABASE_PROJECT_ID` - Supabase project ID
- `SUPABASE_DB_PASSWORD` - Supabase DB password
- `NEXT_PUBLIC_SENTRY_DSN` - Sentry DSN for error tracking
- `SENTRY_AUTH_TOKEN` - Sentry auth token for source map upload

**Required GitHub Variables:**
- `NEXT_PUBLIC_SENTRY_ORG` - Your Sentry organization slug
- `NEXT_PUBLIC_SENTRY_PROJECT_ID` - Your Sentry project ID

### Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Static export
npm run export  # Adds .nojekyll file

# Lint
npm run lint
```

Output directory: `out/`

---

## Database Development

### Local Supabase

```bash
# Start local instance (requires Docker)
supabase start

# Stop
supabase stop

# Check status
supabase status

# Reset database
supabase db reset
```

Local endpoints:
- API: http://localhost:54321
- DB: postgresql://postgres:postgres@localhost:54322/postgres
- Studio: http://localhost:54323

### Migrations

```bash
# Create migration
supabase migration new migration_name

# Apply locally
supabase db push

# Push to production (requires link)
supabase link --project-ref <project-ref>
supabase db push
```

Migration files: [supabase/migrations/](supabase/migrations/)

### Seed Data

[supabase/seed.sql](supabase/seed.sql) contains test data. Runs automatically on `supabase db reset`.

---

## Common Tasks

### Adding a New Form Field

1. Update TypeScript type in [app/lib/types.ts](app/lib/types.ts)
2. Add Zod validation in [app/lib/validations.ts](app/lib/validations.ts)
3. Add database column via migration
4. Update [app/components/forms/RSVPForm.tsx](app/components/forms/RSVPForm.tsx)
5. Update admin table/edit modal if needed

### Adding a New Admin Feature

1. Create component in [app/components/admin/](app/components/admin/)
2. Add custom hook in [app/hooks/](app/hooks/) if needed
3. Update [app/admin/page.tsx](app/admin/page.tsx)
4. Ensure RLS policies allow authenticated access

### Customizing Wedding Data

Edit [app/lib/constants.ts](app/lib/constants.ts):
- `WEDDING_INFO.couple` - Names
- `WEDDING_INFO.date` - Date and time
- `WEDDING_INFO.venue` - Ceremony and reception details
- `WEDDING_INFO.schedule` - Timeline events
- Label mappings for Czech translations

---

## Troubleshooting

### Supabase Connection Issues
- Check `.env.local` variables
- Verify Supabase project is running
- Check browser console for CORS errors

### Build Failures
- Clear `.next`: `rm -rf .next`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run build`

### Database Migration Errors
- Check migration SQL syntax
- Verify local Supabase is running
- Reset local DB: `supabase db reset`

### GitHub Actions Deployment Failures
- Verify all secrets are set in GitHub
- Check workflow logs for specific errors
- Ensure Supabase project is accessible

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Zod Documentation](https://zod.dev)
