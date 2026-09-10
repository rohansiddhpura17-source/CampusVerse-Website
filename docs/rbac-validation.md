# CampusVerse Web — RBAC & Authorization Validation Report

This document validates the correspondence between client-side route guards (`components/guards/route-guards.tsx`) and authoritative backend Express middleware (`requireAuth`, `requireRole`, `isAdminAuthorized`, and resource ownership checks).

---

## 1. Backend Authorization Primitives

### `requireAuth` (`backend/src/middleware/auth.middleware.ts`)
- **Mechanism**: Extracts Bearer token from `Authorization: Bearer <token>` header.
- **Verification**: Verifies JWT signature using `JWT_SECRET`.
- **Liveness Check**: Queries the Prisma database (`prisma.user.findUnique`) to verify user exists and `isActive === true`.
- **Request Context Injection**: Attaches `{ userId, email, role, isAdminAuthorized }` to Express `req.user`.
- **Rejection Codes**:
  - `UNAUTHORIZED` (HTTP 401) — Missing or malformed header.
  - `INVALID_TOKEN` (HTTP 401) — Expired or forged token.
  - `ACCOUNT_INACTIVE` (HTTP 401) — User suspended (`isActive = false`) or deleted.

### `requireRole(...allowedRoles)` (`backend/src/middleware/rbac.middleware.ts`)
- **Mechanism**: Checks whether `allowedRoles.map(r => r.toUpperCase()).includes(req.user.role.toUpperCase())`.
- **Rejection Code**: `FORBIDDEN` (HTTP 403) — Role not in whitelist.
- **Admin Privilege Elevation Safeguard**:
  ```typescript
  if (userRole === 'ADMIN' && !req.user.isAdminAuthorized) {
    sendError(res, 'Admin account authorization is pending or unverified.', 403, 'ADMIN_UNAUTHORIZED');
    return;
  }
  ```
  Even if an account has `role === 'ADMIN'`, if `isAdminAuthorized !== true`, they receive HTTP 403 `ADMIN_UNAUTHORIZED`.

### Ownership & Resource Guards
- **Community Post / Comment Deletion**: Only the author (`req.user.userId === post.authorId`) or an elevated Admin can update/delete.
- **Notes CRUD**: Note owner can edit or delete; all users can read public notes.
- **Marketplace Listing Deletion**: Restricted to seller (`req.user.userId === item.sellerId`) or Admin.
- **Job Application Withdrawal**: Restricted to applicant (`req.user.userId === application.applicantId`).
- **Safety Report Resolution**: Restricted strictly to authorized Administrators.

---

## 2. Frontend Guard to Backend RBAC Mapping Matrix

| Route Family | Frontend Guard | Permitted Roles | Backend Middleware Enforcement | Unauthorized Behavior |
|---|---|---|---|---|
| `/auth/*` | `PublicRoute` | Unauthenticated (or all) | Public (None) | If already authenticated, redirected to respective role dashboard |
| `/student/*` | `StudentRoute` | `STUDENT`, `ADMIN` | `requireAuth`, `requireRole('STUDENT', 'ADMIN')` | Redirects to own dashboard if authenticated as different role; to `/auth/login` if unauthenticated |
| `/aspirant/*` | `AspirantRoute` | `ASPIRANT`, `ADMIN` | `requireAuth`, `requireRole('ASPIRANT', 'ADMIN')` | Redirects to own dashboard if authenticated as different role; to `/auth/login` if unauthenticated |
| `/alumni/*` | `AlumniRoute` | `ALUMNI`, `ADMIN` | `requireAuth`, `requireRole('ALUMNI', 'ADMIN')` | Redirects to own dashboard if authenticated as different role; to `/auth/login` if unauthenticated |
| `/admin/*` | `AdminRoute` | `ADMIN` (with `isAdminAuthorized === true`) | `requireAuth`, `requireRole('ADMIN')` + `isAdminAuthorized === true` | If `role !== 'ADMIN'`, redirected to own dashboard. If `isAdminAuthorized === false`, redirected to `/auth/unauthorized`. Backend rejects with 403 `ADMIN_UNAUTHORIZED`. |

---

## 3. Role Access Simulation Matrix

### Scenario 1: Unauthenticated Visitor
- **Visits `/` or `/features`**: Allowed (Public route).
- **Visits `/auth/login` or `/auth/register`**: Allowed (Public route).
- **Visits `/student/dashboard`**: Intercepted by `AuthenticatedRoute` / `StudentRoute` &rarr; Redirects to `/auth/login?redirect=/student/dashboard`.
- **Attempts direct API call `GET /api/v1/academics/me`**: Backend `requireAuth` returns HTTP 401 `UNAUTHORIZED`.

### Scenario 2: Authenticated Student (`student@campusverse.edu`, Role: `STUDENT`)
- **Visits `/student/dashboard`**: Allowed. Backend returns 200 OK.
- **Visits `/aspirant/dashboard`**: `AspirantRoute` detects `role === 'STUDENT'` &rarr; Redirects to `/student/dashboard`.
- **Visits `/alumni/dashboard`**: `AlumniRoute` detects `role === 'STUDENT'` &rarr; Redirects to `/student/dashboard`.
- **Visits `/admin/dashboard`**: `AdminRoute` detects `role !== 'ADMIN'` &rarr; Redirects to `/student/dashboard`.
- **Attempts direct API call `GET /api/v1/admin/dashboard`**: Backend `requireRole('ADMIN')` returns HTTP 403 `FORBIDDEN`.

### Scenario 3: Authenticated Aspirant (`aspirant@campusverse.edu`, Role: `ASPIRANT`)
- **Visits `/aspirant/dashboard`**: Allowed. Backend returns 200 OK.
- **Visits `/student/dashboard`**: `StudentRoute` detects mismatch &rarr; Redirects to `/aspirant/dashboard`.
- **Visits `/alumni/dashboard`**: `AlumniRoute` detects mismatch &rarr; Redirects to `/aspirant/dashboard`.
- **Visits `/admin/dashboard`**: `AdminRoute` detects mismatch &rarr; Redirects to `/aspirant/dashboard`.
- **Attempts direct API call `PATCH /api/v1/admin/users/123/status`**: Backend returns HTTP 403 `FORBIDDEN`.

### Scenario 4: Authenticated Alumni (`alumni@campusverse.edu`, Role: `ALUMNI`)
- **Visits `/alumni/dashboard`**: Allowed. Backend returns 200 OK.
- **Visits `/student/dashboard`**: `StudentRoute` detects mismatch &rarr; Redirects to `/alumni/dashboard`.
- **Visits `/aspirant/dashboard`**: `AspirantRoute` detects mismatch &rarr; Redirects to `/alumni/dashboard`.
- **Visits `/admin/dashboard`**: `AdminRoute` detects mismatch &rarr; Redirects to `/alumni/dashboard`.
- **Attempts direct API call `POST /api/v1/admin/announcements`**: Backend returns HTTP 403 `FORBIDDEN`.

### Scenario 5: Self-Registered Admin (`role: ADMIN`, `isAdminAuthorized: false`)
- **Registration**: Can register, but backend explicitly enforces `isAdminAuthorized = false`.
- **Visits `/admin/dashboard`**: `AdminRoute` detects `isAdminAuthorized === false` &rarr; Redirects to `/auth/unauthorized?reason=admin_authorization_required`.
- **Attempts direct API call `GET /api/v1/admin/dashboard`**: Backend `requireRole('ADMIN')` returns HTTP 403 `ADMIN_UNAUTHORIZED`.

### Scenario 6: Superadmin (`admin@campusverse.edu`, Role: `ADMIN`, `isAdminAuthorized: true`)
- **Visits `/admin/dashboard`**: Allowed. Backend returns 200 OK.
- **Visits `/student/dashboard`**, `/aspirant/dashboard`, `/alumni/dashboard`: Allowed (Admin supervisory access).
- **All Admin API calls**: Backend returns 200 OK.

---

## 4. RBAC Validation Verdict: PASS

Frontend guards and backend middleware agree on all 4 role boundaries and the administrative elevation condition.
No client bypass is possible because Express routes reject unauthorized requests with HTTP 401/403.
