# Individual User Subscription — Implementation Plan

**Goal:** Allow individual (personal mode) users to browse plans, add a payment method, and subscribe — using the same backend Stripe infrastructure that already powers org billing, but with `currentTenantId: null` in the JWT (personal mode).

---

## Current State Summary

| Area | Status |
|---|---|
| User auto-gets a Stripe customer at login (`user.stripeAccountId`) | ✅ Done |
| Backend endpoints support personal mode (`currentTenantId: null`) | ✅ Done |
| `SubscriptionModel` has `tenantId: null` for personal subscriptions | ✅ Done |
| `checkDailyRequestLimit` reads personal subscriptions from DB | ✅ Done |
| `/upgrade` page — plan cards exist | ⚠️ Static mockup only (no API, no payment) |
| `/upgrade` page — payment flow | ❌ Not connected |
| Personal billing dashboard | ❌ Does not exist |
| Cancel / manage personal subscription | ❌ Does not exist |

---

## Phase 1 — Backend: Fix `createSubscriptionController` Bug

**File:** `ASON-Core-Service-Backend/src/app/modules/stripe/stripe.controller.js`

> This bug exists regardless of personal vs. org and must be fixed first. The `Product.findOne()` call is missing `await`, so `productId` is never correctly saved to the DB subscription record, and plan `limits` (like `dailyRequestLimit`) are never copied over from the product definition.

### Step 1.1 — Fix missing `await` on Product lookup

In `createSubscriptionController`, change:
```js
// CURRENT (broken)
const product = Product.findOne({ stripePriceId: priceId });
```
to:
```js
// FIXED
const product = await Product.findOne({ stripePriceId: priceId });
```

### Step 1.2 — Copy plan limits into the Subscription record

After the product is fetched, populate `limits` from the product when creating or updating the `SubscriptionModel`:

```js
const limits = product ? {
  dailyRequestLimit: product.features.dailyRequestLimit,
  ragType: product.features.ragType,
  storagePerUser: product.features.storagePerUser,
  canInviteTeam: product.features.canInviteTeam,
} : undefined;
```

Add `limits`, `plan_name`, `stripeCustomerId`, `stripePriceId`, `currentPeriodStart`, `currentPeriodEnd` to both the create and update paths in `SubscriptionModel`.

### Step 1.3 — Add a `GET /stripe/my-subscription` endpoint

Add a single endpoint that returns the current user's active personal subscription (not just `my-subscriptions` which returns all). This is what the frontend dashboard will call.

**Route:** `GET /api/v1/stripe/my-subscription`  
**Auth:** `auth()` + `extractTenantContext`  
**Response:**
```json
{
  "success": true,
  "data": {
    "context": "personal",
    "hasSubscription": true,
    "subscription": { ... Stripe subscription object ... },
    "dbRecord": { ... SubscriptionModel doc ... }
  }
}
```

---

## Phase 2 — Frontend: Upgrade Page (Plan Selection)

**File:** `Alti.Assistant.Frontend/src/app/(protected)/upgrade/page.tsx`

Replace the current static mockup with a fully dynamic, API-driven page.

### Step 2.1 — Fetch real plans from API

Use the existing `getStripeProducts(accessToken)` action (same as org pricing). Filter out plans where `canInviteTeam === true` (those are org-only) or show all plans and let design guide it.

Remove the hardcoded `plans` array entirely.

### Step 2.2 — Fetch current subscription on page load

Call `GET /stripe/my-subscription` to know which plan the user is currently on. Mark that plan card as "Current Plan" and disable its button.

### Step 2.3 — Wire up "Select Plan" buttons

On click:
- If clicked plan is the current plan → do nothing
- If user has no payment methods (`GET /stripe/my-payment-methods` returns empty) → open `AddCardStep` directly  
- If user has payment methods → open `PaymentConfirmationModal`

### Step 2.4 — Wrap page with `StripeProviderWithErrorBoundary`

The `PaymentConfirmationModal` requires Stripe Elements context. Wrap the entire page:
```tsx
<StripeProviderWithErrorBoundary>
  <UpgradePageContent />
</StripeProviderWithErrorBoundary>
```

### Step 2.5 — Mount `PaymentConfirmationModal`

The existing `PaymentConfirmationModal` component already handles:
- Fetching saved payment methods
- Adding a new card (tokenize → attach → payment intent → confirm)
- Creating the subscription

It only needs to be dropped into the upgrade page exactly as it is in the org billing page. No new component needed.

---

## Phase 3 — Frontend: Personal Billing Dashboard

**New file:** `Alti.Assistant.Frontend/src/app/(protected)/billing/page.tsx`

This is the "My Billing" page for personal users, equivalent to `/organizations/[tenantId]/billing`. Add a link to it from the settings sidebar or user profile menu.

### Step 3.1 — Create the billing page

Sections:
1. **Current Plan Card** — plan name, price, interval (from `GET /stripe/my-subscription`)
2. **Usage Card** — daily requests used today / limit (from `X-Daily-Requests-*` headers or a new usage endpoint)
3. **Payment Methods Card** — list saved cards (from `GET /stripe/my-payment-methods`), ability to add new card
4. **Next Billing Date** — from `subscription.current_period_end`

### Step 3.2 — "Change Plan" button

Opens the plan selection view (same `OrganizationPricingCards` component or a clone of it without `canInviteTeam` filtering) then opens `PaymentConfirmationModal` on selection.

### Step 3.3 — "Cancel Subscription" button

Calls `DELETE /stripe/subscription/:subscriptionId`.  
Show a confirmation dialog before proceeding (`ConfirmDialog` already exists at `src/components/common/ConfirmDialog.tsx`).  
On success, refresh the page data and show a toast.

### Step 3.4 — "Add Payment Method" button (standalone)

Allow users to add a card without subscribing. Reuse `StripeCardForm` inside a dialog. On submit:
1. `stripe.createPaymentMethod({ type: 'card', card: cardElement })`
2. `POST /stripe/payment-method { paymentMethodId }`

---

## Phase 4 — Frontend: Navigation Wiring

### Step 4.1 — Add "Billing" link to settings / profile

In the user profile dropdown or settings sidebar, add:
- **Billing** → `/billing` (personal mode)
- When in org mode (`mode === UserMode.TENANT`) → hide or redirect to `/organizations/:tenantId/billing`

### Step 4.2 — Add "Upgrade" prompt on daily limit hit

When the API returns `429 Too Many Requests` (daily limit reached), the error message already says "Upgrade to Explore ($20/mo)". Wire the frontend error handler to show a toast with an **"Upgrade"** button linking to `/upgrade`.

Check for the `429` status in the global fetch/API error handler and show:
```tsx
toast.error('Daily limit reached', {
  action: { label: 'Upgrade Plan', onClick: () => router.push('/upgrade') }
});
```

### Step 4.3 — Show current plan in settings page

In `src/app/(protected)/settings/page.tsx`, add a "Subscription" card that shows:
- Current plan name + price
- Daily requests remaining (from response headers)
- Link to `/billing`
- Link to `/upgrade` if on free plan

---

## Phase 5 — Backend: Stripe Webhook for Personal Subscriptions

Currently the webhook handler (`POST /subscriptions/webhook`) only handles subscriptions created via the old Checkout Session flow. Subscriptions created via `POST /stripe/subscription` (the direct API path used in the new flow) have **no webhook coverage**.

### Step 5.1 — Add webhook handler in stripe module or extend existing

Add handling for these Stripe events when `metadata` does **not** contain a `tenantId` (personal subscription):

| Stripe Event | Action |
|---|---|
| `invoice.payment_succeeded` | Update `SubscriptionModel.paymentStatus = 'paid'`, refresh `currentPeriodEnd` |
| `invoice.payment_failed` | Update `paymentStatus = 'pending'`, notify user by email |
| `customer.subscription.updated` | Update plan limits in `SubscriptionModel.limits` |
| `customer.subscription.deleted` | Set `paymentStatus = 'canceled'`, update `User.isSubscribed = false` |

### Step 5.2 — Set metadata on subscription creation

In `createSubscriptionService`, pass metadata so webhook can route correctly:
```js
await stripe.subscriptions.create({
  customer: customerId,
  items: [{ price: priceId }],
  metadata: { userId: userId.toString(), tenantId: tenantId || '' },
  expand: ['latest_invoice.payment_intent'],
});
```

### Step 5.3 — Register webhook route

Extend `stripe.route.js` or `payment.route.js` to handle `POST /stripe/webhook` with `express.raw({ type: 'application/json' })` (raw body required for Stripe signature verification).

---

## Phase 6 — Testing & Validation

### Step 6.1 — Backend validation

- [ ] `POST /stripe/subscription` with personal JWT (no tenant) creates a `SubscriptionModel` with `tenantId: null`, correct `limits`, correct `plan_name`
- [ ] `GET /stripe/my-subscription` returns correct active subscription for personal user
- [ ] `GET /stripe/my-payment-methods` returns cards for personal user's `stripeAccountId`
- [ ] `checkDailyRequestLimit` reads higher limit after personal subscription is created
- [ ] Cancel flow: `DELETE /stripe/subscription/:id` → `paymentStatus: 'canceled'` → limit reverts to 10/day

### Step 6.2 — Frontend validation

- [ ] `/upgrade` loads real plans from API, shows current plan as "Current Plan"
- [ ] Clicking "Select Plan" on a paid plan opens `PaymentConfirmationModal`
- [ ] New card flow completes without errors (all 5 sub-steps)
- [ ] Existing card flow completes without errors
- [ ] `/billing` page shows current plan, usage, and saved cards
- [ ] Cancel subscription dialog works and plan reverts correctly
- [ ] 429 error from API shows "Upgrade Plan" toast with correct link

### Step 6.3 — Stripe test cards

Use during development:
- Success: `4242 4242 4242 4242`
- Auth required: `4000 0025 0000 3155`
- Decline: `4000 0000 0000 9995`

---

## Execution Order

```
Phase 1  →  Phase 2  →  Phase 3  →  Phase 4  →  Phase 5  →  Phase 6
Backend      Upgrade      Billing     Nav +        Webhooks    QA
bug fix      page         dashboard   429 toast
             (critical)
```

Phases 2, 3, and 4 can be worked on in parallel by separate developers once Phase 1 is complete. Phase 5 (webhooks) can be developed in parallel with Phases 3 and 4 since it is purely backend.

---

## Files to Create / Modify

### Backend (`ASON-Core-Service-Backend`)
| File | Action |
|---|---|
| `src/app/modules/stripe/stripe.controller.js` | Fix `await Product.findOne`, add limits to subscription save, add `getMySubscriptionController` |
| `src/app/modules/stripe/stripe.route.js` | Add `GET /my-subscription`, add `POST /webhook` |
| `src/app/modules/stripe/subscription.service.js` | Add metadata to `stripe.subscriptions.create` |
| `src/app/modules/stripe/webhook.service.js` | **New file** — personal subscription webhook handler |

### Frontend (`Alti.Assistant.Frontend`)
| File | Action |
|---|---|
| `src/app/(protected)/upgrade/page.tsx` | Full rewrite — dynamic plans, Stripe provider, modal |
| `src/app/(protected)/billing/page.tsx` | **New file** — personal billing dashboard |
| `src/actions/stripeActions.ts` | Add `getMyPersonalSubscription()` action |
| `src/app/(protected)/settings/page.tsx` | Add subscription card + billing link |
| Global error handler (API fetch utility) | Add 429 → upgrade toast handling |
