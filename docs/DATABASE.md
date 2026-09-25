# CampusVerse — Production Database Architecture & Operations Guide

## 1. Overview & Architecture

CampusVerse utilizes **Supabase PostgreSQL** as its primary relational and transactional persistence layer. The database is designed with third-normal-form (3NF) principles, strictly enforced foreign keys with appropriate referential actions (`CASCADE`, `SET NULL`, `RESTRICT`), indexed access paths, and defense-in-depth security via **Row Level Security (RLS)**.

```
                           +---------------------------+
                           |     CampusVerse Clients   |
                           |  (Next.js Web / Android)  |
                           +-------------+-------------+
                                         |
                                         | HTTPS / REST
                                         v
                           +---------------------------+
                           |  Express + TypeScript     |
                           |       API Backend         |
                           +-------------+-------------+
                                         |
                       +-----------------+-----------------+
                       |                                   |
         Prisma ORM (Port 6543)                 Direct Migrations (Port 5432)
         PgBouncer Transaction Pool             Session Mode (Direct Connection)
                       |                                   |
                       v                                   v
             +-------------------+               +-------------------+
             | Pooler (PgBouncer)|               |  PostgreSQL Engine|
             +---------+---------+               +---------+---------+
                       |                                   ^
                       +-----------------------------------+
```

---

## 2. Supabase Connection Topology & Configuration

Supabase provides two distinct endpoints for PostgreSQL database access:

| Endpoint | Port | Protocol / Mode | Primary Use Case | Environment Variable |
| :--- | :--- | :--- | :--- | :--- |
| **PgBouncer Transaction Pooler** | `6543` | `transaction` (`?pgbouncer=true`) | Application runtime (Express backend, API queries, high concurrency) | `DATABASE_URL` |
| **Direct PostgreSQL Engine** | `5432` | `session` (Direct TCP) | Schema migrations (`prisma migrate`), DDL executions, RLS deployments | `DIRECT_URL` |

### Recommended Production Connection Parameters
```env
# Runtime connection pooling for Express API
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=20&pool_timeout=10"

# Direct URL used strictly for Prisma Migrate & CLI operations
DIRECT_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres?sslmode=require"
```

### Connection Pool Sizing
- **Free / Starter Tier**: Maximum 20 pooled connections per node.
- **Connection Timeout**: 10 seconds.
- **Query Timeout**: Max 5000ms for OLTP queries; complex reports batched asynchronously.

---

## 3. Normalized Database Schema by Domain

The production database is organized into 13 cohesive domain subsystems:

### 3.1. Authentication & Security
- `User`: Core identity entity storing `email`, `passwordHash`, `role` (`STUDENT`, `ALUMNI`, `ASPIRANT`, `ADMIN`), status flags (`isActive`, `isEmailVerified`, `isAdminAuthorized`), and verification metadata.
- `SecuritySettings`: User security preferences including `twoFactorEnabled`, `twoFactorSecret`, and `loginAlertsEnabled`.
- `PrivacySettings`: Profile visibility toggles (`showEmail`, `showPhone`, `allowMessagesFrom`, `allowMentorshipRequests`).

### 3.2. User Profiles & Subsystems
- `Profile`: Shared persona details (`fullName`, `avatarUrl`, `headline`, `bio`, `location`, `social links`).
- `StudentProfile`: Linked to `Institution`, stores `studentIdNumber`, `degree`, `major`, `semester`, `cgpa`, `graduationYear`.
- `AlumniProfile`: Stores `graduationYear`, `currentCompany`, `currentDesignation`, `industry`, `yearsOfExperience`, `willingToMentor`, `willingToRefer`.
- `AspirantProfile`: Stores `targetDegree`, `targetMajor`, `targetUniversities`, `highSchool`, `expectedGradYear`, `entranceExamScores`.
- `AdminProfile`: Stores `department`, `accessLevel`, `employeeId`.
- `NotificationPreference`: Per-user communication toggles for email and push notifications.

### 3.3. Academic Infrastructure
- `Institution`: Verified universities and colleges with ranking, acceptance rate, accreditation, and fees.
- `Department`: Academic divisions within institutions (`Computer Science`, `Electrical Engineering`).
- `Semester`: Academic terms with dates and term numbers (`Spring 2026`).
- `Subject`: Course offerings associated with departments and semesters (`Distributed Systems CS301`).
- `Course`: Legacy course mapping for Android/Web catalog backward compatibility.
- `Enrollment`: Active and historical student subject enrollments with status (`ENROLLED`, `COMPLETED`, `DROPPED`).
- `Grade`: Modular grading records per enrollment (`MIDTERM`, `FINAL`, `ASSIGNMENT`).
- `AcademicRecord`: Official term summary records tracking `sgpa`, `cgpa`, `totalCredits`, `earnedCredits`.
- `Note`: Academic resource sharing with download tracking, ratings, and course tagging.
- `LibraryItem`: Catalog of physical and digital campus library volumes.

### 3.4. Skills & Competencies
- `Skill`: Standardized taxonomy of technical and domain skills.
- `StudentSkill`: User-acquired skills with `proficiencyLevel` (`BEGINNER`, `INTERMEDIATE`, `ADVANCED`, `EXPERT`), verification flags, and endorsement counts.
- `SkillProgress`: Alumni career skill tracking and assessment scores.

### 3.5. Projects, Portfolio & Showcase
- `Project`: Showcase projects with descriptions, demo links, GitHub repositories, and visibility toggles.
- `ProjectMember`: Multi-user project contributors with role permissions (`OWNER`, `CONTRIBUTOR`, `MENTOR`).
- `ProjectTechnology`: Technologies utilized by each project.
- `ProjectLink`: External links (documentation, live deployments, slides).
- `Achievement`: Hackathon awards, honors, and academic recognitions.
- `Certification`: Professional certifications (`Google Associate Android Developer`, `AWS Certified Cloud Practitioner`) with credential IDs.

### 3.6. Aspirant & Admissions Intelligence
- `CollegeProgram`: Specific degree tracks per institution with cutoffs, tuition fees, and entrance exams.
- `CollegePreference`: Aspirant target preferences (degree, major, budget, locations).
- `CollegeRecommendation`: Algorithmic and AI-driven institution recommendations with match scores and reasoning.
- `CollegeApplication`: Aspirant college admission application tracker (`DRAFT`, `SUBMITTED`, `ACCEPTED`, `REJECTED`).
- `EntranceExam`: Standardized entrance tests and scores (`JEE_MAIN`, `JEE_ADVANCED`, `SAT`, `BITSAT`, `GRE`).
- `AdmissionPrediction`: Historical acceptance probability calculations.
- `SavedCollege`: Aspirant bookmarked universities.
- `SavedScholarship`: Aspirant bookmarked scholarships.

### 3.7. Scholarships & Financial Aid
- `Scholarship`: Merit, need-based, and demographic scholarship offerings with eligibility criteria and application links.
- `ScholarshipApplication`: Application tracker for internal and partner scholarship offerings.

### 3.8. Alumni Career & Placement
- `EmploymentRecord`: Chronological employment history of alumni.
- `HigherEducationRecord`: Post-graduate degree history of alumni.
- `AlumniAchievement`: Patents, publications, and career milestones.
- `Company`: Employer directory with verification status and industry classification.
- `Job`: Job and internship opportunities posted by alumni and recruiters.
- `JobApplication`: Job application records with resumes and interview status.
- `SavedJob`: User bookmarked employment listings.
- `Referral`: Employee referral requests between students and alumni.
- `CareerRoadmap`: Structured progression milestones for career advancement.
- `CareerPreference`: Target roles, compensation brackets, and relocation preferences.
- `InterviewSession`: Mock technical and behavioral interview transcripts and ratings.

### 3.9. Mentorship Ecosystem
- `MentorProfile`: Mentorship availability, expertise keywords, hourly rates, and average rating.
- `MentorshipRequest`: Formal mentorship applications with goals and review status (`PENDING`, `ACCEPTED`, `DECLINED`).
- `MentorshipSession`: Scheduled sessions with calendar integration and meeting URLs.
- `MentorshipReview`: Mentee post-session ratings (1-5 stars) and qualitative feedback.

### 3.10. Campus Life, Marketplace & Community
- `Community`: Academic, hobby, and professional campus clubs.
- `CommunityMember`: Membership rosters with admin and member roles.
- `CommunityPost`: Discussions and articles within communities.
- `CommunityComment`: Threaded post replies.
- `MarketplaceItem`: Student peer-to-peer textbook and gadget sales (`AVAILABLE`, `PENDING`, `SOLD`).
- `MarketplaceTransaction`: Recorded marketplace purchase agreements.
- `Event`: Hackathons, webinars, and cultural events.
- `EventRegistration`: Student event tickets and attendance tracking.

### 3.11. Messaging & Notifications
- `Conversation`: Direct 1-on-1 and group communication channels.
- `ConversationParticipant`: Channel membership rosters.
- `Message`: Encrypted text messages with read receipts.
- `UserConnection`: Peer professional connections (`PENDING`, `ACCEPTED`, `BLOCKED`).
- `Notification`: In-app notification queue.

### 3.12. AI Consultation & Chat Subsystem
- `AIChatSession`: AI consultation threads categorized by `agentType` (`STUDY_TUTOR`, `CAREER_COUNSELOR`, `ADMISSIONS_ADVISOR`).
- `AIChatMessage`: Conversational turns with token usage metadata.
- `AIRecommendation`: Stored recommendation summaries and rationale.
- `CareerReadinessScore`: Computed technical, soft skill, and resume scoring metrics.

### 3.13. Governance, Audit & Documents
- `Document`: Secure cloud document storage registry (transcripts, IDs, resumes, verification proofs).
- `Verification`: Multi-tier identity verification submissions for students and alumni.
- `Report`: Abuse and moderation flags on posts, notes, and messages.
- `ModerationRecord`: Administrative moderation actions taken (`WARNED`, `CONTENT_REMOVED`, `SUSPENDED`).
- `AuditLog`: Immutable administrator and security action audit trail.
- `Announcement`: Platform-wide administrative announcements.

---

## 4. Indexing & Query Performance Optimization

All high-traffic queries and relational joins are supported by composite and B-Tree indexes:

```sql
-- Fast user lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Academic enrollments & records
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_subject ON enrollments(subject_id);
CREATE INDEX idx_academic_records_student ON academic_records(student_id);

-- Project showcase
CREATE INDEX idx_projects_owner ON projects(owner_id);
CREATE INDEX idx_project_members_project ON project_members(project_id);

-- Mentorship sessions & reviews
CREATE INDEX idx_mentorship_requests_mentor ON mentorship_requests(mentor_id);
CREATE INDEX idx_mentorship_requests_mentee ON mentorship_requests(mentee_id);
CREATE INDEX idx_mentorship_reviews_mentor ON mentorship_reviews(mentor_id);

-- Community & Messaging
CREATE INDEX idx_community_posts_community ON community_posts(community_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- AI consultations
CREATE INDEX idx_ai_chat_sessions_user ON ai_chat_sessions(user_id);
CREATE INDEX idx_ai_chat_messages_session ON ai_chat_messages(session_id);
```

---

## 5. Row-Level Security (RLS) Strategy

Row Level Security is configured across all sensitive tables via migration `database/migrations/010_rls_policies.sql`.

### Core RLS Principles
1. **Service Role Bypass**: The backend Express API connects using the Supabase service role / direct database credentials to execute business logic, validation, and aggregations.
2. **Direct Client Access Control**: If client SDKs (Supabase JS) query PostgreSQL directly, RLS restricts access to `auth.uid() = user_id`.
3. **Role-Based Policies**: Administrative queries require `auth.jwt() ->> 'role' = 'ADMIN'`.

---

## 6. Migration Execution Workflow

### Applying Migrations via Prisma
When the database is connected via `DIRECT_URL`:
```bash
# Inside CampusVerse/backend/
npx prisma migrate deploy
```

### Applying Modular SQL Migrations
Migrations are sequentially numbered under `database/migrations/`:
```bash
# In psql or Supabase SQL Editor:
\i database/migrations/001_initial_schema.sql
\i database/migrations/002_academic_system.sql
\i database/migrations/003_aspirant_system.sql
\i database/migrations/004_alumni_system.sql
\i database/migrations/005_events.sql
\i database/migrations/006_mentorship.sql
\i database/migrations/007_ai_system.sql
\i database/migrations/008_notifications.sql
\i database/migrations/009_admin_audit.sql
\i database/migrations/010_rls_policies.sql
```

---

## 7. Seeding & Development Safety Guard

The seed script (`prisma/seed.ts`) populates 4 fully configured test personas:
- **Student**: `student@campusverse.edu` (`Password123`)
- **Alumni**: `alumni@campusverse.edu` (`Password123`)
- **Aspirant**: `aspirant@campusverse.edu` (`Password123`)
- **Admin**: `admin@campusverse.edu` (`Password123`)

### Production Guard
The seed script includes an explicit, non-bypassable environment check:
```typescript
if (process.env.NODE_ENV === 'production') {
  console.error('CRITICAL ERROR: Seed script execution is strictly FORBIDDEN in PRODUCTION environment.');
  process.exit(1);
}
```

---

## 8. Backup, Disaster Recovery & PITR Playbook

### Daily Automated Backups
Supabase performs automated daily backups with write-ahead log (WAL) archiving.

### Manual Dump Procedure
To create an offsite logical backup before major releases:
```bash
pg_dump -h aws-0-ap-south-1.pooler.supabase.com \
        -p 5432 \
        -U postgres.[PROJECT_REF] \
        -d postgres \
        -F c -b -v \
        -f "campusverse_backup_$(date +%Y%m%d_%H%M%S).dump"
```

### Restore Procedure
```bash
pg_restore -h aws-0-ap-south-1.pooler.supabase.com \
           -p 5432 \
           -U postgres.[PROJECT_REF] \
           -d postgres \
           -v "campusverse_backup_20260924.dump"
```

---

## 9. Health Checks & Database Monitoring

The API provides an integrated database connectivity check at:
`GET /api/v1/health`

### Healthy Response
```json
{
  "status": "HEALTHY",
  "database": "connected",
  "timestamp": "2026-09-24T08:24:00.000Z"
}
```

If the database is unreachable or timing out (>2000ms), the endpoint gracefully returns `"database": "disconnected"` while maintaining HTTP 200 so platform load balancers and uptime probes can monitor service degradation without cascade dropping traffic.
