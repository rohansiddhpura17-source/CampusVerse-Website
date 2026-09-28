# CampusVerse — Production Source of Truth

**Document Version:** 1.0.0
**Last Updated:** September 28, 2026
**Auditor / Architect:** Principal Infrastructure & Full-Stack Architect
**Repositories:**
1. **Frontend:** [`CampusVerse-Website`](https://github.com/rohansiddhpura17-source/CampusVerse-Website)
2. **Backend:** [`CampusVerse`](https://github.com/rohansiddhpura17-source/CampusVerse)

---

## 1. Canonical Production Website URL

- **Canonical URL:** `https://campusverse-website.onrender.com`
- **Hosting Platform:** Render Web Service
- **Service ID:** `srv-dar6hoflot8c73ela880`
- **Region:** Singapore / Global CDN (Cloudflare edge proxy)
- **Live Status:** `HTTP/2 200 OK` (Verified via direct HTTP probe)
- **Framework:** Next.js 14 App Router, React 18, Tailwind CSS

---

## 2. Canonical Production API URL

- **Canonical API Base URL:** `https://campusverse-api-k5ny.onrender.com`
- **Canonical API Endpoint Prefix:** `https://campusverse-api-k5ny.onrender.com/api/v1`
- **Health Check Endpoint:** `https://campusverse-api-k5ny.onrender.com/api/v1/health`
- **Hosting Platform:** Render Web Service
- **Service ID:** `srv-darq8u3ncjis73em5o4g` (Render service `campusverse-api`)
- **Region:** Singapore (`singapore` in `render.yaml`)
- **Live Status:** `HTTP/2 200 OK` (Verified via direct HTTP probe: `{"status":"HEALTHY","database":"connected","timestamp":"2026-09-28T05:02:49.882Z"}`)
- **Framework:** Node.js, Express, TypeScript, Prisma ORM v5

> [!IMPORTANT]
> Exactly **ONE** active canonical production backend exists: `https://campusverse-api-k5ny.onrender.com`.
> There is no intentional "secondary cluster". Any earlier URLs (such as `campusverse-backend-api.onrender.com`) are legacy/stale endpoints.

---

## 3. Deployment Architecture

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        CAMPUSVERSE ARCHITECTURE                        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
       ┌────────────────────────────┴────────────────────────────┐
       ▼                                                         ▼
┌───────────────────────────────┐         ┌───────────────────────────────┐
│     CAMPUSVERSE WEBSITE       │         │      CAMPUSVERSE BACKEND      │
│  (Next.js 14 App Router)      │         │   (Node.js / Express / Prisma)│
│                               │         │                               │
│ Render Web Service            │         │ Render Web Service            │
│ campusverse-website           │         │ campusverse-api (k5ny)        │
│ .onrender.com                 │         │ .onrender.com                 │
│                               │         │                               │
│ Build: npm i && npm run build │         │ Build: npm i && npm run build │
│ Start: next start -p $PORT    │         │ Start: node dist/server.js    │
└──────────────┬────────────────┘         └──────────────┬────────────────┘
               │                                         │
               │ HTTP REST Requests                      │ Prisma ORM
               │ (Bearer JWT Auth)                       │ Pooled Connection
               └────────────────────────────────────────►│
                                                         │
                                          ┌──────────────┴───────────────┐
                                          ▼                              ▼
                           ┌──────────────────────────────┐ ┌────────────┴────────┐
                           │      SUPABASE DATABASE       │ │  THIRD-PARTY APIS   │
                           │   PostgreSQL 15 (AWS Mumbai) │ │                     │
                           │   92 Relational Models       │ │ • Google Gemini API │
                           │   RLS on public tables       │ │ • Resend Email      │
                           │   aws-0-ap-south-1.pooler    │ │ • Razorpay Gateway  │
                           └──────────────────────────────┘ └─────────────────────┘
```

### Component Details:
1. **Frontend Service (`CampusVerse-Website`):**
   - Repository: `https://github.com/rohansiddhpura17-source/CampusVerse-Website`
   - Active Branch: `main`
   - Runtime: Node.js 20+ on Render
   - Build Command: `npm install && npm run build`
   - Start Command: `next start -p $PORT` (via `npm start`)
2. **Backend Service (`CampusVerse/backend`):**
   - Repository: `https://github.com/rohansiddhpura17-source/CampusVerse`
   - Root Directory: `backend`
   - Active Branch: `main`
   - Runtime: Node.js 24 on Render
   - Build Command: `npm install && npx prisma generate && npm run build`
   - Start Command: `node dist/server.js` (via `npm start`)
   - Health Check Path: `/api/v1/health`
3. **Database Layer:**
   - Provider: Managed PostgreSQL on Supabase (AWS Mumbai region `ap-south-1`)
   - Connection Mode: Transaction Pooler via PgBouncer on port `6543` / Session Pooler on port `5432`
   - Schema: 92 relational tables, zero migration drift

---

## 4. Actual Framework Versions

### Website (`CampusVerse-Website`):
| Package / Tool | Declared in `package.json` | Actual Installed Version | Verification Source |
| :--- | :--- | :--- | :--- |
| **Next.js** | `^14.2.15` | **`14.2.35`** | `node_modules/next/package.json`, `package-lock.json` |
| **React** | `^18.3.1` | **`18.3.1`** | `node_modules/react/package.json` |
| **React DOM** | `^18.3.1` | **`18.3.1`** | `node_modules/react-dom/package.json` |
| **TypeScript** | `^5.6.3` | **`5.6.3`** | `node_modules/typescript/package.json` |
| **Tailwind CSS** | `^3.4.14` | **`3.4.14`** | `node_modules/tailwindcss/package.json` |
| **TanStack React Query** | `^5.59.0` | **`5.59.0`** | `node_modules/@tanstack/react-query/package.json` |
| **Axios** | `^1.7.7` | **`1.7.7`** | `node_modules/axios/package.json` |

### Backend API (`CampusVerse/backend`):
| Package / Tool | Declared in `package.json` | Actual Version | Verification Source |
| :--- | :--- | :--- | :--- |
| **Express** | `^4.21.1` | **`4.21.1`** | `backend/package.json` |
| **Prisma Client** | `^5.22.0` | **`5.22.0`** | `backend/package.json` |
| **TypeScript** | `^5.6.3` | **`5.6.3`** | `backend/package.json` |
| **bcryptjs** | `^2.4.3` | **`2.4.3`** | `backend/package.json` |
| **jsonwebtoken** | `^9.0.2` | **`9.0.2`** | `backend/package.json` |
| **Node.js** | `>=20` | **`24.21.0`** (Render) / **`24.10.0`** (Local) | Render runtime logs & `node -v` |

---

## 5. Environment-Variable Ownership

### Frontend Variables (`CampusVerse-Website`):
| Variable | Scope | Location | Purpose / Canonical Value |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Public / Client Bundle | Render Environment / `.env.production.example` | Points to canonical API: `https://campusverse-api-k5ny.onrender.com/api/v1` |
| `PORT` | Server Runtime | Render System Default | Injected by Render runtime |
| `NODE_ENV` | Server Runtime | Render Environment | `production` |

### Backend Variables (`CampusVerse/backend`):
| Variable | Scope | Location | Sensitivity | Purpose / Canonical Value |
| :--- | :--- | :--- | :--- | :--- |
| `NODE_ENV` | Server Runtime | Render Environment | Public | `production` |
| `PORT` | Server Runtime | Render Environment | Public | `10000` (Render default) |
| `DATABASE_URL` | Server Runtime | Render Secret | **CRITICAL** | Supabase pooled PostgreSQL connection string |
| `DIRECT_URL` | Server Runtime | Render Secret | **CRITICAL** | Supabase direct PostgreSQL connection string |
| `JWT_SECRET` | Server Runtime | Render Secret | **CRITICAL** | HMAC-SHA256 secret for signing auth tokens |
| `JWT_EXPIRES_IN` | Server Runtime | Render Environment | Config | `7d` |
| `CORS_ORIGIN` | Server Runtime | Render Environment | Config | `https://campusverse-website.onrender.com` |
| `GEMINI_API_KEY` | Server Runtime | Render Secret | **SECRET** | Google Generative Language API key |
| `GEMINI_MODEL` | Server Runtime | Render Environment | Config | `gemini-1.5-flash` |
| `RESEND_API_KEY` | Server Runtime | Render Secret | **SECRET** | Transactional email delivery key |
| `OTP_FROM_EMAIL` | Server Runtime | Render Environment | Config | Sender email address |
| `RAZORPAY_KEY_ID` | Server Runtime | Render Secret | Config | Razorpay public key ID |
| `RAZORPAY_KEY_SECRET` | Server Runtime | Render Secret | **SECRET** | Razorpay private secret |
| `RAZORPAY_WEBHOOK_SECRET` | Server Runtime | Render Secret | **SECRET** | Razorpay webhook verification secret |

---

## 6. Stale URLs Found & Classification

| URL / Reference | Location Found | Classification | Resolution / Notes |
| :--- | :--- | :--- | :--- |
| `campusverse-backend-api.onrender.com` | `docs/CAMPUSVERSE_STRUCTURE_SUMMARY.md:15` | **STALE** | Legacy Render service URL; superseded by `campusverse-api-k5ny.onrender.com`. |
| `campusverse-backend-api.onrender.com` | `docs/CAMPUSVERSE_COMPLETE_STRUCTURE.md:65, 862, 872` | **STALE** | Legacy Render service URL; superseded by `campusverse-api-k5ny.onrender.com`. |
| `api.campusverse.edu` | `.env.production.example:4` | **TEMPLATE** | Outdated template placeholder; updated to canonical URL `https://campusverse-api-k5ny.onrender.com/api/v1`. |
| `api.campusverse.edu` | `ARCHITECTURE.md:1034` | **DOCUMENTATION** | Legacy architectural specification referencing unowned `.edu` domain. |
| `api.campusverse.edu` | `FINAL_PRODUCTION_RELEASE_REPORT.md:24, 113` | **DOCUMENTATION** | Release audit notes documenting unowned `NXDOMAIN` status. |
| `api.campusverse.edu` | `CLOUD_DEPLOYMENT_FINAL_STATUS.md:25, 101` | **DOCUMENTATION** | Deployment audit notes documenting unowned `NXDOMAIN` status. |
| `api.campusverse.edu` | `docs/final-production-readiness.md` (multi) | **DOCUMENTATION** | Readiness checklist items documenting domain prerequisite status. |
| `api.campusverse.edu` | `CampusVerse/BACKUP_AND_DISASTER_RECOVERY.md:65` | **DOCUMENTATION** | Example health check curl command. |
| `campusverse-api.onrender.com` | `CLOUD_DEPLOYMENT_FINAL_STATUS.md:15, 50, 74` | **DOCUMENTATION / STALE** | Earlier deployment name collision that returned 404 before `k5ny` disambiguation. |
| `campusverse-backend.onrender.com` | `CLOUD_DEPLOYMENT_FINAL_STATUS.md:15, 56` | **DOCUMENTATION / STALE** | Earlier deployment name collision that returned 404. |

---

## 7. Current Gemini Configuration

- **Production Model:** Value configured by the `GEMINI_MODEL` environment variable in the production environment (e.g., Render Dashboard environment settings). Note: `gemini-1.5-flash` must NOT be assumed to definitively be the active production model without inspecting the live Render runtime dashboard.
- **Code Fallback Model:** `gemini-1.5-flash` (hardcoded default fallback in `backend/src/controllers/ai.controller.ts` lines 71, 175, 281, 446 when `process.env.GEMINI_MODEL` is unset or empty).
- **Template Configuration:** `gemini-1.5-flash` is declared in `render.yaml` as the initial/default service definition.
- **API Key Environment Variables:** `GEMINI_API_KEY` (primary) or `AI_API_KEY` (fallback).
- **Fallback Behavior When Key Is Missing:**
  - *AI Study Assistant (`/api/v1/ai/study-assistant`):* Falls back to deterministic academic syllabus responses based on keyword matching.
  - *AI Career Assistant (`/api/v1/ai/career-advice`):* Returns HTTP 503 explaining service is unavailable without API key.
  - *AI Admissions Advisor (`/api/v1/ai/admissions-advisor`):* Returns HTTP 503 explaining service is unavailable without API key.
- **Latency Reality:**
  - The frequently cited ~650ms latency is an **empirical benchmark measurement** observed during specific local and test runs with brief token generation.
  - It is **NOT** an architectural guarantee or fixed SLA. Real-world response times depend on network latency, payload length, and Google Gemini API server load.

---

## 8. Current Authentication Storage & Security Boundary

- **Authentication Mechanism:** Stateless JSON Web Tokens (JWT) signed via HMAC-SHA256 (`jsonwebtoken`).
- **Client Storage:**
  - Token: Stored in browser `localStorage` under key `'campusverse_token'`.
  - User Record: Stored in browser `localStorage` under key `'campusverse_user'`.
  - Client Axios Interceptor (`lib/api/client.ts`): Automatically retrieves `campusverse_token` from `localStorage` and injects `Authorization: Bearer <token>` into outgoing requests.
- **Session Revocation Mechanism:**
  - The backend `User` model includes an integer field `sessionVersion: Int @default(1)`.
  - The JWT payload embeds `sessionVersion`.
  - When a user logs out across devices or an administrator invalidates a session, `sessionVersion` is incremented in the database.
  - Backend middleware checks the token's `sessionVersion` against the database record, immediately invalidating old tokens without waiting for expiration.
- **Security Boundary Distinction:**
  > [!IMPORTANT]
  > **Frontend Route Guards (`components/guards/route-guards.tsx`, `ProtectedRoute`, `AdminRoute`, `RoleRoute`):**
  > Provide **client-side UX/navigation protection only**. They ensure unauthorized users are redirected away from pages they shouldn't see in the UI. They do NOT constitute a security boundary.
  >
  > **Backend Middleware (`auth.middleware.ts`, `rbac.middleware.ts`):**
  > Provide the **actual authorization and security boundary**. All data access, mutations, and administrative operations are verified server-side on every request.

---

## 9. Current Content Security Policy (CSP) Limitations

The Content Security Policy is defined in `next.config.mjs` (lines 52-55).

### Directives Currently In Force:
```text
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https: blob:;
font-src 'self' https: data:;
connect-src 'self' http://127.0.0.1:4000 http://localhost:4000 https://*;
frame-ancestors 'none';
object-src 'none';
base-uri 'self';
form-action 'self';
```

### Analysis & Permissive Directives:
1. **`script-src 'unsafe-inline' 'unsafe-eval'`:**
   The CSP explicitly permits inline scripts and `eval()`. This is common for Next.js development and client-side hydration, but means the CSP cannot be classified as "strict" against XSS vulnerabilities.
2. **`style-src 'unsafe-inline'`:**
   Permits arbitrary inline style attributes, required for Tailwind dynamic classes and UI animation components.
3. **`connect-src https://*`:**
   Uses an open wildcard `https://*` for network calls, allowing client-side fetches to arbitrary external HTTPS hosts rather than pinning exclusively to canonical APIs.
4. **Protections Enforced:**
   `frame-ancestors 'none'` and `X-Frame-Options: DENY` strictly defend against UI redressing/clickjacking.

---

## 10. Payment Implementation Status

- **Razorpay Backend:** **IMPLEMENTED**
  - Order creation endpoint: `POST /api/v1/payments/create-order`
  - Payment verification endpoint: `POST /api/v1/payments/verify`
  - Webhook listener: `POST /api/v1/payments/webhook`
  - Security: Cryptographic HMAC-SHA256 signature verification implemented in `backend/src/services/payment.service.ts`.
  - Fallback: Development sandbox mock provider active when production credentials are absent.
- **Razorpay Website Checkout:** **NOT IMPLEMENTED / BACKEND ONLY**
  - `CampusVerse-Website` contains **no** Razorpay checkout script integration (`checkout.js`).
  - No frontend payment modals, checkout buttons, or order completion workflows exist in the current Next.js web application.
  - Payments are currently consumable only via API or mobile clients.

---

## 11. Route Duplication Debt

Four duplicate/alias route pairs currently exist in `app/(app)`:

| Route 1 (Canonical) | Route 2 (Alias / Technical Debt) | Implementation Detail | Canonical Evidence |
| :--- | :--- | :--- | :--- |
| `/student/ai-study` | `/student/ai-tutor` | `ai-tutor/page.tsx` executes `useEffect(() => router.replace('/student/ai-study'), [])` | Directly linked in `app-sidebar.tsx` (line 95); contains full chat interface |
| `/student/community` | `/student/communities` | `communities/page.tsx` executes `useEffect(() => router.replace('/student/community'), [])` | Directly linked in `app-sidebar.tsx` (line 94); contains community hub |
| `/aspirant/compare` | `/aspirant/comparison` | `comparison/page.tsx` executes `useEffect(() => router.replace('/aspirant/compare'), [])` | Directly linked in `app-sidebar.tsx` (line 104); contains comparison table |
| `/admin/verification` | `/admin/verifications` | `verifications/page.tsx` executes `useEffect(() => router.replace('/admin/verification'), [])` | Directly linked in `app-sidebar.tsx` (line 47); contains verification queue |

### Navigation Discrepancy:
- `components/navigation/app-sidebar.tsx` (line 47) links to canonical `/admin/verification`.
- `components/navigation/app-bottom-nav.tsx` (line 51) links to alias `/admin/verifications`. While functional (the alias immediately redirects to `/admin/verification`), it represents unnecessary redirection debt that should be aligned in a future phase.

---

## 12. Production Domain Status

| Domain | Configuration Locations | DNS Status | Classification & Reality |
| :--- | :--- | :--- | :--- |
| `campusverse.edu` | Backend CORS whitelist, email templates | `NXDOMAIN` | **UNREGISTERED / UNREACHABLE**. The `.edu` TLD is strictly restricted by Educause to accredited US higher education institutions. This domain cannot be registered or used for production traffic. |
| `www.campusverse.edu` | Backend CORS whitelist | `NXDOMAIN` | **UNRESOLVED**. Subdomain of `campusverse.edu`. |
| `api.campusverse.edu` | Legacy docs, `.env.production.example` (prior to cleanup) | `NXDOMAIN` | **UNRESOLVED**. Placeholder target domain; not provisioned. |

### Operational Domain Guidance:
- All active production web traffic is routed through **`https://campusverse-website.onrender.com`**.
- All active production API traffic is routed through **`https://campusverse-api-k5ny.onrender.com`**.
- If custom branded domains are desired in the future, an accessible commercial TLD (such as `campusverse.in`, `campusverse.org`, `campusverse.app`, or a university-owned domain) must be acquired and verified.

---

## 13. Production vs Local Configuration Matrix

| Dimension | Local Development | Cloud Production |
| :--- | :--- | :--- |
| **Website URL** | `http://localhost:3000` | `https://campusverse-website.onrender.com` |
| **Backend API URL** | `http://localhost:4000/api/v1` (or `http://127.0.0.1:4000/api/v1`) | `https://campusverse-api-k5ny.onrender.com/api/v1` |
| **Frontend Env File** | `.env.local` (`NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1`) | Render Environment Variables (`NEXT_PUBLIC_API_URL`) |
| **Frontend Env Template** | `.env.example` | `.env.production.example` |
| **Next.js Start Command** | `npm run dev` (`next dev -p 3000`) | `npm start` (`next start -p $PORT`) |
| **Database Connection** | Local SQLite (`dev.db`) or Supabase Pooler | Supabase PostgreSQL Transaction Pooler (`ap-south-1`) |
| **Backend API Port** | `4000` | Dynamic `$PORT` assigned by Render (`10000` in `render.yaml`) |
| **CORS Whitelist** | `localhost:3000`, `127.0.0.1:3000`, mobile emulators | `https://campusverse-website.onrender.com` |
| **Email Service** | Mock console dispatcher | Resend API (`RESEND_API_KEY`) |
| **AI Model Provider** | Google Gemini 1.5 Flash (or deterministic fallback) | Google Gemini 1.5 Flash (`gemini-1.5-flash`) |
| **Payment Gateway** | Razorpay Sandbox Simulator / Mock | Live / Sandbox Razorpay Gateway |
