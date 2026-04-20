# Premium Digital Wedding Invitation - Bugis Theme

A full-stack modern digital wedding invitation built with Next.js 15, Tailwind CSS 4, Framer Motion, and Firebase.

## Features
- **Bugis Theme**: Authentic luxury Bugis styling with Maroon `#6B0F1A`, Gold `#D4AF37`, and Ivory `#F8F5F0`.
- **Dynamic Link**: `/invite/[name]` automatically greets the guest.
- **Heavy Animations**: Framer Motion for scroll reveal, parallax, sparkles, fade, and zoom.
- **Optimized Storage**: Uses local hardcoded WebP images for backgrounds to save Firebase Storage limits.
- **Complete Sections**: Cover, Hero, Couple, Love Story, Schedule, Gallery, RSVP, Wishes, Gift, Maps.
- **Admin Dashboard**: Scaffolded UI for managing RSVPs, guests, and analytics.

## How to Switch Themes (Multi Theme Strategy)
This project is built to support multi-themes easily:
1. **Theme Bugis Royal** (Current)
2. **Theme Modern White Gold**
3. **Theme Dark Luxury**

To change the theme, you can clone the project and modify the CSS variables in `src/app/globals.css` and the hardcoded images in the `public/images/` directory. By updating `--color-brand-maroon`, `--color-brand-gold`, and `--color-brand-ivory`, the entire application will reflect the new colors automatically due to Tailwind CSS 4 `@theme` integration.

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Setup Firebase:
   Add your Firebase configuration to `.env.local`:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   ...
   ```
3. Run Development Server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000/invite/Tamu-Kehormatan` to view the invitation.
