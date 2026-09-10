# CampusVerse Role-Based Access Control (RBAC) Matrix

**Version:** 1.0.0  
**Enforcement Layer:** Backend Express Middleware (`requireAuth`, `requireRole`) & Android Navigation Guards  
**Target Roles:** `STUDENT`, `ASPIRANT`, `ALUMNI`, `ADMIN`  

---

## 1. System Roles Overview

| Role | Definition & Scope | Default Verification State | Special Authorization Required |
|---|---|---|---|
| `STUDENT` | Enrolled university students accessing academic tools, peer resources, study assistant, campus marketplace, and clubs. | `isEmailVerified: false` initially; `isVerified: false` on profile | None |
| `ASPIRANT` | Prospective students exploring colleges, admission criteria, scholarships, and exam score benchmarking. | `isEmailVerified: false` initially | None |
| `ALUMNI` | University graduates offering mentorship, posting hiring opportunities, providing referrals, and networking. | `isEmailVerified: false` initially; `isVerified: false` on profile | None |
| `ADMIN` | Platform moderators, department chairs, and campus administrators overseeing users, safety, and verifications. | `isEmailVerified: false` initially | **`isAdminAuthorized: true` strictly required in database and JWT.** |

---

## 2. Admin Security & Elevation Model

> [!IMPORTANT]
> **Strict Protection against Unauthorized Administrative Access**  
> Anyone who registers with `role: "ADMIN"` via `POST /api/v1/auth/register` is created with:
> ```json
> {
>   "role": "ADMIN",
>   "isAdminAuthorized": false
> }
> ```
> The `requireRole("ADMIN")` middleware explicitly evaluates:
> ```typescript
> if (req.user.role === 'ADMIN' && !req.user.isAdminAuthorized) {
>   return res.status(403).json({
>     success: false,
>     error: {
>       code: 'ADMIN_UNAUTHORIZED',
>       message: 'Admin account requires authorization from a superadministrator.'
>     }
>   });
> }
> ```
> To elevate an admin, a superadmin must update the database record (`isAdminAuthorized = true`) or invoke the admin management endpoint. The JWT payload encodes `isAdminAuthorized`, and `requireAuth` re-verifies active status in the database on every request.

---

## 3. Comprehensive Domain Permission Matrix

*Legend:*
- **C** = Create
- **R** = Read
- **U** = Update / Moderate
- **D** = Delete
- **–** = No Access (Returns `403 Forbidden` or `401 Unauthorized`)
- **(own)** = Action restricted strictly to items owned by the authenticated user

| Feature Domain | Endpoint Pattern | Public / Guest | STUDENT | ASPIRANT | ALUMNI | ADMIN (Authorized) |
|---|---|:---:|:---:|:---:|:---:|:---:|
| **Auth & Onboarding** |
| Register / Login | `/auth/register`, `/auth/login` | C | C | C | C | C |
| Current Session | `/auth/me`, `/auth/logout` | – | R | R | R | R |
| OTP Verification | `/auth/send-otp`, `/auth/verify-otp` | C, U | C, U | C, U | C, U | C, U |
| Password Recovery | `/auth/forgot-password`, `/reset-password` | C, U | C, U | C, U | C, U | C, U |
| **Profile & Settings** |
| Base Profile | `/users/profile` | – | R, U (own) | R, U (own) | R, U (own) | R, U |
| Student Profile | `/users/profile/student` | – | R, U (own) | – | – | R, U |
| Alumni Profile | `/users/profile/alumni` | – | – | – | R, U (own) | R, U |
| Aspirant Profile | `/aspirant/profile` | – | – | R, U (own) | – | R, U |
| Privacy Settings | `/users/privacy-settings` | – | R, U (own) | R, U (own) | R, U (own) | R, U (own) |
| Security Settings | `/users/security-settings` | – | R, U (own) | R, U (own) | R, U (own) | R, U (own) |
| **Verifications** |
| Submit ID / Credential | `/verifications` | – | C (own) | – | C (own) | C |
| View Verification History | `/verifications/me` | – | R (own) | – | R (own) | R |
| Verification Queue | `/admin/verifications` | – | – | – | – | R |
| Review / Approve / Reject | `/admin/verifications/:id/review` | – | – | – | – | U |
| **Academics & Courses** |
| Academic Summary | `/academics/me` | – | R (own) | – | – | R |
| Course Catalog | `/courses`, `/courses/:id` | – | R | – | – | R |
| **Notes Hub** |
| View & Search Notes | `/notes`, `/notes/:id` | – | R | – | – | R |
| Upload Note | `/notes` | – | C | – | – | C |
| Edit Note | `/notes/:id` | – | U (own) | – | – | U |
| Delete Note | `/notes/:id` | – | D (own) | – | – | D |
| Download Note Counter | `/notes/:id/download` | – | U | – | – | U |
| **Digital Library** |
| Library Catalog | `/library`, `/library/:id` | – | R | – | – | R |
| **Events** |
| View Campus Events | `/events`, `/events/:id` | – | R | R | R | R |
| Register / Unregister | `/events/:id/register` | – | C, D (own) | C, D (own) | C, D (own) | C, D (own) |
| Moderate Events | `/admin/events/:id/moderate` | – | – | – | – | U, D |
| **Communities & Discussions**|
| Browse Communities | `/communities`, `/communities/:id` | – | R | – | R | R |
| Join / Leave Community | `/communities/:id/join`, `/leave` | – | C, D (own) | – | C, D (own) | C, D (own) |
| Create Post | `/communities/:id/posts` | – | C | – | C | C |
| Edit / Delete Post | `/posts/:id` | – | U, D (own) | – | U, D (own) | U, D |
| Like Post | `/posts/:id/like` | – | C | – | C | C |
| Comment on Post | `/posts/:id/comments` | – | C | – | C | C |
| **Campus Marketplace** |
| Browse Items | `/marketplace`, `/marketplace/:id` | – | R | – | R | R |
| List Item for Sale | `/marketplace` | – | C | – | C | C |
| Edit Listing | `/marketplace/:id` | – | U (own) | – | U (own) | U |
| Delete Listing | `/marketplace/:id` | – | D (own) | – | D (own) | D |
| Moderate Item | `/admin/marketplace/:id/moderate` | – | – | – | – | U, D |
| **Mentorship** |
| Browse Mentor Directory | `/mentors`, `/mentors/:id` | – | R | R | R | R |
| Create Mentor Profile | `/mentors/profile` | – | – | – | C, U (own) | C, U |
| Request Mentorship | `/mentorship/requests` | – | C (own) | C (own) | – | C |
| Accept / Decline Request | `/mentorship/requests/:id` | – | – | – | U (own) | U |
| Schedule Session | `/mentorship/sessions` | – | – | – | C (own) | C |
| View Mentorship Sessions | `/mentorship/sessions` | – | R (own) | R (own) | R (own) | R |
| Moderate Mentors | `/admin/mentorship/:id/moderate` | – | – | – | – | U |
| **Messaging & Chat** |
| Direct Conversations | `/conversations`, `/messages` | – | C, R (own) | C, R (own) | C, R (own) | C, R |
| **Careers, Jobs & Referrals** |
| Browse Jobs | `/jobs`, `/jobs/recommended`, `/jobs/:id`| – | R | – | R | R |
| Post Job Opportunity | `/jobs` | – | – | – | C | C |
| Bookmark / Unsave Job | `/jobs/:id/save` | – | C, D (own) | – | C, D (own) | C, D (own) |
| Apply for Job | `/jobs/:id/apply` | – | C (own) | – | C (own) | C |
| View Applications | `/applications` | – | R (own) | – | R (own) | R |
| Withdraw Application | `/applications/:id/withdraw` | – | U (own) | – | U (own) | U |
| Company Profiles | `/companies`, `/companies/:id` | – | R | – | R | R |
| Request Referral | `/referrals` | – | C (own) | – | – | C |
| Respond to Referral | `/referrals/:id` | – | – | – | U (own) | U |
| Moderate Job Postings | `/admin/jobs/:id/moderate` | – | – | – | – | U, D |
| **Alumni Directory & Networking**|
| Search Alumni Directory | `/alumni`, `/alumni/:id` | – | R | R | R | R |
| Send Connection Request | `/alumni/:id/connect` | – | C (own) | C (own) | C (own) | C |
| Respond to Connection | `/alumni/connections/:id` | – | U (own) | U (own) | U (own) | U |
| View Network Activity | `/alumni/network/activity` | – | R | R | R | R |
| Bookmark Alumni Profile | `/alumni/:id/save` | – | C, D (own) | C, D (own) | C, D (own) | C, D (own) |
| **Career Development** |
| Career Roadmaps | `/career/roadmaps` | – | R, C, U (own) | – | R, C, U (own) | R, U |
| Skills Progress | `/career/skills` | – | R, C, U (own) | – | R, C, U (own) | R, U |
| Mock Interview Transcripts | `/career/interviews` | – | R, C (own) | – | R, C (own) | R |
| Career Preferences | `/career/preferences` | – | R, U (own) | – | R, U (own) | R, U |
| **Aspirant Admissions** |
| Aspirant Dashboard | `/aspirant/home` | – | – | R (own) | – | R |
| Explore Colleges | `/colleges`, `/colleges/:id` | – | R | R | R | R |
| Bookmark / Unsave College | `/colleges/:id/save` | – | – | C, D (own) | – | C, D |
| Compare Colleges | `/colleges/compare` | – | R | R | R | R |
| Admission Predictor | `/predictions/predict` | – | – | C (own) | – | C |
| Prediction History | `/predictions/history` | – | – | R (own) | – | R |
| Search Scholarships | `/scholarships`, `/scholarships/:id` | – | R | R | – | R |
| Save Scholarships | `/scholarships/:id/save` | – | R (own) | C, D (own) | – | C, D |
| **Artificial Intelligence** |
| AI Study Tutor | `/ai/study-assistant` | – | C | C | C | C |
| AI Career Coach | `/ai/career-assistant` | – | C | – | C | C |
| AI Admission Advisor | `/ai/aspirant-recommendations`| – | – | C | – | C |
| **Trust, Safety & Notifications**|
| File Report | `/reports` | – | C (own) | C (own) | C (own) | C |
| Notifications Feed | `/notifications` | – | R, U (own) | R, U (own) | R, U (own) | R, U (own) |
| Resolve Reports | `/admin/reports/:id/resolve` | – | – | – | – | U |
| **Platform Administration** |
| Admin Dashboard Telemetry | `/admin/dashboard` | – | – | – | – | R |
| User List & Details | `/admin/users`, `/admin/users/:id` | – | – | – | – | R |
| Suspend User / Change Role | `/admin/users/:id/status` | – | – | – | – | U |
| Admin Password Force-Reset | `/admin/users/:id/reset-password`| – | – | – | – | C |
| System Announcements | `/admin/announcements` | – | – | – | – | C, R |
| Global Platform Settings | `/admin/settings` | – | – | – | – | R, U |

---

## 4. Resource Isolation & Data Boundary Policies

1. **Self-Access Isolation (`(own)`)**:
   - A user cannot update, delete, or withdraw records created by another user (e.g., job applications, mentorship requests, marketplace items, discussion posts).
   - Controllers strictly enforce ownership:
     `if (resource.userId !== req.user.id && req.user.role !== 'ADMIN') return res.status(403)...`
2. **Cross-Role Boundaries**:
   - `ASPIRANT` accounts cannot view or participate in internal campus academic forums (`/academics/me`, `/courses`, `/notes`, `/library`).
   - `STUDENT` accounts cannot post jobs (`POST /jobs` is restricted to `ALUMNI` and `ADMIN`).
   - `ALUMNI` accounts cannot submit student enrollment verifications.
3. **Public Unauthenticated Endpoints**:
   - Limited strictly to login, registration, OTP generation/verification, and password recovery.
   - All other 70 endpoints reject unauthenticated traffic with `401 Unauthorized`.
