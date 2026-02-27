# Invitation Auth Flow — Task List

## Overview

When a user clicks an invite link (`/accept-invite/{token}`), the backend verify API returns
`isUserExistWithEmail`. Based on that flag, redirect to register or login. Both pages receive
the `invitationToken` as a query param, pass it in the request body, and the backend
auto-accepts the invitation on successful registration/login.

---

## Task 1 — Update `VerifyInvitationResponse` Type

**File:** `src/types/tenant.ts`

- [x] Add `id: string` (the invitation token used in API calls, returned as `id` in the response)
- [x] Add `isUserExistWithEmail: boolean`
- [x] Add `inviterName?: string` (backend returns `inviterName`, not `invitedBy`)
- [x] Add `expiresAt?: string`
- [x] Keep existing fields (`email`, `tenantName`, `tenantId`, `role`)

---

## Task 2 — Update `accept-invite` Page Logic

**File:** `src/app/(public)/accept-invite/[...token]/page.tsx`

- [x] After `verifyInvitationToken` succeeds, check `invitation.isUserExistWithEmail`
- [x] If user is **unauthenticated** and `isUserExistWithEmail === false`:
  - Auto-redirect to `/register?invitationToken={token}&email={email}&tenantName={tenantName}`
  - Show a brief loading state with org name + role while redirecting ("Setting up your account...")
- [x] If user is **unauthenticated** and `isUserExistWithEmail === true`:
  - Auto-redirect to `/login?invitationToken={token}&email={email}&tenantName={tenantName}`
  - Show a brief loading state ("Redirecting to sign in...")
- [x] If user is **authenticated** → keep the current "Accept Invitation" button flow unchanged
- [x] Remove the "Sign in to Accept" button state (no longer needed — redirect is automatic)
- [x] Remove the `handleReject` / Decline button for unauthenticated users (nothing to decline before auth)

---

## Task 3 — Update `RegisterUser` Server Action

**File:** `src/actions/register.ts`

- [x] Add optional `invitationToken?: string` parameter to the function signature
- [x] When `invitationToken` is provided, include it in the `body` sent to the backend:
  ```json
  { "email": "...", "password": "...", "confirmPassword": "...", "invitationToken": "..." }
  ```
- [x] No other change needed — backend handles auto-acceptance when token is present

---

## Task 4 — Update Registration Page

**File:** `src/app/register/page.tsx`

- [x] Read `invitationToken`, `email`, and `tenantName` from URL search params (`useSearchParams`)
- [x] If `invitationToken` is present:
  - Show an invitation banner at the top: *"You've been invited to join **{tenantName}** — create your account to continue"*
  - Pre-fill the email field with the `email` param
  - Make the email field **read-only** (invite is tied to this specific email)
- [x] Pass `invitationToken` to `RegisterUser(...)` action when calling it
- [x] On success → redirect to `/organizations` (backend auto-accepts, tenant context will load)

---

## Task 5 — Update Login Page / Action

**File:** `src/app/login/page.tsx`

- [x] Read `invitationToken`, `email`, and `tenantName` from URL search params
- [x] If `invitationToken` is present:
  - Show an invitation banner: *"Sign in to join **{tenantName}**"*
  - Pre-fill the email field with the `email` param
  - Make the email field **read-only**
- [x] Pass `invitationToken` alongside credentials when calling the sign-in action
- [x] On success → redirect to `/organizations`

**File:** `src/auth.ts` or login server action (wherever credentials are submitted to the backend)

- [x] Accept optional `invitationToken` param
- [x] Include it in the login request body when present

---

## Task 6 — Verify `verifyInvitationToken` Uses POST

**File:** `src/actions/memberActions.ts`

- [x] Method is already `POST` ✅ (matches backend requirement)

---

## Summary

| # | Task | File(s) | Status |
|---|---|---|---|
| 1 | Update `VerifyInvitationResponse` type | `types/tenant.ts` | ✅ |
| 2 | Redirect logic on accept-invite page | `accept-invite/[...token]/page.tsx` | ✅ |
| 3 | Pass `invitationToken` in register action | `actions/register.ts` | ✅ |
| 4 | Invitation banner + pre-filled email on register page | `app/register/page.tsx` | ✅ |
| 5 | Invitation banner + pre-filled email on login page | `app/login/page.tsx` + auth action | ✅ |
| 6 | Verify POST method on verify endpoint | `actions/memberActions.ts` | ✅ |
