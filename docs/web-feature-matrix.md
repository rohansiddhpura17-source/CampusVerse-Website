# CampusVerse Web Feature Matrix & Parity Inventory

**Audit Target:** Android Native App (`app/`) vs. Backend REST API (`backend/`) vs. CampusVerse Web Scope  
**Status Key:**
- **`WORKING`**: Full end-to-end integration verified (UI -> Repository -> REST API -> Prisma/Database).
- **`PARTIALLY WORKING`**: UI renders and network call is wired, but relies on local fallback when offline, or missing real-time synchronization.
- **`UI ONLY`**: Screen or component is rendered visually in Compose, but has no backing REST endpoint or repository network call.
- **`MISSING BACKEND`**: Feature exists in UI design or specification, but backend endpoint/Prisma model has not been implemented.
- **`BROKEN`**: Code or endpoint causes runtime failure or returns unhandled error codes.

---

## 1. Authentication, Onboarding & Shared Features

| Feature | Screen / Route (`Screen.kt`) | User Role | Navigation Origin | API Endpoint Used | Database Dependency | Current Status | Web Implementation Notes |
|---|---|---|---|---|---|:---:|---|
| Splash & Route Resolver | `Screen.Splash` (`splash`) | Public | App Launch | `GET /auth/me` | `User`, `Profile` | **WORKING** | Web landing router checking `localStorage`/Cookie JWT |
| Welcome & Hero Carousel | `Screen.Welcome` (`welcome`) | Public | Post-Splash | None | None | **WORKING** | Web landing page hero with modern CSS/Tailwind |
| Role Selection | `Screen.RoleSelection` (`role_selection`) | Public | Welcome | None | None | **WORKING** | Pre-registration role switcher cards |
| User Registration | `Screen.CreateAccount` (`create_account`) | Public | Role Selection | `POST /auth/register` | `User`, `Profile`, `PrivacySettings`, `SecuritySettings` | **WORKING** | Standard web form with role selector & client Zod validation |
| User Login | `Screen.Login` (`login`) | Public | Welcome / Create | `POST /auth/login` | `User` | **WORKING** | Form with email/password, sets auth context |
| OTP Verification | `Screen.Verification` (`verification`) | All | Register / Reset | `POST /auth/verify-otp`, `POST /auth/send-otp` | `OtpToken`, `User` | **WORKING** | 6-box OTP input with 60s cooldown timer |
| Verification Success | `Screen.VerificationSuccess` (`verification_success`) | All | Post-OTP | None | None | **WORKING** | Celebration modal redirecting to role dashboard |
| Forgot Password | `Screen.ForgotPassword` (`forgot_password`) | Public | Login | `POST /auth/forgot-password` | `User`, `OtpToken` | **WORKING** | Email submission form triggering OTP dispatch |
| Reset Password | `Screen.ResetPassword` (`reset_password`) | Public | Forgot Password | `POST /auth/reset-password` | `User`, `OtpToken` | **WORKING** | OTP entry + new password confirmation |
| Notifications Bell & Feed | Shared top bar | All | All Dashboards | `GET /notifications`, `PATCH /notifications/:id/read` | `Notification` | **WORKING** | Web dropdown popover with unread badge |
| Safety & Content Reporting | Report Dialog | All | Community / Market | `POST /reports` | `Report` | **WORKING** | Reusable modal dialog with violation reasons |

---

## 2. Student Module

| Feature | Screen / Route (`Screen.kt`) | User Role | Navigation Origin | API Endpoint Used | Database Dependency | Current Status | Web Implementation Notes |
|---|---|---|---|---|---|:---:|---|
| Student Home Dashboard | `Screen.StudentHome` (`student_home`) | STUDENT | Login / Splash | Multiple (`/academics/me`, `/events`, `/notes`) | `User`, `StudentProfile`, `Course`, `Event` | **WORKING** | Multi-widget overview dashboard with quick links |
| Academic Summary & CGPA | `Screen.Academics` (`student_academics`) | STUDENT | Bottom Nav | `GET /academics/me` | `StudentProfile`, `Institution`, `Course` | **WORKING** | Transcript summary card, GPA meter, course list |
| Course Catalog Search | `Screen.Academics` | STUDENT | Academics | `GET /courses` | `Course` | **WORKING** | Searchable grid with semester filter |
| Notes Hub Browser | `Screen.NotesHub` (`student_notes`) | STUDENT | Bottom Nav | `GET /notes` | `Note`, `Course`, `Profile` | **WORKING** | Filterable card list with tags and search |
| Note Upload | `Screen.NotesHub` (Upload Sheet) | STUDENT | Notes Hub | `POST /notes` | `Note` | **PARTIALLY WORKING** | Expects URL string; Web requires file upload/storage handler |
| Note Detail & Download | `Screen.NotesHub` | STUDENT | Notes Hub | `GET /notes/:id`, `POST /notes/:id/download` | `Note` | **WORKING** | PDF viewer modal or external tab download |
| Digital Library Catalog | `Screen.Library` (`student_library`) | STUDENT | Drawer / Quick Links| `GET /library` | `LibraryItem`, `Institution` | **WORKING** | Book cards with availability badge & shelf location |
| AI Study Tutor | `Screen.AiStudyAssistant` (`student_ai_assistant`) | STUDENT | Action Grid | `POST /ai/study-assistant` | Google Gemini 1.5 Flash | **WORKING** | Interactive chat interface with syntax highlighting |
| Campus Events Browser | `Screen.Events` (`student_events`) | STUDENT | Bottom Nav | `GET /events` | `Event`, `Institution` | **WORKING** | Calendar / Grid view with category filters |
| Event Registration | `Screen.Events` (Event Item) | STUDENT | Events | `POST /events/:id/register`, `DELETE /events/:id/register` | `EventRegistration`, `Event` | **WORKING** | Instant register/unregister toggle button |
| Campus Communities List | `Screen.CommunityList` (`student_communities`) | STUDENT | Bottom Nav | `GET /communities` | `Community`, `CommunityMember` | **WORKING** | Club discovery cards with member counts |
| Community Detail & Feed | `Screen.CommunityList` | STUDENT | Communities | `GET /communities/:id` | `Community`, `CommunityPost`, `CommunityComment` | **WORKING** | Feed timeline with post composer |
| Community Post Creation | `Screen.CommunityList` | STUDENT | Community Feed | `POST /communities/:id/posts` | `CommunityPost` | **WORKING** | Text area with post submission |
| Community Post Likes | `Screen.CommunityList` | STUDENT | Community Feed | `POST /posts/:id/like` | `CommunityPost` | **WORKING** | Optimistic like counter toggle |
| Community Comments | `Screen.CommunityList` | STUDENT | Post Item | `POST /posts/:id/comments` | `CommunityComment`, `CommunityPost` | **WORKING** | Nested comment thread |
| Marketplace Listings | `Screen.Marketplace` (`student_marketplace`) | STUDENT | Bottom Nav | `GET /marketplace` | `MarketplaceItem`, `User` | **WORKING** | E-commerce style product cards with search & category filters |
| Create Marketplace Item | `Screen.Marketplace` (Create Sheet) | STUDENT | Marketplace | `POST /marketplace` | `MarketplaceItem` | **WORKING** | Listing form with title, price, category, condition |
| Student Profile Management | `Screen.StudentProfile` (`student_profile`) | STUDENT | Top Bar / Nav | `GET /users/profile`, `PATCH /users/profile/student` | `Profile`, `StudentProfile` | **WORKING** | Editable profile form (Bio, major, semester, CGPA) |
| Student Settings | `Screen.StudentSettings` (`student_settings`) | STUDENT | Profile / Drawer | `GET/PATCH /users/privacy-settings`, `security-settings` | `PrivacySettings`, `SecuritySettings` | **WORKING** | Settings toggle panels |

---

## 3. Aspirant Module

| Feature | Screen / Route (`Screen.kt`) | User Role | Navigation Origin | API Endpoint Used | Database Dependency | Current Status | Web Implementation Notes |
|---|---|---|---|---|---|:---:|---|
| Aspirant Home Dashboard | `Screen.AspirantHome` (`aspirant_home`) | ASPIRANT | Login / Splash | `GET /aspirant/home` | `AspirantProfile`, `SavedCollege`, `SavedScholarship`, `AdmissionPrediction` | **WORKING** | Stats overview (saved colleges, scholarships, predictions) |
| College Explorer | `Screen.AspirantCollegeExplorer` (`aspirant_colleges`) | ASPIRANT | Bottom Nav | `GET /colleges` | `Institution`, `CollegeProgram` | **WORKING** | Institution search with country, degree, ranking filters |
| College Detail Profile | `Screen.AspirantCollegeExplorer` | ASPIRANT | College List | `GET /colleges/:id` | `Institution`, `CollegeProgram` | **WORKING** | Campus size, fees, degree programs, cutoffs |
| Save / Unsave College | `Screen.AspirantCollegeExplorer` | ASPIRANT | College Item | `POST /colleges/:id/save`, `DELETE /colleges/:id/save` | `SavedCollege` | **WORKING** | Bookmark button with instant state update |
| College Comparison Tool | `Screen.AspirantCollegeComparison` (`aspirant_college_comparison`) | ASPIRANT | Explorer Action | `POST /colleges/compare` | `Institution`, `CollegeProgram` | **WORKING** | Side-by-side comparison table (fees, rankings, acceptance) |
| Admission Predictor Engine | `Screen.AspirantPredictor` (`aspirant_predictor`) | ASPIRANT | Bottom Nav | `POST /predictions/predict` | `AdmissionPrediction`, `Institution`, `CollegeProgram` | **WORKING** | Interactive form: GPA + JEE/SAT score calculation |
| Prediction Results & History | `Screen.AspirantPredictionResults` (`aspirant_prediction_results`) | ASPIRANT | Predictor / History | `GET /predictions/history` | `AdmissionPrediction` | **WORKING** | Gauge chart (0-100%) + Qualification badge (STRONG/COMPETITIVE/REACH) |
| Scholarships Directory | `Screen.AspirantScholarships` (`aspirant_scholarships`) | ASPIRANT | Bottom Nav | `GET /scholarships` | `Scholarship` | **WORKING** | Filterable cards by category (MERIT, NEED, WOMEN_IN_TECH) |
| Save / Unsave Scholarship | `Screen.AspirantScholarships` | ASPIRANT | Scholarship Item| `POST /scholarships/:id/save`, `DELETE /scholarships/:id/save` | `SavedScholarship` | **WORKING** | Bookmark toggle for financial aid opportunities |
| Saved Scholarships View | `Screen.AspirantSavedScholarships` (`aspirant_saved_scholarships`) | ASPIRANT | Scholarships Tab| `GET /scholarships/saved` | `SavedScholarship`, `Scholarship` | **WORKING** | Filtered view of bookmarked grants |
| AI Admission Advisor | `Screen.AspirantAiRecommendations` (`aspirant_ai_recommendations`) | ASPIRANT | Action Bar | `POST /ai/aspirant-recommendations` | Google Gemini 1.5 Flash | **WORKING** | Recommendations based on GPA and exam scores |
| Aspirant Profile & Scores | `Screen.AspirantProfile` (`aspirant_profile`) | ASPIRANT | Top Bar | `GET /aspirant/profile`, `PATCH /aspirant/profile` | `AspirantProfile` | **WORKING** | Profile form for target schools, exams (JEE/SAT/IELTS) |
| Aspirant Settings | `Screen.AspirantSettings` (`aspirant_settings`) | ASPIRANT | Drawer | `GET/PATCH /users/privacy-settings`, `security-settings` | `PrivacySettings`, `SecuritySettings` | **WORKING** | Settings toggle panels |

---

## 4. Alumni Module

| Feature | Screen / Route (`Screen.kt`) | User Role | Navigation Origin | API Endpoint Used | Database Dependency | Current Status | Web Implementation Notes |
|---|---|---|---|---|---|:---:|---|
| Alumni Home Dashboard | `Screen.AlumniHome` (`alumni_home`) | ALUMNI | Login / Splash | `GET /auth/me`, `GET /jobs/recommended`, `GET /events` | `User`, `AlumniProfile`, `Job`, `Event` | **WORKING** | Comprehensive career and mentorship summary |
| Alumni Directory Search | `Screen.AlumniNetwork` (`alumni_network`) | ALUMNI | Bottom Nav | `GET /alumni` | `AlumniProfile`, `User`, `Institution` | **WORKING** | Searchable directory by company, industry, grad year |
| Alumni Profile Detail | `Screen.AlumniProfileDetail` (`alumni_profile_detail/{id}`) | ALUMNI | Directory | `GET /alumni/:id` | `AlumniProfile`, `User`, `SkillProgress` | **WORKING** | Experience timeline, skills list, mutual connections |
| 1-on-1 Connection Requests | `Screen.AlumniConnections` (`alumni_connections`) | ALUMNI | Network Tab | `POST /alumni/:id/connect`, `GET /alumni/network/connections` | `UserConnection` | **WORKING** | Send request, incoming requests queue with Accept/Decline |
| Network Activity Feed | `Screen.AlumniNetwork` | ALUMNI | Network Tab | `GET /alumni/network/activity` | `AuditLog`, `Job`, `Event` | **WORKING** | Social feed of promotions and new opportunities |
| Bookmark Alumni | `Screen.AlumniNetwork` | ALUMNI | Alumni Profile | `POST /alumni/:id/save`, `DELETE /alumni/:id/save` | `SavedAlumni` | **WORKING** | Save profile bookmark button |
| Job Board Browser | `Screen.AlumniCareers` (`alumni_careers`) | ALUMNI | Bottom Nav | `GET /jobs`, `GET /jobs/recommended` | `Job`, `Company`, `User` | **WORKING** | Job listings with remote filter, salary tag |
| Job Details & Apply | `Screen.AlumniJobDetails` (`alumni_job_details/{id}`) | ALUMNI | Job Board | `GET /jobs/:id`, `POST /jobs/:id/apply` | `Job`, `JobApplication` | **WORKING** | Job description, apply modal with resumeUrl |
| Post a Job Opening | `Screen.AlumniCareers` (Post Job) | ALUMNI | Careers Action | `POST /jobs` | `Job`, `Company` | **WORKING** | Multi-field job posting form |
| Saved Jobs & Bookmarks | `Screen.AlumniSavedJobs` (`alumni_saved_jobs`) | ALUMNI | Careers Tab | `GET /jobs/saved`, `POST/DELETE /jobs/:id/save` | `SavedJob`, `Job` | **WORKING** | Bookmarked jobs management |
| Application Tracking | `Screen.AlumniApplicationTracking` (`alumni_applications`) | ALUMNI | Careers Tab | `GET /applications`, `PATCH /applications/:id/withdraw` | `JobApplication`, `Job` | **WORKING** | Status tracker (APPLIED, INTERVIEWING, OFFER, WITHDRAWN) |
| Company Profiles & Openings | `Screen.AlumniCompanyProfile` (`alumni_company_profile/{id}`) | ALUMNI | Job / Directory| `GET /companies/:id` | `Company`, `Job` | **WORKING** | Company profile with linked open roles |
| Referral Requests & Status | `Screen.AlumniReferrals` (`alumni_referrals`) | ALUMNI | Careers Tab | `GET /referrals`, `POST /referrals`, `PATCH /referrals/:id` | `Referral`, `Job`, `User` | **WORKING** | Give or request employee referrals |
| Mentorship Directory | `Screen.AlumniMentorship` (`alumni_mentorship`) | ALUMNI | Bottom Nav | `GET /mentors`, `GET /mentors/:id` | `MentorProfile`, `User` | **WORKING** | Mentor cards with expertise tags and hourly rate |
| Mentor Profile Setup | `Screen.AlumniMentorship` (Edit Profile) | ALUMNI | Mentorship | `POST /mentors/profile` | `MentorProfile` | **WORKING** | Profile form for expertise, bio, and mentee capacity |
| Mentorship Requests Queue | `Screen.AlumniMentorshipRequests` (`alumni_mentorship_requests`)| ALUMNI | Mentorship | `GET /mentorship/requests`, `PATCH /mentorship/requests/:id` | `MentorshipRequest` | **WORKING** | Accept/decline incoming student mentee requests |
| Mentorship Session Scheduler| `Screen.AlumniSessionDetails` (`alumni_session_details/{id}`) | ALUMNI | Mentorship | `GET /mentorship/sessions`, `POST /mentorship/sessions` | `MentorshipSession` | **WORKING** | Schedule confirmed call with meetingUrl and notes |
| Direct Messaging & Chats | `Screen.AlumniMessages` (`alumni_messages`), `Screen.AlumniChat` | ALUMNI | Drawer / Top Nav| `GET/POST /conversations`, `GET/POST /conversations/:id/messages` | `Conversation`, `Message` | **PARTIALLY WORKING** | REST-based polling. No WebSockets currently. |
| AI Career Coach | `Screen.AlumniAiCareerAssistant` (`alumni_ai_career_assistant`) | ALUMNI | Action Grid | `POST /ai/career-assistant` | Google Gemini 1.5 Flash | **WORKING** | AI coach for resume review and STAR responses |
| Career Progression Roadmap | `Screen.AlumniCareerRoadmap` (`alumni_career_roadmap`) | ALUMNI | Career Dev | `GET/POST /career/roadmaps`, `PATCH milestones` | `CareerRoadmap` | **WORKING** | Interactive quarterly milestone progress tracker |
| Skill Development Matrix | `Screen.AlumniSkillDevelopment` (`alumni_skill_development`) | ALUMNI | Career Dev | `GET/POST /career/skills` | `SkillProgress` | **WORKING** | Skill cards with level (BEGINNER/INTERMEDIATE/EXPERT) |
| Mock Interview Transcripts | `Screen.AlumniInterviewPrep` (`alumni_interview_prep`) | ALUMNI | Career Dev | `GET/POST /career/interviews` | `InterviewSession` | **WORKING** | Feedback evaluation with strengths & improvement notes |
| Career Preferences & Alerts | `Screen.AlumniCareerPreferences` (`alumni_career_preferences`) | ALUMNI | Settings | `GET/PATCH /career/preferences` | `CareerPreference` | **WORKING** | Target role, salary, and remote preference toggles |

---

## 5. Admin Module

| Feature | Screen / Route (`Screen.kt`) | User Role | Navigation Origin | API Endpoint Used | Database Dependency | Current Status | Web Implementation Notes |
|---|---|---|---|---|---|:---:|---|
| Admin Dedicated Login | `Screen.AdminLogin` (`admin_login`) | ADMIN | Route /auth/admin | `POST /auth/login` | `User` | **WORKING** | Checks `role === 'ADMIN'` & `isAdminAuthorized === true` |
| Admin Dashboard Telemetry | `Screen.AdminDashboard` (`admin_dashboard`) | ADMIN | Admin Login | `GET /admin/dashboard` | Aggregates 10+ models, `AuditLog` | **WORKING** | High-level KPI metrics (Users, Verifications, Reports, Uptime) |
| User Management Table | `Screen.AdminUserManagement` (`admin_users`) | ADMIN | Dashboard Tab | `GET /admin/users`, `GET /admin/users/:id` | `User`, `Profile`, `Verification` | **WORKING** | Searchable table with role, status, verification filters |
| Suspend / Activate User | `Screen.AdminUserManagement` | ADMIN | User Actions | `PATCH /admin/users/:id/status` | `User`, `AuditLog` | **WORKING** | Modal to suspend/reinstate account with reason |
| Force Reset User Password | `Screen.AdminUserManagement` | ADMIN | User Actions | `POST /admin/users/:id/reset-password` | `User`, `AuditLog` | **WORKING** | Generates temporary password displayed in modal |
| Verification Review Queue | `Screen.AdminVerification` (`admin_verification`) | ADMIN | Dashboard Tab | `GET /admin/verifications`, `POST review` | `Verification`, `User`, `Profile` | **WORKING** | Document viewer with Approve / Reject modal |
| Trust & Safety Reports Queue| `Screen.AdminReports` (`admin_reports`) | ADMIN | Dashboard Tab | `GET /admin/reports`, `POST resolve` | `Report`, `AuditLog` | **WORKING** | Moderation queue with resolution action selector |
| Marketplace Moderation | `Screen.AdminMarketplace` (`admin_marketplace`) | ADMIN | Dashboard Tab | `GET /admin/marketplace`, `PATCH moderate` | `MarketplaceItem`, `AuditLog` | **WORKING** | Unlist or remove offending marketplace items |
| Campus Events Moderation | `Screen.AdminEvents` (`admin_events`) | ADMIN | Dashboard Tab | `GET /admin/events`, `PATCH moderate` | `Event`, `AuditLog` | **WORKING** | Cancel or modify scheduled events |
| Job Postings Moderation | `Screen.AdminJobs` (`admin_jobs`) | ADMIN | Dashboard Tab | `GET /admin/jobs`, `PATCH moderate` | `Job`, `AuditLog` | **WORKING** | Delist or verify job postings |
| Mentorship Moderation | `Screen.AdminMentorship` (`admin_mentorship`) | ADMIN | Dashboard Tab | `GET /admin/mentorship`, `PATCH moderate` | `MentorProfile`, `AuditLog` | **WORKING** | Approve or suspend mentor visibility |
| System Announcements | `Screen.AdminAnnouncements` (`admin_announcements`) | ADMIN | Dashboard Tab | `GET/POST /admin/announcements` | `Announcement`, `AuditLog` | **WORKING** | Create broadcast announcements with priority badge |
| Platform System Settings | `Screen.AdminSettings` (`admin_settings`) | ADMIN | Dashboard Tab | `GET/PATCH /admin/settings` | In-memory / Database config | **WORKING** | Maintenance mode toggle and registration controls |
