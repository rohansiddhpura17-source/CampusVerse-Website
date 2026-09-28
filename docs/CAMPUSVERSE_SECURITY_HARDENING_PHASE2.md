# CampusVerse — Phase 2 Security Hardening: CSP & Security Headers

**Document Version:** 2.1.0  
**Phase:** 2 — Content Security Policy & HTTP Security Headers Hardening  
**Date:** September 28, 2026  
**Target Repository:** [`CampusVerse-Website`](https://github.com/rohansiddhpura17-source/CampusVerse-Website)  
**Configuration File:** [`next.config.mjs`](file:///Users/rohansiddhpura/Documents/campuswebsite/next.config.mjs)  

---

## 1. Executive Summary & Security Boundary

In Phase 2, the web application's Content Security Policy (CSP) and HTTP security response headers were hardened in [`next.config.mjs`](file:///Users/rohansiddhpura/Documents/campuswebsite/next.config.mjs) to eliminate dangerous wildcards (`https://*` and `https:`), remove obsolete legacy backend origins, remove localhost development endpoints from production, remove redundant Supabase subdomains, and ensure development HTTP calls are not broken by insecure request upgrading.

> [!IMPORTANT]
> **Authoritative Security Boundary Principle:**  
> **Backend RBAC is the authoritative security boundary.**  
> Frontend route guards (`components/guards/route-guards.tsx`) and the browser Content Security Policy provide **defense-in-depth and UX navigation guidance only**. The actual authoritative authorization boundary remains the server-side Express middleware (`auth.middleware.ts` and `rbac.middleware.ts`) enforcing cryptographic JWT verification and database-backed permission validation on every request.

---

## 2. Policy Definitions

### Full Production CSP String
```text
default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://images.unsplash.com https://eaqwchuugwaeaftjzfnf.supabase.co https://*.googleusercontent.com; font-src 'self' data:; connect-src 'self' https://campusverse-api-k5ny.onrender.com https://eaqwchuugwaeaftjzfnf.supabase.co; worker-src 'self' blob:; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests
```

### Full Development CSP String
```text
default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://images.unsplash.com https://eaqwchuugwaeaftjzfnf.supabase.co https://*.googleusercontent.com; font-src 'self' data:; connect-src 'self' http://localhost:4000 http://127.0.0.1:4000 https://campusverse-api-k5ny.onrender.com https://eaqwchuugwaeaftjzfnf.supabase.co; worker-src 'self' blob:; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'
```

### Previous Baseline CSP (Phase 1 Baseline):
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

---

## 3. Directives & Allowed Origin Justification Matrix

Every directive and origin permitted in the production and development policies is mapped to a verified runtime requirement:

| Directive | Allowed Origin / Source | Environment | Component / File Using It | Technical Justification |
| :--- | :--- | :---: | :--- | :--- |
| **`default-src`** | `'self'` | Both | Core Next.js assets | Fallback restriction for all undeclared resource types to same origin. |
| **`script-src`** | `'self'` | Both | Next.js client bundles | Allows loading first-party compiled JavaScript chunks from `/_next/static/*`. |
| **`script-src`** | `'unsafe-inline'` | Both | Next.js 14 App Router | Required for Next.js SSR inline hydration scripts (`self.__next_f.push(...)`). |
| **`script-src`** | `'unsafe-eval'` | Dev Only | Webpack HMR / Fast Refresh | Required solely for Webpack eval-source-maps in `next dev`. **Removed in Production.** |
| **`style-src`** | `'self'` | Both | Next.js CSS bundles | Allows loading first-party compiled stylesheets from `/_next/static/css/*`. |
| **`style-src`** | `'unsafe-inline'` | Both | Tailwind CSS & dynamic styles | Required for inline CSS style attributes (e.g., dynamic progress bar widths, toast animations). |
| **`img-src`** | `'self'` | Both | App static icons & logos | Allows first-party static image assets located in `/public`. |
| **`img-src`** | `data:` | Both | Lucide icons / SVGs | Required for inline base64 image placeholders and SVG icons. |
| **`img-src`** | `blob:` | Both | `components/ui/file-upload.tsx` | Required for client-side image preview URLs generated via `URL.createObjectURL()`. |
| **`img-src`** | `https://images.unsplash.com` | Both | `backend/prisma/seed.ts` | Allows loading seed images for company logos and campus photography. |
| **`img-src`** | `https://eaqwchuugwaeaftjzfnf.supabase.co` | Both | User avatars & documents | Verified exact production Supabase project bucket URL for profile avatars and attachments. |
| **`img-src`** | `https://*.googleusercontent.com` | Both | User profile photos | Allows user avatar photos hosted on Google user content domains (`lh3-lh6.googleusercontent.com`). |
| **`font-src`** | `'self'` | Both | System fonts | Allows same-origin font files. |
| **`font-src`** | `data:` | Both | Embedded font assets | Allows base64 embedded icon fonts. |
| **`connect-src`** | `'self'` | Both | Next.js RSC fetches | Allows React Server Component data payload fetches to same origin. |
| **`connect-src`** | `https://campusverse-api-k5ny.onrender.com` | Both | `lib/api/client.ts` | Canonical production REST backend API (`NEXT_PUBLIC_API_URL`). |
| **`connect-src`** | `https://eaqwchuugwaeaftjzfnf.supabase.co` | Both | Supabase storage & API | Verified exact Supabase project API and storage endpoint. |
| **`connect-src`** | `http://localhost:4000` | Dev Only | `lib/api/client.ts` | Local backend development server. **Removed in Production.** |
| **`connect-src`** | `http://127.0.0.1:4000` | Dev Only | `lib/api/client.ts` | Local backend development server IPv4 alias. **Removed in Production.** |
| **`worker-src`** | `'self' blob:` | Both | Client-side workers | Isolates web worker execution contexts to same origin and local blobs. |
| **`frame-ancestors`** | `'none'` | Both | Root layout | Completely disables framing/embedding in iframes (anti-clickjacking). |
| **`object-src`** | `'none'` | Both | Global | Disables legacy browser plugins (Flash, Java applets). |
| **`base-uri`** | `'self'` | Both | Global | Prevents unauthorized injection of `<base>` tags altering link targets. |
| **`form-action`** | `'self'` | Both | Forms | Restricts form submissions strictly to the same origin. |
| **`upgrade-insecure-requests`** | N/A | Prod Only | Production environment | Automatically upgrades insecure HTTP URLs to HTTPS. **Omitted in Development** to protect local HTTP API endpoints (`http://localhost:4000`). |

---

## 4. HTTP Security Headers Configured

All HTTP responses configured in [`next.config.mjs`](file:///Users/rohansiddhpura/Documents/campuswebsite/next.config.mjs) include the following 6 headers:

```javascript
[
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=(), usb=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
  },
  {
    key: 'Content-Security-Policy',
    value: cspDirectives.join('; '),
  },
]
```

---

## 5. Architectural Rationales & Intentional Allowances

### Why `upgrade-insecure-requests` is Production-Only
- **Development Risk:** In local development, the frontend connects to `http://localhost:4000` and `http://127.0.0.1:4000`. The local development Express server does not serve TLS/HTTPS.
- **Browser Behavior:** If `upgrade-insecure-requests` is delivered in development, user agents (Chrome, Safari, Firefox) automatically rewrite outgoing `http://localhost:4000/...` API fetches to `https://localhost:4000/...`, immediately breaking local development with `ERR_SSL_PROTOCOL_ERROR` or connection refusals.
- **Resolution:** `upgrade-insecure-requests` is appended only when `process.env.NODE_ENV !== 'development'`.

### Why `*.supabase.co` Was Removed
- **Investigation:** A comprehensive code search across both repositories confirmed that the production Supabase project reference is strictly `eaqwchuugwaeaftjzfnf`. The database connects over TCP port 6543 to `aws-0-ap-south-1.pooler.supabase.com` from the backend Node process only (never accessed by client browsers).
- **Concrete Usage:** The only Supabase hostname contacted by client browsers is `https://eaqwchuugwaeaftjzfnf.supabase.co`.
- **Resolution:** Wildcard `https://*.supabase.co` was removed from CSP (`img-src` and `connect-src`) and from Next.js `images.remotePatterns`.

### Why `*.googleusercontent.com` Was Retained
- **Investigation:** Production database inspection confirmed 0 users currently have a populated `avatarUrl`. In the codebase, Google avatars are served dynamically by Google across regional and load-balanced subdomains (`lh3.googleusercontent.com`, `lh4.googleusercontent.com`, `lh5.googleusercontent.com`, `lh6.googleusercontent.com`).
- **Evidence Assessment:** No single, specific subdomain (e.g. `lh3` alone) is designated or guaranteed by Google's avatar delivery infrastructure. Restricting to a single arbitrary hostname would break avatars assigned by Google to other shards.
- **Resolution:** Per safety instructions, `https://*.googleusercontent.com` is preserved without speculative modification.

### Why `unsafe-inline` Remains in `script-src` and `style-src`
1. **Next.js 14 App Router Hydration:** Next.js 14 App Router streams React Server Component payloads and page data by injecting inline `<script>` tags containing `self.__next_f.push(...)`.
2. **Hydration Breakdown Without Nonce Architecture:** Removing `'unsafe-inline'` from `script-src` without implementing dynamic, per-request cryptographic nonces (via custom Next.js Edge Middleware rewriting script tags on the fly) immediately breaks client-side React hydration on every page, rendering interactive buttons, modals, and forms non-functional.
3. **Tailwind CSS & Dynamic Styling:** Tailwind CSS and component libraries inject inline dynamic style properties (e.g., progress bar percentages, dynamic flex widths, toast alert positioning). Removing `'unsafe-inline'` from `style-src` breaks UI layout and animated components.
4. **Conclusion:** `'unsafe-inline'` is intentionally retained for architectural compatibility until a nonce-generating Edge Middleware pipeline is evaluated in a future phase.

### Why `unsafe-eval` is Development-Only
1. **Webpack HMR & Fast Refresh:** During local development (`next dev`), Webpack uses `eval()`-based source maps to enable sub-second hot module reloading and source mapping in browser DevTools.
2. **Production Elimination:** In production builds (`next build`), Next.js pre-compiles all JavaScript chunks as static minified assets that do not require runtime code evaluation.
3. **Implementation:** `next.config.mjs` inspects `process.env.NODE_ENV === 'development'`. When false (production, staging, test, or unset), the policy strictly omits `'unsafe-eval'`.

### Why the Legacy Backend Was Removed
- **Endpoint Identified:** `https://campusverse-backend-api.onrender.com`
- **Reason for Removal:** Classified during Phase 1 as a stale/legacy Render deployment superseded by `https://campusverse-api-k5ny.onrender.com`. Retaining it in `connect-src` would permit outbound network requests to a superseded server. It has been completely purged from the CSP configuration.

### Why Localhost Origins Were Removed from Production CSP
- **Endpoints Identified:** `http://localhost:4000`, `http://127.0.0.1:4000`
- **Reason for Removal:** In production, the application is accessed over public HTTPS and connects exclusively to the canonical cloud API. Permitting localhost network targets in production provides zero functional benefit and needlessly expands the network attack surface.
- **Implementation:** Localhost origins are now conditionally appended to `connect-src` only when `NODE_ENV === 'development'`.

### Why Speculative Headers Were Removed
- **`Cross-Origin-Opener-Policy` (COOP):** Removed because the application does not utilize cross-origin window opener features requiring cross-origin isolation. Speculative headers without documented operational needs introduce compatibility risks with authentication redirects.
- **`X-DNS-Prefetch-Control`:** Removed because modern browsers automatically manage DNS prefetching, and adding non-standard legacy directives without concrete requirements adds unnecessary overhead.

---

## 6. Threat Model Reality & Known Limitations

> [!CAUTION]
> ### Accurate Threat Model & Limitations Statement
> - **XSS and Token Exfiltration:**  
>   Because `script-src` retains `'unsafe-inline'`, this Content Security Policy cannot be described as an absolute defense against Cross-Site Scripting (XSS). If an attacker successfully injects and executes arbitrary inline JavaScript, the script executes within the origin context.
> - **Scope of Hardened CSP:**  
>   The hardened CSP **restricts permitted outbound destinations and reduces the impact of unauthorized network requests.** By pinning `connect-src` strictly to `https://campusverse-api-k5ny.onrender.com` and `https://eaqwchuugwaeaftjzfnf.supabase.co`, compromised scripts cannot use standard browser network APIs (`fetch`, `XMLHttpRequest`, `sendBeacon`) to transmit stolen data to arbitrary external domains.
> - **JWT Storage in `localStorage`:**  
>   Authentication tokens currently reside in browser `localStorage` (`campusverse_token`). While the hardened CSP restricts unauthorized network destinations, `localStorage` remains readable by any script executing in the same origin. Migration of token storage to `HttpOnly`, `SameSite=Strict` secure cookies is scheduled for a future authentication architecture phase.
> - **Security Boundary Reiteration:**  
>   **Backend RBAC is the authoritative security boundary.** Client-side route guards and CSP are defense-in-depth only.

---

## 7. Verification & Testing Performed

1. **TypeScript Static Analysis:**
   - Command: `npm run typecheck` (`tsc --noEmit`)
   - Result: **PASS (0 errors)**.
2. **Direct Configuration Evaluation (Production Mode):**
   - Command: `NODE_ENV=production node -e 'import("./next.config.mjs").then(async m => console.log(await m.default.headers()))'`
   - Result: **PASS** — Emits production CSP with `upgrade-insecure-requests`, no `'unsafe-eval'`, no `localhost`, no `127.0.0.1`, no `*.supabase.co`, and no legacy backend.
3. **Direct Configuration Evaluation (Development Mode):**
   - Command: `NODE_ENV=development node -e 'import("./next.config.mjs").then(async m => console.log(await m.default.headers()))'`
   - Result: **PASS** — Emits development CSP with `'unsafe-eval'`, `localhost:4000`, `127.0.0.1:4000`, and **no** `upgrade-insecure-requests`.
4. **Direct Configuration Evaluation (Unset Mode):**
   - Command: `node -e 'delete process.env.NODE_ENV; import("./next.config.mjs").then(async m => console.log(await m.default.headers()))'`
   - Result: **PASS** — Fails-closed to strict production policy.
5. **Git Formatting Check:**
   - Command: `git diff --check`
   - Result: **PASS (0 whitespace or syntax errors)**.

---

## 8. Changed Files in Phase 2

- [`next.config.mjs`](file:///Users/rohansiddhpura/Documents/campuswebsite/next.config.mjs): Hardened CSP directives, removed wildcards (`https://*` and `*.supabase.co`), removed legacy backend URL, isolated `localhost` to development, isolated `upgrade-insecure-requests` to production, removed `'unsafe-eval'` from production, and pinned image remote patterns.
- [`docs/CAMPUSVERSE_SECURITY_HARDENING_PHASE2.md`](file:///Users/rohansiddhpura/Documents/campuswebsite/docs/CAMPUSVERSE_SECURITY_HARDENING_PHASE2.md): Comprehensive Phase 2 architectural documentation, justification matrix, and threat model analysis.
