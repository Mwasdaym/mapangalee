# Kariua Parish Catholic Music Website

## Overview

This is a full-stack web application for Kariua Parish, a Catholic community led by Fr. Karani. The website serves as a digital platform for sharing sacred music, traditional Catholic prayers, and devotional content. The application features a reverent, minimalist design inspired by contemplative spiritual websites, combining visual reverence with modern functionality.

The platform allows visitors to explore Catholic hymns and masses through YouTube integration, access traditional prayers in both English and Latin, submit prayer requests that are sent to church leadership via Telegram, and interact with an AI-powered chat assistant for questions about the parish and Catholic faith.

## Key Features

- **Sacred Music Library**: YouTube integration for Catholic hymns, masses, and devotional content
- **Prayer Resources**: Traditional Catholic prayers in English and Latin
- **Prayer Intentions**: Community prayer wall where visitors can submit and view prayer requests
- **Telegram Integration**: Prayer requests are automatically sent to church leadership via Telegram bot
- **AI Chat Assistant**: Bottom-right positioned chat widget powered by OpenAI GPT-5 for answering questions about the parish, Catholic faith, and spiritual guidance
- **Responsive Design**: Mobile-first approach with accessibility features

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React with TypeScript for type-safe component development
- Vite as the build tool and development server, chosen for fast HMR and optimized production builds
- Wouter for lightweight client-side routing (alternative to React Router, reducing bundle size)

**UI Component Library:**
- Shadcn/ui (New York style variant) with Radix UI primitives for accessible, headless components
- Tailwind CSS for utility-first styling with custom design system
- Class Variance Authority (CVA) for managing component variants

**State Management:**
- TanStack Query (React Query) for server state management, caching, and data fetching
- Local React state for UI-specific concerns

**Design System:**
- Custom color palette using CSS variables with HSL values for theme support
- Typography hierarchy using Google Fonts: Cinzel/Cormorant Garamond for headers, Inter/Source Sans Pro for body text
- Consistent spacing primitives (4, 6, 8, 12, 16, 24) for vertical rhythm
- Responsive breakpoints with mobile-first approach

### Backend Architecture

**Server Framework:**
- Express.js running on Node.js with TypeScript
- ESM module system for modern JavaScript features

**API Design:**
- RESTful API endpoints under `/api` namespace
- JSON-based request/response format
- Custom logging middleware for API request tracking

**Development Workflow:**
- Vite middleware integration for seamless dev experience
- Hot module replacement (HMR) for rapid development
- Separate build outputs for client (static assets) and server (Node.js bundle)

### Data Storage Solutions

**Database:**
- PostgreSQL as the primary database (via Neon serverless)
- Drizzle ORM for type-safe database queries and schema management
- Schema-first approach with TypeScript types generated from database schema

**Session Management:**
- connect-pg-simple for PostgreSQL-backed session storage
- Designed to support authentication flows (infrastructure in place)

**In-Memory Storage:**
- MemStorage class for development/testing purposes
- Provides user management interface without database dependency

### External Dependencies

**YouTube Data API v3:**
- Fetches Catholic hymns, masses, and devotional music videos
- Search functionality with relevance language filtering and safe search
- Video details including thumbnails, duration, channel information
- API key authentication required via environment variable `YOUTUBE_API_KEY`

**OpenAI API (GPT-5):**
- Powers the AI chat assistant for parish and faith-related inquiries
- Context-aware responses about Catholic teachings, prayers, and parish activities
- System prompt customized for Kariua Parish under Fr. Karani
- API key required via environment variable `OPENAI_API_KEY`
- Max completion tokens set to 500 for concise responses

**Telegram Bot API:**
- Sends prayer request notifications to church leadership
- Formatted messages with submitter name, intention, and timestamp
- HTML parse mode for rich text formatting
- Requires `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` environment variables
- Graceful error handling - prayer saved even if Telegram delivery fails

**Google Fonts:**
- Cinzel and Cormorant Garamond for elegant, reverent headers
- Inter and Source Sans Pro for readable body text
- EB Garamond for decorative prayer titles

**Database Service:**
- Neon (serverless PostgreSQL) configured via `DATABASE_URL` environment variable
- Connection managed through @neondatabase/serverless driver

**Deployment Platform:**
- Configured for Replit deployment with custom Vite plugins
- Runtime error overlay and development banner for Replit environment
- Cartographer plugin for enhanced debugging on Replit
- **Production Deployment:**
  - Render.com configuration via `render.yaml` for one-click deployment
  - VPS deployment guide in `DEPLOYMENT.md` with full setup instructions
  - Health check endpoint at `/api/health` for monitoring
  - Environment-based configuration supporting both development and production

### Key Architectural Decisions

**Monorepo Structure:**
- Shared schema definitions in `/shared` for type safety across client and server
- Path aliases configured (`@/`, `@shared/`, `@assets/`) for clean imports
- Single TypeScript configuration covering all packages

**Type Safety:**
- Zod schemas for runtime validation and TypeScript type inference
- Drizzle-zod integration for database schema validation
- Strict TypeScript configuration with comprehensive type checking

**Styling Approach:**
- Utility-first with Tailwind for rapid development
- Custom CSS variables for theme consistency (light/dark mode support)
- Shadcn/ui components customized to match spiritual aesthetic

**Performance Considerations:**
- Lazy loading and code splitting via Vite
- Optimized asset bundling with separate client/server builds
- Query caching with TanStack Query to minimize API calls

**Accessibility:**
- Radix UI primitives ensure WCAG compliance
- Semantic HTML structure throughout
- Keyboard navigation support in all interactive components