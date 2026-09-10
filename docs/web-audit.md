# CampusVerse Web — Phase 1: Comprehensive Repository Audit

**Audit Version:** 1.0.0  
**Date:** September 2, 2026  
**Auditor:** Antigravity Autonomous Pair Programmer  
**Target Repository:** `/Users/rohansiddhpura/AndroidStudioProjects/CampusVerse`  
**Web Workspace Target:** `/Users/rohansiddhpura/Documents/campuswebsite`  

---

## 1. Executive Summary

This repository audit constitutes Phase 1 of the CampusVerse Web initiative. CampusVerse is an academic and career platform connecting students, alumni, college aspirants, and university administrators. 

The existing production-grade codebase is organized as a multi-tier monorepo under `/Users/rohansiddhpura/AndroidStudioProjects/CampusVerse`, comprising:
- **`backend/`**: A hardened Node.js/Express TypeScript REST API backed by Prisma ORM and SQLite (with seamless PostgreSQL compatibility), featuring 78 REST endpoints, Zod schema validation, JWT auth, HMAC-salted timing-safe OTP verification, and 146 automated Jest tests passing across 9 test suites.
- **`app/`**: A native Android client written in Kotlin and Jetpack Compose utilizing clean MVVM architecture, Material 3, Navigation Compose, Kotlin Coroutines/Flows, and offline-resilient HTTP network repositories targeting the backend REST API.

**Core Mandate for CampusVerse Web:**
CampusVerse Web **MUST NOT** introduce a separate backend, duplicate database, mock APIs, or alternative business logic. The web application will directly interface with the existing Express REST API (`/api/v1`), honoring identical JWT authentication tokens, RBAC permissions, Prisma database models, OTP flows, and Gemini AI endpoints.

---

## 2. Monorepo & System Architecture

```
CampusVerse Ecosystem
├── backend/                               [Node.js 20+, Express 4, TypeScript, Prisma ORM]
│   ├── prisma/
│   │   ├── schema.prisma                  [966 lines, 48 entity models, relational foreign keys]
│   │   ├── dev.db                         [SQLite persistent database instance]
│   │   └── seed.ts                        [1079 lines, pre-seeded rich multi-role ecosystem data]
│   ├── src/
│   │   ├── app.ts                         [Express application bootstrap, CORS, JSON parsers, /api/v1 router]
│   │   ├── server.ts                      [HTTP server listener on port 4000]
│   │   ├── config/env.ts                  [Zod-validated environment config: PORT, JWT, OTP, CORS, EMAIL, GEMINI]
│   │   ├── middleware/                    [requireAuth, requireRole, validateBody, validateQuery, errorHandler]
│   │   ├── controllers/                   [17 controllers covering all system domains]
│   │   ├── routes/                        [17 Express routers mounted under /api/v1]
│   │   └── services/                      [OtpService, EmailService]
│   └── tests/                             [9 Jest suites, 146 passing unit/integration/security tests]
│
├── app/                                   [Native Android Application - Jetpack Compose & Kotlin]
│   ├── src/main/java/com/campusverse/app/
│   │   ├── data/                          [Models, Network Repositories, Preferences, DataStore]
│   │   ├── domain/                        [Session managers, Auth/Student/Alumni/Aspirant/Admin interfaces]
│   │   ├── navigation/                    [CampusVerseNavHost, Screen sealed class with 50+ routes]
│   │   └── ui/screens/                    [Compose screens organized by role: Student, Alumni, Aspirant, Admin]
│
└── campuswebsite/                         [Future CampusVerse Web Application Client]
    └── docs/                              [Phase 1 Audit & System Blueprints]
        ├── web-audit.md                   [This document]
        ├── api-inventory.md               [Complete 78-endpoint specification]
        ├── rbac-matrix.md                 [Role permission & route security enforcement matrix]
        └── web-feature-matrix.md          [Feature parity & UI-to-API mapping]
```

---

## 3. Technology Stack Breakdown

### 3.1 Backend Stack
- **Language & Runtime:** TypeScript 5.4+ running on Node.js 20+
- **Web Framework:** Express 4.19+
- **ORM & Database Client:** Prisma ORM 5.14+
- **Validation Engine:** Zod 3.23+ for request body and query parameter validation
- **Authentication:** JSON Web Tokens (`jsonwebtoken` 9.0+) with 7-day expiration (`7d`)
- **Password Hashing:** `bcryptjs` (cost factor: 10 rounds)
- **OTP Security:** Native Node.js `crypto` CSPRNG (`randomInt`), SHA-256 HMAC salted with `JWT_SECRET`, constant-time comparison via `crypto.timingSafeEqual`
- **Email Delivery:** Pluggable `EmailService` supporting SMTP (Node.js raw TLS socket without external nodemailer dependencies), Resend HTTP API, SendGrid HTTP API, and Development Mocking
- **AI Integration:** Google Gemini REST API (`gemini-1.5-flash` model) for academic tutoring, career advice, and admission guidance
- **Test Framework:** Jest 29+ with `ts-jest` and `supertest`

### 3.2 Database Stack
- **Engine:** SQLite 3 (`prisma/dev.db`) configured in Prisma; architected with standard foreign keys, cascade deletes, and indexing compatible with PostgreSQL 15+
- **Entity Models:** 48 relational models mapped in `prisma/schema.prisma`
- **Seeded Data:** Fully populated with institutions (NIT Bangalore, IIT Bombay, Stanford, MIT, BITS Pilani, Univ of Toronto), college programs, scholarships, active courses, digital library books, notes, communities, posts, comments, marketplace listings, companies (Google India, Microsoft IDC), jobs, applications, referrals, mentorship requests, sessions, chat messages, roadmaps, and notifications.

### 3.3 Android Application Stack
- **UI Framework:** Jetpack Compose (Kotlin 1.9+, Compose BOM 2024+)
- **Architecture:** Clean Architecture + MVVM (Model-View-ViewModel) + Single Activity Architecture (`MainActivity`)
- **Navigation:** Jetpack Navigation Compose with type-safe `Screen` sealed class routes
- **Networking:** Native HTTP connection layer (`HttpURLConnection`) targeting `http://10.0.2.2:4000/api/v1` (Android Emulator loopback)
- **State Management:** Kotlin Coroutines, `StateFlow`, `MutableStateFlow`
- **Session Persistence:** Jetpack DataStore / `InMemorySessionManager` storing JWT bearer token and user metadata

---

## 4. Authentication Architecture & Security

### 4.1 Authentication Life Cycle
1. **Registration (`POST /api/v1/auth/register`)**:
   - Accepts `name`, `email`, `password` (min 6 characters), and `role` (`STUDENT`, `ASPIRANT`, `ALUMNI`, `ADMIN`).
   - Hashes password using `bcryptjs` (10 rounds).
   - Initializes user in `User` table, automatically creates empty base `Profile`, default `PrivacySettings`, and default `SecuritySettings`.
   - Role-specific profile records (`StudentProfile`, `AspirantProfile`, `AlumniProfile`, `AdminProfile`) are initialized or provisioned.
   - **Crucial Admin Security Policy:** Any user registering with role `ADMIN` is created with `isAdminAuthorized = false`. They cannot access administrative endpoints until promoted/authorized directly in the database or by a superadmin.
   - Issues a signed JWT and dispatches an email verification OTP.
2. **Login (`POST /api/v1/auth/login`)**:
   - Validates email and password against `bcryptjs.compare`.
   - Checks `user.isActive == true`. Suspended accounts are rejected with `403 Forbidden` (`ACCOUNT_SUSPENDED`).
   - Issues a JWT containing `{ userId, email, role, isAdminAuthorized }`.
3. **Current User (`GET /api/v1/auth/me`)**:
   - Requires valid `Authorization: Bearer <token>` header.
   - Decodes JWT, queries database for freshest user data including `profile`, role profiles, and settings.
4. **Logout (`POST /api/v1/auth/logout`)**:
   - Terminates client session. Token blacklisting table is currently **MISSING** (JWT expires client-side or after 7 days).

### 4.2 OTP Verification Engine
- **Generation:** 6-digit numeric token generated via `crypto.randomInt(100000, 1000000)`.
- **Storage:** Stored in `OtpToken` table as a SHA-256 hash salted with `JWT_SECRET`:
  `crypto.createHash('sha256').update(otp + env.JWT_SECRET).digest('hex')`.
  The plain OTP code is **NEVER** stored in the database.
- **Verification:** Computed candidate hash compared against stored hash using `crypto.timingSafeEqual` to prevent side-channel timing attacks.
- **Safety Limits:**
  - Expiry: 5 minutes (`OTP_EXPIRY_MINUTES = 5`).
  - Max attempts: 5 (`OTP_MAX_ATTEMPTS = 5`). Code invalidated if exceeded.
  - Resend Cooldown: 60 seconds (`OTP_RESEND_COOLDOWN_SECONDS = 60`).
  - Purpose binding: Restricted to explicit purpose (`EMAIL_VERIFICATION`, `PASSWORD_RESET`, `LOGIN_2FA`).
- **Response Privacy:** The generated OTP is **NEVER** sent in the API response JSON. It is dispatched exclusively via `EmailService`.

---

## 5. Role-Based Access Control (RBAC) Architecture

### 5.1 The Four System Roles
| Role | Core Scope | Default Permissions |
|---|---|---|
| `STUDENT` | Academic learning, campus community, peer trading, career launch | Access academic summary, course catalogs, notes hub, library, AI study tutor, campus events, communities, marketplace buying/selling, mentorship requests, safety reports. |
| `ASPIRANT` | College exploration, admission forecasting, financial aid | College explorer, college comparison, admission predictor (JEE/SAT), scholarship search, saved colleges/scholarships, AI admission advisor. |
| `ALUMNI` | Career development, networking, mentorship, hiring | Alumni network directory, 1-on-1 connections, direct messaging, job board posting & applications, referral requests, mentor profiles, mentorship session hosting, career roadmaps, skill tracking, mock interviews. |
| `ADMIN` | Platform governance, verification, trust & safety, configuration | User management & suspension, verification document review, safety report resolution, moderation of marketplace, events, jobs, mentors, system-wide announcements, platform telemetry. |

### 5.2 Middleware Enforcement
1. **`requireAuth`**: Extracts Bearer token, validates JWT signature and expiry, fetches user from Prisma DB, asserts user is active.
2. **`requireRole(...allowedRoles)`**: Asserts authenticated user's role is in `allowedRoles`.
3. **`isAdminAuthorized` Enforcement**: For any request accessing an `ADMIN` route or role, `requireRole` strictly verifies `req.user.isAdminAuthorized === true`. This prevents unapproved admin registrations from executing administrative actions.

---

## 6. Pre-Seeded Test Credentials

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Student** | `student@campusverse.edu` | `Password123` | Active Student (NIT Bangalore, CSE Junior) |
| **Alumni** | `alumni@campusverse.edu` | `Password123` | Senior SWE @ Google, Mentor & Referrer |
| **Aspirant** | `aspirant@campusverse.edu` | `Password123` | Prospect Undergrad (JEE: 98.4, SAT: 1490) |
| **Admin** | `admin@campusverse.edu` | `Password123` | Superadmin (`isAdminAuthorized: true`) |

---

## 7. Security Findings & Architectural Gaps

1. **CORS Configuration**: In `backend/src/app.ts`, `cors({ origin: true, credentials: true })` reflects incoming origins. For production web deployment, explicit domain whitelisting is required (`CAMPUSVERSE_WEB_URL`).
2. **File Upload Handling**: Routes currently expect pre-hosted public URL strings (`fileUrl`, `avatarUrl`, `documentUrl`, `resumeUrl`). There is **NO** multipart file upload middleware (`multer`, AWS S3, or Cloudinary). **Status:** MISSING (requires direct upload service or S3 signed URLs for web).
3. **Real-Time Communication**: The messaging and chat subsystem (`/conversations`, `/messages`) relies entirely on REST HTTP polling. There are **NO** WebSockets (`Socket.io`) implemented. **Status:** MISSING (web will need periodic polling or WebSocket upgrade).
4. **Token Revocation & Refresh Tokens**: Tokens have a fixed 7-day lifetime. No refresh token rotation or server-side token blacklist exists upon logout.
5. **Rate Limiting**: Rate limiting exists in `OtpService` for OTP codes, but global Express rate-limiting (`express-rate-limit`) on sensitive login/register routes is currently **MISSING**.

---

## 8. Web Application Architecture Blueprint

To ensure complete parity with the Android app without duplicating backend logic, CampusVerse Web must adopt:
1. **Single Backend Integration**: Point `API_BASE_URL` to `http://localhost:4000/api/v1` (or production backend URL).
2. **Unified State Management**: React / Next.js with React Context or TanStack Query (React Query) matching Android ViewModels.
3. **Token Management**: Secure HTTP cookie or persistent `localStorage` with an Axios / Fetch interceptor attaching `Authorization: Bearer <token>`.
4. **Role Routing & Guards**: Next.js App Router or React Router with Protected Route HOCs mirroring `CampusVerseNavHost.kt`:
   - `/auth/*`: Login, Register, Forgot Password, Reset Password, OTP Verification
   - `/student/*`: Academics, Notes, Library, AI Tutor, Events, Communities, Marketplace
   - `/aspirant/*`: Explorer, Comparison, Predictor, Scholarships, AI Advisor
   - `/alumni/*`: Network, Directory, Careers, Applications, Referrals, Mentorship, Chat, Roadmap
   - `/admin/*`: Dashboard, Users, Verifications, Reports, Moderation, Announcements, Settings
