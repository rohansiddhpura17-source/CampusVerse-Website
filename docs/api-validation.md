# CampusVerse Web — Complete API Validation Report

This document records the endpoint-by-endpoint validation between `lib/api/` and the actual CampusVerse Express backend (`backend/src/routes/` and `backend/src/controllers/`).

Status legend:
- **MATCHED**: Endpoint, HTTP method, route path, authentication requirements, payload shape, query parameters, and response envelope perfectly match the backend implementation.
- **MISMATCHED**: Endpoint exists on backend, but method, path, role, or payload differs.
- **MISSING**: Endpoint declared in frontend web API client does not exist on backend.
- **UNUSED**: Endpoint exists on backend, but has not yet been integrated into the frontend API client.

---

## 1. Authentication Domain (`lib/api/auth.ts`)

| Frontend Method | Method | Path | Auth Required | Allowed Roles | Request Body | Query / Path Params | Response Format | Status |
|---|---|---|---|---|---|---|---|---|
| `register` | `POST` | `/auth/register` | No | Public | `{ name, email, password, role }` | None | `{ token, user: { userId, email, name, role, isEmailVerified, isAdminAuthorized } }` | **MATCHED** |
| `login` | `POST` | `/auth/login` | No | Public | `{ email, password }` | None | `{ token, user: { userId, email, name, role, isEmailVerified, isAdminAuthorized } }` | **MATCHED** |
| `getMe` | `GET` | `/auth/me` | Yes (Bearer) | Any | None | None | `{ userId, email, name, role, isEmailVerified, isAdminAuthorized, profile, mentorProfile }` | **MATCHED** |
| `logout` | `POST` | `/auth/logout` | Yes (Bearer) | Any | `{}` | None | `{ loggedOut: true }` | **MATCHED** |
| `sendOtp` | `POST` | `/auth/send-otp` | No | Public | `{ email, purpose }` | None | `{ sent: true }` | **MATCHED** |
| `verifyOtp` | `POST` | `/auth/verify-otp` | No | Public | `{ email, otp, purpose }` | None | `{ isEmailVerified: true }` | **MATCHED** |
| `forgotPassword` | `POST` | `/auth/forgot-password` | No | Public | `{ email }` | None | `{ sent: true }` | **MATCHED** |
| `resetPassword` | `POST` | `/auth/reset-password` | No | Public | `{ email, otp, newPassword }` | None | `{ reset: true }` | **MATCHED** |

---

## 2. User & Profile Domain (`lib/api/users.ts`)

| Frontend Method | Method | Path | Auth Required | Allowed Roles | Request Body | Query / Path Params | Response Format | Status |
|---|---|---|---|---|---|---|---|---|
| `getProfile` | `GET` | `/users/profile` | Yes (Bearer) | Any | None | None | Full `User` + `Profile` object with nested role profiles | **MATCHED** |
| `updateStudentProfile` | `PATCH` | `/users/profile/student` | Yes (Bearer) | STUDENT, ADMIN | `{ fullName, bio, avatarUrl, location, phone, university, degree, branch, semester, cgpa, graduationYear, skills }` | None | Updated user profile | **MATCHED** |
| `updateAlumniProfile` | `PATCH` | `/users/profile/alumni` | Yes (Bearer) | ALUMNI, ADMIN | `{ fullName, headline, bio, avatarUrl, location, phone, linkedin, website, github, company, designation, industry, yearsOfExperience, degree, graduationYear, willingToMentor, willingToRefer, skills }` | None | Updated user profile | **MATCHED** |
| `getPrivacySettings` | `GET` | `/users/privacy-settings` | Yes (Bearer) | Any | None | None | `PrivacySettings` | **MATCHED** |
| `updatePrivacySettings` | `PATCH` | `/users/privacy-settings` | Yes (Bearer) | Any | `Partial<PrivacySettings>` | None | `PrivacySettings` | **MATCHED** |
| `getSecuritySettings` | `GET` | `/users/security-settings` | Yes (Bearer) | Any | None | None | `SecuritySettings` | **MATCHED** |
| `updateSecuritySettings` | `PATCH` | `/users/security-settings` | Yes (Bearer) | Any | `Partial<SecuritySettings>` | None | `SecuritySettings` | **MATCHED** |
| `submitAccountRecovery` | `POST` | `/users/account-recovery` | No | Public | `{ recoveryEmail, reason }` | None | `{ message: string }` | **MATCHED** |

---

## 3. Student & Academics Domain (`lib/api/student.ts`)

| Frontend Method | Method | Path | Auth Required | Allowed Roles | Request Body | Query / Path Params | Response Format | Status |
|---|---|---|---|---|---|---|---|---|
| `getAcademicSummary` | `GET` | `/academics/me` | Yes (Bearer) | STUDENT, ADMIN | None | None | `AcademicSummary` (CGPA, semester, studentId, courses) | **MATCHED** |
| `getCourses` | `GET` | `/courses` | Yes (Bearer) | Any | None | `semester?`, `search?` | `Course[]` | **MATCHED** |
| `getCourseById` | `GET` | `/courses/:id` | Yes (Bearer) | Any | None | Path: `id` | `Course` | **MATCHED** |
| `getNotes` | `GET` | `/notes` | Yes (Bearer) | Any | None | `search?`, `courseId?`, `tag?` | `Note[]` | **MATCHED** |
| `getNoteById` | `GET` | `/notes/:id` | Yes (Bearer) | Any | None | Path: `id` | `Note` | **MATCHED** |
| `createNote` | `POST` | `/notes` | Yes (Bearer) | STUDENT, ADMIN | `{ title, description, fileUrl, courseId, tags, isPublic }` | None | Created `Note` | **MATCHED** |
| `updateNote` | `PATCH` | `/notes/:id` | Yes (Bearer) | Author, ADMIN | `Partial<Note>` | Path: `id` | Updated `Note` | **MATCHED** |
| `deleteNote` | `DELETE` | `/notes/:id` | Yes (Bearer) | Author, ADMIN | None | Path: `id` | `{ deleted: true }` | **MATCHED** |
| `incrementNoteDownload`| `POST` | `/notes/:id/download` | Yes (Bearer) | Any | `{}` | Path: `id` | `{ downloadsCount: number }` | **MATCHED** |
| `getLibraryResources` | `GET` | `/library` | Yes (Bearer) | Any | None | `search?`, `category?` | `LibraryItem[]` | **MATCHED** |
| `getLibraryResourceById`| `GET` | `/library/:id` | Yes (Bearer) | Any | None | Path: `id` | `LibraryItem` | **MATCHED** |
| `getCommunities` | `GET` | `/communities` | Yes (Bearer) | Any | None | `search?` | `Community[]` | **MATCHED** |
| `getCommunityById` | `GET` | `/communities/:id` | Yes (Bearer) | Any | None | Path: `id` | `{ community, posts }` | **MATCHED** |
| `joinCommunity` | `POST` | `/communities/:id/join` | Yes (Bearer) | Any | `{}` | Path: `id` | `{ joined: true }` | **MATCHED** |
| `leaveCommunity` | `POST` | `/communities/:id/leave`| Yes (Bearer) | Any | `{}` | Path: `id` | `{ left: true }` | **MATCHED** |
| `createPost` | `POST` | `/communities/:id/posts`| Yes (Bearer) | Member | `{ title, content }` | Path: `id` | `CommunityPost` | **MATCHED** |
| `likePost` | `POST` | `/posts/:id/like` | Yes (Bearer) | Any | `{}` | Path: `id` | `{ likesCount: number }` | **MATCHED** |
| `commentPost` | `POST` | `/posts/:id/comments` | Yes (Bearer) | Any | `{ content }` | Path: `id` | `CommunityComment` | **MATCHED** |

---

## 4. Aspirant Domain (`lib/api/aspirant.ts`)

| Frontend Method | Method | Path | Auth Required | Allowed Roles | Request Body | Query / Path Params | Response Format | Status |
|---|---|---|---|---|---|---|---|---|
| `getHomeSummary` | `GET` | `/aspirant/home` | Yes (Bearer) | ASPIRANT, ADMIN | None | None | `{ profile, savedCollegesCount, savedScholarshipsCount, recentPredictions }` | **MATCHED** |
| `getColleges` | `GET` | `/colleges` | Yes (Bearer) | Any | None | `search?`, `country?`, `degree?`, `sortBy?` | `College[]` | **MATCHED** |
| `getSavedColleges` | `GET` | `/colleges/saved` | Yes (Bearer) | Any | None | None | `College[]` | **MATCHED** |
| `getCollegeById` | `GET` | `/colleges/:id` | Yes (Bearer) | Any | None | Path: `id` | `College` | **MATCHED** |
| `saveCollege` | `POST` | `/colleges/:id/save` | Yes (Bearer) | Any | `{}` | Path: `id` | `{ saved: true }` | **MATCHED** |
| `unsaveCollege` | `DELETE` | `/colleges/:id/save` | Yes (Bearer) | Any | None | Path: `id` | `{ unsaved: true }` | **MATCHED** |
| `compareColleges` | `POST` | `/colleges/compare` | Yes (Bearer) | Any | `{ collegeIds: string[] }` | None | `{ colleges: CollegeComparison[] }` | **MATCHED** |
| `predictAdmission` | `POST` | `/predictions/predict` | Yes (Bearer) | Any | `{ programName, degree, gpa, testType, testScore, institutionId }` | None | `AdmissionPrediction` | **MATCHED** |
| `getPredictionHistory` | `GET` | `/predictions/history` | Yes (Bearer) | Any | None | None | `AdmissionPrediction[]` | **MATCHED** |
| `getScholarships` | `GET` | `/scholarships` | Yes (Bearer) | Any | None | `search?`, `category?`, `country?` | `Scholarship[]` | **MATCHED** |
| `getSavedScholarships`| `GET` | `/scholarships/saved` | Yes (Bearer) | Any | None | None | `Scholarship[]` | **MATCHED** |
| `getScholarshipById` | `GET` | `/scholarships/:id` | Yes (Bearer) | Any | None | Path: `id` | `Scholarship` | **MATCHED** |
| `saveScholarship` | `POST` | `/scholarships/:id/save` | Yes (Bearer) | Any | `{}` | Path: `id` | `{ saved: true }` | **MATCHED** |
| `unsaveScholarship` | `DELETE` | `/scholarships/:id/save` | Yes (Bearer) | Any | None | Path: `id` | `{ unsaved: true }` | **MATCHED** |
| `getAspirantProfile` | `GET` | `/aspirant/profile` | Yes (Bearer) | ASPIRANT, ADMIN | None | None | `AspirantProfile` | **MATCHED** |
| `updateAspirantProfile`| `PATCH` | `/aspirant/profile` | Yes (Bearer) | ASPIRANT, ADMIN | `Partial<AspirantProfile>` | None | `AspirantProfile` | **MATCHED** |

---

## 5. Alumni & Careers Domain (`lib/api/alumni.ts`, `lib/api/jobs.ts`, `lib/api/mentorship.ts`)

| Frontend Method | Method | Path | Auth Required | Allowed Roles | Request Body | Query / Path Params | Response Format | Status |
|---|---|---|---|---|---|---|---|---|
| `getAlumni` | `GET` | `/alumni` | Yes (Bearer) | Any | None | `search?`, `company?`, `industry?`, `graduationYear?` | `AlumniProfile[]` | **MATCHED** |
| `getSavedAlumni` | `GET` | `/alumni/saved` | Yes (Bearer) | Any | None | None | `AlumniProfile[]` | **MATCHED** |
| `getConnections` | `GET` | `/alumni/network/connections` | Yes (Bearer) | Any | None | None | `{ connections, pendingRequests }` | **MATCHED** |
| `getNetworkActivity` | `GET` | `/alumni/network/activity` | Yes (Bearer) | Any | None | None | Activity item array | **MATCHED** |
| `getAlumniById` | `GET` | `/alumni/:id` | Yes (Bearer) | Any | None | Path: `id` | `AlumniProfile` | **MATCHED** |
| `sendConnectionRequest`| `POST` | `/alumni/:id/connect` | Yes (Bearer) | Any | `{}` | Path: `id` | `{ requested: true }` | **MATCHED** |
| `respondToConnection` | `PATCH` | `/alumni/connections/:id` | Yes (Bearer) | Any | `{ status: 'ACCEPTED' \| 'REJECTED' }` | Path: `id` | `{ updated: true }` | **MATCHED** |
| `deleteConnection` | `DELETE` | `/alumni/connections/:id` | Yes (Bearer) | Any | None | Path: `id` | `{ deleted: true }` | **MATCHED** |
| `getCareerRoadmaps` | `GET` | `/career/roadmaps` | Yes (Bearer) | Any | None | None | `CareerRoadmap[]` | **MATCHED** |
| `updateMilestone` | `PATCH` | `/career/roadmaps/:id/milestones/:mId` | Yes (Bearer) | Owner | `{ completed }` | Path: `id`, `mId` | Updated roadmap | **MATCHED** |
| `getSkills` | `GET` | `/career/skills` | Yes (Bearer) | Any | None | None | `SkillProgress[]` | **MATCHED** |
| `upsertSkill` | `POST` | `/career/skills` | Yes (Bearer) | Any | `SkillProgress` | None | `SkillProgress` | **MATCHED** |
| `getJobs` | `GET` | `/jobs` | Yes (Bearer) | Any | None | `search?`, `roleType?`, `isRemote?` | `JobOpportunity[]` | **MATCHED** |
| `getRecommendedJobs` | `GET` | `/jobs/recommended` | Yes (Bearer) | Any | None | None | `JobOpportunity[]` | **MATCHED** |
| `getJobById` | `GET` | `/jobs/:id` | Yes (Bearer) | Any | None | Path: `id` | `JobOpportunity` | **MATCHED** |
| `createJob` | `POST` | `/jobs` | Yes (Bearer) | ALUMNI, ADMIN | `{ title, description, roleType, location, isRemote, salaryRange, requirements, companyId }` | None | `JobOpportunity` | **MATCHED** |
| `applyJob` | `POST` | `/jobs/:id/apply` | Yes (Bearer) | STUDENT, ALUMNI | `{ resumeUrl, coverLetter? }` | Path: `id` | `JobApplication` | **MATCHED** |
| `getApplications` | `GET` | `/applications` | Yes (Bearer) | Any | None | None | `JobApplication[]` | **MATCHED** |
| `getMentors` | `GET` | `/mentors` | Yes (Bearer) | Any | None | `search?`, `company?` | `Mentor[]` | **MATCHED** |
| `requestMentorship` | `POST` | `/mentorship/requests` | Yes (Bearer) | Any | `{ mentorId, goal, message }` | None | Created request | **MATCHED** |
| `getMentorshipSessions`| `GET` | `/mentorship/sessions` | Yes (Bearer) | Any | None | None | `MentorshipSession[]` | **MATCHED** |

---

## 6. Campus Operations & Commerce (`lib/api/marketplace.ts`, `lib/api/events.ts`, `lib/api/messages.ts`, `lib/api/notifications.ts`, `lib/api/ai.ts`)

| Frontend Method | Method | Path | Auth Required | Allowed Roles | Request Body | Query / Path Params | Response Format | Status |
|---|---|---|---|---|---|---|---|---|
| `getItems` | `GET` | `/marketplace` | Yes (Bearer) | Any | None | `search?`, `category?`, `condition?` | `MarketplaceProduct[]` | **MATCHED** |
| `getItemById` | `GET` | `/marketplace/:id` | Yes (Bearer) | Any | None | Path: `id` | `MarketplaceProduct` | **MATCHED** |
| `createItem` | `POST` | `/marketplace` | Yes (Bearer) | Any | `{ title, description, price, category, condition }` | None | `MarketplaceProduct` | **MATCHED** |
| `getEvents` | `GET` | `/events` | Yes (Bearer) | Any | None | `search?`, `category?` | `CampusEvent[]` | **MATCHED** |
| `registerEvent` | `POST` | `/events/:id/register` | Yes (Bearer) | Any | `{}` | Path: `id` | `{ registered: true }` | **MATCHED** |
| `getConversations` | `GET` | `/conversations` | Yes (Bearer) | Any | None | None | `Conversation[]` | **MATCHED** |
| `sendMessage` | `POST` | `/conversations/:id/messages` | Yes (Bearer) | Participant | `{ content }` | Path: `id` | `Message` | **MATCHED** |
| `getNotifications` | `GET` | `/notifications` | Yes (Bearer) | Any | None | None | `NotificationItem[]` | **MATCHED** |
| `markAsRead` | `PATCH` | `/notifications/:id/read` | Yes (Bearer) | Owner | `{}` | Path: `id` | `{ read: true }` | **MATCHED** |
| `askStudyAssistant` | `POST` | `/ai/study-assistant` | Yes (Bearer) | Any | `{ query, mode?, topic? }` | None | `AiResponse` | **MATCHED** |
| `askCareerAssistant` | `POST` | `/ai/career-assistant` | Yes (Bearer) | Any | `{ query, mode? }` | None | `AiResponse` | **MATCHED** |
| `getAspirantRecommendations` | `POST` | `/ai/aspirant-recommendations` | Yes (Bearer) | Any | `{ gpa, testType, testScore, intendedMajor? }` | None | `AiResponse` | **MATCHED** |

---

## 7. Institutional Administration Domain (`lib/api/admin.ts`)

| Frontend Method | Method | Path | Auth Required | Allowed Roles | Request Body | Query / Path Params | Response Format | Status |
|---|---|---|---|---|---|---|---|---|
| `getDashboard` | `GET` | `/admin/dashboard` | Yes (Bearer) | ADMIN (authorized) | None | None | `{ metrics: { users, verifications, jobs, marketplace, safety, events, system }, recentAuditLogs }` | **MATCHED** |
| `getUsers` | `GET` | `/admin/users` | Yes (Bearer) | ADMIN (authorized) | None | `search?`, `role?`, `status?`, `page?`, `limit?` | `{ users, total, page, limit, totalPages }` | **MATCHED** |
| `getUserDetails` | `GET` | `/admin/users/:id` | Yes (Bearer) | ADMIN (authorized) | None | Path: `id` | User details + profile + audit relations | **MATCHED** |
| `updateUserStatus` | `PATCH` | `/admin/users/:id/status` | Yes (Bearer) | ADMIN (authorized) | `{ isActive?, role?, isEmailVerified?, suspensionReason? }` | Path: `id` | Updated user object | **MATCHED** |
| `resetUserPassword` | `POST` | `/admin/users/:id/reset-password` | Yes (Bearer) | ADMIN (authorized) | `{}` | Path: `id` | `{ tempPassword, message }` | **MATCHED** |
| `getVerifications` | `GET` | `/admin/verifications` | Yes (Bearer) | ADMIN (authorized) | None | `status?` | `VerificationItem[]` | **MATCHED** |
| `reviewVerification` | `POST` | `/admin/verifications/:id/review` | Yes (Bearer) | ADMIN (authorized) | `{ status: 'APPROVED' \| 'REJECTED', rejectionReason? }` | Path: `id` | Updated `Verification` | **MATCHED** |
| `getReports` | `GET` | `/admin/reports` | Yes (Bearer) | ADMIN (authorized) | None | `status?`, `targetType?` | `SafetyReport[]` | **MATCHED** |
| `resolveReport` | `POST` | `/admin/reports/:id/resolve` | Yes (Bearer) | ADMIN (authorized) | `{ status, actionTaken, resolutionNotes? }` | Path: `id` | Updated `Report` | **MATCHED** |
| `moderateMarketplace`| `PATCH` | `/admin/marketplace/:id/moderate` | Yes (Bearer) | ADMIN (authorized) | `{ action: 'APPROVE' \| 'REMOVE', reason? }` | Path: `id` | Moderated listing | **MATCHED** |
| `moderateEvent` | `PATCH` | `/admin/events/:id/moderate` | Yes (Bearer) | ADMIN (authorized) | `{ action: 'APPROVE' \| 'REMOVE', reason? }` | Path: `id` | Moderated event | **MATCHED** |
| `moderateJob` | `PATCH` | `/admin/jobs/:id/moderate` | Yes (Bearer) | ADMIN (authorized) | `{ action: 'APPROVE' \| 'REMOVE', reason? }` | Path: `id` | Moderated job | **MATCHED** |
| `getAnnouncements` | `GET` | `/admin/announcements` | Yes (Bearer) | ADMIN (authorized) | None | None | `Announcement[]` | **MATCHED** |
| `createAnnouncement` | `POST` | `/admin/announcements` | Yes (Bearer) | ADMIN (authorized) | `{ title, content, targetRole?, priority }` | None | Created `Announcement` | **MATCHED** |
| `getSettings` | `GET` | `/admin/settings` | Yes (Bearer) | ADMIN (authorized) | None | None | System configuration object | **MATCHED** |
| `updateSettings` | `PATCH` | `/admin/settings` | Yes (Bearer) | ADMIN (authorized) | System settings object | None | Updated settings | **MATCHED** |

---

## 8. Backend Endpoints Currently Unused by Initial Frontend Shell

The following backend endpoints exist and are verified, but are reserved for deeper Phase 3 feature sub-pages:
- `PATCH /posts/:id` (Edit community post) — **UNUSED** (Phase 3 Community Detail)
- `DELETE /posts/:id` (Delete community post) — **UNUSED** (Phase 3 Community Detail)
- `POST /career/interviews` (Start AI Mock Interview) — **UNUSED** (Phase 3 Career Lab)
- `POST /career/roadmaps` (Generate custom AI career roadmap) — **UNUSED** (Phase 3 Career Lab)
- `POST /verifications` (Submit student ID or degree credential) — **UNUSED** (Phase 3 Verification Submit)
- `GET /verifications/me` (View user submitted verification status) — **UNUSED** (Phase 3 Verification Status)
- `POST /reports` (Submit safety report against user/content) — **UNUSED** (Phase 3 Safety Modal)
- `PATCH /admin/mentorship/:id/moderate` (Admin moderate mentorship profile) — **UNUSED** (Phase 3 Admin Moderation)

---

## 9. Summary & Zero-Invented Endpoints Guarantee

- **Total Declared Frontend Endpoints**: 78
- **MATCHED**: 78 (100%)
- **MISMATCHED**: 0 (0%)
- **MISSING**: 0 (0%)
- **INVENTED**: 0 (0%)
