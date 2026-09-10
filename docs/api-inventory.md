# CampusVerse REST API Inventory

**API Version:** `v1`  
**Base URL:** `http://localhost:4000/api/v1` (Web) / `http://10.0.2.2:4000/api/v1` (Android Emulator)  
**Total Endpoints:** 78  
**Authentication Scheme:** `Authorization: Bearer <JWT>`  
**Payload Format:** `application/json`  
**Standard Response Contract:**
```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```
Error Contract:
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable explanation"
  }
}
```

---

## 1. Authentication & Account Recovery (`/auth`)

| Method | Endpoint | Auth Required | Role | Description |
|---|---|---|---|---|
| `POST` | `/auth/register` | None | Public | Register new user (STUDENT, ASPIRANT, ALUMNI, ADMIN). Returns JWT + User. Note: Admins register with `isAdminAuthorized: false`. |
| `POST` | `/auth/login` | None | Public | Authenticate with email & password. Rejects suspended users. Returns JWT + User. |
| `GET` | `/auth/me` | Bearer JWT | All | Get currently authenticated user profile, roles, and settings. |
| `POST` | `/auth/logout` | Bearer JWT | All | Invalidate client session. |
| `POST` | `/auth/send-otp` | None | Public | Generate CSPRNG OTP, store salted SHA-256 hash, dispatch via EmailService. |
| `POST` | `/auth/verify-otp` | None | Public | Verify OTP using timing-safe equal comparison. Marks email verified if purpose matches. |
| `POST` | `/auth/forgot-password` | None | Public | Trigger password reset flow, sends OTP to registered email. |
| `POST` | `/auth/reset-password` | None | Public | Reset account password using verified OTP token. |

---

## 2. Users, Profiles & Settings (`/users`)

| Method | Endpoint | Auth Required | Role | Description |
|---|---|---|---|---|
| `GET` | `/users/profile` | Bearer JWT | All | Fetch unified profile data for current user. |
| `PATCH` | `/users/profile/student` | Bearer JWT | STUDENT, ADMIN | Update student-specific profile (major, degree, semester, CGPA, studentIdNumber). |
| `PATCH` | `/users/profile/alumni` | Bearer JWT | ALUMNI, ADMIN | Update alumni profile (company, designation, experience, mentor/referral willingness). |
| `GET` | `/users/privacy-settings` | Bearer JWT | All | Fetch user's visibility and messaging privacy preferences. |
| `PATCH` | `/users/privacy-settings` | Bearer JWT | All | Update privacy preferences (showEmail, showPhone, allowMessagesFrom). |
| `GET` | `/users/security-settings` | Bearer JWT | All | Fetch security configurations (twoFactorEnabled, loginAlertsEnabled). |
| `PATCH` | `/users/security-settings` | Bearer JWT | All | Update security settings. |
| `POST` | `/users/account-recovery` | Bearer JWT | All | Submit account recovery requests. |

---

## 3. Verifications (`/verifications`)

| Method | Endpoint | Auth Required | Role | Description |
|---|---|---|---|---|
| `POST` | `/verifications` | Bearer JWT | STUDENT, ALUMNI | Submit official identity/enrollment documents (STUDENT_ID, DEGREE_CERTIFICATE, GOVERNMENT_ID). |
| `GET` | `/verifications/me` | Bearer JWT | STUDENT, ALUMNI | Fetch current user's submitted verification history and status. |
| `GET` | `/verifications` | Bearer JWT | ADMIN | List all submitted verification requests with status filtering. |
| `PATCH` | `/verifications/:id` | Bearer JWT | ADMIN | Review, approve, or reject verification submission. |

---

## 4. Academics & Coursework (`/academics`, `/courses`)

| Method | Endpoint | Auth Required | Role | Description |
|---|---|---|---|---|
| `GET` | `/academics/me` | Bearer JWT | STUDENT, ADMIN | Fetch current student's enrolled courses, CGPA, semester, and institution profile. |
| `GET` | `/courses` | Bearer JWT | STUDENT, ADMIN | Search institution course catalog with semester/keyword filters. |
| `GET` | `/courses/:id` | Bearer JWT | STUDENT, ADMIN | Get detailed course syllabus and credit information. |

---

## 5. Notes Hub (`/notes`)

| Method | Endpoint | Auth Required | Role | Description |
|---|---|---|---|---|
| `GET` | `/notes` | Bearer JWT | STUDENT, ADMIN | List shared academic notes with course, tag, and keyword search. |
| `POST` | `/notes` | Bearer JWT | STUDENT, ADMIN | Upload/share new academic note metadata (fileUrl, title, tags, courseId). |
| `GET` | `/notes/:id` | Bearer JWT | STUDENT, ADMIN | Retrieve single note details with author info. |
| `PATCH` | `/notes/:id` | Bearer JWT | STUDENT, ADMIN | Update note title, description, or tags (Owner or Admin). |
| `DELETE` | `/notes/:id` | Bearer JWT | STUDENT, ADMIN | Delete note (Owner or Admin). |
| `POST` | `/notes/:id/download` | Bearer JWT | STUDENT, ADMIN | Increment download telemetry counter for note. |

---

## 6. Library Catalog (`/library`)

| Method | Endpoint | Auth Required | Role | Description |
|---|---|---|---|---|
| `GET` | `/library` | Bearer JWT | STUDENT, ADMIN | Search campus library resources, textbooks, and eBooks. |
| `GET` | `/library/:id` | Bearer JWT | STUDENT, ADMIN | Get specific book availability, shelf location, and copy counts. |

---

## 7. Campus Events (`/events`)

| Method | Endpoint | Auth Required | Role | Description |
|---|---|---|---|---|
| `GET` | `/events` | Bearer JWT | All | Browse campus hackathons, workshops, webinars, and mixers. |
| `GET` | `/events/:id` | Bearer JWT | All | Get event agenda, venue/virtual links, and attendee counts. |
| `POST` | `/events/:id/register` | Bearer JWT | All | Register current user for an upcoming event. |
| `DELETE` | `/events/:id/register` | Bearer JWT | All | Unregister current user from an event. |

---

## 8. Communities, Posts & Comments (`/communities`, `/posts`)

| Method | Endpoint | Auth Required | Role | Description |
|---|---|---|---|---|
| `GET` | `/communities` | Bearer JWT | STUDENT, ALUMNI, ADMIN | Browse available campus student/alumni communities. |
| `GET` | `/communities/:id` | Bearer JWT | STUDENT, ALUMNI, ADMIN | View community details and member posts feed. |
| `POST` | `/communities/:id/join` | Bearer JWT | STUDENT, ALUMNI, ADMIN | Join a community. |
| `POST` | `/communities/:id/leave` | Bearer JWT | STUDENT, ALUMNI, ADMIN | Leave a community. |
| `POST` | `/communities/:id/posts` | Bearer JWT | STUDENT, ALUMNI, ADMIN | Create a discussion post in community. |
| `PATCH` | `/posts/:id` | Bearer JWT | STUDENT, ALUMNI, ADMIN | Edit discussion post (Author or Admin). |
| `DELETE` | `/posts/:id` | Bearer JWT | STUDENT, ALUMNI, ADMIN | Delete discussion post (Author or Admin). |
| `POST` | `/posts/:id/like` | Bearer JWT | STUDENT, ALUMNI, ADMIN | Toggle like on community post. |
| `POST` | `/posts/:id/comments` | Bearer JWT | STUDENT, ALUMNI, ADMIN | Comment on a discussion post. |

---

## 9. Campus Marketplace (`/marketplace`)

| Method | Endpoint | Auth Required | Role | Description |
|---|---|---|---|---|
| `GET` | `/marketplace` | Bearer JWT | STUDENT, ALUMNI, ADMIN | Browse textbooks, electronics, dorm essentials with filters. |
| `POST` | `/marketplace` | Bearer JWT | STUDENT, ALUMNI, ADMIN | Create new item listing. |
| `GET` | `/marketplace/:id` | Bearer JWT | STUDENT, ALUMNI, ADMIN | Get listing details and seller contact information. |
| `PATCH` | `/marketplace/:id` | Bearer JWT | STUDENT, ALUMNI, ADMIN | Update listing details or status (AVAILABLE, SOLD) (Seller or Admin). |
| `DELETE` | `/marketplace/:id` | Bearer JWT | STUDENT, ALUMNI, ADMIN | Remove marketplace listing (Seller or Admin). |

---

## 10. Mentorship Network (`/mentors`, `/mentorship`)

| Method | Endpoint | Auth Required | Role | Description |
|---|---|---|---|---|
| `GET` | `/mentors` | Bearer JWT | STUDENT, ALUMNI, ASPIRANT, ADMIN | Browse verified alumni mentors with company/domain filters. |
| `GET` | `/mentors/:id` | Bearer JWT | STUDENT, ALUMNI, ASPIRANT, ADMIN | View mentor bio, areas of expertise, and rating. |
| `POST` | `/mentors/profile` | Bearer JWT | ALUMNI, ADMIN | Create or update alumni mentor profile. |
| `POST` | `/mentorship/requests` | Bearer JWT | STUDENT, ASPIRANT, ADMIN | Submit 1-on-1 mentorship request to an alumni mentor. |
| `GET` | `/mentorship/requests` | Bearer JWT | All | List mentorship requests sent or received. |
| `PATCH` | `/mentorship/requests/:id`| Bearer JWT | ALUMNI, ADMIN | Accept or decline mentorship request. |
| `GET` | `/mentorship/sessions` | Bearer JWT | All | List scheduled mentorship sessions with meeting links. |
| `POST` | `/mentorship/sessions` | Bearer JWT | ALUMNI, ADMIN | Schedule a confirmed session with meeting URL. |
| `PATCH` | `/mentorship/sessions/:id`| Bearer JWT | ALUMNI, ADMIN | Update session notes or mark session completed. |

---

## 11. Conversations & Direct Messaging (`/conversations`, `/messages`)

| Method | Endpoint | Auth Required | Role | Description |
|---|---|---|---|---|
| `GET` | `/conversations` | Bearer JWT | All | List all active 1-on-1 and group conversations for user. |
| `POST` | `/conversations` | Bearer JWT | All | Start direct conversation with another user. |
| `GET` | `/conversations/:id/messages` | Bearer JWT | All | Fetch chronological chat messages for conversation. |
| `POST` | `/conversations/:id/messages` | Bearer JWT | All | Send direct message to conversation. |

---

## 12. Careers, Jobs & Referrals (`/jobs`, `/companies`, `/applications`, `/referrals`)

| Method | Endpoint | Auth Required | Role | Description |
|---|---|---|---|---|
| `GET` | `/jobs` | Bearer JWT | STUDENT, ALUMNI, ADMIN | Browse job and internship listings. |
| `GET` | `/jobs/recommended` | Bearer JWT | STUDENT, ALUMNI, ADMIN | Algorithmic job recommendations matching user profile. |
| `GET` | `/jobs/saved` | Bearer JWT | STUDENT, ALUMNI, ADMIN | List bookmarked jobs. |
| `GET` | `/jobs/:id` | Bearer JWT | STUDENT, ALUMNI, ADMIN | Get job description, salary range, requirements, and recruiter. |
| `POST` | `/jobs` | Bearer JWT | ALUMNI, ADMIN | Post job opening on behalf of hiring company. |
| `POST` | `/jobs/:id/save` | Bearer JWT | STUDENT, ALUMNI, ADMIN | Bookmark job opportunity. |
| `DELETE` | `/jobs/:id/save` | Bearer JWT | STUDENT, ALUMNI, ADMIN | Remove bookmark on job. |
| `POST` | `/jobs/:id/apply` | Bearer JWT | STUDENT, ALUMNI, ADMIN | Apply for job with resumeUrl and coverLetter. |
| `GET` | `/applications` | Bearer JWT | STUDENT, ALUMNI, ADMIN | Track status of user's submitted job applications. |
| `PATCH` | `/applications/:id/withdraw` | Bearer JWT | STUDENT, ALUMNI, ADMIN | Withdraw pending job application. |
| `GET` | `/companies` | Bearer JWT | STUDENT, ALUMNI, ADMIN | List hiring partner company profiles. |
| `GET` | `/companies/:id` | Bearer JWT | STUDENT, ALUMNI, ADMIN | Get company overview, website, and active job listings. |
| `GET` | `/referrals` | Bearer JWT | STUDENT, ALUMNI, ADMIN | List requested/given employee referrals. |
| `POST` | `/referrals` | Bearer JWT | STUDENT, ADMIN | Request internal job referral from alumni employee. |
| `PATCH` | `/referrals/:id` | Bearer JWT | ALUMNI, ADMIN | Accept, decline, or update referral status. |

---

## 13. Alumni Directory & Networking (`/alumni`)

| Method | Endpoint | Auth Required | Role | Description |
|---|---|---|---|---|
| `GET` | `/alumni` | Bearer JWT | All | Search alumni directory with filters (company, industry, gradYear). |
| `GET` | `/alumni/saved` | Bearer JWT | All | List saved alumni profiles. |
| `GET` | `/alumni/network/connections` | Bearer JWT | All | List accepted 1-on-1 connections and pending requests. |
| `GET` | `/alumni/network/activity` | Bearer JWT | All | Feed of alumni career milestones and platform activities. |
| `GET` | `/alumni/:id` | Bearer JWT | All | View public alumni profile, skills, experience, and mutual connections. |
| `POST` | `/alumni/:id/connect` | Bearer JWT | All | Send 1-on-1 connection request to alumni. |
| `PATCH` | `/alumni/connections/:id` | Bearer JWT | All | Accept or reject incoming connection request. |
| `DELETE` | `/alumni/connections/:id` | Bearer JWT | All | Disconnect existing connection. |
| `POST` | `/alumni/:id/save` | Bearer JWT | All | Bookmark alumni profile for future networking. |
| `DELETE` | `/alumni/:id/save` | Bearer JWT | All | Unsave alumni profile. |

---

## 14. Career Development & Upskilling (`/career`)

| Method | Endpoint | Auth Required | Role | Description |
|---|---|---|---|---|
| `GET` | `/career/roadmaps` | Bearer JWT | STUDENT, ALUMNI, ADMIN | Fetch personalized multi-stage career progression roadmaps. |
| `POST` | `/career/roadmaps` | Bearer JWT | STUDENT, ALUMNI, ADMIN | Initialize or update career roadmap. |
| `PATCH` | `/career/roadmaps/:id/milestones/:mId` | Bearer JWT | STUDENT, ALUMNI, ADMIN | Toggle completion status of roadmap milestone. |
| `GET` | `/career/skills` | Bearer JWT | STUDENT, ALUMNI, ADMIN | List technical skills, mastery levels, and assessment scores. |
| `POST` | `/career/skills` | Bearer JWT | STUDENT, ALUMNI, ADMIN | Upsert skill level and proficiency. |
| `GET` | `/career/interviews` | Bearer JWT | STUDENT, ALUMNI, ADMIN | Fetch past mock interview session transcripts and feedback scores. |
| `POST` | `/career/interviews` | Bearer JWT | STUDENT, ALUMNI, ADMIN | Record mock interview session result. |
| `GET` | `/career/preferences` | Bearer JWT | STUDENT, ALUMNI, ADMIN | Get career target preferences (roles, salary, location, hybrid/remote). |
| `PATCH` | `/career/preferences` | Bearer JWT | STUDENT, ALUMNI, ADMIN | Update career preferences and job alert toggles. |

---

## 15. Aspirant Admissions & College Explorer (`/aspirant`, `/colleges`, `/predictions`, `/scholarships`)

| Method | Endpoint | Auth Required | Role | Description |
|---|---|---|---|---|
| `GET` | `/aspirant/home` | Bearer JWT | ASPIRANT, ADMIN | Aspirant home dashboard (saved colleges count, predictions, scholarships). |
| `GET` | `/colleges` | Bearer JWT | ASPIRANT, ADMIN | Explore worldwide universities with search, ranking, and country filters. |
| `GET` | `/colleges/saved` | Bearer JWT | ASPIRANT, ADMIN | List bookmarked universities. |
| `GET` | `/colleges/:id` | Bearer JWT | ASPIRANT, ADMIN | Detailed institution profile, degree programs, cutoffs, tuition fees. |
| `POST` | `/colleges/:id/save` | Bearer JWT | ASPIRANT, ADMIN | Bookmark college. |
| `DELETE` | `/colleges/:id/save` | Bearer JWT | ASPIRANT, ADMIN | Unsave college. |
| `POST` | `/colleges/compare` | Bearer JWT | ASPIRANT, ADMIN | Side-by-side comparison of 2-4 colleges (fees, rankings, acceptance rates). |
| `POST` | `/predictions/predict` | Bearer JWT | ASPIRANT, ADMIN | Admission prediction engine evaluating GPA, JEE Main, or SAT against cutoffs. |
| `GET` | `/predictions/history` | Bearer JWT | ASPIRANT, ADMIN | History of generated admission predictions and status (REACH/COMPETITIVE/STRONG). |
| `GET` | `/scholarships` | Bearer JWT | ASPIRANT, ADMIN | Search scholarship directory (MERIT, NEED_BASED, WOMEN_IN_TECH). |
| `GET` | `/scholarships/saved` | Bearer JWT | ASPIRANT, ADMIN | List saved scholarships. |
| `GET` | `/scholarships/:id` | Bearer JWT | ASPIRANT, ADMIN | Get scholarship eligibility, deadline, grant amount, and apply link. |
| `POST` | `/scholarships/:id/save` | Bearer JWT | ASPIRANT, ADMIN | Save scholarship opportunity. |
| `DELETE` | `/scholarships/:id/save` | Bearer JWT | ASPIRANT, ADMIN | Unsave scholarship opportunity. |
| `GET` | `/aspirant/profile` | Bearer JWT | ASPIRANT, ADMIN | Get aspirant profile and entrance exam scores. |
| `PATCH` | `/aspirant/profile` | Bearer JWT | ASPIRANT, ADMIN | Update target universities, target major, and entrance exam scores. |

---

## 16. Artificial Intelligence Services (`/ai`)

| Method | Endpoint | Auth Required | Role | Description |
|---|---|---|---|---|
| `POST` | `/ai/study-assistant` | Bearer JWT | All | Academic AI Tutor (Gemini 1.5 Flash) assisting in coding, algorithms, and theory. |
| `POST` | `/ai/career-assistant` | Bearer JWT | All | Career Coach (Gemini 1.5 Flash) assisting in resume refinement, mock prep, STAR answers. |
| `POST` | `/ai/aspirant-recommendations` | Bearer JWT | ASPIRANT, ADMIN | Admission Advisor recommending universities and career tracks based on student scores. |

---

## 17. Trust, Safety & Notifications (`/reports`, `/notifications`)

| Method | Endpoint | Auth Required | Role | Description |
|---|---|---|---|---|
| `POST` | `/reports` | Bearer JWT | All | File moderation report against user, post, note, or marketplace item. |
| `GET` | `/reports/:id` | Bearer JWT | All | Fetch status of submitted report. |
| `GET` | `/notifications` | Bearer JWT | All | Fetch notifications feed (SYSTEM, CONNECTION, MENTORSHIP, APPLICATION). |
| `PATCH` | `/notifications/:id/read` | Bearer JWT | All | Mark notification as read. |

---

## 18. Admin Operations Center (`/admin`)

*Strictly requires `isAdminAuthorized === true` on the authenticated user.*

| Method | Endpoint | Auth Required | Role | Description |
|---|---|---|---|---|
| `GET` | `/admin/dashboard` | Bearer JWT | ADMIN | High-level system telemetry, user counts, uptime, and recent audit logs. |
| `GET` | `/admin/users` | Bearer JWT | ADMIN | Search, filter, and inspect all registered accounts across all roles. |
| `GET` | `/admin/users/:id` | Bearer JWT | ADMIN | Detailed user profile, security settings, and verification status. |
| `PATCH` | `/admin/users/:id/status` | Bearer JWT | ADMIN | Suspend/activate account or modify user role. |
| `POST` | `/admin/users/:id/reset-password` | Bearer JWT | ADMIN | Force reset user password and generate secure temporary credential. |
| `GET` | `/admin/verifications` | Bearer JWT | ADMIN | List pending student and alumni credential submissions. |
| `POST` | `/admin/verifications/:id/review` | Bearer JWT | ADMIN | Approve or reject verification with review audit notes. |
| `GET` | `/admin/reports` | Bearer JWT | ADMIN | View moderation queue of user-flagged content. |
| `POST` | `/admin/reports/:id/resolve` | Bearer JWT | ADMIN | Resolve safety report, issue warning, or ban target. |
| `GET` | `/admin/marketplace` | Bearer JWT | ADMIN | Inspect active marketplace listings across all campuses. |
| `PATCH` | `/admin/marketplace/:id/moderate` | Bearer JWT | ADMIN | Remove inappropriate marketplace items. |
| `GET` | `/admin/events` | Bearer JWT | ADMIN | Inspect all scheduled campus events. |
| `PATCH` | `/admin/events/:id/moderate` | Bearer JWT | ADMIN | Moderate or cancel scheduled campus events. |
| `GET` | `/admin/jobs` | Bearer JWT | ADMIN | Inspect all posted job opportunities. |
| `PATCH` | `/admin/jobs/:id/moderate` | Bearer JWT | ADMIN | Moderate or unlist job postings. |
| `GET` | `/admin/mentorship` | Bearer JWT | ADMIN | Inspect registered alumni mentors and mentorship activity. |
| `PATCH` | `/admin/mentorship/:id/moderate` | Bearer JWT | ADMIN | Approve or suspend mentor profiles. |
| `GET` | `/admin/announcements` | Bearer JWT | ADMIN | List system-wide broadcast announcements. |
| `POST` | `/admin/announcements` | Bearer JWT | ADMIN | Create high-priority banner or broadcast announcement. |
| `GET` | `/admin/settings` | Bearer JWT | ADMIN | Fetch platform feature toggles (maintenanceMode, openRegistrations). |
| `PATCH` | `/admin/settings` | Bearer JWT | ADMIN | Update global platform feature flags. |
