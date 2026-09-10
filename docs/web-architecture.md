# CampusVerse Web Architecture Blueprint

**Version:** 1.0.0  
**Target Implementation:** Next.js 14+ (App Router), TypeScript, React 18/19, TanStack Query v5, React Hook Form, Zod, Tailwind CSS  
**Workspace:** `/Users/rohansiddhpura/Documents/campuswebsite`  
**Authoritative Backend:** `/Users/rohansiddhpura/AndroidStudioProjects/CampusVerse/backend` (`http://localhost:4000/api/v1`)  

---

## 1. System Topology & Ecosystem Integration

CampusVerse Web is an enterprise-grade web application sharing the unified CampusVerse backend with the native Android application. 

```
                                  ┌─────────────────────────────────────────────────────────┐
                                  │               CampusVerse Express REST API              │
                                  │            TypeScript, Node.js, Zod, JWT, Crypto        │
                                  └───────────┬─────────────────────────────────┬───────────┘
                                              │                                 │
                                              ▼                                 ▼
                               ┌─────────────────────────────┐   ┌─────────────────────────────┐
                               │     Prisma ORM & SQLite     │   │   Google Gemini 1.5 Flash   │
                               │  dev.db (48 Relational M.)  │   │  Academic, Career, Advisor  │
                               └─────────────────────────────┘   └─────────────────────────────┘
                                              ▲                                 ▲
                        Prisma Data Access    │                                 │
                                              │                                 │
                                              │                                 │
                     ┌────────────────────────┴─────────┐                       │
                     │                                  │                       │
                     ▼                                  ▼                       ▼
      ┌─────────────────────────────┐    ┌──────────────────────────────────────────────┐
      │   Android App (Existing)    │    │           CampusVerse Web (Phase 2)          │
      │   Kotlin, Jetpack Compose   │    │     Next.js 14+ App Router, React, Tailwind │
      │   Navigation Compose, MVVM  │    │     TanStack Query, React Hook Form, Zod     │
      └─────────────────────────────┘    └──────────────────────────────────────────────┘
```

### Core Invariants:
1. **Single Backend & Database:** Web will not create a parallel backend or duplicate SQLite/PostgreSQL databases.
2. **Contract Preservation:** All request payloads, response envelopes (`{ success, data, error }`), and HTTP status codes match the existing 78 Express endpoints.
3. **Stateless JWT Flow:** Authentication tokens issued by `POST /auth/login` and `POST /auth/register` are honored identically across platforms.
4. **Authoritative Backend Security:** Frontend route guards provide responsive UX, but the backend Express middleware (`requireAuth`, `requireRole`, `isAdminAuthorized`) remains authoritative.

---

## 2. Directory & Folder Structure

```
campuswebsite/
├── app/                                  # Next.js App Router root
│   ├── (public)/                         # Public marketing & informational routes
│   │   ├── layout.tsx                    # Public header + navigation + footer shell
│   │   ├── page.tsx                      # Landing / Hero page
│   │   ├── about/page.tsx                # About CampusVerse
│   │   ├── features/page.tsx             # Platform capabilities overview
│   │   ├── students/page.tsx             # Student community showcase
│   │   ├── aspirants/page.tsx            # College admission & predictor intro
│   │   ├── alumni/page.tsx               # Alumni network & mentoring intro
│   │   ├── institutions/page.tsx         # Partner universities
│   │   ├── help/page.tsx                 # Help center
│   │   ├── faq/page.tsx                  # Frequently asked questions
│   │   ├── contact/page.tsx              # Contact support form
│   │   ├── terms/page.tsx                # Terms of Service
│   │   ├── privacy/page.tsx              # Privacy Policy
│   │   └── community-guidelines/page.tsx # Community Guidelines
│   │
│   ├── (auth)/                           # Authentication & verification routes
│   │   ├── layout.tsx                    # Auth shell (centered card, brand mark, security badge)
│   │   ├── login/page.tsx                # Email & password login
│   │   ├── register/page.tsx             # Multi-role registration
│   │   ├── verify/page.tsx               # 6-digit OTP verification with countdown
│   │   ├── forgot-password/page.tsx      # Password recovery trigger
│   │   └── reset-password/page.tsx       # Set new password with OTP token
│   │
│   ├── (app)/                            # Role-aware protected application domains
│   │   ├── student/                      # Student application
│   │   │   ├── layout.tsx                # Student layout (desktop sidebar, mobile bottom nav, topbar)
│   │   │   ├── dashboard/page.tsx        # Student home overview
│   │   │   ├── academics/page.tsx        # Enrolled courses, CGPA, grades
│   │   │   ├── notes/page.tsx            # Notes hub, download, share
│   │   │   ├── library/page.tsx          # Digital library catalog
│   │   │   ├── ai-tutor/page.tsx         # Gemini AI study assistant
│   │   │   ├── events/page.tsx           # Campus hackathons, webinars
│   │   │   ├── communities/page.tsx      # Student clubs & discussion feeds
│   │   │   ├── marketplace/page.tsx      # Peer-to-peer textbook & gear marketplace
│   │   │   └── profile/page.tsx          # Student academic profile & settings
│   │   │
│   │   ├── aspirant/                     # Aspirant application
│   │   │   ├── layout.tsx                # Aspirant navigation shell
│   │   │   ├── dashboard/page.tsx        # Aspirant home overview
│   │   │   ├── colleges/page.tsx         # College explorer with country/ranking filters
│   │   │   ├── comparison/page.tsx       # Side-by-side college comparison
│   │   │   ├── predictor/page.tsx        # Admission prediction engine (JEE/SAT/GPA)
│   │   │   ├── scholarships/page.tsx     # Merit & need-based scholarship finder
│   │   │   ├── ai-advisor/page.tsx       # Gemini AI admission advisor
│   │   │   └── profile/page.tsx          # Target degree, exam scores & settings
│   │   │
│   │   ├── alumni/                       # Alumni application
│   │   │   ├── layout.tsx                # Alumni navigation shell
│   │   │   ├── dashboard/page.tsx        # Alumni home & network highlights
│   │   │   ├── network/page.tsx          # Alumni directory & 1-on-1 connections
│   │   │   ├── careers/page.tsx          # Job board, post openings, referral hub
│   │   │   ├── mentorship/page.tsx       # Mentorship directory, requests, sessions
│   │   │   ├── messages/page.tsx         # Direct 1-on-1 chat threads
│   │   │   ├── career-dev/page.tsx       # Roadmaps, skill matrix, mock interviews
│   │   │   └── profile/page.tsx          # Professional profile & settings
│   │   │
│   │   └── admin/                        # Admin application
│   │       ├── layout.tsx                # Admin console shell (strictly checks isAdminAuthorized)
│   │       ├── dashboard/page.tsx        # High-level system metrics & audit logs
│   │       ├── users/page.tsx            # User directory, suspension, role management
│   │       ├── verifications/page.tsx    # Student/Alumni verification document queue
│   │       ├── reports/page.tsx          # Content moderation queue
│   │       ├── marketplace/page.tsx      # Marketplace moderation
│   │       ├── events-jobs/page.tsx      # Event and job posting moderation
│   │       ├── announcements/page.tsx    # Broadcast announcement publisher
│   │       └── settings/page.tsx         # Global platform feature flags
│   │
│   ├── layout.tsx                        # Root layout (QueryClientProvider, AuthProvider, Toaster)
│   ├── not-found.tsx                     # Global 404 page
│   └── globals.css                       # Tailwind directives, CSS variables & typography
│
├── components/
│   ├── ui/                               # 22 reusable Design System primitives
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── checkbox.tsx
│   │   ├── switch.tsx
│   │   ├── tabs.tsx
│   │   ├── badge.tsx
│   │   ├── card.tsx
│   │   ├── modal.tsx
│   │   ├── drawer.tsx
│   │   ├── dropdown.tsx
│   │   ├── toast.tsx
│   │   ├── tooltip.tsx
│   │   ├── table.tsx
│   │   ├── pagination.tsx
│   │   ├── search.tsx
│   │   ├── filters.tsx
│   │   ├── avatar.tsx
│   │   ├── data-table.tsx
│   │   ├── file-upload.tsx
│   │   ├── skeleton.tsx
│   │   ├── empty-state.tsx
│   │   └── error-state.tsx
│   │
│   ├── navigation/                       # Shared navigation components
│   │   ├── public-nav.tsx                # Public site navigation header
│   │   ├── public-footer.tsx             # Public footer with site map
│   │   ├── app-topbar.tsx                # Authenticated topbar with search, notifications, profile
│   │   ├── app-sidebar.tsx               # Desktop collapsible role sidebar
│   │   ├── app-bottom-nav.tsx            # Mobile compact bottom navigation bar
│   │   └── notification-dropdown.tsx     # Real-time notifications bell popover
│   │
│   └── guards/                           # Route security guards
│       ├── public-route.tsx              # Public-only guard (redirects logged-in users)
│       ├── authenticated-route.tsx       # Requires valid JWT token
│       ├── student-route.tsx             # Enforces STUDENT role
│       ├── aspirant-route.tsx            # Enforces ASPIRANT role
│       ├── alumni-route.tsx              # Enforces ALUMNI role
│       └── admin-route.tsx               # Enforces ADMIN role + isAdminAuthorized === true
│
├── features/                             # Modular feature-specific composite components
│   ├── academics/                        # Course cards, CGPA gauge, transcript table
│   ├── notes/                            # Note cards, PDF viewer modal, upload dialog
│   ├── communities/                      # Feed list, post creator, comment thread, like button
│   ├── marketplace/                      # Product card, seller modal, listing creator
│   ├── mentorship/                       # Mentor card, session booking calendar, request list
│   ├── jobs/                             # Job card, apply modal, referral request dialog
│   ├── predictor/                        # Score input form, probability gauge, criteria breakdown
│   ├── chat/                             # Message thread, conversation list, input box
│   └── admin/                            # Metrics KPI cards, user actions dropdown, review sheet
│
├── hooks/                                # Custom React hooks
│   ├── use-auth.ts                       # Access AuthContext (user, login, logout, token)
│   ├── use-media-query.ts                # Responsive breakpoint listener (mobile/tablet/desktop)
│   ├── use-debounce.ts                   # Debounced search inputs
│   └── use-disclosure.ts                 # Modal/drawer open/close state helper
│
├── lib/
│   ├── api/                              # Modular API service layer (NO component API logic)
│   │   ├── client.ts                     # Central Axios instance with Bearer token & error interceptors
│   │   ├── auth.ts                       # /auth endpoints
│   │   ├── users.ts                      # /users endpoints
│   │   ├── student.ts                    # /academics, /courses, /notes, /library
│   │   ├── aspirant.ts                   # /aspirant, /colleges, /predictions, /scholarships
│   │   ├── alumni.ts                     # /alumni, /career
│   │   ├── admin.ts                      # /admin endpoints
│   │   ├── jobs.ts                       # /jobs, /companies, /applications, /referrals
│   │   ├── mentorship.ts                 # /mentors, /mentorship
│   │   ├── events.ts                     # /events
│   │   ├── marketplace.ts                # /marketplace
│   │   ├── messages.ts                   # /conversations, /messages
│   │   ├── notifications.ts              # /notifications
│   │   └── ai.ts                         # /ai (Gemini tutor, coach, advisor)
│   │
│   ├── context/                          # React context providers
│   │   └── auth-context.tsx              # Global authentication state & lifecycle
│   │
│   ├── providers/                        # Application providers wrapper
│   │   └── query-provider.tsx            # TanStack QueryClient configuration
│   │
│   └── utils.ts                          # clsx + tailwind-merge helper, formatting utilities
│
├── types/                                # TypeScript definitions matching backend contracts
│   ├── api.ts                            # ApiResponse<T>, ApiError, Pagination
│   ├── auth.ts                           # User, Role, AuthState, Session
│   ├── student.ts                        # Course, AcademicSummary, Note, Community
│   ├── aspirant.ts                       # College, Prediction, Scholarship
│   ├── alumni.ts                         # AlumniProfile, Job, MentorshipSession, Roadmap
│   └── admin.ts                          # DashboardMetrics, VerificationItem, SafetyReport
│
└── docs/                                 # Audit & Architecture Documentation
    ├── web-audit.md
    ├── api-inventory.md
    ├── rbac-matrix.md
    ├── web-feature-matrix.md
    └── web-architecture.md               # This document
```

---

## 3. Routing & Role-Aware Navigation

### 3.1 Route Taxonomy

| Category | Path Pattern | Access Policy | Guard Component |
|---|---|---|---|
| **Public Website** | `/`, `/about`, `/features`, `/students`, `/aspirants`, `/alumni`, `/institutions`, `/help`, `/faq`, `/contact`, `/terms`, `/privacy`, `/community-guidelines` | Unrestricted | `PublicRoute` (optional redirect) |
| **Authentication** | `/auth/login`, `/auth/register`, `/auth/verify`, `/auth/forgot-password`, `/auth/reset-password` | Unauthenticated Only | `PublicRoute` (redirects if authenticated) |
| **Student App** | `/student/*` (`/dashboard`, `/academics`, `/notes`, `/library`, `/ai-tutor`, `/events`, `/communities`, `/marketplace`, `/profile`) | Authenticated `STUDENT` or `ADMIN` | `StudentRoute` |
| **Aspirant App** | `/aspirant/*` (`/dashboard`, `/colleges`, `/comparison`, `/predictor`, `/scholarships`, `/ai-advisor`, `/profile`) | Authenticated `ASPIRANT` or `ADMIN` | `AspirantRoute` |
| **Alumni App** | `/alumni/*` (`/dashboard`, `/network`, `/careers`, `/mentorship`, `/messages`, `/career-dev`, `/profile`) | Authenticated `ALUMNI` or `ADMIN` | `AlumniRoute` |
| **Admin Console** | `/admin/*` (`/dashboard`, `/users`, `/verifications`, `/reports`, `/marketplace`, `/events-jobs`, `/announcements`, `/settings`) | Authenticated `ADMIN` with `isAdminAuthorized: true` | `AdminRoute` |

### 3.2 Role-Aware Automatic Redirection
Upon successful login or session restoration:
- `role === 'STUDENT'` $\rightarrow$ `/student/dashboard`
- `role === 'ASPIRANT'` $\rightarrow$ `/aspirant/dashboard`
- `role === 'ALUMNI'` $\rightarrow$ `/alumni/dashboard`
- `role === 'ADMIN'` $\rightarrow$ `/admin/dashboard` (if `isAdminAuthorized === true`) or `/auth/verify` (if pending approval)

---

## 4. Route Security & Authorization

### 4.1 Frontend Route Guard Architecture

Frontend route guards intercept client-side navigation, check the local authentication state in `AuthContext`, and render loading spinners during token revalidation.

```typescript
// Conceptual Architecture of RoleRoute
export function RoleRoute({ 
  allowedRoles, 
  children 
}: { 
  allowedRoles: UserRole[]; 
  children: React.ReactNode 
}) {
  const { user, status } = useAuth();
  const router = useRouter();

  if (status === 'loading') return <FullScreenSpinner />;
  if (status === 'unauthenticated') {
    router.replace('/auth/login?redirect=' + encodeURIComponent(window.location.pathname));
    return null;
  }
  if (!user || !allowedRoles.includes(user.role)) {
    router.replace('/unauthorized');
    return null;
  }
  if (allowedRoles.includes('ADMIN') && user.role === 'ADMIN' && !user.isAdminAuthorized) {
    router.replace('/auth/admin-pending');
    return null;
  }
  return <>{children}</>;
}
```

### 4.2 Authoritative Backend Enforcement
Frontend route guards provide immediate feedback, but **CANNOT** guarantee security alone:
1. Every network request generated by TanStack Query or user actions attaches the HTTP header:
   ```
   Authorization: Bearer <token>
   ```
2. The Express server executes `requireAuth`, re-verifies token signature and expiration, queries the database for `isActive: true`, and verifies role permissions via `requireRole(...)`.
3. If an unauthorized client attempts an action, the API returns `401 Unauthorized` or `403 Forbidden`. The centralized Axios client automatically intercepts `401` responses, clears local credentials, and redirects to `/auth/login`.

---

## 5. API Architecture & Modular Services

### 5.1 Centralized HTTP Client (`lib/api/client.ts`)
Components and hooks **NEVER** call `fetch()` or `axios.get()` directly. All HTTP requests pass through the unified Axios client:
- **Base URL:** Reads `NEXT_PUBLIC_API_URL` (default: `http://localhost:4000/api/v1`).
- **Request Interceptor:** Reads `campusverse_token` from `localStorage` or secure cookie; appends `Authorization: Bearer <token>`.
- **Response Interceptor:** Automatically unwraps `{ success: true, data: T }` envelopes, transforming failures into structured `ApiError` instances.
- **Session Revocation:** On `401 Unauthorized`, emits an auth-expired event or clears credentials.

```typescript
// lib/api/client.ts sample
import axios, { AxiosError } from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('campusverse_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response.data?.data ?? response.data,
  (error: AxiosError<any>) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('campusverse_token');
      window.location.href = '/auth/login?error=session_expired';
    }
    const message = error.response?.data?.error?.message || error.message || 'Unknown network error';
    return Promise.reject(new Error(message));
  }
);
```

### 5.2 Modular Service Catalog (`lib/api/*`)
Each module exposes typed async functions:
- `lib/api/auth.ts`: `login()`, `register()`, `verifyOtp()`, `sendOtp()`, `forgotPassword()`, `resetPassword()`, `getMe()`, `logout()`
- `lib/api/users.ts`: `getProfile()`, `updateStudentProfile()`, `updateAlumniProfile()`, `getPrivacySettings()`, `updatePrivacySettings()`
- `lib/api/student.ts`: `getAcademicSummary()`, `getCourses()`, `getNotes()`, `uploadNote()`, `getLibraryItems()`, `getCommunities()`, `joinCommunity()`
- `lib/api/aspirant.ts`: `getAspirantHome()`, `getColleges()`, `compareColleges()`, `predictAdmission()`, `getScholarships()`, `saveScholarship()`
- `lib/api/alumni.ts`: `getAlumni()`, `getConnections()`, `connect()`, `getRoadmaps()`, `updateMilestone()`, `getSkills()`
- `lib/api/admin.ts`: `getDashboard()`, `getUsers()`, `updateUserStatus()`, `getVerifications()`, `reviewVerification()`, `getReports()`, `resolveReport()`
- `lib/api/jobs.ts`: `getJobs()`, `getRecommendedJobs()`, `applyJob()`, `saveJob()`, `getCompanies()`, `requestReferral()`
- `lib/api/mentorship.ts`: `getMentors()`, `requestMentorship()`, `getSessions()`, `scheduleSession()`
- `lib/api/events.ts`: `getEvents()`, `registerEvent()`, `unregisterEvent()`
- `lib/api/marketplace.ts`: `getItems()`, `createItem()`, `deleteItem()`
- `lib/api/messages.ts`: `getConversations()`, `getMessages()`, `sendMessage()`
- `lib/api/notifications.ts`: `getNotifications()`, `markRead()`
- `lib/api/ai.ts`: `askStudyAssistant()`, `askCareerAssistant()`, `askAspirantAdvisor()`

---

## 6. Four-Tier State Management Strategy

To avoid monolithic global stores while keeping state responsive, CampusVerse Web strictly isolates state into four discrete layers:

```
┌─────────────────────────────────────────────────────────────────────────┐
│ 1. Authentication State (React Context + localStorage)                  │
│ Scope: Current user identity, JWT token, role, verification status.     │
│ Component: <AuthProvider /> -> useAuth()                                │
└─────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 2. Server State (TanStack Query v5)                                     │
│ Scope: Remote database entities (courses, jobs, colleges, mentors).    │
│ Mechanics: Queries, Mutations, automatic invalidation, optimistic UI.   │
│ Config: staleTime: 5 min, gcTime: 30 min, retry: 1                      │
└─────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 3. UI State (Local React State / URL Query Parameters)                  │
│ Scope: Modal open/close, active tab, sidebar collapse, filters, search. │
│ Mechanics: useState, useReducer, useSearchParams (Nuqs pattern).       │
└─────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 4. Form State (React Hook Form + Zod)                                   │
│ Scope: Inputs, field validation errors, dirty states, submission.       │
│ Mechanics: useForm({ resolver: zodResolver(schema) })                   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Responsive Layout Strategy

CampusVerse Web does **NOT** mirror Android screen layouts one-for-one. Instead, it leverages the broader real estate of desktop screens while providing fluid mobile interfaces.

### Breakpoint Matrix:
- **Mobile (`< 640px` - `sm`):** Single column, collapsible slide-over drawer, sticky bottom navigation bar for primary role tabs, compact cards.
- **Tablet (`640px` - `1023px` - `md`):** 2-column grid, top navigation header with hamburger menu, compact sidebar.
- **Desktop (`1024px` - `1439px` - `lg`):** Persistent 260px collapsible sidebar, unified topbar with quick search (`Cmd+K`), multi-column dashboard widgets (3-column cards).
- **Large Desktop (`≥ 1440px` - `xl` / `2xl`):** Max container width `1400px`, detailed side inspection panels (e.g., side-by-side college comparison, chat thread split-view).

```
Mobile Layout (< 640px):
┌───────────────────────────────┐
│ [≡] CampusVerse           [🔔]│  <- Top Bar
├───────────────────────────────┤
│                               │
│       Scrollable Content      │
│       (Single Column)         │
│                               │
├───────────────────────────────┤
│ [🏠]  [📚]  [🛒]  [💬]  [👤] │  <- Sticky Bottom Nav
└───────────────────────────────┘

Desktop Layout (≥ 1024px):
┌───────────┬─────────────────────────────────────────────────┐
│ CampusVerse│  [🔍 Search...]                   [🔔] [Avatar]│ <- Topbar
├───────────┼─────────────────────────────────────────────────┤
│ [Sidebar] │  Breadcrumbs / Page Header                      │
│ - Home    ├───────────────────────┬─────────────────────────┤
│ - Academic│  Main Content Area    │ Right Rail / Side Stats │
│ - Notes   │  (2-3 Column Grid)    │ - Quick Actions         │
│ - Library │                       │ - Upcoming Deadlines    │
│ - Events  │                       │ - AI Assistant Shortcut │
│ - Market  │                       │                         │
│ - Settings│                       │                         │
└───────────┴───────────────────────┴─────────────────────────┘
```

---

## 8. Design System Specification (22 Reusable Primitives)

All components live in `components/ui/` and adhere to WAI-ARIA accessibility guidelines, keyboard navigation, and consistent focus states:

1. **`Button`**: Variants (`primary`, `secondary`, `outline`, `ghost`, `danger`), sizes (`sm`, `md`, `lg`), loading spinner state (`isLoading`).
2. **`Input`**: Text, email, password with show/hide eye toggle, floating labels, validation error messages.
3. **`Select`**: Custom styled accessible dropdown selection with search option.
4. **`Checkbox`**: Custom styled SVG check with label and disabled states.
5. **`Switch`**: Smooth toggle switch with keyboard navigation (`space`/`enter`).
6. **`Tabs`**: Tab list, trigger, and animated content panels.
7. **`Badge`**: Pill indicators for statuses (`success`, `warning`, `danger`, `neutral`, `role`).
8. **`Card`**: Structured card container (`CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`).
9. **`Modal`**: Backdrop-blurred dialog with ESC key dismiss and focus trap.
10. **`Drawer`**: Side slide-over sheet for mobile menus or detailed inspection sheets.
11. **`Dropdown`**: Popover menu triggered by clicks with outside click listener.
12. **`Toast`**: Contextual feedback notifications (`success`, `error`, `info`) with auto-dismiss.
13. **`Tooltip`**: Floating hover hint with pointer indicator.
14. **`Table`**: Semantic HTML table with alternating rows, hover highlighting, and sortable headers.
15. **`Pagination`**: Previous/Next controls, page number buttons, items per page selector.
16. **`Search`**: Search input with clear icon and debounced change emitter.
17. **`Filters`**: Filter pill bar with active count badge and reset button.
18. **`Avatar`**: Image avatar with automatic initials fallback (`Aarav Sharma` $\rightarrow$ `AS`).
19. **`DataTable`**: Generic composite table integrating sorting, pagination, and empty states.
20. **`FileUpload`**: Drag-and-drop dropzone with file size/type validation and preview.
21. **`Skeleton`**: Pulsing placeholder loaders matching card, text, and avatar dimensions.
22. **`EmptyState` & `ErrorState`**: Illustrated empty state with call-to-action button, and error boundary with retry trigger.

---

## 9. Testing Strategy

1. **Unit & Component Testing:**
   - **Framework:** Vitest + React Testing Library.
   - **Scope:** Design system primitives, form validations (Zod schemas), formatting utility functions, and route guard logic.
2. **Integration Testing:**
   - **Scope:** API client error unwrapping, mock TanStack Query hooks, `AuthContext` login/logout state transitions.
   - **Tooling:** MSW (Mock Service Worker) for deterministic API mocking during tests.
3. **End-to-End (E2E) Testing:**
   - **Framework:** Playwright.
   - **Critical Paths:**
     - User registration $\rightarrow$ OTP verification $\rightarrow$ Role dashboard redirection.
     - Student notes hub filter and download counter increment.
     - Aspirant admission predictor calculation.
     - Alumni job application submission.
     - Admin verification approval workflow.
