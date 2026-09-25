# CampusVerse — Production REST API Specification

## 1. Global Conventions

### Base URLs
- **Production (Render)**: `https://campusverse-backend.onrender.com/api/v1`
- **Local Development**: `http://localhost:4000/api/v1`

### Authentication & Authorization
Protected endpoints require an `Authorization` header containing a valid JSON Web Token (JWT):
```http
Authorization: Bearer <JWT_ACCESS_TOKEN>
```

Tokens are signed using `JWT_SECRET` with standard expiration (default 15 minutes for access tokens, 7 days for refresh tokens).

### Standard Response Envelope

#### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": { ... },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

#### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input provided.",
    "details": [
      {
        "field": "email",
        "message": "Invalid email address format."
      }
    ]
  }
}
```

---

## 2. API Endpoints Catalog

### 2.1. System & Health
| Method | Path | Auth | Roles | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/health` | Public | Any | System and database connectivity check |

**Example Response**:
```json
{
  "status": "HEALTHY",
  "database": "connected",
  "timestamp": "2026-09-24T08:25:00.000Z"
}
```

---

### 2.2. Authentication (`/auth`)
| Method | Path | Auth | Roles | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Public | Any | Create a new user account |
| `POST` | `/auth/login` | Public | Any | Authenticate and obtain access + refresh tokens |
| `POST` | `/auth/refresh` | Public | Any | Rotate expired access token using refresh token |
| `POST` | `/auth/forgot-password` | Public | Any | Trigger password reset verification email |
| `POST` | `/auth/reset-password` | Public | Any | Finalize password reset using email token |
| `GET` | `/auth/verify-email` | Public | Any | Verify account email address |

---

### 2.3. User Profiles & Preferences (`/profile`)
| Method | Path | Auth | Roles | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/profile/me` | Bearer | Any | Retrieve authenticated user profile with role metadata |
| `PUT` | `/profile/me` | Bearer | Any | Update profile details and role-specific sub-profiles |
| `GET` | `/profile/users/:id`| Bearer | Any | Retrieve public profile of another user |
| `GET` | `/profile/preferences` | Bearer | Any | Retrieve notification and privacy preferences |
| `PUT` | `/profile/preferences` | Bearer | Any | Update email & push notification preferences |

---

### 2.4. Projects & Portfolio (`/projects`)
| Method | Path | Auth | Roles | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/projects` | Bearer | Any | List public and accessible user projects (with search/tech filters) |
| `POST` | `/projects` | Bearer | Any | Create a new showcase project |
| `GET` | `/projects/:id` | Bearer | Any | Get project details, team members, and technologies |
| `PATCH` | `/projects/:id` | Bearer | Any | Update project details (owner or admin only) |
| `DELETE` | `/projects/:id` | Bearer | Any | Delete project (owner or admin only) |
| `POST` | `/projects/:id/members` | Bearer | Any | Add a contributor or mentor to project |
| `DELETE` | `/projects/:id/members/:memberId` | Bearer | Any | Remove project contributor |

---

### 2.5. Student & Academics (`/students`, `/academics`, `/courses`, `/notes`, `/library`)
| Method | Path | Auth | Roles | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/students/me/skills` | Bearer | STUDENT | List skills tagged to the authenticated student |
| `POST` | `/students/me/skills` | Bearer | STUDENT | Add a skill with proficiency level |
| `DELETE` | `/students/me/skills/:id` | Bearer | STUDENT | Remove a tagged skill |
| `GET` | `/students/me/academic-records` | Bearer | STUDENT | Retrieve official SGPA/CGPA semester records |
| `GET` | `/students/me/certifications` | Bearer | STUDENT | List professional certifications |
| `POST` | `/students/me/certifications` | Bearer | STUDENT | Register a new professional certification |
| `GET` | `/academics/me` | Bearer | STUDENT | Academic summary including institution and courses |
| `GET` | `/courses` | Bearer | Any | Catalog of academic courses |
| `GET` | `/notes` | Bearer | Any | Browse and search academic lecture notes |
| `POST` | `/notes` | Bearer | STUDENT, ALUMNI | Upload and share study notes |
| `POST` | `/notes/:id/download` | Bearer | Any | Increment download count and track metrics |
| `GET` | `/library` | Bearer | Any | Search physical and digital library catalog |

---

### 2.6. Mentorship Ecosystem (`/mentors`, `/mentorship`)
| Method | Path | Auth | Roles | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/mentors` | Bearer | Any | List alumni and mentors accepting mentees |
| `GET` | `/mentors/:id` | Bearer | Any | View mentor detailed profile and expertise |
| `POST` | `/mentorship/requests` | Bearer | ASPIRANT, STUDENT | Submit a formal mentorship request with goals |
| `PATCH` | `/mentorship/requests/:id`| Bearer | ALUMNI, ADMIN | Accept or decline mentorship request |
| `GET` | `/mentorship/sessions` | Bearer | Any | List upcoming and past mentorship video sessions |
| `PATCH` | `/mentorship/sessions/:id`| Bearer | Any | Update session notes, meeting URL, or status |
| `POST` | `/mentorship/sessions/:id/review` | Bearer | STUDENT, ASPIRANT | Submit 1-5 star review and qualitative feedback |

---

### 2.7. Aspirant & Admissions Intelligence (`/aspirant`, `/colleges`, `/predictions`, `/scholarships`)
| Method | Path | Auth | Roles | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/aspirant/home` | Bearer | ASPIRANT | Aspirant dashboard summary (saved colleges, tips) |
| `GET` | `/aspirant/profile` | Bearer | ASPIRANT | Target degree, scores, and dream colleges |
| `PATCH` | `/aspirant/profile` | Bearer | ASPIRANT | Update academic targets and scores |
| `GET` | `/aspirant/recommendations` | Bearer | ASPIRANT | Algorithmic college recommendation matches |
| `POST` | `/aspirant/recommendations/generate` | Bearer | ASPIRANT | Regenerate personalized admission recommendations |
| `GET` | `/aspirant/applications` | Bearer | ASPIRANT | List college admission applications |
| `POST` | `/aspirant/applications` | Bearer | ASPIRANT | Submit college admission application |
| `GET` | `/colleges` | Bearer | Any | Directory of colleges with filters and ranking |
| `GET` | `/colleges/:id` | Bearer | Any | Detailed college statistics, cutoffs, and fees |
| `POST` | `/colleges/compare` | Bearer | Any | Multi-college feature side-by-side comparison |
| `POST` | `/predictions/predict` | Bearer | Any | Calculate admission chance based on GPA/scores |
| `GET` | `/scholarships` | Bearer | Any | Browse scholarships by category and eligibility |

---

### 2.8. Alumni, Jobs & Careers (`/alumni`, `/careers`, `/jobs`)
| Method | Path | Auth | Roles | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/alumni/profile` | Bearer | ALUMNI | Alumni professional profile |
| `GET` | `/jobs` | Bearer | Any | Filter and search job and internship listings |
| `GET` | `/jobs/:id` | Bearer | Any | Detailed job listing with recruiter information |
| `POST` | `/jobs` | Bearer | ALUMNI, ADMIN | Post a new job or internship opportunity |
| `POST` | `/jobs/:id/apply` | Bearer | STUDENT, ALUMNI | Submit application with resume URL |
| `POST` | `/jobs/:id/referral` | Bearer | STUDENT | Request an employee referral from alumni |

---

### 2.9. Community & Campus Marketplace (`/communities`, `/marketplace`, `/conversations`)
| Method | Path | Auth | Roles | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/communities` | Bearer | Any | List student clubs and interest communities |
| `GET` | `/communities/:id` | Bearer | Any | Community posts and member directory |
| `POST` | `/communities/:id/join` | Bearer | Any | Join campus community |
| `POST` | `/communities/:id/posts` | Bearer | Any | Create a post within community |
| `POST` | `/posts/:id/comments` | Bearer | Any | Add comment to post |
| `POST` | `/posts/:id/like` | Bearer | Any | Upvote/like a post |
| `GET` | `/marketplace` | Bearer | Any | Browse peer-to-peer textbook and gear listings |
| `POST` | `/marketplace` | Bearer | Any | List an item for sale |
| `GET` | `/conversations` | Bearer | Any | User direct messages and chat channels |
| `POST` | `/conversations` | Bearer | Any | Start new conversation thread |
| `POST` | `/conversations/:id/messages` | Bearer | Any | Send direct message |

---

### 2.10. AI Assistant & Consultations (`/ai`)
| Method | Path | Auth | Roles | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/ai/study-assistant` | Bearer | STUDENT | Academic Q&A, algorithmic breakdown, study plans |
| `POST` | `/ai/career-assistant` | Bearer | ALUMNI, STUDENT | Career progression advice and interview coaching |
| `POST` | `/ai/aspirant-recommendations` | Bearer | ASPIRANT | Admissions guidance and college match rationale |
| `GET` | `/ai/sessions` | Bearer | Any | List previous AI consultation chat sessions |
| `POST` | `/ai/sessions` | Bearer | Any | Start a new contextual AI consultation session |
| `GET` | `/ai/sessions/:id` | Bearer | Any | Retrieve chat thread and previous assistant replies |
| `POST` | `/ai/sessions/:id/messages` | Bearer | Any | Send message to AI and receive generated response |
| `DELETE` | `/ai/sessions/:id` | Bearer | Any | Delete consultation session thread |

---

### 2.11. Admin & Governance (`/admin`)
| Method | Path | Auth | Roles | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/admin/metrics` | Bearer | ADMIN | System KPIs, user counts, and error rates |
| `GET` | `/admin/users` | Bearer | ADMIN | User management roster with status filters |
| `PATCH` | `/admin/users/:id/status` | Bearer | ADMIN | Suspend or activate user account |
| `GET` | `/admin/verifications` | Bearer | ADMIN | Pending student/alumni identity verifications |
| `POST` | `/admin/verifications/:id/review` | Bearer | ADMIN | Approve or reject verification submission |
| `GET` | `/admin/audit-logs` | Bearer | ADMIN | Immutable platform audit trail |
