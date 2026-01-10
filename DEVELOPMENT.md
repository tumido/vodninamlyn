# Czech Wedding Website - Development Documentation

## Project Overview

A single-page Czech wedding website built with Next.js 16, featuring a predominantly white layout with artsy, playful animated vector art and pastel blue/orange accents.

**Tech Stack:**
- Next.js 16.1.1 (App Router)
- React 19.2.3
- TypeScript
- Tailwind CSS v4
- Zod (form validation)
- Supabase (backend - to be configured)

**Architecture:**
- Client-side only (static export)
- No Next.js API routes
- Supabase Edge Functions for backend (planned)
- GitHub Pages deployment (planned)

---

## What We've Built So Far

### 1. Foundation & Configuration

#### Dependencies Installed
```bash
npm install zod @supabase/supabase-js
npm install -D supabase  # Supabase CLI
```

#### Configuration Files

**next.config.ts**
- Added `output: 'export'` for static HTML generation
- Enables deployment to GitHub Pages or any static host

**package.json**
- Added `"export": "next build && touch out/.nojekyll"` script
- For GitHub Pages deployment

**app/globals.css**
- Added pastel color variables:
  - Pastel Blue: `#b8d4e8` (light: `#d9e9f3`, dark: `#8fb8d4`)
  - Pastel Orange: `#ffd4a3` (light: `#ffe9cc`, dark: `#ffbd7a`)
- Added CSS animation keyframes:
  - `@keyframes float` - Vertical floating animation (3s)
  - `@keyframes float-slow` - Slow floating with rotation (6s)
  - `@keyframes draw-line` - SVG path drawing animation
- Removed dark mode styles
- Added `scroll-behavior: smooth` for smooth scrolling

**app/layout.tsx**
- Changed language from `lang="en"` to `lang="cs"`
- Updated metadata:
  - Title: "Naše Svatba"
  - Description: "Srdečně vás zveme na naši svatbu"

### 2. Core Library Files

#### app/lib/types.ts
TypeScript interfaces for all data structures:
- `RSVPFormData` - RSVP form data structure
- `RSVPSubmission` - RSVP with ID and timestamp
- `Address` - Street, city, zip
- `Coordinates` - Latitude/longitude
- `Venue` - Complete venue information
- `ScheduleItem` - Timeline event structure
- `WeddingInfo` - Complete wedding information structure

#### app/lib/constants.ts
Wedding data configuration (currently placeholder data):
- Couple names (bride/groom)
- Wedding date and time
- Venue information:
  - Ceremony: Kostel svatého Jakuba
  - Reception: Restaurace U Zlatého Lva
- Schedule timeline (4 events: Obřad, Focení, Hostina, Tanec)
- RSVP deadline
- Contact information (email, phone)

**⚠️ TODO: Replace with actual wedding data**

#### app/lib/validations.ts
Zod validation schemas:
- `rsvpSchema` - Complete RSVP form validation
  - Required fields: name, email, attending
  - Conditional validation:
    - If `plusOne` is true, `plusOneName` is required
    - If `attending` is 'ano', `mealPreference` is required
  - Error messages in Czech
- Exported type: `RSVPFormValues`

#### app/lib/supabase.ts
Supabase client initialization:
- Reads environment variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Creates and exports Supabase client instance

### 3. UI Components (app/components/ui/)

All components use arrow function syntax.

#### SectionContainer.tsx
Wrapper component for consistent section spacing:
- Responsive padding (mobile → tablet → desktop)
- Max-width constraint (6xl)
- Centered content
- Optional ID for scroll anchors

#### Button.tsx
Styled button with variants:
- Variants: `primary` (pastel blue), `secondary` (pastel orange)
- Loading state with spinner
- Disabled state handling
- Hover and active animations

#### Input.tsx
Form input component:
- Error state styling (red border/background)
- Focus ring with pastel blue
- Hover effects
- Rounded corners

#### Select.tsx
Dropdown select component:
- Options array prop
- Optional placeholder
- Error state styling
- Consistent styling with Input component

#### FormField.tsx
Form field wrapper combining label, input, and error message:
- Required field indicator (*)
- Error message display
- Accessible label with `htmlFor`

### 4. Animation Components (app/components/animations/)

#### ScrollReveal.tsx
Client-side component using Intersection Observer:
- Fades in and slides up when element enters viewport
- 700ms transition duration
- 10% threshold for triggering
- Cleanup on unmount

#### FloatingHeart.tsx
Animated SVG heart decoration:
- Size prop (default: 40px)
- Color variants: blue/orange
- Uses `animate-float-slow` class
- SVG heart path with customizable fill color

#### AnimatedDivider.tsx
Decorative section separator:
- Animated curved line (SVG path)
- Floating dot at center
- Uses both `animate-draw` and `animate-float` animations
- Pastel blue line, orange dot

### 5. Section Components (app/components/sections/)

#### Hero.tsx
Full-screen landing section:
- Gradient background (white → neutral-50)
- Floating decorative hearts (4 hearts with varied positioning)
- Couple names with elegant typography
- Wedding date and time display
- Animated scroll indicator arrow
- Data from `WEDDING_INFO.couple` and `WEDDING_INFO.date`

#### WeddingDetails.tsx
Venue information section:
- Two venue cards (ceremony and reception)
- Venue name, address display
- Google Maps links
- Scroll reveal animation
- Animated divider separator
- Data from `WEDDING_INFO.venue`

#### Schedule.tsx
Timeline of the day:
- Responsive grid (1 → 2 → 4 columns)
- Each item shows: icon (emoji), time, title, description
- Centered card layout
- Data from `WEDDING_INFO.schedule`

#### RSVP.tsx (Most Complex Component)
Full RSVP form with validation:

**Form Fields:**
- Jméno a příjmení (name) - required
- Email - required
- Zúčastním se (attending) - radio buttons (ano/ne) - required
- Doprovodná osoba (plus one) - checkbox
- Jméno doprovodu (plus one name) - conditional, shown if plus one checked
- Preferovaný oběd (meal preference) - select (maso/ryba/vegetarian/vegan) - conditional, shown if attending 'ano'
- Dietní omezení (dietary restrictions) - textarea, optional
- Vzkaz (message) - textarea, optional

**Form Features:**
- Client-side validation with Zod
- Real-time error display
- Conditional field rendering
- Loading state during submission
- Success/error messages
- Form reset on successful submission

**Current State:**
- Form submits to console (simulated delay of 1.5s)
- TODO: Integrate with Supabase Edge Function

#### Footer.tsx
Site footer:
- Dark background (neutral-900)
- Couple names display
- Contact information (email, phone)
- Decorative floating hearts
- Wedding date reminder

### 6. Main Page Assembly (app/page.tsx)

Simple composition of all sections:
```tsx
<Hero />
<WeddingDetails />
<Schedule />
<RSVP />
<Footer />
```

All sections flow vertically in order.

### 7. Static Export Configuration

#### public/.nojekyll
Empty file that prevents GitHub Pages from ignoring Next.js files starting with underscore.

#### .env.local.example
Template for environment variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**⚠️ TODO: Create actual `.env.local` file with real credentials when Supabase is set up**

---

## Project Structure

```
svatba/
├── app/
│   ├── components/
│   │   ├── animations/
│   │   │   ├── AnimatedDivider.tsx
│   │   │   ├── FloatingHeart.tsx
│   │   │   └── ScrollReveal.tsx
│   │   ├── sections/
│   │   │   ├── Footer.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── RSVP.tsx
│   │   │   ├── Schedule.tsx
│   │   │   └── WeddingDetails.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── FormField.tsx
│   │       ├── Input.tsx
│   │       ├── SectionContainer.tsx
│   │       └── Select.tsx
│   ├── lib/
│   │   ├── constants.ts      (customize with real data!)
│   │   ├── supabase.ts
│   │   ├── types.ts
│   │   └── validations.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── supabase/
│   ├── migrations/
│   │   └── 20260107193342_create_rsvps_table.sql
│   ├── config.toml
│   └── .gitignore
├── public/
│   └── .nojekyll
├── .env.local.example
├── next.config.ts
├── package.json
└── DEVELOPMENT.md (this file)
```

---

## Current Status

✅ **Completed:**
- Foundation setup and configuration
- All core library files
- All UI components
- All animation components
- All page sections
- Main page assembly
- Static export configuration
- Dev server running successfully
- **Supabase CLI installed and initialized**
- **Database migration created** (`rsvps` table with constraints and indexes)

🔄 **In Progress / TODO:**
- Customize wedding data in `constants.ts`
- Create custom SVG assets (heart, rings, flower)
- Set up Supabase project (production)
- Link local project to Supabase
- Push migration to production database
- Create Supabase Edge Function for RSVP
- Add environment variables (.env.local)
- Update RSVP component to call Edge Function
- Test form submission end-to-end
- Deploy to GitHub Pages

---

## How to Run

### Development Server
```bash
npm run dev
```
Opens at [http://localhost:3000](http://localhost:3000)

### Build for Production
```bash
npm run build
# or
npm run export  # includes .nojekyll file creation
```

Output will be in the `out/` directory.

---

## Next Steps

### 1. Customize Wedding Data

Edit [app/lib/constants.ts](app/lib/constants.ts) and replace placeholder data:
- Bride and groom names
- Wedding date and time
- Venue names and addresses
- Schedule timeline
- Contact information

### 2. Set Up Supabase

#### Supabase CLI Setup ✅

We've installed and initialized Supabase CLI locally:

```bash
npm install -D supabase    # Installed
npx supabase init          # Initialized - created supabase/ directory
```

#### Database Migration Created ✅

**Migration file:** `supabase/migrations/20260107193342_create_rsvps_table.sql`

This migration creates the `rsvps` table with:

**Columns:**
- `id` - UUID primary key (auto-generated)
- `created_at` - Timestamp of submission
- `name` - Guest's full name (required)
- `email` - Guest's email address (required)
- `attending` - 'ano' or 'ne' (yes/no in Czech, required)
- `plus_one` - Boolean for bringing a guest
- `plus_one_name` - Name of the plus one (required if plus_one is true)
- `meal_preference` - 'maso', 'ryba', 'vegetarian', or 'vegan' (required if attending 'ano')
- `dietary_restrictions` - Optional text field
- `message` - Optional message from guest

**Constraints:**
- Plus one name is required when `plus_one` is true
- Meal preference is required when `attending` is 'ano'
- Attending must be 'ano' or 'ne'
- Meal preference must be one of: maso, ryba, vegetarian, vegan

**Indexes** (for performance):
- `idx_rsvps_email` - For looking up RSVPs by email
- `idx_rsvps_created_at` - For sorting by submission date (DESC)
- `idx_rsvps_attending` - For filtering by attendance status

#### Local Development with Supabase (Optional)

To test locally:

**Prerequisites:**
- Docker Desktop must be installed and running

**Commands:**
```bash
npx supabase start   # Start local instance (runs migrations automatically)
npx supabase stop    # Stop local instance
npx supabase status  # Check status and get local URLs
```

#### Production Deployment Steps

##### 1. Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Wait for project to be provisioned

##### 2. Link Your Local Project
```bash
npx supabase link --project-ref your-project-ref
```

Find your project ref in: Supabase Dashboard → Settings → General

##### 3. Push Migration to Production
```bash
npx supabase db push
```

This applies the migration from `supabase/migrations/` to your production database.

##### 4. Get API Credentials
From Supabase Dashboard → Settings → API:
- Copy **Project URL**
- Copy **anon** public key

Add to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

#### Create Edge Function

Create `supabase/functions/rsvp/index.ts`:

```typescript
// TODO: Implement Edge Function
// - Validate request body with Zod
// - Insert into rsvps table
// - Send email notification via Resend
// - Return success/error response
```

Deploy with:
```bash
supabase functions deploy rsvp
```

Add secrets:
```bash
supabase secrets set RESEND_API_KEY=xxx WEDDING_EMAIL=xxx
```

#### Add Environment Variables

Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_actual_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_key
```

#### Update RSVP Component

In [app/components/sections/RSVP.tsx](app/components/sections/RSVP.tsx), replace the TODO section with actual Supabase Edge Function call.

### 3. Create Custom SVG Assets

Create wedding-themed SVGs in `/public`:
- `heart.svg` - Heart shape
- `rings.svg` - Wedding rings
- `flower.svg` - Floral decorations

Update animation components to use these custom SVGs.

### 4. Deploy to GitHub Pages

#### Option A: Manual Deployment
```bash
npm run export
# Push out/ directory to gh-pages branch
```

#### Option B: GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
```

Add secrets in GitHub: Settings → Secrets and variables → Actions

---

## Design Guidelines

### Color Palette
- **Background**: White (#ffffff)
- **Pastel Blue**: #b8d4e8 (primary accent)
- **Pastel Orange**: #ffd4a3 (secondary accent)
- **Text**: Neutral shades (#171717 to #404040)

### Typography
- **Headings**: Font-serif, light weight
- **Body**: Geist Sans (modern, clean)
- **Sizes**: Responsive (mobile → desktop)

### Animations
- **Subtle and playful**, not overwhelming
- Float animations for decorative elements
- Scroll reveal for content sections
- Smooth transitions (200-700ms)

### Responsive Breakpoints
- Mobile: 320px+
- Tablet: 768px+
- Desktop: 1280px+

---

## Troubleshooting

### Dev Server Won't Start
If you get a "lock" error:
1. Kill any running Next.js processes
2. Delete `.next` directory: `rm -rf .next`
3. Restart: `npm run dev`

### Tailwind Classes Not Working
Ensure custom colors are defined in `globals.css` under `@theme inline` block.

### Form Validation Not Working
Check Zod schema in `app/lib/validations.ts` and ensure error messages are in Czech.

### Supabase Connection Issues
Verify environment variables are set correctly and Supabase client is initialized.

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Zod Documentation](https://zod.dev)
- [Original Plan](/.claude/plans/curious-fluttering-frog.md)

---

## License

Private project for personal use.

**Built with ❤️ using Next.js 16 and Tailwind CSS v4**
