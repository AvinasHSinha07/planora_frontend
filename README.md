# Planora | The Ultimate High-Fidelity Event Management Ecosystem

**Planora** is a state-of-the-art, AI-enhanced event management platform tailored for the "Luxury Startup" aesthetic. It provides a seamless, high-performance experience for discovering, creating, and managing premium events through a sophisticated multi-role architecture.

---

## 🚀 Deployment & Source
- **Live Application**: [https://planora-frontend-six-rho.vercel.app/](https://planora-frontend-six-rho.vercel.app/)
- **API Documentation**: [https://planora-backend-mt4h.onrender.com/](https://planora-backend-mt4h.onrender.com/)
- **Frontend Repo**: [https://github.com/AvinasHSinha07/planora_frontend](https://github.com/AvinasHSinha07/planora_frontend)
- **Backend Repo**: [https://github.com/AvinasHSinha07/planora_backend](https://github.com/AvinasHSinha07/planora_backend)

---

## 💎 Features Implemented

### 1. 🤖 PlanoraBot AI Concierge
- **Conversational Discovery**: Integrated AI assistant using natural language processing to help users find events based on intent, location, or mood.
- **Context-Aware Responses**: The AI provides direct links to event detail pages and answers specific queries about registration and pricing.

### 2. 🎭 Multi-Role Architecture (RBAC)
- **Unified Auth System**: Powered by Better Auth, allowing seamless transitions between User, Organizer, and Admin identities.
- **Contextual Navigation**: Sidebar and mobile menus dynamically adapt to the user's role, showing only relevant management tools.

### 3. 💳 High-Performance Payments
- **Stripe Integration**: Secure checkout sessions for paid events with automatic participation granting upon success.
- **Fiscal Transparency**: Organizers can track revenue per event, while Admins audit global platform transactions.

### 4. 🎨 "Luxury Startup" UI/UX
- **Modern Aesthetics**: Utilizes glassmorphism, fluid gradients, and a sleek dark/light mode system.
- **Responsive Mastery**: Complex data tables on desktop elegantly transform into interactive cards on mobile.
- **Framer Motion Animations**: Silky smooth transitions, staggered grid loads, and micro-interactions for a premium feel.

### 5. 🛠️ Comprehensive Management Hubs
- **Organizer Hub**: Advanced moderation tools (Approve/Reject/Ban), invitation system, and real-time attendance tracking.
- **Admin Console**: Global user moderation, event featuring capabilities, and platform-wide analytics.
- **User Portal**: Invitation management, notification center, and participation history.

---

## 🔄 Detailed Workflows & User Flows

### 🔐 Authentication Workflow
1. **User Request**: User signs up/logs in via Email or Google OAuth.
2. **Session Verification**: Frontend uses `Better Auth` client to establish a secure, cross-tab session.
3. **Role Redirection**: Post-login middleware detects the user's role and directs them to their specific dashboard overview.

### 📅 Event Participation Workflow
1. **Discovery**: User finds an event via the Hero Gallery or AI Search.
2. **Registration**: 
   - **Free Events**: One-click registration with instant approval/pending status.
   - **Paid Events**: User is redirected to a premium Stripe checkout.
3. **Confirmation**: Upon successful payment or approval, a real-time notification is sent, and the event appears in the user's "My Participations" feed.

### 🏢 Organizer Moderation Workflow
1. **Event Launch**: Organizer creates an event with specific categories and pricing.
2. **Request Triage**: Organizer receives notifications for new participation requests.
3. **Moderation Hub**: Organizer can Approve, Reject, or Ban participants. Approvals trigger automated notifications to the user.
4. **Invite System**: Organizer can search global users and send direct event invitations.

---

## 🛠️ Technology Stack & Rationale

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | **Next.js 15+** | For high-performance SSR, App Router, and seamless SEO. |
| **Styling** | **Tailwind CSS** | Rapid, utility-first design for the "Luxury Startup" aesthetic. |
| **Components** | **Shadcn/UI** | Highly accessible, customizable base components. |
| **Animations** | **Framer Motion** | For premium, declarative layout transitions. |
| **Data Fetching** | **TanStack Query** | Robust caching, loading states, and optimistic updates. |
| **Authentication** | **Better Auth** | Secure, flexible, and developer-friendly auth ecosystem. |
| **State** | **React Hooks** | Clean, functional state management. |

---

## 📂 Project Structure

```text
src/
├── app/                  # Route handlers and layout definitions
├── components/
│   ├── modules/          # Domain-specific modules (Dashboard, Auth, Home, AI)
│   │   ├── Dashboard/    # Management UIs for Admin, Organizer, and User
│   │   ├── Events/       # Details, Lists, and Search components
│   │   └── Home/         # Hero, Stats, CTA, and AI bot sections
│   ├── shared/           # Shared components (Navbar, Sidebar, Providers)
│   └── ui/               # Atomic UI components from Shadcn
├── hooks/                # Custom hooks (useAuth, useDebounce, useMediaQuery)
├── lib/                  # API clients (axiosInstance) and auth configs
└── types/                # Unified TypeScript definitions
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18.0+
- npm or yarn

### Installation steps
1. **Clone & Install**:
   ```bash
   git clone https://github.com/AvinasHSinha07/planora_frontend.git
   cd planora_frontend
   npm install
   ```
2. **Environment Configuration**:
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=https://planora-backend-mt4h.onrender.com/api/v1
   BETTER_AUTH_URL=https://planora-frontend-six-rho.vercel.app
   ```
3. **Start Development**:
   ```bash
   npm run dev
   ```

---

## 🔐 Universal Demo Credentials

| Role | Email | Password | Capability |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@planora.com` | `admin123` | Platform-wide Oversight |
| **Organizer** | `organizer@planora.com` | `organizer123` | Event Creation & Lifecycle |
| **Standard User** | `ac@gmail.com` | `asdfghjk` | Discovery & Participation |

---

## 📄 License
Project developed as part of the **Next Level Web Development** Capstone.
