# Invite Member Feature — Task List

## Priority 1: Bug Fixes (Critical Path)

### Session Refresh After Accept Invitation
**File:** `src/app/(public)/accept-invite/[token]/page.tsx`

- [x] Import `update` from `useSession` hook
- [x] Call `update()` after `acceptInvitation()` succeeds to refresh the JWT with the new tenant context
- [x] Only redirect to `/organizations/${invitation.tenantId}` after the session update resolves
- [x] Add fallback redirect to `/organizations` if `invitation.tenantId` is undefined

---

## Priority 2: UX Improvements (High Value)

### Invite Link in Modal Success State
**File:** `src/components/modals/InviteMemberModal.tsx`

- [x] Add a `successInvitation` state to hold the returned `TenantInvitation` object after a successful invite
- [x] When `response.success` is true, store `response.data` (which includes `token`) in state instead of immediately closing
- [x] Render a success view inside the modal showing:
  - [x] A success icon + "Invitation Sent!" heading
  - [x] The invite link built as `${window.location.origin}/accept-invite/${token}`
  - [x] A copy-to-clipboard button next to the link (use `navigator.clipboard.writeText`)
  - [x] A toast on copy: "Invite link copied"
- [x] Add a "Done" button that closes the modal and calls `onConfirm?.()`
- [x] Reset `successInvitation` back to `null` when the modal closes via `handleClose`

---

## Priority 3: Access Control

### Role-Based Gate on Invite Button
**File:** `src/app/(protected)/organizations/[tenantId]/members/page.tsx`

- [x] Fetch the current user's role for this tenant from `session?.user?.tenants`
- [x] Determine `canInvite`: role must be `owner` or `admin`
- [x] Check `canInviteTeam` flag from the tenant's subscription features (`organization.subscription?.price?.features?.canInviteTeam`)
- [x] If `canInvite` is false: hide the "Invite Member" button entirely (non-admin members have no invite rights)
- [x] If `canInvite` is true but `canInviteTeam` is false (free/trial plan): show the button as disabled with a tooltip "Upgrade your plan to invite members"

### Member Limit Pre-Check Before Opening Modal
**File:** `src/app/(protected)/organizations/[tenantId]/members/page.tsx`

- [x] Fetch `maxMembers` from tenant settings (available via `getCurrentTenant()` → `settings.maxMembers`)
- [x] In `handleInviteMember`, compare `members.length` against `maxMembers`
- [x] If limit is reached: do NOT open the modal — instead show a toast: "Member limit reached. Upgrade your plan to add more members."
- [x] Add a link in the toast or a separate alert to `/organizations/[tenantId]/billing`

---

## Priority 4: UX Polish

### Accept-Invite Page — Unauthenticated User Clarity
**File:** `src/app/(public)/accept-invite/[token]/page.tsx`

- [x] When `status === 'unauthenticated'`, change the "Accept Invitation" button label to "Sign in to Accept"
- [x] Add a helper text below the button: "You'll be redirected back here after signing in"
- [x] When `status === 'authenticated'`, show the normal "Accept Invitation" label
- [x] Verify the `callbackUrl` correctly encodes `/accept-invite/${token}` when redirecting to login

---

## Summary

| # | Task | File | Priority |
|---|---|---|---|
| 1 | Session refresh after accept | `accept-invite/[token]/page.tsx` | ✅ Done |
| 2 | Invite link in modal success state | `InviteMemberModal.tsx` | ✅ Done |
| 3 | Role-based gate on invite button | `members/page.tsx` | ✅ Done |
| 4 | Member limit pre-check | `members/page.tsx` | ✅ Done |
| 5 | Accept-invite unauthenticated UX | `accept-invite/[token]/page.tsx` | ✅ Done |
