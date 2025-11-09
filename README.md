# 📻 Radio Istic Dashboard

<div align="center">

![Radio Istic Logo](public/assets/radio-istic-banner.png)

**The official student club dashboard of ISTIC Borj Cédria**

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

[Features](#-features) •
[Tech Stack](#-tech-stack) •
[Installation](#-installation) •
[Usage](#-usage) •
[Project Structure](#-project-structure) •
[Contributing](#-contributing)

</div>

---

## 📖 Table of Contents

- [About](#-about-radio-istic)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [Key Components](#-key-components)
- [Authentication & Security](#-authentication--security)
- [Styling & Design System](#-styling--design-system)
- [API & Data Management](#-api--data-management)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🎯 About Radio Istic

**Radio Istic** is the official student club of ISTIC (Institut Supérieur des Technologies de l'Information et de la Communication) Borj Cédria, Tunisia. This dashboard serves as the central hub for club management, member engagement, event organization, and media production.

### Mission

Enrich student life at ISTIC by providing quality events, training, and media content created by and for students.

### Vision

Build a dynamic community that brings together students passionate about media, technology, creativity, sports, and innovation.

### Core Values

- **Creativity**: Encouraging innovative ideas and unique content
- **Collaboration**: Working together across different fields and years
- **Authenticity**: Staying true to student experiences and voices
- **Inclusion**: Welcoming all students regardless of their background or year

---

## ✨ Features

### 🏠 Dashboard & Overview

- **Real-time Statistics**: Live member count, online status, event participation
- **Quick Stats Cards**: Members (50+), Events (25+), Podcasts (15+), Training (10+)
- **Activity Feed**: Recent club activities and updates
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### 👥 Member Portal

- **Member Directory**: Comprehensive list of all 40+ club members
- **Advanced Filtering**: Filter by field (GLSI, IRS, LISI, LAI, IOT, LT), year (1-3), and online status
- **Search Functionality**: Quick search by name, email, or role
- **Member Profiles**: Detailed profiles with avatar, contact info, motivation, projects, and skills
- **Points & Ranking System**: Gamification with point tracking and leaderboards
- **Bureau Highlighting**: Special badges for bureau members (President, Vice-President, Secretary, etc.)
- **Top Members Section**: Showcase top 5 members by points
- **Online Status Indicators**: Real-time online/offline status

### 📅 Events Management

- **Event Catalog**: Browse upcoming events with detailed information
- **Event Categories**: Sport, Podcast, Social Events (Soirée), Trips (Voyage), Social
- **Event Details**: Date, time, location, participant count, max capacity
- **Event Images**: Visual representation for each event
- **Registration System**: Sign up for events directly from the dashboard
- **Event Types**:
  - **Sports**: Ping-Pong tournaments, Football tournaments, Basketball
  - **Podcasts**: Live recordings with tech industry guests
  - **Social**: Cinema nights, Matchy Matchy networking events
  - **Trips**: Weekend getaways (Ain Draham and other destinations)

### 💬 Real-time Chat System

- **Direct Messaging**: One-on-one conversations with other members
- **Group Conversations**: Multiple participants in a single conversation
- **Real-time Updates**: WebSocket-powered instant messaging
- **Unread Message Badges**: Visual indicators for new messages
- **Message History**: Complete conversation history
- **Typing Indicators**: See when someone is typing
- **Online Status**: See who's currently online
- **Mobile Chat Drawer**: Floating chat button with full-screen drawer on mobile
- **Desktop Chat Panel**: Persistent chat panel in the sidebar on desktop
- **Chat States**: Collapsed, expanded, and full conversation views

### 🎨 Media & Content

- **Media Gallery**: Browse and view club media (podcasts, videos, photos)
- **Podcast Library**: Access all recorded podcast episodes
- **Photo Albums**: Event photos and club activities
- **Video Content**: Club videos and productions

### 🎓 Training & Workshops

- **Training Catalog**: Available workshops and training sessions
- **Skill Development**: Photoshop, Illustrator, video editing, podcast production
- **Registration**: Sign up for training sessions
- **Certifications**: Track completed training

### 👔 Club Life

- **About Section**: Detailed information about the club
- **Bureau Members**: Meet the leadership team with roles and responsibilities
- **Club Activities**: Overview of all club activities
- **Mission & Values**: Core principles and goals

### 🏆 Sponsors Management

- **Sponsor Directory**: List of current and past sponsors
- **Partnership Details**: Sponsor benefits and collaboration information
- **Contact Information**: Direct links to sponsor representatives

### 🔐 Authentication & Authorization

- **User Registration**: New member sign-up flow
- **Login System**: Email-based authentication
- **Protected Routes**: Role-based access control
- **Session Management**: Persistent authentication with localStorage
- **Role System**: Multiple user roles (admin, president, vice-president, secretary, sponsor-manager, events-organizer, media-responsable, member, guest)
- **Profile Management**: User profile viewing and editing

### 🔔 Notifications

- **Real-time Notifications**: Instant alerts for important updates
- **Notification Types**: Info, Warning, Success, Error
- **Priority Levels**: Low, Medium, High
- **Read/Unread Status**: Track which notifications have been seen
- **Notification Center**: Central hub for all notifications

### 📊 Analytics & Tracking

- **Member Activity Tracking**: Monitor member engagement
- **Event Participation**: Track who's attending which events
- **Points System**: Gamification with point rewards
- **Ranking System**: Leaderboards based on participation and contribution

### 🎨 Customization

- **Dark Mode**: Modern dark theme optimized for extended use
- **Custom Font System**: Multiple fonts (Poppins, Inter, JetBrains Mono)
- **Neon Design Language**: Electric blue, neon lime, signal orange accents
- **Responsive Layouts**: Adaptive UI for all screen sizes
- **Smooth Animations**: Framer Motion powered transitions

---

## 🛠️ Tech Stack

### Frontend Framework

- **[Next.js 14.2.16](https://nextjs.org/)** - React framework with App Router
- **[React 18](https://reactjs.org/)** - UI library
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type-safe JavaScript

### Styling

- **[Tailwind CSS 4.1.9](https://tailwindcss.com/)** - Utility-first CSS framework
- **[tailwindcss-animate](https://www.npmjs.com/package/tailwindcss-animate)** - Animation utilities
- **[class-variance-authority](https://cva.style/)** - Component variant management
- **[tailwind-merge](https://www.npmjs.com/package/tailwind-merge)** - Tailwind class merging
- **[clsx](https://www.npmjs.com/package/clsx)** - Conditional classname utility

### UI Components

- **[Radix UI](https://www.radix-ui.com/)** - Headless UI components
  - Accordion, Alert Dialog, Avatar, Checkbox, Dialog, Dropdown Menu
  - Hover Card, Label, Navigation Menu, Popover, Progress
  - Radio Group, Scroll Area, Select, Separator, Slider
  - Switch, Tabs, Toast, Toggle, Tooltip
- **[shadcn/ui](https://ui.shadcn.com/)** - Component collection built on Radix
- **[Lucide React](https://lucide.dev/)** - Icon library (450+ icons)

### Animations

- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Motion](https://motion.dev/)** - Additional animation utilities
- **[@number-flow/react](https://number-flow.barvian.me/)** - Animated number transitions

### Forms & Validation

- **[React Hook Form 7.60.0](https://react-hook-form.com/)** - Form state management
- **[Zod 3.25.76](https://zod.dev/)** - Schema validation
- **[@hookform/resolvers](https://www.npmjs.com/package/@hookform/resolvers)** - Form validation resolvers

### State Management

- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight state management
- **[Immer](https://immerjs.github.io/immer/)** - Immutable state updates
- **React Context API** - Built-in state management for auth and websocket

### Data & Charts

- **[Recharts](https://recharts.org/)** - Chart library for data visualization
- **[date-fns 4.1.0](https://date-fns.org/)** - Date utility library
- **[react-day-picker 9.8.0](https://react-day-picker.js.org/)** - Date picker component

### UI Utilities

- **[cmdk 1.0.4](https://cmdk.paco.me/)** - Command menu component
- **[input-otp 1.4.1](https://input-otp.rodz.dev/)** - OTP input component
- **[sonner 1.7.4](https://sonner.emilkowal.ski/)** - Toast notifications
- **[vaul 0.9.9](https://vaul.emilkowal.ski/)** - Drawer component
- **[embla-carousel-react 8.5.1](https://www.embla-carousel.com/)** - Carousel component
- **[react-resizable-panels 2.1.7](https://github.com/bvaughn/react-resizable-panels)** - Resizable panels

### Fonts

- **[Geist 1.3.1](https://vercel.com/font)** - Vercel's font family
- **Next.js Font Optimization** - Google Fonts (Inter, Poppins, JetBrains Mono)

### Analytics & Monitoring

- **[@vercel/analytics 1.3.1](https://vercel.com/analytics)** - Web analytics
- **[next-themes 0.4.6](https://github.com/pacocoursey/next-themes)** - Theme management

### Development Tools

- **[ESLint](https://eslint.org/)** - Code linting
- **[@eslint/eslintrc](https://www.npmjs.com/package/@eslint/eslintrc)** - ESLint configuration
- **[PostCSS 8.5](https://postcss.org/)** - CSS processing
- **[Autoprefixer 10.4.20](https://github.com/postcss/autoprefixer)** - CSS vendor prefixing
- **[TypeScript](https://www.typescriptlang.org/)** - Static type checking

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** version 18.0 or higher
  - Download from [nodejs.org](https://nodejs.org/)
  - Check version: `node --version`
- **npm** version 9.0 or higher (comes with Node.js)
  - Check version: `npm --version`
- **Git** (optional, for cloning the repository)
  - Download from [git-scm.com](https://git-scm.com/)

### Recommended Tools

- **Visual Studio Code** with extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript and JavaScript Language Features
- **Modern web browser** (Chrome, Firefox, Safari, or Edge)

---

## 🚀 Installation

### Method 1: Clone from Repository (if using Git)

```bash
# Clone the repository
git clone https://github.com/your-username/radio-istic-dashboard.git

# Navigate to the project directory
cd radio-istic-dashboard

# Install dependencies
npm install
```

### Method 2: Using Existing Project Files

```bash
# Navigate to the project directory
cd dashboard

# Install dependencies
npm install
```

### Alternative Package Managers

If you prefer using **pnpm** or **yarn**:

```bash
# Using pnpm
pnpm install

# Using yarn
yarn install
```

---

## 🎮 Usage

### Development Server

Start the development server with hot-reload:

```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

### Building for Production

Create an optimized production build:

```bash
npm run build
```

### Running Production Server

After building, start the production server:

```bash
npm start
```

### Linting

Run ESLint to check for code quality issues:

```bash
npm run lint
```

### Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `next dev` | Start development server |
| `build` | `next build` | Create production build |
| `start` | `next start` | Start production server |
| `lint` | `eslint .` | Run ESLint on all files |

---

## 📁 Project Structure

```
dashboard/
├── app/                          # Next.js App Router pages
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Home page
│   ├── not-found.tsx            # 404 page
│   ├── about/                   # About page
│   │   ├── page.tsx
│   │   └── loading.tsx
│   ├── bureau/                  # Bureau members page
│   ├── chat/                    # Chat page
│   ├── club-life/               # Club life page
│   ├── events/                  # Events listing page
│   ├── login/                   # Login page
│   ├── media/                   # Media gallery page
│   ├── members/                 # Members directory
│   │   ├── page.tsx
│   │   └── [id]/               # Individual member pages
│   ├── settings/                # User settings
│   ├── signup/                  # Registration page
│   ├── sponsors/                # Sponsors page
│   └── training/                # Training & workshops page
│
├── components/                   # React components
│   ├── chat/                    # Chat components
│   │   ├── chat-contact.tsx
│   │   ├── chat-conversation.tsx
│   │   ├── chat-expanded.tsx
│   │   ├── chat-header.tsx
│   │   ├── chat-message.tsx
│   │   ├── chat-preview.tsx
│   │   ├── chat-status-indicator.tsx
│   │   ├── index.tsx
│   │   ├── mobile-chat.tsx
│   │   ├── mobile-chat-content.tsx
│   │   ├── use-chat-state.ts
│   │   └── utils.ts
│   │
│   ├── dashboard/               # Dashboard components
│   │   ├── card/               # Dashboard cards
│   │   ├── chart/              # Chart components
│   │   ├── layout/             # Layout components
│   │   ├── mobile-header/      # Mobile header
│   │   ├── notifications/      # Notification system
│   │   ├── rebels-ranking/     # Member ranking
│   │   ├── security-status/    # Security indicators
│   │   ├── sidebar/            # Sidebar navigation
│   │   ├── stat/               # Statistics cards
│   │   ├── widget/             # Dashboard widgets
│   │   ├── mobile-header.tsx
│   │   └── sidebar.tsx
│   │
│   ├── icons/                   # Custom icon components
│   │   ├── arrow-left.tsx
│   │   ├── arrow-right.tsx
│   │   ├── atom.tsx
│   │   ├── bell.tsx
│   │   ├── boom.tsx
│   │   ├── brackets.tsx
│   │   ├── cute-robot.tsx
│   │   ├── dots-vertical.tsx
│   │   ├── email.tsx
│   │   ├── gear.tsx
│   │   ├── layout.tsx
│   │   ├── lock.tsx
│   │   ├── minus.tsx
│   │   ├── monkey.tsx
│   │   ├── plus.tsx
│   │   └── proccesor.tsx
│   │
│   ├── ui/                      # Reusable UI components (shadcn/ui)
│   │   ├── accordion.tsx
│   │   ├── alert-dialog.tsx
│   │   ├── alert.tsx
│   │   ├── aspect-ratio.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── calendar.tsx
│   │   ├── card.tsx
│   │   ├── checkbox.tsx
│   │   ├── dialog.tsx
│   │   ├── drawer.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── popover.tsx
│   │   ├── select.tsx
│   │   ├── sidebar.tsx
│   │   ├── toast.tsx
│   │   └── ... (40+ components)
│   │
│   ├── member-profile-modal.tsx # Member profile modal
│   ├── protected-route.tsx      # Route protection HOC
│   ├── radio-istic-logo.tsx     # Club logo component
│   └── theme-provider.tsx       # Theme management
│
├── data/                         # Static data and mocks
│   └── chat-mock.ts             # Mock chat data
│
├── hooks/                        # Custom React hooks
│   ├── use-mobile.ts            # Mobile detection hook
│   └── use-toast.ts             # Toast notification hook
│
├── lib/                          # Utility libraries
│   ├── auth-context.tsx         # Authentication context
│   ├── members-data.ts          # Member data (40+ members)
│   ├── utils.ts                 # Utility functions
│   └── websocket-context.tsx    # WebSocket context
│
├── public/                       # Static assets
│   ├── assets/                  # General assets
│   ├── avatars/                 # Member avatars (40+ images)
│   ├── events/                  # Event images
│   ├── fonts/                   # Custom fonts
│   └── sponsors/                # Sponsor logos
│
├── styles/                       # Additional styles
│   └── globals.css              # Global CSS
│
├── types/                        # TypeScript type definitions
│   ├── chat.ts                  # Chat types
│   └── dashboard.ts             # Dashboard types
│
├── components.json               # shadcn/ui configuration
├── eslint.config.mjs            # ESLint configuration
├── mock.json                    # Mock data for dashboard
├── next.config.mjs              # Next.js configuration
├── next.config.ts               # TypeScript Next.js config
├── package.json                 # Project dependencies
├── pnpm-lock.yaml              # pnpm lock file
├── postcss.config.mjs          # PostCSS configuration
├── README.md                   # This file
└── tsconfig.json               # TypeScript configuration
```

---

## 🧩 Key Components

### Authentication System

**Location**: `lib/auth-context.tsx`

Provides authentication and user management:

```typescript
// Available roles
type UserRole = "admin" | "president" | "vice-president" | 
                "secretary" | "sponsor-manager" | "events-organizer" | 
                "media-responsable" | "member" | "guest"

// Usage
import { useAuth } from '@/lib/auth-context'

function Component() {
  const { user, login, logout, isAuthenticated } = useAuth()
  // ...
}
```

### WebSocket System

**Location**: `lib/websocket-context.tsx`

Real-time messaging functionality:

```typescript
import { useWebSocket } from '@/lib/websocket-context'

function ChatComponent() {
  const { isConnected, sendMessage } = useWebSocket()
  // ...
}
```

### Protected Routes

**Location**: `components/protected-route.tsx`

Secure pages with role-based access:

```typescript
import ProtectedRoute from '@/components/protected-route'

export default function SecurePage() {
  return (
    <ProtectedRoute requiredRoles={['admin', 'president']}>
      {/* Protected content */}
    </ProtectedRoute>
  )
}
```

### Dashboard Layout

**Location**: `components/dashboard/layout/index.tsx`

Consistent page layout with header and breadcrumbs:

```typescript
import DashboardPageLayout from '@/components/dashboard/layout'
import { Users } from 'lucide-react'

export default function Page() {
  return (
    <DashboardPageLayout
      header={{
        title: "Page Title",
        description: "Page description",
        icon: Users,
      }}
    >
      {/* Page content */}
    </DashboardPageLayout>
  )
}
```

### Chat System

**Location**: `components/chat/`

Multi-state chat interface:
- Collapsed: Minimal view showing unread count
- Expanded: Contact list view
- Conversation: Full chat interface

### Member Profile Modal

**Location**: `components/member-profile-modal.tsx`

Detailed member information display with:
- Contact information
- Field of study and year
- Skills and motivation
- Projects and contributions
- Points and ranking

---

## 🔐 Authentication & Security

### Authentication Flow

1. **Registration** (`/signup`):
   - New users provide name, email, and password
   - User created with default "member" role
   - Automatic login after registration

2. **Login** (`/login`):
   - Email and password validation
   - Role assignment based on member data
   - Session stored in localStorage
   - Redirect to dashboard

3. **Session Management**:
   - Persistent sessions using localStorage
   - Automatic session restoration on page reload
   - Logout clears session data

### User Roles & Permissions

| Role | Description | Access Level |
|------|-------------|--------------|
| **admin** | Full system access | All features |
| **president** | Club president | Management features |
| **vice-president** | Vice president | Management features |
| **secretary** | General secretary | Documentation features |
| **sponsor-manager** | Sponsor relations | Sponsor management |
| **events-organizer** | Events coordinator | Event management |
| **media-responsable** | Media manager | Media upload & editing |
| **member** | Regular member | Standard features |
| **guest** | Visitor | Limited read-only access |

### Protected Routes

Routes are protected using the `ProtectedRoute` component:

```typescript
<ProtectedRoute requiredRoles={['admin', 'president']}>
  {/* Only admins and presidents can access */}
</ProtectedRoute>
```

### Security Best Practices

- ✅ Client-side authentication (suitable for demo/prototype)
- ✅ Role-based access control
- ✅ Protected API routes (to be implemented)
- ⚠️ For production: Implement server-side authentication
- ⚠️ For production: Add JWT tokens or session cookies
- ⚠️ For production: Implement HTTPS
- ⚠️ For production: Add CSRF protection
- ⚠️ For production: Implement rate limiting

---

## 🎨 Styling & Design System

### Color Palette

The dashboard uses a custom neon-inspired color scheme:

```css
/* Primary Colors */
--electric-blue: #00D9FF     /* Primary accent */
--neon-lime: #B4FF00         /* Success, active states */
--signal-orange: #FF6B00     /* Warnings, alerts */

/* Background Colors */
--background: #0A0A0A        /* Main background */
--card: #141414              /* Card backgrounds */
--border: #2A2A2A            /* Border color */

/* Text Colors */
--foreground: #FFFFFF        /* Primary text */
--muted-foreground: #888888  /* Secondary text */
```

### Typography

The application uses a three-font system:

1. **Poppins** - Display and headings
   - Weights: 400, 500, 600, 700, 800
   - Usage: Headers, titles, important text

2. **Inter** - Body text
   - Weights: Variable
   - Usage: Paragraphs, descriptions

3. **JetBrains Mono** - Code and monospace
   - Weights: Variable
   - Usage: Code blocks, technical data

### Spacing System

Custom spacing variables:

```css
--gap: 1rem              /* Standard gap */
--sides: 1.5rem          /* Page padding */
```

### Component Styling

- **shadcn/ui** components with custom Tailwind theme
- **class-variance-authority** for variant management
- **Radix UI** primitives for accessible components
- Custom utility classes for neon effects:
  ```css
  .neon-glow-blue { box-shadow: 0 0 20px #00D9FF; }
  .neon-glow-lime { box-shadow: 0 0 20px #B4FF00; }
  ```

### Responsive Design

Breakpoints follow Tailwind defaults:

```css
sm:  640px   /* Small devices */
md:  768px   /* Medium devices */
lg:  1024px  /* Large devices */
xl:  1280px  /* Extra large devices */
2xl: 1536px  /* 2X large devices */
```

### Animation System

**Framer Motion** powers all animations:
- Page transitions
- Component enter/exit
- Hover effects
- Loading states

**Number Flow** for animated counters:
- Member counts
- Points
- Statistics

---

## 📡 API & Data Management

### Current State (Mock Data)

The application currently uses mock data stored in:

- `mock.json` - Dashboard statistics, charts, notifications
- `lib/members-data.ts` - Member directory (40+ members)
- `data/chat-mock.ts` - Chat conversations

### Data Structure

#### Member Data

```typescript
interface Member {
  id: string
  name: string
  firstName: string
  lastName: string
  email: string
  phone: string
  field: string              // GLSI, IRS, LISI, LAI, IOT, LT
  year: number               // 1, 2, or 3
  motivation: string
  projects: string
  skills: string
  status: "online" | "offline"
  avatar: string
  points: number
  role?: string              // Bureau position
  isBureau?: boolean         // Bureau member flag
}
```

#### Chat Data

```typescript
interface ChatMessage {
  id: string
  content: string
  timestamp: string
  senderId: string
  isFromCurrentUser: boolean
}

interface ChatConversation {
  id: string
  participants: ChatUser[]
  lastMessage: ChatMessage
  unreadCount: number
  messages: ChatMessage[]
}
```

#### Dashboard Statistics

```typescript
interface DashboardStat {
  label: string
  value: string
  description: string
  intent: "positive" | "negative" | "neutral"
  icon: string
  tag?: string
  direction?: "up" | "down"
}
```

### Future Backend Integration

To connect to a real backend:

1. **Replace mock data imports** with API calls
2. **Implement API utilities** in `lib/api.ts`
3. **Use SWR or React Query** for data fetching
4. **Update contexts** to fetch from API
5. **Add environment variables** for API endpoints

Example API structure:

```typescript
// lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL

export async function getMembers() {
  const response = await fetch(`${API_BASE}/members`)
  return response.json()
}

export async function getEvents() {
  const response = await fetch(`${API_BASE}/events`)
  return response.json()
}
```

---

## 🚀 Deployment

### Vercel (Recommended)

The easiest way to deploy a Next.js app:

1. **Push code to GitHub**:
   ```bash
   git push origin main
   ```

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your repository
   - Click "Deploy"

3. **Configure Environment Variables** (if needed):
   - Add any environment variables in Vercel dashboard
   - Example: `NEXT_PUBLIC_API_URL`

### Other Platforms

#### Netlify

```bash
# Build command
npm run build

# Publish directory
.next
```

#### Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Build application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

Build and run:

```bash
docker build -t radio-istic-dashboard .
docker run -p 3000:3000 radio-istic-dashboard
```

#### Self-Hosted

```bash
# Build the application
npm run build

# Start production server
npm start

# Or use PM2 for process management
npm install -g pm2
pm2 start npm --name "radio-istic" -- start
```

### Environment Variables

Create a `.env.local` file for local development:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.radioistic.tn

# WebSocket Configuration
NEXT_PUBLIC_WS_URL=wss://ws.radioistic.tn

# Analytics (optional)
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your-analytics-id

# Authentication (for production)
NEXTAUTH_URL=https://dashboard.radioistic.tn
NEXTAUTH_SECRET=your-secret-key
```

---

## 🤝 Contributing

We welcome contributions from all club members!

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit with a clear message**:
   ```bash
   git commit -m "Add: Amazing new feature"
   ```
5. **Push to your branch**:
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style
- Write clear commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation if needed
- Keep PRs focused on a single feature/fix

### Code Style

This project uses:
- **ESLint** for code linting
- **TypeScript** for type safety
- **Prettier** (recommended) for code formatting

Run the linter before committing:

```bash
npm run lint
```

### Commit Message Convention

```
Type: Brief description

- Detailed explanation (if needed)
- Reference to issue (if applicable)

Types:
- Add: New feature
- Fix: Bug fix
- Update: Changes to existing features
- Remove: Deprecated features
- Refactor: Code restructuring
- Docs: Documentation updates
- Style: Formatting changes
```

---

## 📜 License

This project is created for **Radio Istic - ISTIC Borj Cédria** student club.

© 2025 Radio Istic. All rights reserved.

---

## 📞 Contact

### Radio Istic Club

- **Email**: contact@radioistic.tn
- **Instagram**: [@radio.istic](https://instagram.com/radio.istic)
- **Facebook**: [Radio Istic](https://facebook.com/radioistic)
- **Location**: ISTIC Borj Cédria, Ben Arous, Tunisia

### Bureau Members

- **Mohamed Aziz Mehri** (Président) - aziz.mehri@radioistic.tn
- **Nassim Ben Mrad** (Vice-président) - nassim.benmrad@radioistic.tn
- **Balkis** (Secrétaire Générale) - balkis@radioistic.tn
- **Mohamed Sahly** (Responsable Sponsors) - mohamed.sahly@radioistic.tn
- **Aymen Ksouri** (Responsable Événements) - aymen.ksouri@radioistic.tn
- **Dhia Eddine Ktiti** (Responsable Média) - dhia.ktiti@radioistic.tn

### Development

For technical questions about this dashboard:
- Open an issue on GitHub
- Contact the development team through the club

---

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing framework
- **Vercel** - For hosting and deployment platform
- **shadcn** - For the beautiful UI components
- **Radix UI** - For accessible component primitives
- **All Radio Istic Members** - For their contributions and feedback

---

<div align="center">

### ⭐ Star this repository if you find it useful!

**Built with ❤️ by Radio Istic @ ISTIC Borj Cédria**

[Back to Top](#-radio-istic-dashboard)

</div>
