// Stripe Payment Integration Type Definitions

/**
 * Represents a Stripe payment method (credit/debit card)
 */
export interface PaymentMethod {
  id: string;
  object: 'payment_method';
  type: 'card';
  card: {
    brand: 'visa' | 'mastercard' | 'amex' | 'discover' | 'diners' | 'jcb' | 'unionpay' | 'unknown';
    last4: string;
    exp_month: number;
    exp_year: number;
    country?: string;
    funding?: 'credit' | 'debit' | 'prepaid' | 'unknown';
  };
  billing_details?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: {
      city?: string;
      country?: string;
      line1?: string;
      line2?: string;
      postal_code?: string;
      state?: string;
    };
  };
  created: number;
  customer?: string;
  livemode: boolean;
}

/**
 * Represents a Stripe payment intent
 */
export interface PaymentIntent {
  id: string;
  object: 'payment_intent';
  amount: number;
  currency: string;
  client_secret: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'succeeded' | 'canceled';
  payment_method?: string;
  customer?: string;
  description?: string;
  created: number;
  livemode: boolean;
}

/**
 * Represents a Stripe product
 */
export interface StripeProduct {
  id: string;
  object: 'product';
  name: string;
  description?: string;
  active: boolean;
  default_price?: string;
  metadata?: Record<string, string>;
  images?: string[];
  created: number;
  livemode: boolean;
}

/**
 * Represents a Stripe price
 */
export interface StripePrice {
  id: string;
  object: 'price';
  product: string;
  active: boolean;
  currency: string;
  unit_amount: number;
  type: 'one_time' | 'recurring';
  recurring?: {
    interval: 'day' | 'week' | 'month' | 'year';
    interval_count: number;
    trial_period_days?: number;
  };
  metadata?: Record<string, string>;
  created: number;
  livemode: boolean;
}

/**
 * Represents a Stripe subscription
 */
export interface Subscription {
  id: string;
  object: 'subscription';
  status: 'active' | 'past_due' | 'unpaid' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'trialing';
  customer: string;
  items: {
    data: Array<{
      id: string;
      price: StripePrice;
      quantity: number;
    }>;
  };
  current_period_start: number;
  current_period_end: number;
  cancel_at_period_end: boolean;
  canceled_at?: number;
  ended_at?: number;
  trial_start?: number;
  trial_end?: number;
  default_payment_method?: string;
  metadata?: Record<string, string>;
  created: number;
  livemode: boolean;
}

// ============================================================================
// REQUEST TYPES
// ============================================================================

/**
 * Request body for creating a payment intent
 */
export interface CreatePaymentIntentRequest {
  amount: number;
  currency: string;
}

/**
 * Request body for adding a payment method
 */
export interface AddPaymentMethodRequest {
  paymentMethodId: string;
}

/**
 * Request body for creating a subscription
 */
export interface CreateSubscriptionRequest {
  priceId: string;
}

// ============================================================================
// RESPONSE TYPES
// ============================================================================

/**
 * Response from GET /api/v1/stripe/my-payment-methods
 */
export interface GetPaymentMethodsResponse {
  data: PaymentMethod[];
  has_more: boolean;
}

/**
 * Response from POST /api/v1/stripe/payment-intent
 */
export interface CreatePaymentIntentResponse {
  paymentIntent: PaymentIntent;
  clientSecret: string;
}

/**
 * Response from POST /api/v1/stripe/payment-method
 */
export interface AddPaymentMethodResponse {
  paymentMethod: PaymentMethod;
  message: string;
}

/**
 * Response from GET /api/v1/stripe/products
 */
export interface GetProductsResponse {
  data: StripeProduct[];
  has_more: boolean;
}

/**
 * Response from GET /api/v1/stripe/prices
 */
export interface GetPricesResponse {
  data: StripePrice[];
  has_more: boolean;
}

/**
 * Response from POST /api/v1/stripe/subscription
 */
export interface CreateSubscriptionResponse {
  subscription: Subscription;
  message: string;
}

/**
 * Response from GET /api/v1/stripe/subscription/:id
 */
export interface GetSubscriptionResponse {
  subscription: Subscription;
}

/**
 * Response from DELETE /api/v1/stripe/subscription/:id
 */
export interface CancelSubscriptionResponse {
  subscription: Subscription;
  message: string;
}

// ============================================================================
// COMPONENT PROP TYPES
// ============================================================================

/**
 * Props for PaymentConfirmationModal component
 */
export interface PaymentConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  plan: {
    id: string;
    name: string;
    price: number;
    priceId: string;
    interval?: 'month' | 'year';
  };
}

/**
 * Props for PaymentMethodCard component
 */
export interface PaymentMethodCardProps {
  paymentMethod: PaymentMethod;
  isSelected?: boolean;
  isDefault?: boolean;
  onSelect?: (paymentMethodId: string) => void;
}

/**
 * Props for PaymentMethodList component
 */
export interface PaymentMethodListProps {
  paymentMethods: PaymentMethod[];
  selectedMethodId?: string;
  onSelectMethod: (paymentMethodId: string) => void;
  onAddNew: () => void;
  isLoading?: boolean;
}

/**
 * Props for StripeCardForm component
 */
export interface StripeCardFormProps {
  onCardComplete?: (isComplete: boolean) => void;
  onError?: (error: string) => void;
}

/**
 * Props for StripeProvider component
 */
export interface StripeProviderProps {
  children: React.ReactNode;
}

// ============================================================================
// PAYMENT FLOW TYPES
// ============================================================================

/**
 * State management for payment flow
 */
export interface PaymentFlowState {
  step: 'select_method' | 'enter_card' | 'processing' | 'success' | 'error';
  selectedMethodId?: string;
  paymentMethods: PaymentMethod[];
  isAddingNew: boolean;
  isLoading: boolean;
  error?: string;
}

/**
 * Actions for payment flow reducer
 */
export type PaymentFlowAction =
  | { type: 'SET_PAYMENT_METHODS'; payload: PaymentMethod[] }
  | { type: 'SELECT_METHOD'; payload: string }
  | { type: 'ADD_NEW_METHOD' }
  | { type: 'CANCEL_NEW_METHOD' }
  | { type: 'START_PROCESSING' }
  | { type: 'SUCCESS' }
  | { type: 'ERROR'; payload: string }
  | { type: 'RESET' };

/**
 * Generic API error response
 */
export interface ApiError {
  error: string;
  message: string;
  statusCode?: number;
}

/**
 * Result type for API calls
 */
export type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: ApiError };
