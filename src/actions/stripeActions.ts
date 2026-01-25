'use server';

// ============================================================================
// STRIPE ACTIONS - Backend API Integration for Multi-Tenant Stripe Management
// ============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  debugMessage?: string;
  statusCode?: number;
}

// ============================================================================
// TYPES
// ============================================================================

export interface StripeCustomer {
  id: string; // cus_xxxx
  name: string | null;
  email: string | null;
  phone: string | null;
  address: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  } | null;
  created: number;
  metadata?: Record<string, string>;
  invoice_settings?: {
    default_payment_method: string | null;
  };
}

export interface StripeProduct {
  id: string; // prod_xxxx
  name: string;
  description: string | null;
  active: boolean;
  metadata?: Record<string, string>;
  created: number;
}

export interface StripePrice {
  id: string; // price_xxxx
  product: string;
  active: boolean;
  currency: string;
  unit_amount: number; // in cents
  nickname: string | null;
  recurring: {
    interval: 'day' | 'week' | 'month' | 'year';
    interval_count: number;
  } | null;
}

export interface StripePaymentMethod {
  id: string; // pm_xxxx
  type: string;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
  created: number;
}

export interface StripeSubscription {
  id: string; // sub_xxxx
  customer: string;
  status:
    | 'active'
    | 'canceled'
    | 'incomplete'
    | 'past_due'
    | 'trialing'
    | 'unpaid';
  current_period_start: number;
  current_period_end: number;
  items: {
    data: Array<{
      id: string;
      price: StripePrice;
    }>;
  };
  created: number;
}

export interface StripePaymentIntent {
  id: string; // pi_xxxx
  client_secret: string;
  amount: number;
  currency: string;
  status: string;
  customer: string | null;
}

// ============================================================================
// CUSTOMER MANAGEMENT
// ============================================================================

export async function getStripeCustomers(
  accessToken: string,
): Promise<ApiResponse<StripeCustomer[]>> {
  console.log('[stripeActions] GET - getStripeCustomers payload:', null);

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/stripe/customers`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || 'Failed to fetch customers',
        statusCode: response.status,
      };
    }

    const data = await response.json();
    console.log(
      '[stripeActions] GET - getStripeCustomers response:',
      // JSON.stringify(data),
      data,
    );
    // Backend returns: { accounts: { object: "list", data: [...] } }
    const customers =
      data.accounts?.data ||
      data.customers?.data ||
      data.customers ||
      data.data ||
      [];
    return {
      success: true,
      message: 'Customers fetched successfully',
      data: customers,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[stripeActions] GET - getStripeCustomers error:', error);
    return {
      success: false,
      message: 'Failed to fetch customers',
      debugMessage: errorMessage,
      statusCode: 500,
    };
  }
}

export async function getStripeCustomer(
  customerId: string,
  accessToken: string,
): Promise<ApiResponse<StripeCustomer>> {
  console.log('[stripeActions] GET - getStripeCustomer payload:', {
    customerId,
  });

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/stripe/customer/${customerId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || 'Failed to fetch customer',
        statusCode: response.status,
      };
    }

    const data = await response.json();
    console.log(
      '[stripeActions] GET - getStripeCustomer response:',
      // JSON.stringify(data),
      data,
    );
    return {
      success: true,
      message: 'Customer fetched successfully',
      data: data.customer || data,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[stripeActions] GET - getStripeCustomer error:', error);
    return {
      success: false,
      message: 'Failed to fetch customer',
      debugMessage: errorMessage,
      statusCode: 500,
    };
  }
}

export async function createStripeCustomer(
  customerData: {
    name: string;
    email: string;
    phone?: string;
    address?: {
      line1: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  },
  accessToken: string,
): Promise<ApiResponse<StripeCustomer>> {
  console.log(
    '[stripeActions] POST - createStripeCustomer payload:',
    customerData,
  );

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/stripe/customer`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || 'Failed to create customer',
        statusCode: response.status,
      };
    }

    const data = await response.json();
    console.log(
      '[stripeActions] POST - createStripeCustomer response:',
      // JSON.stringify(data),
      data,
    );
    return {
      success: true,
      message: 'Customer created successfully',
      data: data.customer || data,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[stripeActions] POST - createStripeCustomer error:', error);
    return {
      success: false,
      message: 'Failed to create customer',
      debugMessage: errorMessage,
      statusCode: 500,
    };
  }
}

export async function updateStripeCustomer(
  customerId: string,
  updateData: Partial<{
    name: string;
    email: string;
    phone: string;
    address: {
      line1: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  }>,
  accessToken: string,
): Promise<ApiResponse<StripeCustomer>> {
  console.log('[stripeActions] PUT - updateStripeCustomer payload:', {
    customerId,
    updateData,
  });

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/stripe/customer/${customerId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || 'Failed to update customer',
        statusCode: response.status,
      };
    }

    const data = await response.json();
    console.log(
      '[stripeActions] PUT - updateStripeCustomer response:',
      // JSON.stringify(data),
      data,
    );
    return {
      success: true,
      message: 'Customer updated successfully',
      data: data.customer || data,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[stripeActions] PUT - updateStripeCustomer error:', error);
    return {
      success: false,
      message: 'Failed to update customer',
      debugMessage: errorMessage,
      statusCode: 500,
    };
  }
}

export async function deleteStripeCustomer(
  customerId: string,
  accessToken: string,
): Promise<ApiResponse<{ deleted: boolean }>> {
  console.log('[stripeActions] DELETE - deleteStripeCustomer payload:', {
    customerId,
  });

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/stripe/customer/${customerId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || 'Failed to delete customer',
        statusCode: response.status,
      };
    }

    console.log('[stripeActions] DELETE - deleteStripeCustomer response:', {
      deleted: true,
    });
    return {
      success: true,
      message: 'Customer deleted successfully',
      data: { deleted: true },
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(
      '[stripeActions] DELETE - deleteStripeCustomer error:',
      error,
    );
    return {
      success: false,
      message: 'Failed to delete customer',
      debugMessage: errorMessage,
      statusCode: 500,
    };
  }
}

// ============================================================================
// PRODUCT & PRICING MANAGEMENT
// ============================================================================

export async function getStripeProducts(
  accessToken: string,
): Promise<ApiResponse<StripeProduct[]>> {
  console.log('[stripeActions] GET - getStripeProducts payload:', null);

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/stripe/products`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || 'Failed to fetch products',
        statusCode: response.status,
      };
    }

    const data = await response.json();
    console.log(
      '[stripeActions] GET - getStripeProducts response:',
      // JSON.stringify(data),
      data,
    );
    // Backend returns: { products: { object: "list", data: [...] } }
    const products = data.products?.data || data.products || data.data || [];
    return {
      success: true,
      message: 'Products fetched successfully',
      data: products,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[stripeActions] GET - getStripeProducts error:', error);
    return {
      success: false,
      message: 'Failed to fetch products',
      debugMessage: errorMessage,
      statusCode: 500,
    };
  }
}

export async function getStripePrices(
  accessToken: string,
  productId?: string,
): Promise<ApiResponse<StripePrice[]>> {
  console.log('[stripeActions] GET - getStripePrices payload:', { productId });

  try {
    const url = productId
      ? `${process.env.NEXT_PUBLIC_API_URL}/stripe/prices?productId=${productId}`
      : `${process.env.NEXT_PUBLIC_API_URL}/stripe/prices`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || 'Failed to fetch prices',
        statusCode: response.status,
      };
    }

    const data = await response.json();
    console.log(
      '[stripeActions] GET - getStripePrices response:',
      // JSON.stringify(data),
      data,
    );
    return {
      success: true,
      message: 'Prices fetched successfully',
      data: data.prices?.data || data.prices || data.data || [],
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[stripeActions] GET - getStripePrices error:', error);
    return {
      success: false,
      message: 'Failed to fetch prices',
      debugMessage: errorMessage,
      statusCode: 500,
    };
  }
}

export async function createStripeProducts(
  accessToken: string,
): Promise<ApiResponse<StripeProduct[]>> {
  console.log('[stripeActions] POST - createStripeProducts payload:', {});

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/stripe/products`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || 'Failed to create products',
        statusCode: response.status,
      };
    }

    const data = await response.json();
    console.log('[stripeActions] POST - createStripeProducts response:', data);
    return {
      success: true,
      message: 'Products created successfully',
      data: data.products || data.data || [],
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[stripeActions] POST - createStripeProducts error:', error);
    return {
      success: false,
      message: 'Failed to create products',
      debugMessage: errorMessage,
      statusCode: 500,
    };
  }
}

export async function getStripeProduct(
  productId: string,
  accessToken: string,
): Promise<ApiResponse<StripeProduct>> {
  console.log('[stripeActions] GET - getStripeProduct payload:', { productId });

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/stripe/products/${productId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || 'Failed to fetch product',
        statusCode: response.status,
      };
    }

    const data = await response.json();
    console.log('[stripeActions] GET - getStripeProduct response:', data);
    return {
      success: true,
      message: 'Product fetched successfully',
      data: data.product || data,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[stripeActions] GET - getStripeProduct error:', error);
    return {
      success: false,
      message: 'Failed to fetch product',
      debugMessage: errorMessage,
      statusCode: 500,
    };
  }
}

// ============================================================================
// PAYMENT METHODS
// ============================================================================

export async function getPaymentMethods(
  customerId: string,
  accessToken: string,
  type: string = 'card',
): Promise<ApiResponse<StripePaymentMethod[]>> {
  console.log('[stripeActions] GET - getPaymentMethods payload:', {
    customerId,
    type,
  });

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/stripe/payment-methods/${customerId}/${type}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || 'Failed to fetch payment methods',
        statusCode: response.status,
      };
    }

    const data = await response.json();
    console.log(
      '[stripeActions] GET - getPaymentMethods response:',
      // JSON.stringify(data),
      data,
    );
    return {
      success: true,
      message: 'Payment methods fetched successfully',
      data: data.paymentMethods || data.data || [],
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[stripeActions] GET - getPaymentMethods error:', error);
    return {
      success: false,
      message: 'Failed to fetch payment methods',
      debugMessage: errorMessage,
      statusCode: 500,
    };
  }
}

export async function addPaymentMethod(
  customerId: string,
  paymentMethodId: string,
  accessToken: string,
): Promise<ApiResponse<StripePaymentMethod>> {
  console.log('[stripeActions] POST - addPaymentMethod payload:', {
    customerId,
    paymentMethodId,
  });

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/stripe/payment-method`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId, paymentMethodId }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || 'Failed to add payment method',
        statusCode: response.status,
      };
    }

    const data = await response.json();
    console.log(
      '[stripeActions] POST - addPaymentMethod response:',
      // JSON.stringify(data),
      data,
    );
    return {
      success: true,
      message: 'Payment method added successfully',
      data: data.paymentMethod || data,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[stripeActions] POST - addPaymentMethod error:', error);
    return {
      success: false,
      message: 'Failed to add payment method',
      debugMessage: errorMessage,
      statusCode: 500,
    };
  }
}

// ============================================================================
// PAYMENT INTENTS
// ============================================================================

export async function createPaymentIntent(
  amount: number,
  currency: string,
  customerId: string,
  accessToken: string,
): Promise<ApiResponse<StripePaymentIntent>> {
  console.log('[stripeActions] POST - createPaymentIntent payload:', {
    amount,
    currency,
    customerId,
  });

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/stripe/payment-intent`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, currency, customerId }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || 'Failed to create payment intent',
        statusCode: response.status,
      };
    }

    const data = await response.json();
    console.log(
      '[stripeActions] POST - createPaymentIntent response:',
      // JSON.stringify(data),
      data,
    );
    return {
      success: true,
      message: 'Payment intent created successfully',
      data: data.paymentIntent || data,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[stripeActions] POST - createPaymentIntent error:', error);
    return {
      success: false,
      message: 'Failed to create payment intent',
      debugMessage: errorMessage,
      statusCode: 500,
    };
  }
}

// ============================================================================
// SUBSCRIPTIONS
// ============================================================================

export async function getStripeSubscriptions(
  accessToken: string,
): Promise<ApiResponse<StripeSubscription[]>> {
  console.log('[stripeActions] GET - getStripeSubscriptions payload:', null);

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/stripe/subscriptions`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || 'Failed to fetch subscriptions',
        statusCode: response.status,
      };
    }

    const data = await response.json();
    console.log(
      '[stripeActions] GET - getStripeSubscriptions response:',
      // JSON.stringify(data),
      data,
    );
    // Backend returns: { subscriptions: { object: "list", data: [...] } }
    const subscriptions =
      data.subscriptions?.data || data.subscriptions || data.data || [];
    return {
      success: true,
      message: 'Subscriptions fetched successfully',
      data: subscriptions,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[stripeActions] GET - getStripeSubscriptions error:', error);
    return {
      success: false,
      message: 'Failed to fetch subscriptions',
      debugMessage: errorMessage,
      statusCode: 500,
    };
  }
}

export async function getStripeSubscription(
  subscriptionId: string,
  accessToken: string,
): Promise<ApiResponse<StripeSubscription>> {
  console.log('[stripeActions] GET - getStripeSubscription payload:', {
    subscriptionId,
  });

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/stripe/subscription/${subscriptionId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || 'Failed to fetch subscription',
        statusCode: response.status,
      };
    }

    const data = await response.json();
    console.log('[stripeActions] GET - getStripeSubscription response:', data);
    return {
      success: true,
      message: 'Subscription fetched successfully',
      data: data.subscription || data,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[stripeActions] GET - getStripeSubscription error:', error);
    return {
      success: false,
      message: 'Failed to fetch subscription',
      debugMessage: errorMessage,
      statusCode: 500,
    };
  }
}

export async function createSubscription(
  customerId: string,
  priceId: string,
  accessToken: string,
): Promise<ApiResponse<StripeSubscription>> {
  console.log('[stripeActions] POST - createSubscription payload:', {
    customerId,
    priceId,
  });

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/stripe/subscription`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId, priceId }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || 'Failed to create subscription',
        statusCode: response.status,
      };
    }

    const data = await response.json();
    console.log(
      '[stripeActions] POST - createSubscription response:',
      // JSON.stringify(data),
      data,
    );
    return {
      success: true,
      message: 'Subscription created successfully',
      data: data.subscription || data,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[stripeActions] POST - createSubscription error:', error);
    return {
      success: false,
      message: 'Failed to create subscription',
      debugMessage: errorMessage,
      statusCode: 500,
    };
  }
}

export async function cancelSubscription(
  subscriptionId: string,
  accessToken: string,
): Promise<ApiResponse<StripeSubscription>> {
  console.log('[stripeActions] DELETE - cancelSubscription payload:', {
    subscriptionId,
  });

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/stripe/subscription/${subscriptionId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || 'Failed to cancel subscription',
        statusCode: response.status,
      };
    }

    const data = await response.json();
    console.log(
      '[stripeActions] DELETE - cancelSubscription response:',
      // JSON.stringify(data),
      data,
    );
    return {
      success: true,
      message: 'Subscription canceled successfully',
      data: data.subscription || data,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[stripeActions] DELETE - cancelSubscription error:', error);
    return {
      success: false,
      message: 'Failed to cancel subscription',
      debugMessage: errorMessage,
      statusCode: 500,
    };
  }
}
