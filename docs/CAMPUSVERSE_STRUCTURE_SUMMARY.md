# CAMPUSVERSE — ARCHITECTURE QUICK REFERENCE SUMMARY

**Project:** CampusVerse Web & API Ecosystem
**Repository:** `https://github.com/rohansiddhpura17-source/CampusVerse-Website`
**Backend:** `https://github.com/rohansiddhpura17-source/CampusVerse`
**Generated:** September 28, 2026

---

## 1. PRODUCTION DEPLOYMENT SNAPSHOT

| Component | Production URL | Technology Stack | Hosting / Provider | Status |
| :--- | :--- | :--- | :--- | :---: |
| **Website (Frontend)** | `https://campusverse-website.onrender.com` | Next.js 14 (App Router), React 18, TailwindCSS | Render (`srv-dar6hoflot8c73ela880`) | **LIVE (200 OK)** |
| **Backend API (Canonical)**| `https://campusverse-api-k5ny.onrender.com` | Node.js / Express, TypeScript, Prisma v5 | Render (`srv-darq8u3ncjis73em5o4g`) | **LIVE (200 OK)** |
| **Backend API (Legacy/Stale)**| `https://campusverse-backend-api.onrender.com` | Legacy Render deployment | Render | **STALE / SUPERSEDED** |
| **Database Engine** | Supabase Pooler (`aws-0-ap-south-1.pooler.supabase.com`) | PostgreSQL 15 (92 Relational Models) | Supabase (AWS Mumbai) | **CONNECTED** |
| **AI Subsystem** | Google Generative Language API | Gemini 1.5 Flash (`gemini-1.5-flash`) with fallback | Google Cloud Platform | **OPERATIONAL** |

---

## 2. PORTAL & USER ROLES OVERVIEW

```text
               ┌────────────────────────────────────────────────────────┐
               │              CAMPUSVERSE UNIFIED PORTAL                │
               └───────┬────────────┬────────────┬────────────┬─────────┘
                       │            │            │            │
       ┌───────────────▼┐   ┌───────▼────────┐   │            │
       │ Student Portal │   │Aspirant Portal │   │            │
       │ (/student/*)   │   │ (/aspirant/*)  │   │            │
       └────────────────┘   └────────────────┘   │            │
                                ┌────────────────▼┐   ┌───────▼────────┐
                                │  Alumni Portal  │   │ Admin Console  │
                                │  (/alumni/*)    │   │  (/admin/*)    │
                                └─────────────────┘   └────────────────┘
```

1. **Student (`/student/*`):** Academics, Syllabus Notes, Library Books, Campus Marketplace, Events, Discussions, AI Study Tutor.
2. **Aspirant (`/aspirant/*`):** Global College Directory, 4-Way Side-by-Side Comparison, Admission Probability Calculator, Scholarships Hub, AI Admissions Advisor.
3. **Alumni (`/alumni/*`):** Professional Network Directory, Verified 1-on-1 Mentorship, Corporate Job Postings, Referrals, Direct Chat, AI Career Roadmap, Mock Technical Interviews.
4. **Admin (`/admin/*`):** Platform KPI Telemetry, User Directory Lifecycle (Activate/Suspend/Reset), ID & Degree Verifications, Moderation Queue, Safety Reports, Feature Flags.

---

## 3. GRANULAR RBAC ARCHITECTURE (35 PERMISSIONS)

The platform runs a dual-layer RBAC system:
- **Base Role (`User.role`):** `STUDENT`, `ASPIRANT`, `ALUMNI`, `ADMIN`.
- **Relational Roles (`UserRole` & `RolePermission`):**
  - **`SUPER_ADMIN`:** Full wildcard (`*`) access across all entities, audits, and settings.
  - **`ADMIN`:** General platform management (Users, events, content, moderation).
  - **`MODERATOR`:** Content inspection, safety report resolution, listing removals.
  - **`CONTENT_MANAGER`:** Curates colleges, syllabi, courses, and campus events.
  - **`SUPPORT_ADMIN`:** Verifies student IDs and alumni graduation credentials.
  - **`ANALYTICS_ADMIN`:** Read-only access to telemetry BI, user growth, and audit logs.

*Note: In accordance with production security policies, exactly ONE active Super Administrator (`campusverse.admin@gmail.com`) is provisioned.*

---

## 4. API CLIENT ARCHITECTURE (`lib/api/`)

The frontend uses a centralized Axios client (`lib/api/client.ts`) with:
- **Base URL:** `process.env.NEXT_PUBLIC_API_URL` (Defaults to production backend on Render).
- **Timeout:** `60,000ms` (60s) to accommodate generative AI reasoning.
- **Request Interceptor:** Automatically injects JWT Bearer token: `Authorization: Bearer <token>`.
- **Response Interceptor:** Unwraps `{ success: true, data: T }` envelope and redirects to `/auth/login` on HTTP 401.

### API Modules Directory:
- `lib/api/auth.ts`: Registration, login, logout, OTP dispatch, password reset.
- `lib/api/student.ts`: Academics, courses, notes exchange, library, community posts.
- `lib/api/aspirant.ts`: Colleges, comparison, predictions, scholarships, recommendations.
- `lib/api/alumni.ts`: Connections, career roadmaps, skills, mock interviews.
- `lib/api/jobs.ts`: Job listings, applications, company profiles, referrals.
- `lib/api/mentorship.ts`: Verified mentors, session bookings, meeting status.
- `lib/api/admin.ts`: Dashboard telemetry, user management, verifications, moderation, announcements.
- `lib/api/ai.ts`: Study Assistant, Career Assistant, Aspirant Advisor (Gemini 1.5 Flash).
- `lib/api/marketplace.ts`: Campus goods listings, item creation, search.
- `lib/api/events.ts`: Campus event listings, registrations, ticketing.
- `lib/api/messages.ts`: Real-time conversation threads and direct messaging.
- `lib/api/notifications.ts`: In-app notification alerts and read receipts.
- `lib/api/profile.ts`: User profile details, avatar, and notification preferences.
- `lib/api/projects.ts`: Student and alumni engineering project showcases.
- `lib/api/users.ts`: Privacy toggles, security settings, and account recovery.

---

## 5. EXTERNAL INTEGRATIONS STATUS

| External Provider | Subsystem | Implementation Architecture | Production Status |
| :--- | :--- | :--- | :---: |
| **Google Cloud Gemini** | Generative AI | `gemini-1.5-flash` via REST API with curriculum fallback | **OPERATIONAL (observed ~650ms benchmark)** |
| **Resend** | Outbound Email | Transactional REST API for 6-digit OTP codes | **CONFIGURED** |
| **Razorpay** | Payments | Backend provider (`RazorpayPaymentProvider`), HMAC verification | **BACKEND ONLY (No website checkout)** |
| **Supabase Storage** | Cloud Files | Client-side validated URL references and signed buckets | **OPERATIONAL** |

---

## 6. KEY COMMANDS & VERIFICATION CHECKS

```bash
# Frontend Typecheck
npm run typecheck

# Frontend Build
npm run build

# Frontend Production Start
npm start

# Run Adversarial Security Tests
node tests/security/run-all-security-tests.js

# Backend Tests (RBAC & Guard)
npm test -- tests/frontend.guard.test.ts tests/rbac.test.ts
```
