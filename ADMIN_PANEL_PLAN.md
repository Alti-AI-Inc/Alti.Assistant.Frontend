# Alti Admin Panel — Implementation Plan

> Standalone Next.js application that connects to the existing ASON-Core-Service-Backend.
> Lives at its own repo / deployment URL (e.g. `admin.asonai.com`).

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Authentication](#4-authentication)
5. [Backend Changes Required](#5-backend-changes-required)
6. [Frontend Pages & Features](#6-frontend-pages--features)
7. [Shared Components](#7-shared-components)
8. [Phase-by-Phase Task Checklist](#8-phase-by-phase-task-checklist)
9. [Environment Variables](#9-environment-variables)
10. [Deployment](#10-deployment)

---

## 1. Project Overview

The admin panel is a **separate Next.js 15** project that communicates exclusively with the existing Express backend (`/api/v1/admin/...`). It is **not embedded** in `Alti.Assistant.Frontend`.

**Scope:**
- Platform-wide user management
- Tenant (organisation) management
- User-level usage analytics
- Tenant-level usage analytics
- Platform-wide usage log browser
- Payment / subscription overview

**Access control:** Only users with role `admin` or `super_admin` can log in.

---

## 2. Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 15 (App Router) | Matches main frontend, SSR for data-heavy tables |
| Language | TypeScript | Type safety across API contracts |
| Auth | NextAuth v5 — Credentials provider | Same pattern as main frontend, re-uses same `/auth/login` endpoint |
| Styling | Tailwind CSS v4 | Matches existing design system |
| Components | ShadCN/UI (Radix UI) | Matches main frontend |
| Tables | TanStack Table v8 | Server-side pagination + sorting |
| Charts | Recharts | Lightweight, composable, Tailwind-friendly |
| Forms | React Hook Form + Zod v4 | Consistent with main frontend |
| Server state | TanStack Query v5 | Caching, background refresh, optimistic updates |
| Toasts | Sonner | Matches main frontend |
| Icons | Lucide React | Matches main frontend |
| Package manager | pnpm | Matches main frontend |

---

## 3. Project Structure

```
alti-admin/
├── package.json
├── next.config.ts
├── tsconfig.json
├── .env.local
├── src/
│   ├── auth.ts                         ← NextAuth config (admin-only login)
│   ├── middleware.ts                   ← Route protection
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx                  ← Root layout
│   │   ├── login/
│   │   │   └── page.tsx               ← Admin login page
│   │   └── (admin)/                   ← Protected admin route group
│   │       ├── layout.tsx             ← Admin shell (sidebar + topbar)
│   │       ├── page.tsx               ← Dashboard / Overview
│   │       ├── users/
│   │       │   ├── page.tsx           ← User list
│   │       │   └── [userId]/
│   │       │       └── page.tsx       ← User detail
│   │       ├── tenants/
│   │       │   ├── page.tsx           ← Tenant list
│   │       │   └── [tenantId]/
│   │       │       ├── page.tsx       ← Tenant detail (tabs)
│   │       │       └── members/
│   │       │           └── page.tsx   ← Tenant member list
│   │       └── usage/
│   │           ├── page.tsx           ← Platform usage dashboard
│   │           └── logs/
│   │               └── page.tsx       ← Usage log browser
│   ├── actions/
│   │   ├── auth.ts                    ← Login server action
│   │   ├── users.ts                   ← User API calls
│   │   ├── tenants.ts                 ← Tenant API calls
│   │   └── usage.ts                   ← Usage API calls
│   ├── components/
│   │   ├── ui/                        ← ShadCN primitives
│   │   ├── layout/
│   │   │   ├── AdminSidebar.tsx
│   │   │   ├── AdminTopbar.tsx
│   │   │   └── AdminBreadcrumb.tsx
│   │   ├── common/
│   │   │   ├── StatCard.tsx
│   │   │   ├── DataTable.tsx
│   │   │   ├── SearchFilterBar.tsx
│   │   │   ├── PaginationControls.tsx
│   │   │   ├── ConfirmDialog.tsx
│   │   │   └── EmptyState.tsx
│   │   ├── users/
│   │   │   ├── UserStatusBadge.tsx
│   │   │   ├── UserRoleBadge.tsx
│   │   │   ├── UserActionsMenu.tsx
│   │   │   └── UserUsageSummary.tsx
│   │   ├── tenants/
│   │   │   ├── TenantStatusBadge.tsx
│   │   │   ├── TenantPlanBadge.tsx
│   │   │   ├── TenantActionsMenu.tsx
│   │   │   ├── UsageLimitBar.tsx
│   │   │   └── ExtendTrialModal.tsx
│   │   └── charts/
│   │       ├── UserRegistrationChart.tsx
│   │       ├── ModuleUsageChart.tsx
│   │       ├── RequestVolumeChart.tsx
│   │       └── StatusBreakdownChart.tsx
│   ├── hooks/
│   │   ├── useUsers.ts
│   │   ├── useTenants.ts
│   │   └── useUsage.ts
│   └── types/
│       ├── user.ts
│       ├── tenant.ts
│       └── usage.ts
```

---

## 4. Authentication

### Flow

1. Admin visits `admin.asonai.com/login`
2. Enters email + password
3. NextAuth `Credentials` provider calls `POST /api/v1/auth/login` on the existing backend
4. On success, the JWT is decoded — if `role` is not `admin` or `super_admin`, sign-in is **rejected**
5. Session stored as JWT cookie; `middleware.ts` protects all `/(admin)` routes
6. Token expiry handled identically to main frontend (decode + `isTokenExpired` flag)

### `src/auth.ts`

```typescript
// Credentials provider → POST /api/v1/auth/login
// Reject if role !== 'admin' && role !== 'super_admin'
// JWT callback decodes accessToken and attaches role, id, exp
// Session callback exposes accessToken + isTokenExpired
```

### Role Enforcement Layers

| Layer | Mechanism |
|---|---|
| Sign-in | Reject non-admin roles at `authorize()` |
| Route | `middleware.ts` redirects unauthenticated to `/login` |
| API | Every backend `/admin/` route already requires `auth(ENUM_USER_ROLE.ADMIN)` |

---

## 5. Backend Changes Required

All changes go in `ASON-Core-Service-Backend`.

### 5.1 Fix — User Role Enum (auth.model.js)

The User model role enum is `['user', 'buyer', 'admin', 'unauthorized']` but `ENUM_USER_ROLE` has `super_admin`. These need to be aligned.

- [x] Add `'super_admin'` to `role` enum in `auth.model.js`
- [x] Add `'super_admin'` to `ENUM_USER_ROLE` in `shared/enum.js` (already there)

### 5.2 Fix — `updateUserRole` Controller

Currently hardcodes `role: 'admin'` regardless of request body.

- [x] Read `role` from `req.body`
- [x] Validate against allowed values: `['user', 'admin', 'super_admin']`
- [x] Only `super_admin` can assign `super_admin` or `admin` roles (update route guard)

### 5.3 Fix — `getAllUsers` Select Fields

Missing `name`, `createdAt`, `tenantId`, `dailyRequestLimit`, `freePlanUsage`, `provider` in `.select()`.

- [x] Expand select: `'name email role isSubscribed subscription tenantId dailyRequestLimit freePlanUsage provider createdAt avatar'`

### 5.4 New — User Detail Endpoint

```
GET /api/v1/admin/users/:userId
```
Returns full user profile including subscription + daily limit + tenant info.

### 5.5 New — Update User Endpoint

```
PATCH /api/v1/admin/users/:userId
```
Allowed fields: `role`, `dailyRequestLimit.maxRequests`, `isSubscribed`, hard-ban via `status: 'banned'`.

### 5.6 New — Reset User Daily Limit

```
POST /api/v1/admin/users/:userId/reset-limit
```
Sets `dailyRequestLimit.requestsUsed = 0` and `lastResetAt = now`.

### 5.7 New — User Usage Endpoint

```
GET /api/v1/admin/users/:userId/usage?period=today|7d|30d
```
Queries `UserUsage` model. Returns: `requestsUsed`, `storageUsed`, daily breakdown array.

Uses existing `UserUsageModel` static methods.

### 5.8 New — User Usage Logs

```
GET /api/v1/admin/users/:userId/usage-logs
  ?page=1&limit=20&module=&status=&startDate=&endDate=
```
Paginated query on `UsageLog` filtered by `userId`. Uses existing `UsageLog.getUserUsageSummary`.

### 5.9 New — Tenant Members List

```
GET /api/v1/admin/tenants/:tenantId/members
  ?page=1&limit=20
```
Queries `User` where `tenantId` matches. Attaches today's `UserUsage` per member.

### 5.10 New — Remove Tenant Member

```
DELETE /api/v1/admin/tenants/:tenantId/members/:userId
```
Sets `user.tenantId = null`, decrements `tenant.usage.usersCount`.

### 5.11 New — Platform Usage Summary

```
GET /api/v1/admin/usage/summary?period=today|7d|30d
```
Aggregates `UsageLog`:
- Total requests
- Success / error / partial counts + rates
- Average response duration
- Total tokens consumed
- Active users (distinct `userId`)

### 5.12 New — Platform Usage by Module

```
GET /api/v1/admin/usage/by-module?period=today|7d|30d
```
Groups `UsageLog` by `module`, returns: request count, error rate, avg duration, total tokens.

### 5.13 New — Platform Usage by User (Top N)

```
GET /api/v1/admin/usage/by-user?limit=10&period=7d
```
Groups `UsageLog` by `userId`, returns top N users sorted by request count. Populates `name` and `email`.

### 5.14 New — Usage Log Browser

```
GET /api/v1/admin/usage/logs
  ?page=1&limit=50&userId=&tenantId=&module=&status=&startDate=&endDate=
```
Paginated `UsageLog` with full detail. Populates `userId.name`, `userId.email`, `tenantId.name`.

### 5.15 New — Register All Routes

Add all new routes to `admin.route.js` behind `auth(ENUM_USER_ROLE.ADMIN)`:

```javascript
// Users
router.get('/users/:userId',             auth(ADMIN), AdminController.getUserDetail);
router.patch('/users/:userId',           auth(ADMIN), AdminController.updateUser);
router.post('/users/:userId/reset-limit',auth(ADMIN), AdminController.resetUserLimit);
router.get('/users/:userId/usage',       auth(ADMIN), AdminController.getUserUsage);
router.get('/users/:userId/usage-logs',  auth(ADMIN), AdminController.getUserUsageLogs);

// Tenant Members
router.get('/tenants/:tenantId/members',               auth(ADMIN), AdminController.getTenantMembers);
router.delete('/tenants/:tenantId/members/:userId',    auth(ADMIN), AdminController.removeTenantMember);

// Platform Usage
router.get('/usage/summary',   auth(ADMIN), AdminController.getPlatformUsageSummary);
router.get('/usage/by-module', auth(ADMIN), AdminController.getUsageByModule);
router.get('/usage/by-user',   auth(ADMIN), AdminController.getTopUsersByUsage);
router.get('/usage/logs',      auth(ADMIN), AdminController.getUsageLogs);
```

---

## 6. Frontend Pages & Features

### 6.1 `/login` — Admin Login

- Email + password form (React Hook Form + Zod)
- Calls NextAuth `signIn('credentials', ...)`
- Shows error on wrong credentials or insufficient role
- Redirects to `/` on success

---

### 6.2 `/(admin)` — Dashboard Overview

**Stats row (top):**

| Card | Data Source |
|---|---|
| Total Users | `GET /admin/all-user` → `meta.total` |
| Paid Users | `meta.paidUser` |
| Active Tenants | `GET /admin/tenants` → `meta.total` filtered by `status=active` |
| Requests Today | `GET /admin/usage/summary?period=today` → `totalRequests` |
| Error Rate (24h) | same → `errorRate` |

**Charts row:**
- `UserRegistrationChart` — monthly signups bar chart (existing `/admin/all-user/statistics`)
- `RequestVolumeChart` — daily request volume line chart (7d, from `/admin/usage/summary`)
- `StatusBreakdownChart` — success/error/partial doughnut (from `/admin/usage/summary`)

**Tables row:**
- Top 5 tenants by API usage
- Recent 5 usage log entries

---

### 6.3 `/users` — User Management

**Filter bar:** search (name/email) · role · subscription status · plan

**Table columns:**

| Column | Sortable | Notes |
|---|---|---|
| Name + Avatar | | |
| Email | | |
| Role | | `UserRoleBadge` |
| Plan | | |
| Subscription | | `UserStatusBadge` (paid/expired/free) |
| Daily Requests | | `used / max` inline |
| Tenant | | link to tenant detail |
| Joined | ✓ | |
| Actions | | dropdown menu |

**Row actions:**
- View Detail
- Change Role (modal: select user/admin/super_admin)
- Reset Daily Limit
- Delete (confirm dialog)

**Pagination:** server-side, 20 per page.

---

### 6.4 `/users/[userId]` — User Detail

**Header:** Avatar · Name · Email · Role badge · Joined date · Provider badge (google/github/credentials)

**Tabs:**

#### Profile Tab
- Email, role, subscription plan, subscription status, expires at, invoice URL
- Tenant membership (link to tenant)
- Free plan usage: prompts used / images used
- Daily limit: requests used / max + **Reset Limit** button

#### Usage Tab
- Period selector: Today / 7 days / 30 days
- Stats: Total Requests · Successful · Errors · Avg Duration · Storage Used
- `RequestVolumeChart` (daily breakdown for period)
- Module breakdown table: module · requests · tokens · error rate

#### Activity Log Tab
- Paginated `UsageLog` table
- Columns: Timestamp · Module · Action · Endpoint · Status · HTTP · Duration · Tokens · Model
- Filter by: module, status, date range
- Row expand → full error message + metadata JSON

#### Danger Zone Tab
- Change role form
- Delete user button (confirm dialog)

---

### 6.5 `/tenants` — Tenant Management

**Filter bar:** search (name/slug) · status · plan

**Table columns:**

| Column | Sortable | Notes |
|---|---|---|
| Name | ✓ | |
| Slug | | |
| Plan | | `TenantPlanBadge` |
| Status | | `TenantStatusBadge` |
| Owner | | name + email |
| Members | | `usage.usersCount / limits.maxUsers` |
| API Calls | | `usage.apiCallsUsed / limits.maxApiCalls` |
| Trial Ends | ✓ | highlight if < 3 days |
| Created | ✓ | |
| Actions | | |

**Row actions:**
- View Detail
- Change Status (active / suspended / cancelled)
- Extend Trial (input days → POST)

---

### 6.6 `/tenants/[tenantId]` — Tenant Detail

**Header:** Tenant name · Subdomain · Plan badge · Status badge · Created

**Tabs:**

#### Overview Tab
- Owner: name, email (link to user detail)
- Metadata: industry, company size, use case, referral source

#### Usage & Limits Tab
- `UsageLimitBar` for: API Calls (used/max) · Storage (used/max · formatted GB) · Members (used/max)
- Period breakdown via sub-tabs: Today / 7d / 30d
- Module breakdown table (from `UsageLog.getTenantUsageSummary`)

#### Members Tab
- Table: Name · Email · Role · Requests Today · Storage · Joined
- Remove from tenant action (confirm dialog)
- (Same as `/tenants/[tenantId]/members` but embedded in tab)

#### Subscription Tab
- Stripe Customer ID · Stripe Subscription ID
- Status · Current period start/end · Cancel at
- Trial ends at + **Extend Trial** button

#### Settings Tab
- `allowMemberInvites` toggle
- `requireApproval` toggle
- `maxMembers` input
- Custom branding: logo URL, primary color preview

---

### 6.7 `/usage` — Platform Usage Dashboard

**Period selector:** Today · 7 Days · 30 Days (syncs all charts)

**Stats row:**

| Card | Value |
|---|---|
| Total Requests | count for period |
| Success Rate | % |
| Error Rate | % |
| Avg Response Time | ms |
| Total Tokens | count |
| Active Users | distinct userId count |

**Charts:**
- `RequestVolumeChart` — daily line chart for period
- `ModuleUsageChart` — horizontal bar chart: module vs request count
- `StatusBreakdownChart` — doughnut: success/error/partial
- Top 10 Users bar chart (`/admin/usage/by-user`)

---

### 6.8 `/usage/logs` — Usage Log Browser

**Filters:** userId · tenantId · module (multi-select) · status · date range · HTTP status code

**Table columns:**

| Column | |
|---|---|
| Timestamp | sortable |
| User | name + email |
| Tenant | name (or "Personal") |
| Module | colour-coded chip |
| Action | |
| Endpoint | truncated, full on hover |
| Status | success/error/partial chip |
| HTTP | status code |
| Duration | ms, colour red if > 5000 |
| Tokens | |
| Model | |

**Row expand:** shows full `errorMessage`, `metadata` JSON, `requestId`, `ipAddress`, `userAgent`.

**Export button:** download current filter set as CSV (client-side from fetched page, or server-side endpoint).

---

## 7. Shared Components

### `StatCard.tsx`
```
props: title, value, delta?, deltaLabel?, icon, loading
```

### `DataTable.tsx`
```
props: columns, data, pageCount, page, onPageChange, sorting, onSortingChange, loading
```
TanStack Table — server-side pagination + sorting wired through props.

### `SearchFilterBar.tsx`
```
props: searchPlaceholder, filters: FilterConfig[], onSearchChange, onFilterChange
```
Debounced search input (300ms) + configurable dropdown filters.

### `PaginationControls.tsx`
Standard prev/next with page number input and results-per-page selector.

### `ConfirmDialog.tsx`
Radix Dialog — `title`, `description`, `confirmLabel`, `onConfirm` — used for delete/remove actions.

### `UsageLimitBar.tsx`
```
props: label, used, max, unit ('requests' | 'bytes' | 'users')
```
Progress bar with colour: green < 70%, amber 70–90%, red > 90%.

### `UserRoleBadge.tsx`
Colour map: `super_admin` = red · `admin` = purple · `user` = blue · `unauthorized` = grey

### `TenantStatusBadge.tsx`
`active` = green · `trial` = amber · `suspended` = red · `cancelled` = grey

### `TenantPlanBadge.tsx`
`free` · `explore` · `analyze` · `execute` · `command` · `enterprise` — each with distinct colour

---

## 8. Phase-by-Phase Task Checklist

### Phase 0 — Scaffold New Project

- [x] `pnpm create next-app alti-admin --typescript --tailwind --app --src-dir --import-alias "@/*"`
- [x] Install dependencies: `next-auth shadcn-ui @tanstack/react-query @tanstack/react-table recharts react-hook-form zod sonner lucide-react`
- [x] Initialise ShadCN: `pnpm dlx shadcn@latest init`
- [x] Add ShadCN components: button, card, table, badge, dialog, tabs, select, input, label, dropdown-menu, progress, skeleton, avatar, separator, scroll-area, sheet
- [x] Configure `tailwind.config.ts`, `globals.css`
- [x] Set up `src/auth.ts` with NextAuth Credentials provider (admin-only check)
- [x] Set up `src/proxy.ts` to protect `/(admin)` routes (Next.js 16 uses `proxy.ts` instead of `middleware.ts`)
- [x] Create `.env.local` template (see Section 9)

### Phase 1 — Backend Fixes (ASON-Core-Service-Backend)

- [x] Add `'super_admin'` to `role` enum in `auth.model.js`
- [x] Fix `updateUserRole` — read `role` from `req.body`, validate enum
- [x] Fix `getAllUsers` — expand `.select()` fields
- [x] Add all new endpoints (5.4 → 5.14) to `admin.controller.js` and `admin.service.js`
- [x] Register all new routes in `admin.route.js`
- [ ] Test all endpoints with Postman

### Phase 2 — Types & Actions Layer

- [x] `src/types/user.ts` — `User`, `UserDetail`, `UserUsageSummary` types
- [x] `src/types/tenant.ts` — `Tenant`, `TenantDetail`, `TenantMember` types
- [x] `src/types/usage.ts` — `UsageLog`, `UsageSummary`, `ModuleUsage`, `UserTopUsage` types
- [x] `src/actions/users.ts` — all user API functions
- [x] `src/actions/tenants.ts` — all tenant API functions
- [x] `src/actions/usage.ts` — all usage API functions

### Phase 3 — Layout & Login

- [x] `src/app/login/page.tsx` — login form
- [x] `src/app/(admin)/layout.tsx` — Admin shell + `AdminSidebar` + `AdminTopbar`
- [x] `AdminSidebar.tsx` — nav links with active state
- [x] `AdminTopbar.tsx` — breadcrumb + user menu + sign out
- [x] Shared common components: `StatCard`, `DataTable`, `SearchFilterBar`, `PaginationControls`, `ConfirmDialog`

### Phase 4 — Dashboard

- [x] `src/app/(admin)/page.tsx`
- [x] `StatCard` row
- [x] `UserRegistrationChart`
- [x] `RequestVolumeChart`
- [x] `StatusBreakdownChart`
- [x] Recent logs mini-table

### Phase 5 — Users Module

- [x] `src/app/(admin)/users/page.tsx` — list with filters, pagination, row actions
- [x] `UserStatusBadge`, `UserRoleBadge`, `UserActionsMenu`
- [x] Change Role modal
- [x] Delete confirm dialog
- [x] `src/app/(admin)/users/[userId]/page.tsx` — detail with 4 tabs
- [x] `UserUsageSummary` component
- [x] Activity log tab with `UsageLog` table

### Phase 6 — Tenants Module ✅ COMPLETE

- [x] `src/app/(admin)/tenants/page.tsx` — list with search/status/plan filters, row actions
- [x] `TenantStatusBadge`, `TenantPlanBadge` — color-coded badges
- [x] `ExtendTrialModal` — inline in TenantsTableClient + TenantDetailClient
- [x] `src/app/(admin)/tenants/[tenantId]/page.tsx` — detail with 5 tabs
- [x] `UsageLimitBar` component — with colour thresholds and byte formatting
- [x] Members tab (paginated, remove-member action) — inline in TenantDetailClient
- [x] Backend: `PATCH /admin/tenants/:tenantId/settings` — updateTenantSettingsService

### Phase 7 — Usage Module

- [ ] `src/app/(admin)/usage/page.tsx` — platform dashboard with charts
- [ ] `ModuleUsageChart`
- [ ] Top users chart
- [ ] `src/app/(admin)/usage/logs/page.tsx` — log browser with expand rows + CSV export

### Phase 8 — Polish & Security

- [ ] Add `super_admin`-only guards for destructive actions (backend + frontend)
- [ ] Add loading skeletons to all tables and charts
- [ ] Error boundaries on each page
- [ ] Empty states for all tables
- [ ] Mobile-responsive sidebar (Sheet drawer)
- [ ] Add favicon, title metadata per page
- [ ] Confirm all API errors surface via Sonner toast

---

## 9. Environment Variables

```env
# .env.local

# The backend API base URL
NEXT_PUBLIC_API_URL=https://api.asonai.com/api/v1

# NextAuth
AUTH_SECRET=<generate with: openssl rand -base64 32>
NEXTAUTH_URL=https://admin.asonai.com

# For local dev
# NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
# NEXTAUTH_URL=http://localhost:3001
```

---

## 10. Deployment

### Recommended: Separate GCP Cloud Run service (or Vercel)

```yaml
# cloudbuild.yaml (same pattern as main frontend)
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/alti-admin', '.']
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/alti-admin']
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    args:
      - gcloud
      - run
      - deploy
      - alti-admin
      - --image=gcr.io/$PROJECT_ID/alti-admin
      - --region=us-central1
      - --platform=managed
      - --allow-unauthenticated
```

### CORS Update Required (Backend)

Add the admin panel URL to the CORS `origin` array in `index.js`:

```javascript
origin: [
  'https://asonai.com',
  'https://www.asonai.com',
  'https://admin.asonai.com',   // ← add this
  'http://localhost:3001',       // ← add this for dev
  ...
]
```

---

## API Reference Summary

| Category | Method | Path |
|---|---|---|
| **Users** | GET | `/admin/all-user?searchTerm=&page=&limit=` |
| | GET | `/admin/users/:userId` |
| | PATCH | `/admin/users/:userId` |
| | POST | `/admin/users/:userId/reset-limit` |
| | DELETE | `/admin/delete-user/:objectId` |
| | PUT | `/admin/update-user-role/:id` |
| | GET | `/admin/users/:userId/usage?period=` |
| | GET | `/admin/users/:userId/usage-logs?page=&module=&status=&startDate=&endDate=` |
| **Tenants** | GET | `/admin/tenants?searchTerm=&status=&plan=&page=&limit=` |
| | GET | `/admin/tenants/:tenantId` |
| | PATCH | `/admin/tenants/:tenantId/status` |
| | POST | `/admin/tenants/:tenantId/extend-trial` |
| | GET | `/admin/tenants/:tenantId/usage` |
| | GET | `/admin/tenants/:tenantId/members` |
| | DELETE | `/admin/tenants/:tenantId/members/:userId` |
| **Usage** | GET | `/admin/usage/summary?period=` |
| | GET | `/admin/usage/by-module?period=` |
| | GET | `/admin/usage/by-user?limit=&period=` |
| | GET | `/admin/usage/logs?page=&userId=&tenantId=&module=&status=&startDate=&endDate=` |
| **Platform** | GET | `/admin/all-user/statistics` |
| | GET | `/admin/all-payment?page=&limit=` |
