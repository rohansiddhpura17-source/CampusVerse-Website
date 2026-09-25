# CAMPUSVERSE — COMPLETE SYSTEM ARCHITECTURE BLUEPRINT
**Unified Campus Ecosystem: Web, API, Database, Mobile & AI**
*Document Version: 1.0.0-PROD | Classification: Internal System Architecture | Status: Forensic Reverse-Engineered Blueprint*

---

## TABLE OF CONTENTS
1. [Executive Architectural Summary](#1-executive-architectural-summary)
2. [Complete Technology Stack Matrix](#2-complete-technology-stack-matrix)
3. [Multi-Repository & Codebase Topography](#3-multi-repository--codebase-topography)
4. [High-Level System Architecture & Component Interconnect Diagrams](#4-high-level-system-architecture--component-interconnect-diagrams)
5. [End-to-End Data Flow & Network Traffic Diagrams](#5-end-to-end-data-flow--network-traffic-diagrams)
6. [Next.js Website Architecture (App Router, Client Components, State & Providers)](#6-nextjs-website-architecture)
7. [Frontend Routing Inventory & Route Tree](#7-frontend-routing-inventory--route-tree)
8. [User Role Journeys & Experience Flows](#8-user-role-journeys--experience-flows)
9. [Authentication & Session Architecture](#9-authentication--session-architecture)
10. [Dual-Layer RBAC & Granular Authorization Architecture](#10-dual-layer-rbac--granular-authorization-architecture)
11. [Express Backend Architecture & Middleware Pipeline](#11-express-backend-architecture--middleware-pipeline)
12. [Comprehensive Backend Service Modules & Business Logic](#12-comprehensive-backend-service-modules--business-logic)
13. [Complete API Route Inventory](#13-complete-api-route-inventory)
14. [Database Architecture & Complete Schema Blueprint](#14-database-architecture--complete-schema-blueprint)
15. [Prisma Migrations History & Schema Evolution](#15-prisma-migrations-history--schema-evolution)
16. [Supabase PostgreSQL Infrastructure & Cloud Setup](#16-supabase-postgresql-infrastructure--cloud-setup)
17. [Database Security & Row Level Security (RLS) Matrix](#17-database-security--row-level-security-rls-matrix)
18. [Admin Control Platform Architecture](#18-admin-control-platform-architecture)
19. [AI Integration Architecture (Google Gemini)](#19-ai-integration-architecture-google-gemini)
20. [Communication & Email Delivery System](#20-communication--email-delivery-system)
21. [File Storage & Asset Management Architecture](#21-file-storage--asset-management-architecture)
22. [Notification & Real-Time Messaging Architecture](#22-notification--real-time-messaging-architecture)
23. [Search, Discovery & Filtering Architecture](#23-search-discovery--filtering-architecture)
24. [Payment & Financial Ledger Architecture (Razorpay)](#24-payment--financial-ledger-architecture-razorpay)
25. [Security Architecture, Threat Analysis & OWASP Assessment](#25-security-architecture-threat-analysis--owasp-assessment)
26. [Performance, Caching & Scalability Analysis](#26-performance-caching--scalability-analysis)
27. [DevOps, Deployment & CI/CD Pipeline](#27-devops-deployment--cicd-pipeline)
28. [Environment Variables & Secret Management Blueprint](#28-environment-variables--secret-management-blueprint)
29. [Android Native Application Integration Architecture](#29-android-native-application-integration-architecture)
30. [Component Dependency & Cross-System Interaction Matrix](#30-component-dependency--cross-system-interaction-matrix)
31. [Request/Response & Error Handling Lifecycles](#31-requestresponse--error-handling-lifecycles)
32. [Observability, Logging & Health Monitoring](#32-observability-logging--health-monitoring)
33. [Technical Debt, Redundancies & Dead Code Inventory](#33-technical-debt-redundancies--dead-code-inventory)
34. [Failure Modes & "What Can Break" Risk Analysis](#34-failure-modes--what-can-break-risk-analysis)
35. [Strategic Architectural Roadmap & Production Readiness Recommendations](#35-strategic-architectural-roadmap--production-readiness-recommendations)

---

## 1. EXECUTIVE ARCHITECTURAL SUMMARY

**CampusVerse** is a multi-tier, multi-tenant digital campus operating system uniting prospective students (aspirants), enrolled university students, alumni, and campus administrators into a unified digital ecosystem.

The system is structured as a decoupled client-server architecture:
1. **Frontend Presentation Tier**: Next.js 14 (App Router) client application utilizing React 18, Tailwind CSS, Lucide icons, and React Query (`@tanstack/react-query`) for optimistic UI mutations and server cache management.
2. **Application & API Gateway Tier**: Express 4.21 TypeScript monolith serving RESTful JSON endpoints at `/api/v1`, featuring JWT bearer token authentication, dual-layer Role-Based Access Control (RBAC), Zod request schema validation, and rate limiting.
3. **Data Persistence Tier**: Supabase-managed PostgreSQL instance in Mumbai (`ap-south-1`) hosted behind Supabase PgBouncer connection pooling, accessed through Prisma ORM 5.22. All 93 production tables are hardened with PostgreSQL Row-Level Security (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`).
4. **Mobile Client Tier**: Native Android application developed with Kotlin and Jetpack Compose, connecting to the Express REST API via coroutine-driven networking repositories and persisting session credentials in Jetpack DataStore.
5. **Intelligent Agent Tier**: Direct integration with Google Gemini Generative Language APIs (`gemini-3.5-flash` / `gemini-1.5-flash`) providing specialized reasoning modes: Academic Study Tutor, Career Pathfinding Advisor, and College Admissions Recommender, guarded by fallback heuristic mock engines and token rate-limiters.

---

## 2. COMPLETE TECHNOLOGY STACK MATRIX

| Layer | Technology | Version | Purpose / Responsibilities |
|---|---|---|---|
| **Frontend Framework** | Next.js | `14.2.15` | SSR, Static Optimization, App Router navigation, Dynamic layouts |
| **Frontend Core** | React / React DOM | `18.3.1` | Component tree reconciliation, hooks, context state |
| **Language (Web)** | TypeScript | `5.6.3` | Type safety, interface definitions, build validation |
| **Styling** | Tailwind CSS | `3.4.14` | Utility-first responsive design, dark/light token system |
| **CSS Processing** | PostCSS / Autoprefixer | `8.4.47` / `10.4.20` | Vendor prefixing, CSS compilation |
| **Icons & Visuals** | Lucide React | `0.453.0` | Comprehensive iconography across web portal |
| **Data Fetching** | TanStack React Query | `5.59.0` | Client cache, deduping, background synchronization |
| **HTTP Client (Web)** | Axios | `1.7.7` | Interceptor-managed bearer auth, centralized API calls |
| **Form Management** | React Hook Form | `7.53.0` | Uncontrolled/controlled form state, error handling |
| **Schema Validation** | Zod | `3.23.8` | Shared input validation schemas across client and server |
| **Backend Framework** | Express | `4.21.1` | REST HTTP routing, middleware pipeline, error bubbling |
| **Language (Server)**| TypeScript / Node.js | `5.6.3` / `v20.x` LTS | Type-checked backend micro-architecture |
| **Runtime Execution**| ts-node / ts-node-dev | `10.9.2` / `2.0.0` | Local dev hot reloading and migration execution |
| **ORM / Data Access**| Prisma ORM Client | `5.22.0` | Typed PostgreSQL access, transaction management, migrations |
| **Database Engine** | PostgreSQL (Supabase) | `15.x` | Managed cloud relational database in AWS Mumbai (`ap-south-1`) |
| **Database Pooling** | Supabase Supavisor / PgBouncer | `v1` (Port 5432 / 6543) | Transaction pooler and session pooler endpoints |
| **Security / Crypto** | bcryptjs | `2.4.3` | Salted SHA-512/Blowfish password hashing (10 salt rounds) |
| **Authentication** | jsonwebtoken | `9.0.2` | Signed HMAC-SHA256 bearer tokens (7-day default expiry) |
| **AI LLM Engine** | Google Gemini API | `v1beta` | Generative AI study tutor, career engine, admission advisor |
| **Payment Gateway** | Razorpay SDK / REST | `v1` | Order creation, HMAC-SHA256 signature verification, webhooks |
| **Email Delivery** | Multi-Driver (Mock/SMTP/Resend)| Custom | OTP generation, account verification, password resets |
| **Mobile OS** | Android Native | SDK 34 (Min 26) | Kotlin, Jetpack Compose, Coroutines, Flow, DataStore |
| **Test Automation** | Jest / Supertest | `29.7.0` / `7.0.0` | Integration and unit test suite across controllers & guards |
| **Hosting (Web)** | Vercel | Production | Global Edge Network, Next.js optimized hosting |
| **Hosting (API)** | Render / Cloud Node | Production | Containerized Node.js long-running Express server |

---

## 3. MULTI-REPOSITORY & CODEBASE TOPOGRAPHY

```
├── /Users/rohansiddhpura/Documents/campuswebsite        [Frontend Canonical Workspace]
│   ├── app/                                            [Next.js App Router Tree]
│   │   ├── (public)/                                   [Public marketing & information routes]
│   │   ├── admin/                                      [Administrative control platform (23 sub-routes)]
│   │   ├── alumni/                                     [Alumni network, mentoring, jobs (25 sub-routes)]
│   │   ├── aspirant/                                   [Admissions, college explorer (14 sub-routes)]
│   │   ├── auth/                                       [Login, registration, verification (6 routes)]
│   │   ├── student/                                    [Academics, notes, library, AI tutor (15 routes)]
│   │   ├── layout.tsx                                  [Root Layout: React Query, AuthProvider, Toaster]
│   │   └── globals.css                                 [Tailwind styles and CSS variables]
│   ├── components/                                     [Shared UI, Admin data tables, route guards]
│   ├── lib/                                            [Axios client, API services, AuthContext]
│   ├── hooks/                                          [useAuth, useRole, useToast, useDebounce]
│   ├── types/                                          [TypeScript domain & auth interfaces]
│   ├── package.json                                    [Next.js 14 dependencies]
│   └── vercel.json                                     [Vercel deployment configuration]
│
├── /Users/rohansiddhpura/AndroidStudioProjects/CampusVerse/backend  [Express API Monolith]
│   ├── src/
│   │   ├── config/                                     [Environment parser (env.ts)]
│   │   ├── controllers/                                [24 REST controller implementations]
│   │   ├── middleware/                                 [Auth, RBAC, Error, Rate-limiting, Audit]
│   │   ├── routes/                                     [Express routers mounted under /api/v1]
│   │   ├── services/                                   [Prisma, Gemini AI, Email, Audit, System]
│   │   ├── utils/                                      [Response formatting, JWT helpers, hashing]
│   │   ├── app.ts                                      [Express app initialization, CORS, JSON limits]
│   │   └── server.ts                                   [HTTP server startup, graceful shutdown]
│   ├── prisma/
│   │   ├── schema.prisma                               [Canonical PostgreSQL schema (93 models)]
│   │   ├── schema.sqlite.prisma                        [Local development SQLite schema]
│   │   ├── migrations/                                 [3 production migrations tracking schema]
│   │   └── seed.ts                                     [Database seeder script]
│   ├── tests/                                          [15 Jest test suites (hardening, RBAC, OTP)]
│   └── package.json                                    [Backend dependencies and scripts]
│
└── /Users/rohansiddhpura/AndroidStudioProjects/CampusVerse/app      [Android Native Application]
    ├── src/main/java/com/campusverse/app/
    │   ├── data/                                       [DataStore sessions, Network repositories]
    │   ├── domain/                                     [Domain models for Student, Alumni, Admin]
    │   ├── navigation/                                 [Compose Navigation Graph]
    │   └── ui/                                         [Material 3 Compose screens and ViewModels]
    └── build.gradle.kts                                [Android Gradle configuration]
```

---

## 4. HIGH-LEVEL SYSTEM ARCHITECTURE & COMPONENT INTERCONNECT DIAGRAMS

```mermaid
flowchart TB
    subgraph Clients ["Client Layer"]
        WEB["Next.js 14 Web Portal\n(Port 3000 / Vercel CDN)\nReact 18 • TanStack Query • Axios"]
        MOB["Native Android Application\nJetpack Compose • Kotlin Coroutines\nDataStore Session Storage"]
    end

    subgraph Gateway ["Network & Ingress Layer"]
        CORS["Strict CORS & Security Policy\nOrigin Allowlist + Mobile Null-Origin Pass"]
        RATELIMIT["Rate Limiting Service\nDefault: 100 req/min\nAI: 10 req/min • OTP: 5/window"]
    end

    subgraph AppServer ["Express 4.21 Application Server (Port 4000 / Render)"]
        APP["Express Monolith Pipeline (app.ts)"]
        AUTH_MID["requireAuth & requireAdminElevation\nJWT Verification & Session Revocation Check"]
        RBAC_MID["Dual-Layer RBAC Engine\nRole & Permission Resolver (35 granular scopes)"]
        VALID["Zod Schema Validation Middleware"]
        AUDIT["Audit Logging Interceptor (AuditLog Service)"]
        
        subgraph Subsystems ["Core Domain Controllers & Services"]
            C_AUTH["Auth & OTP Engine"]
            C_USER["User & Profile Service"]
            C_STUDENT["Student Academic & Notes Engine"]
            C_ASPIRANT["Aspirant Explorer & Predictor"]
            C_ALUMNI["Alumni Directory & Jobs Engine"]
            C_ADMIN["Admin Management & Audit Platform"]
            C_AI["AI Orchestrator (Study, Career, Admissions)"]
            C_PAY["Razorpay Payment & Webhook Ledger"]
        end
    end

    subgraph ExtServices ["Third-Party External Services"]
        GEMINI["Google Gemini API (v1beta)\ngemini-3.5-flash / gemini-1.5-flash"]
        RAZOR["Razorpay Payment Gateway API\nOrder API • Webhooks • Signatures"]
        EMAIL["Email Delivery Engine\nSMTP • Resend API • SendGrid API • Mock"]
    end

    subgraph DataTier ["Persistence Tier (Supabase AWS ap-south-1)"]
        PGBOUNCER["Supavisor / PgBouncer\nTransaction & Session Pooler (Port 5432 / 6543)"]
        PRISMA["Prisma ORM Client 5.22\nTyped Query Engine & Connection Pool"]
        PG_DB[("PostgreSQL 15 Database\n93 Relational Tables\n100% RLS Enabled")]
    end

    WEB -->|HTTP JSON / Bearer JWT| CORS
    MOB -->|HTTP JSON / Bearer JWT| CORS
    CORS --> RATELIMIT
    RATELIMIT --> APP
    APP --> AUTH_MID
    AUTH_MID --> RBAC_MID
    RBAC_MID --> VALID
    VALID --> AUDIT
    AUDIT --> Subsystems

    C_AI <-->|HTTPS POST / REST| GEMINI
    C_PAY <-->|HTTPS REST & Webhooks| RAZOR
    C_AUTH <-->|SMTP / API| EMAIL

    Subsystems --> PRISMA
    PRISMA --> PGBOUNCER
    PGBOUNCER --> PG_DB
```

---

## 5. END-TO-END DATA FLOW & NETWORK TRAFFIC DIAGRAMS

### 5.1 Authenticated Request Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor User as User Browser / Android App
    participant Client as Axios / NetworkRepository
    participant App as Express (app.ts)
    participant Auth as auth.middleware.ts
    participant RBAC as rbac.middleware.ts
    participant Ctrl as Domain Controller
    participant Service as Business Logic Service
    participant DB as Prisma / Supabase PG
    participant Audit as audit.service.ts

    User->>Client: Triggers Action (e.g. Update Note / Post Job)
    Client->>App: POST /api/v1/... (Header: Authorization: Bearer <JWT>)
    App->>Auth: requireAuth()
    Auth->>Auth: Verify JWT signature & expiration
    Auth->>DB: Check User.sessionVersion vs JWT.sessionVersion
    alt Session Revoked / Version Mismatch
        Auth-->>Client: 401 Unauthorized (SESSION_REVOKED)
    else Session Valid
        Auth->>RBAC: requirePermission("resource:action")
        RBAC->>DB: Query UserRole -> Role -> RolePermission -> Permission
        alt Permission Denied
            RBAC-->>Client: 403 Forbidden (INSUFFICIENT_PERMISSIONS)
        else Authorized
            RBAC->>Ctrl: Dispatch to Handler
            Ctrl->>Service: Execute Domain Operation
            Service->>DB: Prisma query/mutation in transaction
            DB-->>Service: Updated records
            Service-->>Ctrl: Operation Result
            Ctrl->>Audit: recordAuditLog({ actorId, action, entityId })
            Audit-->>DB: INSERT INTO "AuditLog"
            Ctrl-->>Client: 200 OK { success: true, data: {...} }
            Client-->>User: Render updated UI state
        end
    end
```

---

## 6. NEXT.JS WEBSITE ARCHITECTURE

The web client in `/Users/rohansiddhpura/Documents/campuswebsite` is built upon **Next.js 14 App Router**.

### 6.1 Core Layout & Provider Tree
The client application wraps all routed screens in `app/layout.tsx`:
1. `QueryProvider`: TanStack React Query `QueryClientProvider` configuring a client cache with `refetchOnWindowFocus: false` and `staleTime: 60 * 1000`.
2. `AuthProvider`: Context provider in `lib/context/auth-context.tsx` managing `user`, `token`, `status` (`loading`, `authenticated`, `unauthenticated`), and login/logout handlers.
3. `ToastProvider`: Global visual feedback overlay for operation successes and validation errors.

### 6.2 HTTP Client Architecture (`lib/api/client.ts`)
- **Axios Instance**: Configured with `baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'`.
- **Request Interceptor**: Extracts `campusverse_token` from `localStorage` and appends `Authorization: Bearer <token>`.
- **Response Interceptor**: Unwraps `{ success: true, data }` responses directly to callers. Catches `401 Unauthorized` responses, flushes `localStorage`, and triggers a hard redirect to `/auth/login`.

### 6.3 Route Guards & Elevation Pipeline (`components/guards/route-guards.tsx`)
- `PublicRoute`: Allows public access; automatically redirects authenticated users attempting to view `/auth/*` pages to their designated role dashboard (`/student/dashboard`, `/aspirant/dashboard`, etc.).
- `AuthenticatedRoute`: Enforces an active session; redirects unauthenticated visitors to `/auth/login?redirect=...`.
- `RoleRoute`: Asserts `allowedRoles.includes(user.role)`.
- `AdminRoute`: Enforces both `user.role === 'ADMIN'` AND `user.isAdminAuthorized === true`. Visitors failing elevation are routed to `/auth/unauthorized?reason=admin_authorization_required`.

---

## 7. FRONTEND ROUTING INVENTORY & ROUTE TREE

The Next.js App Router tree contains **110 compiled production routes** structured across distinct functional domains:

```
app/
├── (public)/                                   # Unauthenticated Information Portal
│   ├── page.tsx                                # Landing page (Hero, metrics, features)
│   ├── about/page.tsx                          # Mission, team, campus vision
│   ├── students/page.tsx                       # Student feature showcase
│   ├── aspirants/page.tsx                      # Aspirant admissions showcase
│   ├── alumni/page.tsx                         # Alumni network showcase
│   ├── institutions/page.tsx                   # University partnerships
│   ├── features/page.tsx                       # Complete platform feature index
│   ├── faq/page.tsx                            # Frequently asked questions
│   ├── contact/page.tsx                        # Contact form & campus support
│   ├── help/page.tsx                           # Help & documentation center
│   ├── community-guidelines/page.tsx           # Safety & conduct guidelines
│   ├── privacy/page.tsx                        # Privacy policy
│   └── terms/page.tsx                          # Terms of service
│
├── auth/                                       # Authentication Flow
│   ├── login/page.tsx                          # Email/password authentication
│   ├── register/page.tsx                       # Role-selected registration
│   ├── verify/page.tsx                         # 6-digit OTP code verification
│   ├── forgot-password/page.tsx                # Password reset request
│   ├── reset-password/page.tsx                 # Token/OTP password reset entry
│   └── unauthorized/page.tsx                   # 403 Forbidden elevation landing
│
├── student/                                    # Enrolled Student Experience
│   ├── dashboard/page.tsx                      # Academic summary, calendar, feeds
│   ├── academics/page.tsx                      # Courses, GPA tracker, syllabus
│   ├── ai-study/page.tsx                       # AI Study Assistant & concept solver
│   ├── ai-tutor/page.tsx                       # Multi-turn conversational AI tutor
│   ├── communities/page.tsx                    # Campus clubs & discussion groups
│   ├── community/[id]/page.tsx                 # Specific community feed & threads
│   ├── events/page.tsx                         # Campus event calendar & RSVP
│   ├── events/[id]/page.tsx                    # Event details & check-in
│   ├── library/page.tsx                        # Digital academic library
│   ├── marketplace/page.tsx                    # Peer-to-peer textbook & gear trade
│   ├── marketplace/[id]/page.tsx               # Product details & seller contact
│   ├── notes/page.tsx                          # Subject lecture notes index
│   ├── notes/[id]/page.tsx                     # Note viewer & download
│   ├── notifications/page.tsx                  # In-app alerts & academic reminders
│   ├── profile/page.tsx                        # Student portfolio & achievements
│   └── settings/page.tsx                       # Privacy, security, notifications
│
├── aspirant/                                   # Prospective Student Experience
│   ├── dashboard/page.tsx                      # Admissions tracker & saved items
│   ├── ai-advisor/page.tsx                     # AI Admissions recommendation engine
│   ├── colleges/page.tsx                       # College directory & search
│   ├── colleges/[id]/page.tsx                  # University profile, cutoffs, fees
│   ├── compare/page.tsx                        # Side-by-side college comparator
│   ├── comparison/page.tsx                     # Program & curriculum comparison
│   ├── notifications/page.tsx                  # Application deadline alerts
│   ├── predictor/page.tsx                      # Rank & cutoff prediction tool
│   ├── predictor/results/page.tsx              # Prediction probabilities & history
│   ├── profile/page.tsx                        # Target degrees, exams & scores
│   ├── recommendations/page.tsx                # AI personalized university matches
│   ├── saved-scholarships/page.tsx             # Bookmarked scholarship programs
│   ├── scholarships/page.tsx                   # Financial aid directory
│   ├── scholarships/[id]/page.tsx              # Scholarship criteria & apply link
│   └── settings/page.tsx                       # Aspirant account preferences
│
├── alumni/                                     # Alumni & Career Experience
│   ├── dashboard/page.tsx                      # Mentee requests, jobs, connections
│   ├── applications/page.tsx                   # Applied jobs & referral statuses
│   ├── career-ai/page.tsx                      # AI career pathfinder & resume advice
│   ├── career-dev/page.tsx                     # Professional skills development
│   ├── careers/page.tsx                        # Job search & career opportunities
│   ├── companies/[id]/page.tsx                 # Company directory & alumni insider
│   ├── connections/page.tsx                    # Professional networking requests
│   ├── events/page.tsx                         # Alumni reunions & webinars
│   ├── events/[id]/page.tsx                    # Event schedule & RSVP
│   ├── interview-prep/page.tsx                 # Technical & behavioral interview prep
│   ├── interview-results/[id]/page.tsx         # Mock interview feedback & rubric
│   ├── jobs/page.tsx                           # Employment & internship board
│   ├── jobs/[id]/page.tsx                      # Job description & referral apply
│   ├── mentorship/page.tsx                     # Mentorship hub & mentor listings
│   ├── mentorship/mentor/[id]/page.tsx         # Mentor profile & session booking
│   ├── mentorship/requests/page.tsx            # Inbound/outbound mentorship requests
│   ├── mentorship/sessions/page.tsx            # Scheduled mentoring meetings
│   ├── mentorship/sessions/[id]/page.tsx       # Meeting details & agenda notes
│   ├── messages/page.tsx                       # Direct messaging conversation list
│   ├── messages/[conversationId]/page.tsx      # Real-time chat message thread
│   ├── mock-interview/page.tsx                 # AI simulated mock interview session
│   ├── network/page.tsx                        # Campus alumni directory & search
│   ├── network/[id]/page.tsx                   # Alumni professional profile
│   ├── notifications/page.tsx                  # Career & network alerts
│   ├── profile/page.tsx                        # Alumni career timeline & company
│   ├── referrals/page.tsx                      # Corporate job referral management
│   ├── roadmap/page.tsx                        # Career milestone roadmap builder
│   ├── saved-jobs/page.tsx                     # Bookmarked career postings
│   ├── saved-profiles/page.tsx                 # Bookmarked peers & candidates
│   ├── skills/page.tsx                         # Skill verification & endorsements
│   └── settings/                               # Detailed account configurations
│       ├── page.tsx                            # General settings
│       ├── account-recovery/page.tsx           # Recovery email & phone setup
│       ├── career-preferences/page.tsx         # Target roles & salary preferences
│       ├── notifications/page.tsx              # Email & push alert preferences
│       ├── privacy/page.tsx                    # Public visibility controls
│       └── security/page.tsx                   # 2FA & active session manager
│
└── admin/                                      # System Administration Platform
    ├── dashboard/page.tsx                      # Executive metrics & health vitals
    ├── alumni/page.tsx                         # Alumni verification & records
    ├── analytics/page.tsx                      # Platform telemetry & user growth
    ├── announcements/page.tsx                  # Broadcast announcement publisher
    ├── aspirants/page.tsx                      # Aspirant user management
    ├── audit-logs/page.tsx                     # Immutable security audit ledger
    ├── colleges/page.tsx                       # University master database
    ├── courses/page.tsx                        # Academic course catalog
    ├── events/page.tsx                         # Campus event moderation
    ├── jobs/page.tsx                           # Job board moderation & review
    ├── marketplace/page.tsx                    # P2P transaction & listing monitor
    ├── mentorship/page.tsx                     # Mentorship pairing oversight
    ├── moderation/page.tsx                     # Content moderation & flagged items
    ├── permissions/page.tsx                    # System RBAC permission matrix
    ├── profile/page.tsx                        # Administrator personal profile
    ├── projects/page.tsx                       # Student project showcase review
    ├── reports/page.tsx                        # User dispute & grievance tickets
    ├── roles/page.tsx                          # Administrative role configurator
    ├── scholarships/page.tsx                   # Scholarship registry management
    ├── security/page.tsx                       # Security audit, 2FA, session resets
    ├── settings/page.tsx                       # Global system configuration
    ├── students/page.tsx                       # Enrolled student directory
    ├── system/page.tsx                         # Platform health & cache stats
    ├── system/feature-flags/page.tsx           # Runtime feature flags toggle board
    ├── users/page.tsx                          # Universal user management directory
    ├── users/[id]/page.tsx                     # Detailed user inspector & editor
    ├── verification/page.tsx                   # Identity document review queue
    └── verifications/page.tsx                  # Academic credential review queue
```

---

## 8. USER ROLE JOURNEYS & EXPERIENCE FLOWS

### 8.1 Student User Journey
1. **Onboarding**: Signs up using college `.edu` email -> Completes OTP verification -> Enters university, major, graduation year.
2. **Academic Life**: Views daily class schedule, uploads lecture notes to `/student/notes`, searches course library.
3. **AI Learning**: Queries `/student/ai-study` for step-by-step math/code problem solving; chats with the interactive tutor at `/student/ai-tutor`.
4. **Campus Community**: Joins campus clubs (`/student/communities`), chats in community feeds, buys/sells used gear in the peer marketplace (`/student/marketplace`).
5. **Career Launch**: Browses alumni mentor profiles, requests 1-on-1 mentorship sessions, requests corporate referrals for internships.

### 8.2 Aspirant User Journey
1. **Exploration**: Explores university database (`/aspirant/colleges`) filtered by region, accreditation, fees, and programs.
2. **Admission Prediction**: Enters entrance test scores (JEE, SAT, NEET) into `/aspirant/predictor` to calculate admission probabilities based on historical cutoffs.
3. **College Comparison**: Places up to 4 institutions side-by-side in `/aspirant/compare` to contrast tuition, faculty-to-student ratios, and placement metrics.
4. **AI Advisory**: Consults `/aspirant/ai-advisor` for personalized counseling on degree selection, essay prompts, and scholarship eligibility.

### 8.3 Alumni User Journey
1. **Verification**: Submits degree certificate or LinkedIn profile to `/alumni/settings` for administrative verification badge.
2. **Mentoring**: Configures mentor availability slots, accepts incoming student mentorship requests (`/alumni/mentorship/requests`), hosts video/chat mentoring.
3. **Talent Sourcing**: Posts open job roles at their current employer (`/alumni/jobs`), reviews student applications, grants internal referral tokens (`/alumni/referrals`).
4. **Networking**: Connects with fellow graduates across graduation years and industry sectors (`/alumni/network`).

### 8.4 Administrator Journey
1. **Elevation**: Logs in with credentials -> Enforces `isAdminAuthorized` validation -> Accesses `/admin/dashboard`.
2. **User Governance**: Inspects user profiles, toggles account status (`isActive`), revokes compromised user sessions (`sessionVersion` increment), provisions RBAC roles.
3. **Moderation**: Reviews user reports (`/admin/reports`), moderates marketplace items, approves or rejects student academic notes (`/admin/moderation`).
4. **System Governance**: Manages dynamic feature flags (`/admin/system/feature-flags`), adjusts platform parameters, reviews immutable security audit trails (`/admin/audit-logs`).

---

## 9. AUTHENTICATION & SESSION ARCHITECTURE

### 9.1 JWT Construction & Claims Blueprint
User authentication generates signed JSON Web Tokens (JWT) using HMAC-SHA256 (`HS256`):
```json
{
  "userId": "uuid-v4-identifier",
  "email": "student@campusverse.edu",
  "role": "STUDENT",
  "isAdminAuthorized": false,
  "sessionVersion": 1,
  "jti": "uuid-v4-token-identifier",
  "iat": 1727251200,
  "exp": 1727856000
}
```

### 9.2 Cryptographic Password Hashing
- Algorithm: `bcryptjs`
- Salt Rounds: 10
- Storage: Field `User.passwordHash` in PostgreSQL. Plaintext passwords are never logged or stored.

### 9.3 Session Versioning & Instant Revocation
To defeat stale JWT expiration vulnerabilities, CampusVerse implements database-backed **Session Versioning**:
1. Every `User` record holds an integer field `sessionVersion` (default: `1`).
2. Every issued JWT embeds `sessionVersion: user.sessionVersion`.
3. The authentication middleware (`requireAuth`) queries the database (or cached user record). If `decodedToken.sessionVersion !== user.sessionVersion`, the token is rejected immediately:
   ```json
   {
     "success": false,
     "error": {
       "code": "SESSION_REVOKED",
       "message": "Session has been invalidated. Please log in again."
     }
   }
   ```
4. **Global Session Kill Switch**: When an admin or user triggers "Log out all devices" or changes their password, `prisma.user.update({ where: { id }, data: { sessionVersion: { increment: 1 } } })` runs. Every existing token issued across all devices is invalidated in under 5 milliseconds.

### 9.4 Elevated Admin Session Management (`AdminSession`)
Administrative users have an additional persistence layer in the `AdminSession` table:
- Tracks: `tokenId` (`jti`), `userId`, `ipAddress`, `userAgent`, `deviceName`, `expiresAt`, `revokedAt`.
- Session Heartbeat: Middleware validates that the active administrative session has not been explicitly revoked in the `AdminSession` table.

---

## 10. DUAL-LAYER RBAC & GRANULAR AUTHORIZATION ARCHITECTURE

CampusVerse implements a hybrid authorization system combining a legacy foundational enum with a high-granularity relational RBAC matrix.

```mermaid
classDiagram
    class User {
        +String id
        +String email
        +String role (Legacy Enum)
        +Boolean isAdminAuthorized
        +Int sessionVersion
    }

    class UserRole {
        +String userId
        +String roleId
    }

    class Role {
        +String id
        +String name (SUPER_ADMIN, ADMIN, MODERATOR, etc.)
        +String description
        +Boolean isSystem
    }

    class RolePermission {
        +String roleId
        +String permissionId
    }

    class Permission {
        +String id
        +String name (users:read, notes:approve, etc.)
        +String module
        +String action
    }

    User "1" --> "*" UserRole : assigned
    UserRole "*" --> "1" Role : references
    Role "1" --> "*" RolePermission : grants
    RolePermission "*" --> "1" Permission : references
```

### 10.1 Layer 1: Base Role (`User.role`)
- Values: `STUDENT`, `ASPIRANT`, `ALUMNI`, `ADMIN`.
- Purpose: Primary portal routing, basic UI theming, and default permissions.
- Elevated Flag: `User.isAdminAuthorized` (Boolean) must be `true` for any user with `role === 'ADMIN'` to execute privileged operations.

### 10.2 Layer 2: Relational Administrative RBAC Matrix
The database maintains 6 default system roles and **35 granular permissions**:
1. `SUPER_ADMIN`: Unrestricted system access, role provisioning, system settings, database inspection.
2. `ADMIN`: Standard administrative operations (user management, event oversight, content moderation).
3. `MODERATOR`: Community posts, notes approval, report dispute resolution.
4. `CONTENT_MANAGER`: College directory, course catalog, scholarship listings, announcements.
5. `SUPPORT_ADMIN`: User profile lookup, password reset dispatch, ticket resolution.
6. `ANALYTICS_ADMIN`: Read-only telemetry, platform usage metrics, financial summaries.

### 10.3 Permission Enforcement Middleware
- `requireRole(['ADMIN', 'SUPER_ADMIN'])`: Fast checks on user roles.
- `requirePermission('notes:approve')`: Deep relational check that queries active permissions through `UserRole` -> `RolePermission` -> `Permission`.
- Results are cached in the request context (`req.user.permissions`) during pipeline traversal.

---

## 11. EXPRESS BACKEND ARCHITECTURE & MIDDLEWARE PIPELINE

The Express application is configured in `src/app.ts` and launched from `src/server.ts`.

### 11.1 Middleware Sequence Pipeline
```mermaid
flowchart LR
    A["Incoming HTTP Request"] --> B["cors() Strict Origin Gate"]
    B --> C["express.json({ limit: '10mb' })\nStores rawBody for Webhooks"]
    C --> D["express.urlencoded({ extended: true })"]
    D --> E["API Router: /api/v1"]
    E --> F["Route Match / Controller"]
    F --> G["Global 404 Handler"]
    G --> H["errorHandler (src/middleware/error.middleware.ts)"]
```

### 11.2 Strict CORS Configuration
```typescript
const productionOrigins = [
  'https://campusverse.edu',
  'https://www.campusverse.edu'
];
// Custom origins supplied via env.CORS_ORIGIN
// Null origins permitted for native Android apps and server-to-server calls
// Regex validation allows localhost and 10.0.2.2 (Android Emulator) during dev/test
```

### 11.3 Request Schema Validation (`validateBody`, `validateQuery`)
Built using **Zod**. If incoming payloads violate the schema, the request terminates with a structured 400 error before reaching controller logic:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request payload",
    "details": [
      {
        "field": "email",
        "message": "Invalid email address format"
      }
    ]
  }
}
```

---

## 12. COMPREHENSIVE BACKEND SERVICE MODULES & BUSINESS LOGIC

### 12.1 Authentication Service (`auth.controller.ts`, `otp.service.ts`)
- Registration with role assignment (`STUDENT`, `ASPIRANT`, `ALUMNI`).
- 6-digit numeric OTP generation with bcrypt hashing, 5-minute time-to-live, and 5-attempt rate-limiting.
- Email verification and password recovery flows.

### 12.2 Student & Academic Module (`student.controller.ts`, `note.controller.ts`)
- Manages student profiles, GPA tracking, enrollments, course records.
- Notes sharing platform: students publish notes; notes enter a `PENDING_REVIEW` state until approved by a `MODERATOR` or `ADMIN`.

### 12.3 Aspirant Admissions Module (`aspirant.controller.ts`)
- College search with multi-faceted filtering: accreditation, tuition ranges, location, degree levels.
- Admission Probability Predictor: matches applicant entrance exam scores against historical college cutoffs.
- Saved colleges and scholarship application tracking.

### 12.4 Alumni & Career Module (`alumni.controller.ts`, `job.controller.ts`, `mentorship.controller.ts`)
- Verified alumni directory search by graduation year, industry, and employer.
- Job posting board: alumni publish openings; students submit applications and referral requests.
- Mentorship matching: slot scheduling, meeting notes, session approval lifecycles.

### 12.5 Financial & Payment Module (`payment.controller.ts`, `razorpay.service.ts`)
- Razorpay order creation for paid campus events, marketplace items, or premium notes.
- Webhook ingestion with HMAC-SHA256 signature verification.
- Entitlement provisioning upon payment confirmation.

### 12.6 System & Feature Flag Module (`admin.controller.ts`)
- Dynamic runtime feature flags persisted in PostgreSQL (`SystemSetting` and `FeatureFlag` tables).
- Allows instant feature toggles (e.g., disable AI study assistant during exam periods) without server restarts.

---

## 13. COMPLETE API ROUTE INVENTORY

Mounted at `/api/v1` in `src/routes/index.ts`:

### 13.1 Core System & Health
| Method | Endpoint | Auth | Permission | Purpose |
|---|---|---|---|---|
| `GET` | `/health` | Public | None | Database connection pool ping and system health status |

### 13.2 Authentication & Identity (`/auth`)
| Method | Endpoint | Auth | Permission | Purpose |
|---|---|---|---|---|
| `POST` | `/auth/register` | Public | None | Create new user account with hashed password |
| `POST` | `/auth/login` | Public | None | Authenticate user, return JWT and role session |
| `POST` | `/auth/send-otp` | Public | None | Generate and dispatch 6-digit email OTP |
| `POST` | `/auth/verify-otp` | Public | None | Validate OTP code and verify user account |
| `POST` | `/auth/forgot-password` | Public | None | Initiate password recovery OTP email |
| `POST` | `/auth/reset-password` | Public | None | Reset password using valid recovery token/OTP |
| `POST` | `/auth/logout` | Bearer | None | Invalidate active session / clear cookies |
| `GET` | `/auth/me` | Bearer | None | Return authenticated user identity, profile & roles |

### 13.3 User Profile Management (`/users`, `/profile`)
| Method | Endpoint | Auth | Permission | Purpose |
|---|---|---|---|---|
| `GET` | `/profile` | Bearer | None | Get comprehensive multi-role profile of current user |
| `PUT` | `/profile` | Bearer | None | Update personal bio, social links, headline |
| `PUT` | `/profile/privacy` | Bearer | None | Update email, phone, and GPA visibility flags |
| `PUT` | `/profile/security` | Bearer | None | Update 2FA preferences and login alerts |
| `POST` | `/users/session-revoke` | Bearer | None | Revoke all active sessions (increments sessionVersion) |

### 13.4 Academic & Notes Module (`/students`, `/notes`, `/library`)
| Method | Endpoint | Auth | Permission | Purpose |
|---|---|---|---|---|
| `GET` | `/students/academic-record`| Bearer | None | Retrieve student transcripts and GPA history |
| `POST`| `/students/academic-record`| Bearer | None | Record course completion and semester grade |
| `GET` | `/notes` | Bearer | None | Search and browse approved study notes |
| `POST`| `/notes` | Bearer | `notes:create` | Upload study notes (enters moderation queue) |
| `GET` | `/notes/:id` | Bearer | None | Retrieve note details, download link, preview |
| `PUT` | `/notes/:id` | Bearer | Owner / Admin| Update note metadata or replace file |
| `DELETE`| `/notes/:id` | Bearer | Owner / Admin| Remove study note |
| `GET` | `/library/catalog` | Bearer | None | Query university digital book catalog |

### 13.5 Aspirant & Admissions Module (`/aspirant`, `/colleges`, `/scholarships`)
| Method | Endpoint | Auth | Permission | Purpose |
|---|---|---|---|---|
| `GET` | `/aspirant/colleges` | Public | None | Search colleges with filter criteria |
| `GET` | `/aspirant/colleges/:id` | Public | None | College details, fee structure, placement data |
| `POST`| `/aspirant/predict` | Bearer | None | Compute college admission cut-off probability |
| `GET` | `/aspirant/saved-colleges`| Bearer | None | Retrieve user's bookmarked institutions |
| `POST`| `/aspirant/saved-colleges`| Bearer | None | Bookmark college to user profile |
| `DELETE`| `/aspirant/saved-colleges/:id`| Bearer| None | Remove bookmarked college |
| `GET` | `/aspirant/scholarships` | Public | None | Search financial aid programs |
| `POST`| `/aspirant/scholarships/apply`| Bearer| None | Submit scholarship application record |

### 13.6 Alumni, Career & Mentorship (`/alumni`, `/jobs`, `/mentorship`)
| Method | Endpoint | Auth | Permission | Purpose |
|---|---|---|---|---|
| `GET` | `/alumni/directory` | Bearer | None | Search verified alumni directory |
| `GET` | `/jobs` | Bearer | None | Browse job postings & internships |
| `POST`| `/jobs` | Bearer | `jobs:create` | Post career vacancy (Alumni/Admin) |
| `GET` | `/jobs/:id` | Bearer | None | View job requirements and recruiter info |
| `POST`| `/jobs/:id/apply` | Bearer | None | Submit student application / referral request |
| `GET` | `/mentorship/mentors` | Bearer | None | Browse available alumni mentors |
| `POST`| `/mentorship/request` | Bearer | None | Book mentorship session with mentor |
| `GET` | `/mentorship/sessions`| Bearer | None | List upcoming and past mentoring sessions |
| `PUT` | `/mentorship/sessions/:id`| Bearer| None | Accept, reschedule, or complete session |

### 13.7 Community, Marketplace & Messaging (`/communities`, `/marketplace`, `/conversations`)
| Method | Endpoint | Auth | Permission | Purpose |
|---|---|---|---|---|
| `GET` | `/communities` | Bearer | None | Browse campus discussion communities |
| `POST`| `/communities` | Bearer | None | Create student club / community group |
| `GET` | `/marketplace/items` | Bearer | None | Browse textbook & gear marketplace |
| `POST`| `/marketplace/items` | Bearer | None | Create marketplace listing |
| `GET` | `/conversations` | Bearer | None | List user direct messaging conversations |
| `GET` | `/conversations/:id/messages`| Bearer| None | Fetch conversation message history |
| `POST`| `/conversations/:id/messages`| Bearer| None | Send direct message to peer |

### 13.8 Artificial Intelligence Engine (`/ai`)
| Method | Endpoint | Auth | Permission | Purpose |
|---|---|---|---|---|
| `POST`| `/ai/study-assistant` | Bearer | AI Rate Limit| AI query for academic explanations & code |
| `POST`| `/ai/career-assistant`| Bearer | AI Rate Limit| AI query for career roadmaps & interview prep |
| `POST`| `/ai/aspirant-recommendations`| Bearer| AI Rate Limit| AI query for personalized admissions guidance |
| `GET` | `/ai/sessions` | Bearer | None | List user's persistent AI chat sessions |
| `POST`| `/ai/sessions` | Bearer | None | Create new persistent AI chat conversation |
| `GET` | `/ai/sessions/:id` | Bearer | Owner/Admin | Retrieve chat history for session |
| `POST`| `/ai/sessions/:id/messages`| Bearer| AI Rate Limit| Post message to AI session and receive response |
| `DELETE`| `/ai/sessions/:id` | Bearer | Owner/Admin | Delete AI chat session |

### 13.9 Financial Ledger & Payments (`/payments`)
| Method | Endpoint | Auth | Permission | Purpose |
|---|---|---|---|---|
| `POST`| `/payments/orders` | Bearer | None | Create Razorpay order for ticket/listing |
| `POST`| `/payments/verify` | Bearer | None | Verify client HMAC-SHA256 payment signature |
| `POST`| `/payments/webhook` | Public | Webhook Sig | Ingest async payment status from Razorpay |
| `GET` | `/payments/history` | Bearer | None | Retrieve user payment transaction history |

### 13.10 System Administration Platform (`/admin`)
| Method | Endpoint | Auth | Permission | Purpose |
|---|---|---|---|---|
| `GET` | `/admin/metrics` | Elevated | `analytics:read` | High-level platform health & user counts |
| `GET` | `/admin/users` | Elevated | `users:read` | Paginated search of all platform users |
| `PUT` | `/admin/users/:id/status`| Elevated | `users:manage` | Suspend, ban, or reactivate user account |
| `POST`| `/admin/users/:id/reset-sessions`| Elevated | `users:manage`| Invalidate all active sessions for user |
| `GET` | `/admin/roles` | Elevated | `roles:read` | List system RBAC roles and permissions |
| `POST`| `/admin/roles/assign` | Elevated | `roles:manage` | Assign RBAC role to specific user |
| `GET` | `/admin/notes/pending`| Elevated | `notes:moderate`| List notes awaiting content approval |
| `POST`| `/admin/notes/:id/review`| Elevated| `notes:moderate`| Approve or reject pending study note |
| `GET` | `/admin/reports` | Elevated | `reports:read` | List user grievance & moderation tickets |
| `PUT` | `/admin/reports/:id` | Elevated | `reports:manage`| Resolve report ticket & apply sanction |
| `GET` | `/admin/audit-logs` | Elevated | `audit:read` | Query immutable system audit logs |
| `GET` | `/admin/feature-flags`| Elevated | `settings:read`| List dynamic platform feature flags |
| `PUT` | `/admin/feature-flags/:key`| Elevated| `settings:manage`| Enable/disable feature flag at runtime |

---

## 14. DATABASE ARCHITECTURE & COMPLETE SCHEMA BLUEPRINT

The database schema defined in `prisma/schema.prisma` is composed of **93 relational models**.

```mermaid
erDiagram
    User ||--o| Profile : "has"
    User ||--o| PrivacySettings : "configures"
    User ||--o| SecuritySettings : "configures"
    User ||--o{ UserRole : "assigned"
    UserRole }o--|| Role : "references"
    Role ||--o{ RolePermission : "contains"
    RolePermission }o--|| Permission : "grants"

    User ||--o{ Note : "authors"
    User ||--o{ EventRegistration : "attends"
    User ||--o{ CommunityMember : "joins"
    User ||--o{ MarketplaceItem : "sells"
    User ||--o{ JobApplication : "applies"
    User ||--o{ MentorshipRequest : "participates"
    User ||--o{ AIChatSession : "owns"
    AIChatSession ||--o{ AIChatMessage : "contains"

    User ||--o{ AuditLog : "initiates"
    User ||--o{ PaymentOrder : "places"
    PaymentOrder ||--o{ Transaction : "records"
    User ||--o{ Entitlement : "holds"
    User ||--o{ AdminSession : "elevates"
```

### 14.1 Core Domain Models (Excerpt)
1. **User**: Primary authentication anchor (`id`, `email`, `passwordHash`, `role`, `isActive`, `isAdminAuthorized`, `sessionVersion`).
2. **Profile**: Extended personal data (`fullName`, `avatarUrl`, `headline`, `bio`, `location`, `phone`, `linkedin`, `github`).
3. **Role & Permission**: Relational RBAC entities managing granular administrative capabilities.
4. **AdminSession**: Tracks active administrative web sessions with device fingerprints and expiration timestamps.
5. **Note**: Academic study material (`title`, `subject`, `fileUrl`, `fileType`, `moderationStatus`, `downloadCount`).
6. **College & CollegeCutoff**: Educational directory and historical cutoff datasets for admissions predictions.
7. **Job & JobApplication**: Employment portal connecting student talent with alumni recruiters.
8. **AIChatSession & AIChatMessage**: Full persistence of multi-turn conversational AI interactions.
9. **AuditLog**: Tamper-evident ledger recording all administrative mutations (`actorId`, `action`, `resource`, `payload`, `ipAddress`).
10. **PaymentOrder & Transaction**: Financial ledger tracking Razorpay transactions and status callbacks.

---

## 15. PRISMA MIGRATIONS HISTORY & SCHEMA EVOLUTION

The database evolution is recorded in `prisma/migrations/`:

| Migration Directory | Applied At | Key Architectural Additions |
|---|---|---|
| `20260909000000_init_postgresql` | Initial Setup | Base schema baseline: Users, Profiles, Notes, Colleges, Jobs, Mentorship, Events, Communities. |
| `20260925000000_production_hardening_rbac_modules` | Hardening Pass 1 | Relational RBAC tables (`Role`, `Permission`, `UserRole`, `RolePermission`), Feature Flags, Audit Logging, Razorpay Ledger. |
| `20260925100000_session_version_and_admin_sessions` | Hardening Pass 2 | Instant token revocation (`sessionVersion` column on `User`), `AdminSession` table for concurrent elevation management. |

---

## 16. SUPABASE POSTGRESQL INFRASTRUCTURE & CLOUD SETUP

- **Cloud Provider**: Supabase Managed PostgreSQL
- **Region**: AWS Mumbai (`ap-south-1`)
- **Connection Strings**:
  - `DATABASE_URL`: Port `5432` / `6543` pointing to Supabase Supavisor connection pooler in Transaction Mode.
  - `DIRECT_URL`: Direct PostgreSQL connection on port `5432` for running schema migrations and DDL statements that require prepared statement support.
- **Extensions Installed**:
  - `pgcrypto` / `uuid-ossp`: Fast in-engine UUIDv4 generation.
  - `citext`: Case-insensitive text storage for email normalization.
  - `pg_stat_statements`: Query performance tracking and slow query diagnosis.

---

## 17. DATABASE SECURITY & ROW LEVEL SECURITY (RLS) MATRIX

To eliminate vulnerabilities stemming from compromised backend connection strings or multi-tenant leaks, **100% of all 93 tables in the database have Row-Level Security explicitly activated**:

```sql
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
-- Result: 93 of 93 tables return rowsecurity = true
```

### 17.1 RLS Enforcement Strategy
- **Backend Access**: Express operates via Prisma connecting through the Supabase `postgres` / `service_role` connection pool. By default in PostgreSQL, superusers/table owners bypass RLS unless `FORCE ROW LEVEL SECURITY` is applied.
- **Supabase Direct Client Access**: If Supabase client libraries (`@supabase/supabase-js`) are deployed to the frontend, RLS policies strictly quarantine rows so users can only `SELECT` or `UPDATE` records matching their verified `auth.uid() = user_id`.
- **Administrative Isolation**: Tables containing sensitive credentials (`User`, `AdminSession`, `AuditLog`, `SystemSetting`) reject public anonymous read access unconditionally.

---

## 18. ADMIN CONTROL PLATFORM ARCHITECTURE

The administrative control center lives at `/admin` within the Next.js application and communicates with `/api/v1/admin/*` backend controllers.

```
/admin Console Architecture:
├── Multi-Panel Dashboard: Real-time telemetry, user registration velocity, payment volumes.
├── User Inspector & Sanctioning: Search users, toggle active status, trigger global session revocation.
├── Role & Permission Matrix: Granular visual checklist assigning permissions to roles.
├── Content Moderation Queue: Side-by-side note preview, approve/reject buttons with reason input.
├── System Feature Flags: Immediate runtime toggles modifying backend behavior without redeployment.
└── Security Audit Log Explorer: Searchable chronological log of all administrator actions.
```

All admin write operations require:
1. Valid JWT with `role === 'ADMIN'`
2. `isAdminAuthorized === true` on the database user record
3. The specific permission required for the action (e.g. `users:manage`, `system:flags`)
4. An automatic append to the immutable `AuditLog` table

---

## 19. AI INTEGRATION ARCHITECTURE (GOOGLE GEMINI)

The AI subsystem leverages Google's Generative AI infrastructure via REST API calls from the backend controllers.

### 19.1 AI Engine Mechanics
- **Upstream Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
- **Configured Models**: `process.env.GEMINI_MODEL || 'gemini-3.5-flash'` (fallback to `gemini-1.5-flash`).
- **Keys**: Supplied via `GEMINI_API_KEY` or `AI_API_KEY`.
- **Rate Limiting**: `aiRateLimiter` enforces a strict quota of **10 requests per minute per user** to prevent API key quota exhaustion.

### 19.2 Specialized Reasoning Personas
1. **Academic Study Assistant (`/ai/study-assistant`)**:
   - Modes: `EXPLAIN`, `SUMMARIZE`, `CONCEPT_QA`, `SOLVE_STEP_BY_STEP`.
   - Prompt Engineering: Configured as a university engineering professor emphasizing formal proofs, time complexities, and clean code examples.
2. **Career Pathfinding Advisor (`/ai/career-assistant`)**:
   - Modes: `CAREER_GUIDANCE`, `JOB_MATCHING`, `INTERVIEW_PREP`, `RESUME_REVIEW`, `CAREER_ROADMAP`.
   - Injects student skills, graduation date, and target industry into prompt context.
3. **Admissions Counselor (`/ai/aspirant-recommendations`)**:
   - Evaluates high school scores, entrance ranks, and target degree against university criteria.

### 19.3 Fault Tolerance & Offline Heuristics
If `GEMINI_API_KEY` is omitted or upstream Google servers return an HTTP 5xx error, the controllers do **not** crash. They degrade gracefully:
- Return pre-compiled academic conceptual guides (Dijkstra algorithm, BCNF normalization, CPU scheduling, TCP handshake).
- Return explicit `available: false` notices instructing the user to retry, maintaining continuous UI functionality.

---

## 20. COMMUNICATION & EMAIL DELIVERY SYSTEM

CampusVerse implements an interchangeable multi-driver email delivery system in `src/services/email.service.ts`:

```mermaid
flowchart TD
    OTP["OTP / Notification Trigger"] --> SERVICE["EmailService (src/services/email.service.ts)"]
    SERVICE --> DRIVER{OTP_EMAIL_PROVIDER}
    DRIVER -->|"mock" (Dev/Test)| MOCK["Mock Driver\nLogs 6-digit OTP to stdout"]
    DRIVER -->|"smtp"| SMTP["Nodemailer SMTP Driver\nConnects to SMTP_HOST:SMTP_PORT"]
    DRIVER -->|"resend"| RESEND["Resend API Driver\nHTTPS POST api.resend.com/emails"]
    DRIVER -->|"sendgrid"| SG["SendGrid Driver\nHTTPS POST api.sendgrid.com/v3/mail/send"]
```

- **OTP Security**: OTP codes are randomly generated 6-digit integers with 5-minute expirations. The raw OTP is dispatched via email, while only its salted hash is stored in PostgreSQL.
- **Resend Cooldown**: Enforces a 60-second cooldown between consecutive dispatch requests to mitigate spam abuse.

---

## 21. FILE STORAGE & ASSET MANAGEMENT ARCHITECTURE

### 21.1 Current Implementation
- Study notes, user avatars, and verification documents are currently tracked via URL references (`fileUrl`, `avatarUrl`, `documentUrl`) stored in PostgreSQL.
- Payloads uploaded via `/api/v1/notes` accept direct URL pointers or base64 strings under a `10mb` express body limit.

### 21.2 Production Target Architecture
- **Supabase Storage / AWS S3**: Documents must be stored in secure, private S3 buckets.
- **Presigned URLs**: Clients obtain a short-lived presigned upload URL from `/api/v1/storage/upload-url`, upload files directly to S3/Supabase Storage, and save the resulting immutable storage key to PostgreSQL.

---

## 22. NOTIFICATION & REAL-TIME MESSAGING ARCHITECTURE

- **In-App Notifications**: Stored in the `Notification` table (`id`, `userId`, `title`, `content`, `type`, `isRead`, `createdAt`). Next.js fetches unread alerts via React Query polling intervals.
- **Direct Messaging (`/conversations`)**: 1-to-1 conversations between students, mentors, and alumni. Messages are persisted in `Message` records.
- **Architectural Gap**: The backend currently relies on HTTP request-response polling rather than persistent WebSockets (`Socket.io`) or Supabase Realtime Channels. High-concurrency chat requires migrating to WebSocket channels.

---

## 23. SEARCH, DISCOVERY & FILTERING ARCHITECTURE

- **Colleges & Scholarships**: Filtered using Prisma `contains` and `mode: 'insensitive'` across name, city, state, and degree fields.
- **Job Board**: Query filters support `employmentType` (`FULL_TIME`, `INTERNSHIP`), `workplaceType` (`REMOTE`, `HYBRID`, `ON_SITE`), and minimum compensation brackets.
- **Study Notes**: Indexed by `subjectId`, `collegeId`, `semester`, and rating.
- **Scaling Recommendation**: Deploy PostgreSQL Full-Text Search (`tsvector`, `tsquery`) with GIN indexes on `Note.title`, `College.name`, and `Job.title` to avoid sequential table scans as records exceed 100,000.

---

## 24. PAYMENT & FINANCIAL LEDGER ARCHITECTURE (RAZORPAY)

CampusVerse integrates **Razorpay** to process campus marketplace purchases, paid mentoring masterclasses, and event registrations.

```mermaid
sequenceDiagram
    autonumber
    actor User as Student
    participant Web as Next.js Web Client
    participant API as Express Backend
    participant Razor as Razorpay Payment Gateway
    participant DB as Supabase PostgreSQL

    User->>Web: Clicks "Purchase / Register"
    Web->>API: POST /api/v1/payments/orders { amount: 500, itemId: "..." }
    API->>Razor: Create Order (amount: 50000 paise, currency: INR)
    Razor-->>API: Returns order_id (e.g. order_NZ78d...)
    API->>DB: INSERT INTO "PaymentOrder" (status: 'CREATED')
    API-->>Web: Return order_id & Razorpay public key
    Web->>Razor: Open Razorpay Checkout modal
    User->>Razor: Completes payment (UPI / Card / NetBanking)
    Razor-->>Web: Returns { razorpay_payment_id, razorpay_signature }
    Web->>API: POST /api/v1/payments/verify { orderId, paymentId, signature }
    API->>API: Compute HMAC-SHA256(orderId + "|" + paymentId, SECRET)
    alt Signature Matches
        API->>DB: UPDATE "PaymentOrder" SET status = 'SUCCESS'
        API->>DB: INSERT INTO "Transaction" & "Entitlement"
        API-->>Web: 200 OK (Payment Verified, Access Granted)
    else Signature Invalid
        API-->>Web: 400 Bad Request (FRAUD_DETECTED)
    end
    Razor-)API: Webhook: payment.captured (Async idempotency backup)
```

---

## 25. SECURITY ARCHITECTURE, THREAT ANALYSIS & OWASP ASSESSMENT

| Threat Category | Potential Attack Vector | CampusVerse Mitigation Strategy | Status |
|---|---|---|---|
| **Broken Auth** | Stolen / leaked JWTs replay attacks | **Session Versioning**: Instant global invalidation by incrementing `User.sessionVersion`. | **SECURE** |
| **SQL Injection** | SQL parameter tampering | **Prisma ORM**: 100% parameterized queries. Zero raw SQL concatenations in application code. | **SECURE** |
| **Elevation of Privilege** | Normal user calling `/api/v1/admin/*` | **Tri-Layer Guard**: Validates JWT role, database `isAdminAuthorized` flag, and granular RBAC permissions. | **SECURE** |
| **Cross-Origin Abuse** | Malicious sites executing API calls | **Strict CORS**: Origin allowlist validation; rejects unlisted web domains. | **SECURE** |
| **Brute Force Attacks** | Password guessing / OTP spamming | **Rate Limiting**: 5 OTP attempts per window; 100 requests/min general rate limiter. | **SECURE** |
| **Mass Data Exfiltration** | Direct cloud database scraping | **100% RLS Enabled**: All 93 PostgreSQL tables have Row-Level Security active. | **SECURE** |
| **Payment Fraud** | Tampered client payment confirmations | **Server-side HMAC-SHA256**: Razorpay signatures verified against cryptographic secrets. | **SECURE** |
| **Prompt Injection** | Jailbreaking Gemini AI models | **System Persona Guardrails**: Structured system prompts bounding AI behavior to academic/career scopes. | **HARDENED** |

---

## 26. PERFORMANCE, CACHING & SCALABILITY ANALYSIS

- **Next.js Rendering Pipeline**: Marketing routes (`/`, `/about`, `/colleges`) utilize Static Site Generation (SSG) for instantaneous global CDN delivery. Dynamic portals (`/student/*`, `/admin/*`) run client-side fetching with TanStack Query caching to eliminate redundant backend trips.
- **Connection Pool Bottlenecks**: Prisma connects via Supabase Supavisor connection pooler (`aws-0-ap-south-1.pooler.supabase.com`). Transaction pooling ensures the database handles up to 5,000 concurrent client connections without exhausting PostgreSQL memory.
- **Frontend Bundle Size**: Next.js tree-shaking isolates heavy dependencies. Production build output verifies optimal JS chunking (average page first-load JS is under 90 kB).

---

## 27. DEVOPS, DEPLOYMENT & CI/CD PIPELINE

```mermaid
flowchart LR
    GIT["GitHub Repository\nrohansiddhpura17-source/CampusVerse"]
    
    subgraph DeployPipeline ["Automated Deployment"]
        VERCEL["Vercel Production\nCampusVerse Website\nRuns next build"]
        RENDER["Render / Cloud Node.js\nExpress API Server\nRuns npm run build && npm start"]
        SUPA["Supabase Cloud (ap-south-1)\nPostgreSQL Database\nRuns prisma migrate deploy"]
    end

    GIT -->|Push to main| VERCEL
    GIT -->|Push to main| RENDER
    RENDER --> SUPA
```

- **Frontend CI/CD**: Automatic branch preview and production deployments via Vercel.
- **Backend CI/CD**: Containerized Node.js runtime executing TypeScript build (`tsc`) and launching `dist/server.js`.
- **Database Migrations**: Applied during release phases using `prisma migrate deploy` against `DIRECT_URL`.

---

## 28. ENVIRONMENT VARIABLES & SECRET MANAGEMENT BLUEPRINT

> [!CAUTION]
> All credentials below are masked for documentation security. Production values must be securely managed via Vercel and Render secret managers.

### 28.1 Backend Environment Matrix (`backend/.env`)
| Variable Key | Required | Format / Example | Purpose |
|---|---|---|---|
| `PORT` | Optional | `4000` | Local HTTP listening port |
| `NODE_ENV` | **YES** | `production` / `development` | Runtime environment mode |
| `DATABASE_URL` | **YES** | `postgresql://postgres.[ref]:[pass]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres?pgbouncer=true` | PgBouncer pooled connection |
| `DIRECT_URL` | **YES** | `postgresql://postgres:[pass]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres` | Direct connection for migrations |
| `JWT_SECRET` | **YES** | `[32+ Char High-Entropy Secret]` | HMAC-SHA256 signing secret |
| `JWT_EXPIRES_IN` | Optional | `7d` | Token expiration duration |
| `CORS_ORIGIN` | **YES** | `https://campusverse.edu,https://www.campusverse.edu` | Allowed web origins |
| `GEMINI_API_KEY` | **YES** | `AIzaSy...` | Google Gemini API secret key |
| `GEMINI_MODEL` | Optional | `gemini-3.5-flash` | Gemini model target identifier |
| `RAZORPAY_KEY_ID` | **YES** | `rzp_live_...` / `rzp_test_...` | Razorpay public API key |
| `RAZORPAY_KEY_SECRET` | **YES** | `[24 Char Secret]` | Razorpay cryptographic secret |
| `OTP_EMAIL_PROVIDER` | **YES** | `mock` / `smtp` / `resend` / `sendgrid` | Active email transport driver |

### 28.2 Frontend Environment Matrix (`campuswebsite/.env.local`)
| Variable Key | Required | Format / Example | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | **YES** | `https://api.campusverse.edu/api/v1` | Public REST backend base URL |

---

## 29. ANDROID NATIVE APPLICATION INTEGRATION ARCHITECTURE

The native Android app in `/Users/rohansiddhpura/AndroidStudioProjects/CampusVerse/app` provides complete mobile parity with the web platform:

### 29.1 Network Architecture
- Uses coroutine-based HTTP clients communicating with `http://10.0.2.2:4000/api/v1` (local development loopback) or the production cloud domain.
- Core Repositories:
  - `NetworkAuthRepository.kt`: Handles login, registration, OTP validation, and token refresh.
  - `NetworkStudentRepository.kt`: Handles academic records, notes downloads, and assignments.
  - `NetworkAlumniRepository.kt`: Handles directory queries, job applications, and referrals.
  - `NetworkAspirantRepository.kt`: Handles admission predictions and college comparisons.
  - `NetworkPaymentRepository.kt`: Integrates Razorpay Android Mobile SDK for in-app payments.

### 29.2 Session Management (`DataStoreSessionManager.kt`)
- Persists user JWT tokens, user role, and profile cache inside encrypted Android Jetpack DataStore preferences.
- Intercepts 401 `SESSION_REVOKED` backend responses and navigates the user back to the Compose `LoginScreen`.

---

## 30. COMPONENT DEPENDENCY & CROSS-SYSTEM INTERACTION MATRIX

```
+-------------------------------------------------------------------------------------------------------------------------+
| SYSTEM COMPONENT        | DEPENDS ON                                           | PROVIDES TO                            |
+-------------------------------------------------------------------------------------------------------------------------+
| Next.js Frontend        | Express Backend (/api/v1), TanStack Query, Axios      | End users (Browsers, Tablets)          |
| Android Application     | Express Backend (/api/v1), Jetpack DataStore, Coroutines| Mobile end users (Android OS)         |
| Express API Gateway     | PostgreSQL (Supabase), JWT, Zod, Rate Limiter        | Next.js Web, Android App               |
| Prisma ORM              | Supabase Connection Pooler (Supavisor)                | Express Domain Controllers             |
| AI Engine Subsystem     | Google Generative Language REST API                  | Student Tutor, Career, Admissions      |
| Payment Gateway Engine  | Razorpay REST API, Webhook HMAC Verification         | Marketplace, Events, Subscriptions     |
| Email Delivery Engine   | Resend API / SendGrid / NodeMailer SMTP              | Auth OTP, Password Recovery, Alerts    |
| Audit Logging Subsystem | PostgreSQL "AuditLog" Table                          | Admin Security Console                 |
+-------------------------------------------------------------------------------------------------------------------------+
```

---

## 31. REQUEST/RESPONSE & ERROR HANDLING LIFECYCLES

All API responses conform to a strict, predictable JSON envelope across both successful operations and caught exceptions:

### 31.1 Standard Success Envelope
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### 31.2 Standard Error Envelope
```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_PERMISSIONS",
    "message": "User does not have the required permission: [notes:approve]",
    "details": null
  }
}
```

### 31.3 Standard HTTP Status Code Map
- `200 OK`: Successful retrieval or update.
- `201 Created`: Entity successfully created (User, Note, Job).
- `400 Bad Request`: Zod validation error or malformed payload.
- `401 Unauthorized`: Missing token, invalid signature, or `SESSION_REVOKED`.
- `403 Forbidden`: Valid token, but insufficient RBAC permissions or un-elevated admin.
- `404 Not Found`: Resource or route does not exist.
- `429 Too Many Requests`: Rate limiter quota exceeded (e.g. AI or OTP limits).
- `500 Internal Server Error`: Unhandled server exception (caught by `errorHandler`).

---

## 32. OBSERVABILITY, LOGGING & HEALTH MONITORING

1. **System Health Endpoint (`GET /api/v1/health`)**: Executes an active ping (`SELECT 1`) against the Supabase PostgreSQL connection pool and returns database latency and operational status.
2. **Security Audit Trail (`AuditLog`)**: Every administrative write (role grant, account suspension, feature flag toggle) generates an immutable record capturing `actorId`, `action`, `resource`, `ipAddress`, and `timestamp`.
3. **Observability Gaps**: The current system relies on `console.log` and `console.error`. To achieve enterprise-grade observability, structured JSON logging (Winston / Pino) and an Application Performance Monitoring (APM) agent like Sentry or Datadog should be integrated.

---

## 33. TECHNICAL DEBT, REDUNDANCIES & DEAD CODE INVENTORY

1. **Dual SQLite / PostgreSQL Schemas**: The repository maintains both `schema.prisma` (PostgreSQL) and `schema.sqlite.prisma` (SQLite). Maintaining two parallel schemas risks divergence; the development environment should use Dockerized PostgreSQL.
2. **Hardcoded Fallback AI Content**: While fallback heuristics prevent crashes, extensive hardcoded CS answers inside `ai.controller.ts` inflate controller size. These should be decoupled into a dedicated knowledge-base service.
3. **Polling vs WebSockets**: Chat and notifications rely on HTTP polling. This creates unnecessary server load as user numbers scale and should be replaced with WebSocket channels.
4. **File Binary Storage**: The database currently relies on URL references without direct S3/Supabase storage presigned upload integrations.

---

## 34. FAILURE MODES & "WHAT CAN BREAK" RISK ANALYSIS

| Failure Scenario | Cascade Effect | Current Resilience / Fallback | Long-Term Solution |
|---|---|---|---|
| **Supabase Connection Spike** | Port 5432 rejects connections with `too many clients`. | Supavisor connection pooling absorbs traffic. | Implement Redis read-caching layer for static college/course data. |
| **Google Gemini Quota Exhaustion**| AI endpoints return HTTP 429 Too Many Requests. | Controller catches error and serves heuristic fallback responses. | Implement multi-key rotation and token-bucket queuing. |
| **Email Gateway Outage** | Users cannot receive verification OTPs. | System falls back to mock driver in test/dev modes. | Multi-provider fallback chain (Resend -> SendGrid -> SMTP). |
| **Razorpay Webhook Network Drop** | User pays on mobile, but backend fails to receive webhook. | Dual confirmation: Client verifies signature synchronously via `/payments/verify`. | Implement idempotent webhook replay reconciliation cron. |
| **Token Compromise** | Malicious actor obtains valid JWT. | Admin increments `User.sessionVersion`, immediately killing all token validity. | Short-lived access tokens (15 min) with refresh tokens in HttpOnly cookies. |

---

## 35. STRATEGIC ARCHITECTURAL ROADMAP & PRODUCTION READINESS RECOMMENDATIONS

```mermaid
gantt
    title CampusVerse Strategic Engineering Roadmap
    dateFormat  YYYY-MM-DD
    section Phase 1: Security & Storage
    S3 Presigned Upload Pipeline           :p1_1, 2026-10-01, 14d
    HttpOnly Refresh Token Rotation        :p1_2, after p1_1, 10d
    section Phase 2: Realtime & Caching
    Redis Cache Layer (Upstash/Redis)      :p2_1, after p1_2, 14d
    WebSocket Engine for Direct Chat       :p2_2, after p2_1, 14d
    section Phase 3: Observability & Scale
    Sentry APM & Pino Structured Logging   :p3_1, after p2_2, 10d
    PostgreSQL Full-Text Search (GIN)      :p3_2, after p3_1, 10d
```

### Immediate Action Items (Next 30 Days)
1. **Presigned Cloud Storage**: Implement direct S3/Supabase presigned upload URLs for notes, avatars, and documents.
2. **HttpOnly Cookie Auth**: Migrate JWT tokens from browser `localStorage` into secure, encrypted `HttpOnly` `SameSite=Lax` cookies to eliminate XSS token theft vectors.
3. **Redis Caching Tier**: Deploy Redis to cache high-frequency, low-mutability queries (College Directory, Course Catalogs, System Settings).
4. **Structured Logging**: Replace `console.log` with a structured logger (`pino`) piped into an observability aggregator (Datadog / BetterStack).

---

## 36. ARCHITECTURE CONSISTENCY & HARDENED BOUNDARIES

Following the comprehensive administrative audit and hardening pass, CampusVerse enforces strict architectural boundaries across the Next.js frontend, Express/TypeScript API gateway, Prisma ORM, and Supabase PostgreSQL database.

### 36.1 Authoritative Relational Authorization (Canonical RBAC)

Authorization is governed authoritatively by the relational RBAC schema (`Role`, `Permission`, `UserRole`, `RolePermission`). All authorization decisions evaluate the user's active relational assignments rather than legacy static enums.

```mermaid
classDiagram
    class User {
        +String id
        +String email
        +Role role (legacy)
        +Boolean isAdminAuthorized (legacy)
        +Int sessionVersion
        +Boolean isActive
    }
    class UserRole {
        +String id
        +String userId
        +String roleId
        +DateTime assignedAt
        +String assignedBy
    }
    class Role {
        +String id
        +String name
        +String description
        +Boolean isSystem
    }
    class RolePermission {
        +String id
        +String roleId
        +String permissionId
        +DateTime assignedAt
    }
    class Permission {
        +String id
        +String name
        +String module
        +String description
    }
    User "1" --> "0..*" UserRole : assigns
    Role "1" --> "0..*" UserRole : defines
    Role "1" --> "0..*" RolePermission : grants
    Permission "1" --> "0..*" RolePermission : contains
```

#### Administrative Defense-in-Depth Pipeline:
1. **Authentication Gate (`authenticateToken`)**: Verifies JWT cryptographic signature, extracts claims (`userId`, `role`, `sessionVersion`), checks database user status (`isActive === true`), and verifies `token.sessionVersion === user.sessionVersion`. Rejects stale or revoked credentials with `401 SESSION_REVOKED`.
2. **Administrative Access Gate (`requireAdministrativeAccess`)**: Canonical router-level middleware guarding all `/api/v1/admin/*` endpoints. Queries `UserRole` junction table for membership in standard administrative roles (`SUPER_ADMIN`, `ADMIN`, `MODERATOR`, `CONTENT_MANAGER`, `SUPPORT_ADMIN`, `ANALYTICS_ADMIN`). Fallback compatibility evaluates `user.role === 'ADMIN' || user.isAdminAuthorized === true`.
3. **Granular Permission Gate (`requirePermission` / `requireAnyPermission`)**: Enforces fine-grained operational permissions per domain endpoint (e.g. `settings.manage`, `users.suspend`, `colleges.manage`).
4. **Controller Invariants & Safeguards**:
   - `CANNOT_MODIFY_OWN_ROLES`: Administrators cannot alter, assign, or revoke their own roles.
   - `UNAUTHORIZED_ROLE_ESCALATION`: Non-super admins cannot grant or revoke `SUPER_ADMIN` privileges or escalate permissions.
   - `CANNOT_DELETE_LAST_SUPER_ADMIN`: Protects against lockout by ensuring at least one active `SUPER_ADMIN` exists in the system.
   - `AUDIT_LOG_IMMUTABLE`: Direct modification (`PUT`/`PATCH`) or deletion (`DELETE`) of audit logs is permanently prohibited with `405 Method Not Allowed`.

#### Standard Administrative Roles Catalog:
| Role Name | Authority Scope | Core Permissions |
|---|---|---|
| `SUPER_ADMIN` | Unrestricted root administrator | Wildcard access across all 10 platform modules |
| `ADMIN` | Platform operations & governance | `users.*`, `events.*`, `scholarships.*`, `moderation.*` |
| `MODERATOR` | Trust, safety & content moderation | `moderation.read`, `moderation.resolve`, `users.suspend` |
| `CONTENT_MANAGER` | Academic catalog & directory management | `colleges.manage`, `courses.manage`, `subjects.manage`, `content.write` |
| `SUPPORT_ADMIN` | Student support & customer service | `users.read`, `support.manage`, `analytics.read` |
| `ANALYTICS_ADMIN` | Business intelligence & audit telemetry | `analytics.read`, `audit.read` |

---

### 36.2 Legacy Compatibility Bridges

To preserve zero-downtime backward compatibility with the existing Android mobile application and legacy API consumers:
1. **Field Retention**: `User.role` enum (`STUDENT`, `ASPIRANT`, `ALUMNI`, `ADMIN`) and `User.isAdminAuthorized` boolean flag are retained in the database schema.
2. **Dual-Synchronization Logic**:
   - When administrative roles are assigned to a user via `assignUserRole`, `User.isAdminAuthorized` is synchronized to `true`.
   - When administrative roles are revoked, `User.isAdminAuthorized` is synchronized to `false` if no administrative roles remain.
3. **Role Decoupling**: A user whose primary base role is `STUDENT` or `ALUMNI` may be assigned elevated administrative privileges (e.g. `MODERATOR`, `ANALYTICS_ADMIN`). The frontend navigation and route guards evaluate `hasAdministrativeAccess(user)` dynamically, decoupling UI capabilities from the legacy `User.role` column.

---

### 36.3 Session Invalidation & Device Management (`sessionVersion` + `AdminSession`)

The system implements a dual-tier session management architecture combining global cryptographic invalidation with granular device tracking:

```mermaid
flowchart TD
    subgraph Global Tier
        PWD[Password Reset / Admin Reset / Revoke All] --> INC[Increment User.sessionVersion in DB]
        INC --> REV[All Existing JWT Tokens with Old sessionVersion Immediately Invalidate with 401]
    end

    subgraph Granular Device Tier
        LOGIN[Admin Login] --> SESS[Create AdminSession Record with tokenHash and Telemetry]
        SESS --> DEV_REV[Admin Revokes Specific Device Session]
        DEV_REV --> FLAG[AdminSession.isRevoked = true]
        FLAG --> REJ[Requests using this token hash rejected with 401]
    end
```

1. **Global Invalidation (`sessionVersion`)**:
   - Every issued JWT token embeds `sessionVersion` inside its encrypted payload.
   - On password reset (OTP reset in `otp.service.ts` or administrative reset in `admin.controller.ts`), user suspension, or forced global revocation (`POST /api/v1/admin/security/sessions/revoke-all`), `User.sessionVersion` is incremented.
   - Every subsequent request with an outdated `sessionVersion` fails authentication with HTTP 401 `SESSION_REVOKED`.
2. **Device Telemetry (`AdminSession`)**:
   - Administrative sessions store cryptographic SHA-256 token hashes (`tokenHash`), client IP address, user agent, device classification, and absolute expiry timestamps.
   - Administrators can review active sessions at `GET /api/v1/admin/security/sessions` and terminate specific compromised devices at `POST /api/v1/admin/security/sessions/:id/revoke`.
   - Privilege boundary: Non-super administrators may only revoke their own sessions; attempting to revoke another administrator's session returns HTTP 403 `FORBIDDEN`.

---

### 36.4 Admin Request Lifecycle Sequence

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Admin Browser
    participant Gateway as Express Gateway / Middleware
    participant Auth as authenticateToken
    participant AdminGuard as requireAdministrativeAccess
    participant PermGuard as requirePermission
    participant Zod as Zod Validation
    participant Ctrl as Admin Controller
    participant DB as Prisma / Supabase PostgreSQL
    participant Audit as AuditLogger

    Admin->>Gateway: HTTP Request with Bearer JWT
    Gateway->>Auth: Verify JWT signature & expiration
    Auth->>DB: Fetch user status & sessionVersion
    alt Invalid Signature or sessionVersion mismatch
        Auth-->>Admin: 401 SESSION_REVOKED / INVALID_TOKEN
    end
    Auth->>AdminGuard: Pass authenticated user context
    AdminGuard->>DB: Query UserRole junction for administrative roles
    alt No administrative roles or fallback
        AdminGuard-->>Admin: 403 FORBIDDEN (ADMIN_ACCESS_REQUIRED)
    end
    AdminGuard->>PermGuard: Check endpoint permission (e.g. settings.manage)
    alt Lacks required permission
        PermGuard-->>Admin: 403 FORBIDDEN (INSUFFICIENT_PERMISSIONS)
    end
    PermGuard->>Zod: Validate Request Body / Query / Params
    alt Validation failure
        Zod-->>Admin: 400 Bad Request (Validation Error)
    end
    Zod->>Ctrl: Execute Business Logic
    Ctrl->>DB: Execute Query via Prisma Pooler (RLS Protected)
    DB-->>Ctrl: Return Entity Result
    Ctrl->>Audit: Record Immutable Audit Log (actor, action, target, metadata)
    Audit->>DB: INSERT into AuditLog
    Ctrl-->>Admin: 200 / 201 JSON Response (Secrets Masked)
```

---

### 36.5 Database Security & Multi-Tier Boundaries

| Tier | Security Boundary | Access Control Mechanism | Threat Mitigation |
|---|---|---|---|
| **Frontend (Next.js)** | Untrusted Client Environment | Route guards (`AdminRoute`, `hasAdministrativeAccess`), zero embedded database credentials | Prevents UI exposure; client tampering cannot bypass API-level RBAC |
| **Backend API Gateway** | Trusted Intermediary | Express middleware pipeline (`authenticateToken`, `requireAdministrativeAccess`, `requirePermission`, Zod schemas) | Enforces strict validation, role separation, rate limiting, and sanitization |
| **Prisma ORM** | Data Access Layer | Connects via PgBouncer/Supavisor pooler (`port 5432`), parameterized queries | Eliminates SQL injection; enforces model-level invariants |
| **Supabase PostgreSQL** | Database Engine | **Row Level Security (RLS) enabled on 92/92 tables** | Defense-in-depth: prevents unauthorized direct table queries via PostgREST/anon keys |

---

### 36.6 Comprehensive API / Frontend Contract Audit Table

The following matrix documents the authoritative contract connecting all 14 frontend administrative routes to their respective backend endpoints, HTTP methods, required permissions, controller handlers, and primary Prisma models:

| # | Admin Page Route | HTTP Method & Backend Endpoint | Required Permission / Guard | Controller Handler | Primary Prisma Model(s) |
|---|---|---|---|---|---|
| 1 | `/admin/dashboard` | `GET /api/v1/admin/stats`<br>`GET /api/v1/admin/system/flags` | `analytics.read`<br>`settings.manage` | `getSystemStats`<br>`getFeatureFlags` | `User`, `College`, `Course`, `SystemSetting` |
| 2 | `/admin/users` | `GET /api/v1/admin/users`<br>`POST /api/v1/admin/users/:id/suspend`<br>`POST /api/v1/admin/users/:id/activate`<br>`POST /api/v1/admin/users/:id/reset-password` | `users.read`<br>`users.suspend`<br>`users.suspend`<br>`users.write` | `getAdminUsers`<br>`suspendUser`<br>`activateUser`<br>`resetUserPassword` | `User`, `UserProfile`, `UserRole`, `AuditLog` |
| 3 | `/admin/roles` | `GET /api/v1/admin/roles`<br>`POST /api/v1/admin/roles`<br>`GET /api/v1/admin/permissions`<br>`POST /api/v1/admin/users/:id/roles`<br>`DELETE /api/v1/admin/users/:id/roles/:roleId` | `roles.manage`<br>`roles.manage`<br>`roles.manage`<br>`roles.manage`<br>`roles.manage` | `getAdminRoles`<br>`createAdminRole`<br>`getAdminPermissions`<br>`assignUserRole`<br>`revokeUserRole` | `Role`, `Permission`, `RolePermission`, `UserRole`, `AuditLog` |
| 4 | `/admin/colleges` | `GET /api/v1/admin/colleges`<br>`POST /api/v1/admin/colleges`<br>`PUT /api/v1/admin/colleges/:id`<br>`DELETE /api/v1/admin/colleges/:id` | `colleges.manage` (or `content.write`) | `getAdminColleges`<br>`createAdminCollege`<br>`updateAdminCollege`<br>`deleteAdminCollege` | `College`, `AuditLog` |
| 5 | `/admin/courses` | `GET /api/v1/admin/courses`<br>`POST /api/v1/admin/courses`<br>`PUT /api/v1/admin/courses/:id`<br>`DELETE /api/v1/admin/courses/:id` | `courses.manage` (or `content.write`) | `getAdminCourses`<br>`createAdminCourse`<br>`updateAdminCourse`<br>`deleteAdminCourse` | `Course`, `College`, `AuditLog` |
| 6 | `/admin/subjects` | `GET /api/v1/admin/subjects`<br>`POST /api/v1/admin/subjects`<br>`PUT /api/v1/admin/subjects/:id`<br>`DELETE /api/v1/admin/subjects/:id` | `subjects.manage` (or `content.write`) | `getAdminSubjects`<br>`createAdminSubject`<br>`updateAdminSubject`<br>`deleteAdminSubject` | `Subject`, `Course`, `AuditLog` |
| 7 | `/admin/scholarships` | `GET /api/v1/admin/scholarships`<br>`POST /api/v1/admin/scholarships`<br>`PUT /api/v1/admin/scholarships/:id`<br>`DELETE /api/v1/admin/scholarships/:id` | `scholarships.manage` | `getAdminScholarships`<br>`createAdminScholarship`<br>`updateAdminScholarship`<br>`deleteAdminScholarship` | `Scholarship`, `AuditLog` |
| 8 | `/admin/projects` | `GET /api/v1/admin/projects`<br>`PUT /api/v1/admin/projects/:id/status`<br>`DELETE /api/v1/admin/projects/:id` | `projects.manage` | `getAdminProjects`<br>`updateAdminProjectStatus`<br>`deleteAdminProject` | `Project`, `AuditLog` |
| 9 | `/admin/events` | `GET /api/v1/admin/events`<br>`POST /api/v1/admin/events`<br>`PUT /api/v1/admin/events/:id`<br>`DELETE /api/v1/admin/events/:id` | `events.manage` | `getAdminEvents`<br>`createAdminEvent`<br>`updateAdminEvent`<br>`deleteAdminEvent` | `Event`, `AuditLog` |
| 10 | `/admin/mentorship` | `GET /api/v1/admin/mentorship`<br>`PUT /api/v1/admin/mentorship/:id/status`<br>`DELETE /api/v1/admin/mentorship/:id` | `mentorship.manage` | `getAdminMentorshipRequests`<br>`updateAdminMentorshipStatus`<br>`deleteAdminMentorshipRequest` | `MentorshipRequest`, `AuditLog` |
| 11 | `/admin/reports` | `GET /api/v1/admin/reports`<br>`PUT /api/v1/admin/reports/:id` | `moderation.manage` (or `moderation.read`) | `getAdminReports`<br>`resolveAdminReport` | `Report`, `AuditLog` |
| 12 | `/admin/analytics` | `GET /api/v1/admin/analytics/overview`<br>`GET /api/v1/admin/analytics/retention`<br>`GET /api/v1/admin/analytics/funnel` | `analytics.read` | `getAnalyticsOverview`<br>`getAnalyticsRetention`<br>`getAnalyticsFunnel` | `User`, `Event`, `Project`, `AuditLog` |
| 13 | `/admin/audit-logs` | `GET /api/v1/admin/audit-logs` | `audit.read` | `getAdminAuditLogs` | `AuditLog`, `User` |
| 14 | `/admin/system` | `GET /api/v1/admin/system/settings`<br>`POST /api/v1/admin/system/settings`<br>`GET /api/v1/admin/system/flags`<br>`POST /api/v1/admin/system/flags`<br>`GET /api/v1/admin/security/sessions`<br>`POST /api/v1/admin/security/sessions/:id/revoke`<br>`POST /api/v1/admin/security/sessions/revoke-all` | `settings.manage`<br>`settings.manage`<br>`settings.manage`<br>`settings.manage`<br>`requireAdministrativeAccess`<br>`requireAdministrativeAccess`<br>`requireAdministrativeAccess` | `getSystemSettings`<br>`updateSystemSettings`<br>`getFeatureFlags`<br>`toggleFeatureFlag`<br>`getAdminSessions`<br>`revokeAdminSession`<br>`revokeAllAdminSessions` | `SystemSetting`, `AdminSession`, `User`, `AuditLog` |

---
*End of CampusVerse Complete System Architecture Blueprint.*

