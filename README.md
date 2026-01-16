# Svatba

A Czech wedding website with RSVP functionality and admin dashboard.

---

## Features

### Public Website

- Responsive wedding website with animated hero section
- Wedding information (venue, date, schedule)
- RSVP form with validation
- Smooth scroll animations
- Mobile-first design

### Admin Dashboard

- Password-protected admin panel
- View all RSVP submissions
- Statistics cards (attendance, drinks, accommodation, children, pets)
- Edit and delete RSVP entries
- Real-time data updates

### Monitoring & Analytics

- Comprehensive error tracking with Sentry
- Performance monitoring and slow operation detection
- Session replay for debugging user issues
- Business metrics tracking (RSVP stats, attendance, preferences)
- Form abandonment tracking
- Page and section view tracking

---

## Tech Stack

**Frontend:**

- [Next.js 16](https://nextjs.org) - React framework with App Router
- [React 19](https://react.dev) - UI library
- [TypeScript](https://www.typescriptlang.org) - Type safety
- [Tailwind CSS v4](https://tailwindcss.com) - Styling
- [Zod](https://zod.dev) - Form validation

**Backend:**

- [Supabase](https://supabase.com) - PostgreSQL database, authentication, RPC
- PostgreSQL 17 - Database
- Row-level security for data protection

**Monitoring:**

- [Sentry](https://sentry.io) - Error tracking, performance monitoring, session replay

**Deployment:**

- GitHub Actions - CI/CD pipeline
- GitHub Pages - Static site hosting

---

## Getting Started

### Prerequisites

- Node.js 20+
- Docker Desktop (for local Supabase development)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/svatba.git
cd svatba

# Install dependencies
npm install

# Copy environment variables template
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# Start local Supabase instance (requires Docker)
npx supabase start

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Edit the `.env.local` file with:

```bash
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_ADMIN_USER=admin@example.com

# Sentry (optional - for error tracking and monitoring)
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
NEXT_PUBLIC_SENTRY_ORG=your_sentry_org
NEXT_PUBLIC_SENTRY_PROJECT_ID=your_sentry_project_id
SENTRY_AUTH_TOKEN=your_sentry_auth_token
```

For local development with `npx supabase start`, get Supabase credentials from `supabase status -o env`.

---

## Project Structure

```text
svatba/
├── app/
│   ├── components/
│   │   ├── admin/          # Admin dashboard components
│   │   ├── forms/          # Form components (RSVP form)
│   │   ├── sections/       # Page sections (Hero, RSVP, FAQ, etc.)
│   │   └── ui/             # Reusable UI components
│   ├── hooks/              # Custom React hooks (7 hooks)
│   ├── lib/
│   │   ├── monitoring/     # Monitoring system (Sentry integration)
│   │   ├── errors/         # Error handling utilities
│   │   ├── utils/          # Helper functions
│   │   ├── supabase.ts     # Supabase client
│   │   ├── types.ts        # TypeScript types
│   │   ├── constants.ts    # Wedding data
│   │   └── validations.ts  # Zod schemas
│   ├── admin/              # Admin pages (dashboard, login)
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   ├── global-error.tsx    # Error boundary
│   └── globals.css         # Global styles
├── supabase/
│   ├── migrations/         # Database migrations (2 migrations)
│   ├── seed.sql            # Test data
│   └── config.toml         # Supabase config
├── public/                 # Static assets
└── instrumentation-client.ts  # Sentry initialization
```

---

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run export       # Build static site with .nojekyll
```

### Database

```bash
npx supabase start       # Start local Supabase
npx supabase stop        # Stop local Supabase
npx supabase status      # View local endpoints
npx supabase db reset    # Reset database with migrations
```

### Adding Custom Wedding Data

Edit [app/lib/constants.ts](app/lib/constants.ts) to customize:

- Couple names
- Wedding date and time
- Venue details
- Schedule timeline
- Contact information

---

## Architecture

### Static Export

The application is configured as a static site (`output: 'export'` in `next.config.ts`):

- No server-side rendering at runtime
- No Next.js API routes
- All data operations through Supabase client-side
- Deployable to any static host

### Database Schema

**Table: `rsvps`**

- Stores guest information and form responses
- Supports multiple guests per submission
- Row-level security for admin-only access

**View: `rsvp_submissions`**

- Formatted view for admin dashboard
- Groups guests by submission

**Function: `submit_rsvp()`**

- Public RPC function for form submissions
- Handles multiple guests in one transaction

See [DEVELOPMENT.md](DEVELOPMENT.md) for complete schema documentation.

---

## Deployment

### GitHub Actions

Automated deployment on push to `main` branch:

1. **Build** - Compiles Next.js app with environment variables
2. **Migrate** - Applies database migrations to Supabase
3. **Deploy** - Publishes to GitHub Pages

### Required GitHub Secrets

Configure in repository settings → Secrets and variables → Actions:

**Supabase:**

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- `NEXT_PUBLIC_ADMIN_USER` - Admin email for authentication
- `SUPABASE_ACCESS_TOKEN` - Supabase access token for migrations
- `SUPABASE_PROJECT_ID` - Supabase project ID
- `SUPABASE_DB_PASSWORD` - Supabase DB password

**Sentry (optional but recommended):**

- `NEXT_PUBLIC_SENTRY_DSN` - Sentry DSN for error tracking
- `SENTRY_AUTH_TOKEN` - Sentry auth token for source map upload

**Variables:**

- `NEXT_PUBLIC_SENTRY_ORG` - Your Sentry organization slug
- `NEXT_PUBLIC_SENTRY_PROJECT_ID` - Your Sentry project ID

### Manual Deployment

```bash
npm run build
# Upload ./out directory to your static host
```

---

## Admin Access

1. Navigate to `/admin/login`
2. Enter password (configured in Supabase Auth)

Admin features:

- View all RSVP submissions
- See attendance statistics
- Edit guest information
- Delete submissions

---

## Design

**Color Palette:**

- Beige (#ebe1d1) - Primary background
- Green (#41644a) - Accent, buttons
- Orange (#e9762b) - Secondary accent
- Amber (#fbbf24) - Highlights

**Typography:**

- Offside (Google Font) - Sans serif
- Bilbo (Google Font) - Decorative serif
- Geist Mono - Code/technical

**Features:**

- Animated SVG mill with couple names
- Smooth scroll animations
- Responsive design (mobile-first)
- Czech language throughout

---

## Contributing

This is a private wedding website project. If you're building your own wedding site based on this:

1. Fork the repository
2. Update wedding data in [app/lib/constants.ts](app/lib/constants.ts)
3. Configure your own Supabase project
4. Customize design/colors as needed
5. Deploy to your preferred host

---

## License

Private project for personal use. [MIT license](./LICENSE)

---

## Documentation

- [DEVELOPMENT.md](DEVELOPMENT.md) - Complete development guide
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)

---

Built with Next.js 16, React 19, and Supabase.
