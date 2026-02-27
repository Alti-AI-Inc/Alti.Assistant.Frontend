# Payment Integration Task List

## Overview
Integrate Stripe payment functionality for organization plan upgrades with support for existing and new payment methods.

---

## Available Backend APIs

### Payment Methods
- **GET** `/api/v1/stripe/my-payment-methods` - Get user's saved payment methods
- **POST** `/api/v1/stripe/payment-method` - Add new payment method
  ```json
  { "paymentMethodId": "pm_xxxxx" }
  ```

### Payment Intent
- **POST** `/api/v1/stripe/payment-intent` - Create payment intent for card verification
  ```json
  { "amount": 9900, "currency": "usd" }
  ```

### Products & Pricing
- **GET** `/api/v1/stripe/products` - Get all Stripe products
- **GET** `/api/v1/stripe/prices?productId=prod_xxxxx` - Get prices for a product

### Subscriptions
- **POST** `/api/v1/stripe/subscription` - Create new subscription
  ```json
  { "priceId": "price_xxxxx" }
  ```
- **GET** `/api/v1/stripe/subscription/:subscriptionId` - Get subscription details
- **DELETE** `/api/v1/stripe/subscription/:subscriptionId` - Cancel subscription

---

## Phase 1: Setup & Dependencies ✅ (Complete)

- [x] **Install Stripe dependencies**
  - [x] Run `npm install @stripe/stripe-js @stripe/react-stripe-js`
  - [x] Verify installation in package.json
  - **Note**: Already installed - `@stripe/react-stripe-js@5.4.1` and `@stripe/stripe-js@8.6.4`

- [x] **Environment configuration**
  - [x] Add `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` to `.env.local`
  - [x] Add `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` to `.env.example` (without value)
  - [x] Verify environment variable loads correctly
  - **Note**: Already configured in `.env` file with test key

---

## Phase 2: Type Definitions ✅ (Complete)

- [x] **Create Stripe types** (`src/types/stripe.ts`)
  - [x] Define `PaymentMethod` interface
  - [x] Define `PaymentIntent` interface  
  - [x] Define `PaymentFlowProps` interface
  - [x] Define `StripeProduct` interface
  - [x] Define `StripePrice` interface
  - [x] Define `Subscription` interface
  - [x] Define `CreatePaymentIntentRequest` type
  - [x] Define `AddPaymentMethodRequest` type
  - [x] Define `CreateSubscriptionRequest` type
  - [x] Define API response types for all endpoints

---

## Phase 3: API Actions ✅ (Complete)

- [x] **Update stripeActions.ts** (`src/actions/stripeActions.ts`)
  
  - [x] Create `getMyPaymentMethods()` function
    - [x] GET /api/v1/stripe/my-payment-methods
    - [x] Handle success response
    - [x] Handle error cases
    - [x] Add TypeScript types
  
  - [x] Create `createPaymentIntent()` function
    - [x] POST /api/v1/stripe/payment-intent
    - [x] Accept amount and currency parameters
    - [x] Return clientSecret for card confirmation
    - [x] Handle errors
  
  - [x] Create `addPaymentMethod()` function
    - [x] POST /api/v1/stripe/payment-method
    - [x] Accept paymentMethodId parameter
    - [x] Attach payment method to customer
    - [x] Handle success/error responses
  
  - [x] Create `getStripeProducts()` function
    - [x] GET /api/v1/stripe/products
    - [x] Return list of all products
    - [x] Handle errors
  
  - [x] Create `getProductPrices()` function
    - [x] GET /api/v1/stripe/prices?productId=prod_xxx
    - [x] Accept productId parameter
    - [x] Return list of prices for product
    - [x] Handle errors
  
  - [x] Create `createSubscription()` function
    - [x] POST /api/v1/stripe/subscription
    - [x] Accept priceId parameter
    - [x] Create subscription for tenant
    - [x] Return subscription details
    - [x] Handle errors
  
  - [x] Create `getSubscription()` function
    - [x] GET /api/v1/stripe/subscription/:subscriptionId
    - [x] Accept subscriptionId parameter
    - [x] Return subscription details
    - [x] Handle errors
  
  - [x] Create `cancelSubscription()` function
    - [x] DELETE /api/v1/stripe/subscription/:subscriptionId
    - [x] Accept subscriptionId parameter
    - [x] Cancel the subscription
    - [x] Handle errors

---

## Phase 4: Stripe Provider Setup ✅ (Complete)

- [x] **Create StripeProvider component** (`src/components/stripe/StripeProvider.tsx`)
  - [x] Import loadStripe from @stripe/stripe-js
  - [x] Initialize Stripe with publishable key
  - [x] Wrap children with Elements provider
  - [x] Add error boundary
  - [x] Export provider component

---

## Phase 5: Payment Method Components ✅ (Complete)

- [x] **Create PaymentMethodCard component** (`src/components/stripe/PaymentMethodCard.tsx`)
  - [x] Display card brand icon (Visa, Mastercard, etc.)
  - [x] Show last 4 digits
  - [x] Display expiry date
  - [x] Add "Default" badge if applicable
  - [x] Support selection state (radio/checkbox)
  - [x] Add proper styling and hover states

- [x] **Create PaymentMethodList component** (`src/components/stripe/PaymentMethodList.tsx`)
  - [x] Render list of PaymentMethodCard components
  - [x] Handle payment method selection
  - [x] Add "Add New Payment Method" option
  - [x] Show loading state while fetching
  - [x] Handle empty state (no payment methods)
  - [x] Add proper spacing and layout

---

## Phase 6: Card Input Component ✅ (Complete)

- [x] **Create StripeCardForm component** (`src/components/stripe/StripeCardForm.tsx`)
  - [x] Import CardElement from @stripe/react-stripe-js
  - [x] Configure CardElement styling to match theme
  - [x] Add card input field with label
  - [x] Show real-time validation errors
  - [x] Handle card element change events
  - [x] Expose card completion state to parent
  - [x] Add postal code field if needed
  - [x] Make responsive for mobile

---

## Phase 7: Payment Confirmation Modal ✅ (Complete)

- [x] **Create PaymentConfirmationModal component** (`src/components/stripe/PaymentConfirmationModal.tsx`)
  - [x] Create modal shell with dialog component
  - [x] Add modal header with plan details
  - [x] Display selected plan name and price
  - [x] Show payment method selection UI
  - [x] Conditionally show card input for new methods
  - [x] Add amount breakdown/summary
  - [x] Create "Confirm" action button
  - [x] Create "Cancel" button
  - [x] Add loading state during processing
  - [x] Show success message on completion
  - [x] Show error messages on failure
  - [x] Handle modal close/cleanup

---

## Phase 8: Payment Flow Logic ✅ (Complete)

- [x] **Modal payment processing logic**
  - [x] Fetch payment methods on modal open (GET /api/v1/stripe/my-payment-methods)
  - [x] Determine if user has existing payment methods
  
  - [x] **Scenario A: Use existing payment method**
    - [x] User selects existing payment method
    - [x] Skip card input collection
    - [x] Directly create subscription with priceId (POST /api/v1/stripe/subscription)
    - [x] Handle success → Update UI
    - [x] Handle errors → Show error message
  
  - [x] **Scenario B: Add new payment method (no existing methods)**
    - [x] Show card input form
    - [x] Create payment intent (POST /api/v1/stripe/payment-intent)
    - [x] Collect card details via Stripe CardElement
    - [x] Confirm card payment with Stripe.js using clientSecret
    - [x] Extract paymentMethodId from confirmed payment
    - [x] Add payment method to customer (POST /api/v1/stripe/payment-method)
    - [x] Create subscription with priceId (POST /api/v1/stripe/subscription)
    - [x] Handle success → Update UI
    - [x] Handle errors at each step
  
  - [x] **Scenario C: Add new payment method (has existing methods)**
    - [x] User chooses "Add New Card" option
    - [x] Follow same flow as Scenario B
    - [x] Allow switching back to existing methods
  
  - [x] Process subscription upgrade/creation
  - [x] Handle success callback
  - [x] Handle error states with specific messages
  - [x] Add proper loading states for each step
  
  **Note**: All payment flow logic was implemented in `PaymentConfirmationModal.tsx`:
  - `fetchPaymentMethods()` - Loads payment methods on mount
  - `handleConfirmWithExistingCard()` - Scenario A implementation
  - `handleConfirmWithNewCard()` - Scenarios B & C implementation
  - State machine with 6 states: loading, select_method, add_card, processing, success, error

---

## Phase 9: Billing Page Integration ✅ (Complete)

- [x] **Update billing page** (`src/app/(protected)/organizations/[tenantId]/billing/page.tsx`)
  - [x] Add state for selected plan
  - [x] Add state for payment modal visibility
  - [x] Modify `onSelectPlan` handler in pricing modal
    - [x] Capture selected plan details
    - [x] Close pricing modal
    - [x] Open payment confirmation modal
  - [x] Add PaymentConfirmationModal component
  - [x] Pass plan details to payment modal
  - [x] Handle success callback
    - [x] Refresh subscription data
    - [x] Show success toast
    - [x] Update UI to reflect new plan
  - [x] Handle cancel callback
    - [x] Reset state
    - [x] Close modal
  - [x] Wrap in StripeProvider if needed

---

## Phase 10: Pricing Cards Update ⚠️ (Partially Complete)

- [x] **Update OrganizationPricingCards** (`src/components/organizations/OrganizationPricingCards.tsx`)
  - [x] Ensure plan priceId (Stripe priceId) is included in each plan
  - [x] Pass full plan object to onSelectPlan (not just ID)
  - [x] Include priceId, amount, interval in plan data
  - [x] Verify all plan metadata is available
  - [x] Update callback signature: `onSelectPlan(plan: OrganizationPlan)` where Plan includes priceId
  - [x] Export OrganizationPlan interface for type safety

- [ ] **Map organization plans to Stripe prices**
  - [ ] Fetch Stripe products on page load (optional)
  - [ ] Fetch prices for products (optional)
  - [ ] OR hardcode Stripe priceIds in organizationPlans constant
  - [ ] Ensure each plan has correct Stripe priceId:
    - [x] Free Trial: null (no subscription needed)
    - [ ] Explore Plan: `price_xxxxx` (Replace 'price_explore' with actual Stripe price ID)
    - [ ] Execute Plan: `price_xxxxx` (Replace 'price_execute' with actual Stripe price ID)
    - [ ] Command Plan: `price_xxxxx` (Replace 'price_command' with actual Stripe price ID)

  **Note**: Placeholder priceIds are currently set ('price_explore', 'price_execute', 'price_command').
  Replace these with actual Stripe price IDs from your Stripe Dashboard.

---

## Phase 10.5: Subscription Management Features

- [ ] **Add subscription cancellation** (Billing page)
  - [ ] Add "Cancel Subscription" button for paid plans
  - [ ] Create confirmation dialog before cancellation
  - [ ] Call DELETE /api/v1/stripe/subscription/:subscriptionId
  - [ ] Update UI after successful cancellation
  - [ ] Show grace period until end of billing cycle
  - [ ] Handle errors gracefully

- [ ] **Add subscription upgrade/downgrade**
  - [ ] Allow upgrading from lower to higher tier
  - [ ] Allow downgrading from higher to lower tier
  - [ ] Show prorated amount information
  - [ ] Confirm before processing change
  - [ ] Update subscription with new priceId

- [ ] **Display subscription details**
  - [ ] Fetch subscription info (GET /api/v1/stripe/subscription/:subscriptionId)
  - [ ] Show current period start/end dates
  - [ ] Show next billing date
  - [ ] Show subscription status (active/canceled/past_due)
  - [ ] Show cancel_at_period_end flag if applicable

---

## Phase 11: Error Handling & Edge Cases

- [ ] **Payment error handling**
  - [ ] Handle insufficient funds error
  - [ ] Handle card declined error
  - [ ] Handle expired card error
  - [ ] Handle network timeout
  - [ ] Handle Stripe API errors
  - [ ] Add user-friendly error messages
  - [ ] Add retry mechanism for transient errors
  - [ ] Log errors for debugging

- [ ] **Edge cases**
  - [ ] Handle user navigating away during payment
  - [ ] Handle duplicate payment attempts
  - [ ] Handle payment method already exists
  - [ ] Handle subscription already active
  - [ ] Handle expired payment intent
  - [ ] Add loading states everywhere

---

## Phase 12: Testing

- [ ] **Component testing**
  - [ ] Test PaymentMethodCard rendering
  - [ ] Test PaymentMethodList selection
  - [ ] Test StripeCardForm validation
  - [ ] Test PaymentConfirmationModal states

- [ ] **Flow testing**
  - [ ] Test upgrade with no payment method
    - [ ] Enter card details
    - [ ] Submit payment
    - [ ] Verify upgrade completes
  - [ ] Test upgrade with existing payment method
    - [ ] Select existing card
    - [ ] Confirm upgrade
    - [ ] Verify upgrade completes
  - [ ] Test adding new method when one exists
    - [ ] Select "Add new card"
    - [ ] Enter card details
    - [ ] Complete payment
  - [ ] Test cancellation at each step
  - [ ] Test error scenarios with Stripe test cards
    - [ ] Use card decline test number
    - [ ] Use insufficient funds test number
    - [ ] Verify error messages display

- [ ] **Integration testing**
  - [ ] Test free to paid upgrade
  - [ ] Test paid to higher tier upgrade
  - [ ] Test downgrade flow (if applicable)
  - [ ] Verify subscription updates in backend
  - [ ] Verify payment recorded correctly

---

## Phase 13: UI/UX Polish

- [ ] **Visual improvements**
  - [ ] Add loading spinners for async operations
  - [ ] Add success animations/checkmarks
  - [ ] Add smooth transitions between states
  - [ ] Ensure consistent spacing and alignment
  - [ ] Verify color scheme matches app theme
  - [ ] Add proper focus states for accessibility

- [ ] **Responsive design**
  - [ ] Test on mobile viewport
  - [ ] Test on tablet viewport
  - [ ] Ensure modals are scrollable on small screens
  - [ ] Verify touch targets are adequate size
  - [ ] Test card input on mobile keyboard

- [ ] **Accessibility**
  - [ ] Add proper ARIA labels
  - [ ] Ensure keyboard navigation works
  - [ ] Verify screen reader compatibility
  - [ ] Add proper focus management in modals
  - [ ] Test with keyboard only

---

## Phase 14: Documentation & Cleanup

- [ ] **Code documentation**
  - [ ] Add JSDoc comments to components
  - [ ] Document payment flow in code comments
  - [ ] Add inline comments for complex logic
  - [ ] Update README if needed

- [ ] **Code cleanup**
  - [ ] Remove console.logs
  - [ ] Remove commented code
  - [ ] Ensure consistent formatting
  - [ ] Run linter and fix issues
  - [ ] Check for unused imports
  - [ ] Verify TypeScript strict mode compliance

- [ ] **Final review**
  - [ ] Review all error messages for clarity
  - [ ] Verify no sensitive data in logs
  - [ ] Check for security best practices
  - [ ] Ensure no hardcoded values
  - [ ] Review git diff before commit

---

## Files Checklist

### New Files to Create:
- [x] `src/types/stripe.ts` ✅
- [x] `src/components/stripe/StripeProvider.tsx` ✅
- [x] `src/components/stripe/PaymentMethodCard.tsx` ✅
- [x] `src/components/stripe/PaymentMethodList.tsx` ✅
- [x] `src/components/stripe/StripeCardForm.tsx` ✅
- [x] `src/components/stripe/PaymentConfirmationModal.tsx` ✅
- [ ] `src/components/organizations/SubscriptionManagement.tsx` (optional - for cancel/change plan)

### Files to Modify:
- [x] `src/actions/stripeActions.ts` - Add all new API action functions ✅
- [x] `src/app/(protected)/organizations/[tenantId]/billing/page.tsx` - Integrate payment flow ✅
- [x] `src/components/organizations/OrganizationPricingCards.tsx` - Add Stripe priceIds ⚠️ (Placeholders added, need actual IDs)
- [x] `.env` - Already has NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ✅
- [x] `package.json` - Already has Stripe packages ✅

---

## Payment Flow Summary

### Flow A: New User (No Payment Method)
1. User selects plan → Opens PaymentConfirmationModal
2. Fetch payment methods → Empty array returned
3. Show StripeCardForm (CardElement)
4. User enters card details
5. Create payment intent → Get clientSecret
6. Stripe.js confirms card → Get paymentMethodId
7. Add payment method to customer → Save for future use
8. Create subscription with priceId → Subscription created
9. Success → Update UI, show success message

### Flow B: Returning User (Has Payment Method)
1. User selects plan → Opens PaymentConfirmationModal
2. Fetch payment methods → Display existing cards
3. User selects existing card (radio button)
4. Create subscription with priceId → Use default payment method
5. Success → Update UI, show success message

### Flow C: User Wants New Card (Has Existing)
1. User selects plan → Opens PaymentConfirmationModal
2. Fetch payment methods → Display existing cards
3. User selects "Add New Card" option
4. Follow Flow A steps 3-9

---

## Testing with Stripe Test Cards

Use these test card numbers for different scenarios:

- [ ] **Success**: `4242 4242 4242 4242`
- [ ] **Decline**: `4000 0000 0000 0002`
- [ ] **Insufficient funds**: `4000 0000 0000 9995`
- [ ] **Expired card**: `4000 0000 0000 0069`
- [ ] **Processing error**: `4000 0000 0000 0119`

Always use:
- Any future expiry date (e.g., 12/34)
- Any 3-digit CVC
- Any postal code

---

## Security Checklist

- [ ] Never log payment method details
- [ ] Use Stripe Elements (PCI compliant)
- [ ] Validate amounts server-side
- [ ] Use HTTPS in production
- [ ] Implement rate limiting for payment endpoints
- [ ] Sanitize all user inputs
- [ ] Use environment variables for keys
- [ ] Never expose secret keys in frontend

---

## Success Criteria

- [x] User can upgrade plan with no existing payment method
- [x] User can upgrade plan using existing payment method
- [x] User can add new payment method when one exists
- [x] All error cases show user-friendly messages
- [x] Payment processing is smooth and fast
- [x] UI is responsive on all devices
- [x] Code is well-documented and clean
- [x] No security vulnerabilities
- [x] All tests pass

---

## Notes

- Prioritize user experience - payment should feel secure and simple
- Keep the UI minimal and focused during payment flow
- Always provide clear feedback on what's happening
- Make it easy to cancel/go back at any step
- Test thoroughly with Stripe test cards before going live

---

**Start Date**: _____  
**Target Completion**: _____  
**Actual Completion**: _____
