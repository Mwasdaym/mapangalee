# Design Guidelines: Kariua Parish Catholic Music Website

## Design Approach

**Selected Approach:** Reference-based with spiritual/reverent aesthetic

Draw inspiration from contemplative, spiritually-focused websites that balance visual reverence with modern functionality. Think National Shrine websites, Vatican News, and Pray.com - combining timeless elegance with contemporary web patterns.

**Core Principles:**
- Reverent minimalism: Clean, uncluttered layouts that invite contemplation
- Warmth and accessibility: Welcoming to all visitors regardless of tech familiarity
- Visual hierarchy that guides the spiritual journey through content

## Typography System

**Font Families (Google Fonts):**
- **Primary (Headers):** Cinzel or Cormorant Garamond - serif fonts with classical, reverent elegance for "KARIUA PARISH" and section headings
- **Body Text:** Inter or Source Sans Pro - highly readable sans-serif for prayers, descriptions, and UI elements
- **Accent (Optional decorative):** EB Garamond for prayer titles

**Hierarchy:**
- Hero title: text-5xl to text-7xl, font-bold
- Section headings: text-3xl to text-4xl, font-semibold
- Prayer titles: text-2xl, font-medium
- Body text: text-base to text-lg for readability
- Captions/metadata: text-sm

## Layout System

**Spacing Primitives (Tailwind):**
Use consistent spacing units of **4, 6, 8, 12, 16, and 24** (e.g., p-4, mb-8, gap-6, py-16, mt-24)

**Container Strategy:**
- Full-width hero sections with inner max-w-7xl
- Content sections: max-w-6xl mx-auto
- Prayer text: max-w-3xl for optimal reading width
- Video grid: max-w-7xl

**Vertical Rhythm:**
- Section padding: py-16 on mobile, py-24 on desktop
- Component spacing: mb-12 to mb-16 between major elements
- Generous whitespace for contemplative feel

## Page Structures

### Homepage
1. **Hero Section (100vh):**
   - Full-screen Maria background image (gentle overlay for text legibility)
   - Centered content: "KARIUA PARISH" (large, elegant), "by Fr Karani" (subtitle)
   - Primary CTA: "Explore Our Music" with blurred backdrop
   - Secondary CTA: "View Prayers"
   - Subtle scroll indicator

2. **Welcome Section:**
   - Single column, centered max-w-3xl
   - Brief parish introduction with warm, inviting copy
   - Include small decorative cross or religious symbol

3. **Featured Content Preview:**
   - 2-column grid (md:grid-cols-2) showing latest video and featured prayer
   - Each card with image/thumbnail, title, brief excerpt
   - "View All" links for each category

4. **Footer:**
   - Parish contact information, Mass times
   - Quick links to main sections
   - Social media links (YouTube channel, Facebook if applicable)
   - Copyright and attribution

### Music/Videos Page
1. **Page Header:**
   - Page title with decorative underline or accent
   - Search bar for filtering videos
   - Category filters (Hymns, Masses, Choral, Instrumental)

2. **Video Grid:**
   - 3-column grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
   - Video cards with:
     - Thumbnail from YouTube
     - Title overlay on hover
     - Duration badge
     - Play icon overlay
   - Embedded YouTube player in modal on click

3. **Audio Player Section:**
   - Sticky bottom player bar when video is playing
   - Play/pause, title, progress bar, volume control
   - Minimize to continue browsing while listening

### Prayers Page
1. **Prayer Navigation:**
   - Horizontal tabs or pill navigation for categories
   - Categories: Traditional Prayers, Rosary, Novenas, Daily Prayers

2. **Prayer Display:**
   - Single column layout with max-w-3xl
   - Each prayer in a card/section:
     - Decorative prayer title with small cross icon
     - Prayer text in generous text-lg with line-height-relaxed
     - Latin version toggle where applicable
     - Print/share options
   - Generous spacing (mb-16) between prayers

3. **Prayer Cards Grid (alternative view):**
   - 2-column grid for browsing all prayers
   - Cards with prayer name, opening line preview
   - Click to expand to full prayer view

## Component Library

### Navigation
- Fixed header with subtle shadow on scroll
- Logo/Parish name on left
- Navigation links: Home, Music, Prayers, About, Contact
- Mobile: Hamburger menu with slide-in drawer

### Cards
- Subtle shadow (shadow-md), rounded corners (rounded-lg)
- Hover state: slight lift (hover:shadow-xl transform hover:-translate-y-1)
- Padding: p-6 to p-8

### Video Components
- YouTube embed with 16:9 aspect ratio
- Custom play button overlay before load
- Metadata: title, upload date, view count
- Share and favorite buttons

### Prayer Components
- Elegant card design with ample padding (p-8 to p-12)
- Decorative dividers between sections
- Print-friendly styling
- Optional audio playback for guided prayers

### Buttons
- Primary: Rounded (rounded-full), generous padding (px-8 py-3)
- On images: Backdrop blur (backdrop-blur-sm) with semi-transparent background
- Icon + text combinations for CTAs
- No hover states needed (automatically handled)

## Images Strategy

**Required Images:**
1. **Hero Background:** Maria (Virgin Mary) image - serene, high-quality photograph or artistic rendering. Should be calming, with soft lighting. Place gentle dark overlay (bg-black/40) for text legibility.

2. **Prayer Section Backgrounds:** Optional subtle background patterns or textures (crosses, rosary patterns) at very low opacity

3. **Placeholder for Featured Content:** Stock images of church interior, candles, stained glass for section backgrounds or card imagery where video thumbnails not available

4. **Icons:** Use Font Awesome for religious symbols (fa-cross, fa-hands-praying, fa-book-bible, fa-play, fa-music)

**Hero Image Implementation:**
- Large, full-viewport hero image (100vh)
- Object-fit: cover, object-position: center
- Overlay gradient for text contrast
- Mobile-optimized version for performance

## Accessibility & Usability

- High contrast text on all backgrounds
- Keyboard navigation for all interactive elements
- Skip to content link for screen readers
- Prayer text must be copyable and printable
- Video controls fully accessible with ARIA labels
- Focus indicators on all interactive elements

## Special Considerations

- Respectful handling of sacred content and imagery
- Print stylesheet for prayers (remove navigation, optimize for paper)
- Fast loading times even with video content (lazy loading)
- Offline-friendly prayer access (service worker caching)
- Share functionality for spreading faith content