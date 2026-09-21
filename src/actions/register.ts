'use server';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  debugMessage?: string;
  statusCode?: number;
}

const API_URL =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'https://api.altihq.com/api/v1';

export async function RegisterUser({
  email,
  password,
  confirmPassword,
  invitationToken,
}: {
  email: string;
  password: string;
  confirmPassword: string;
  invitationToken?: string;
}): Promise<ApiResponse<any>> {
  try {
    const body: Record<string, string> = { email, password, confirmPassword };
    if (invitationToken) body.invitationToken = invitationToken;

    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();

    let errorMessage = data.message || (response.ok ? 'Success' : 'Failed');
    if (
      data.errorMessages &&
      Array.isArray(data.errorMessages) &&
      data.errorMessages.length > 0
    ) {
      errorMessage = data.errorMessages.map((e: any) => e.message).join(', ');
    }

    return {
      success: data.success || data.status === 'success' || response.ok,
      message: errorMessage,
      data: data.data || data,
      statusCode: response.status,
    };
  } catch (error: any) {
    console.error('RegisterUser Error:', error);
    return {
      success: false,
      message: error?.message || 'Failed to register.',
      debugMessage: error?.message || String(error),
      statusCode: 500,
    };
  }
}

export async function confirmRegistration(
  token: string,
): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_URL}/auth/register/confirmation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    const data = await response.json();
    return {
      success: data.success || data.status === 'success' || response.ok,
      message: data.message || (response.ok ? 'Success' : 'Failed'),
      data: data.data || data,
      statusCode: response.status,
    };
  } catch (error: any) {
    console.error('confirmRegistration Error:', error);
    return {
      success: false,
      message: error?.message || 'Failed to verify code.',
      debugMessage: error?.message || String(error),
      statusCode: 500,
    };
  }
}

export async function checkEmailStatus(
  email: string,
): Promise<'unverified' | 'verified' | 'not_found' | 'error'> {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'dummy_check_password_123!' }),
    });
    const data = await res.json();
    const msg = (data.message || '').toLowerCase();

    if (msg.includes('verify your email') || msg.includes('verify your e-mail')) {
      return 'unverified';
    }
    if (msg.includes('not found') || res.status === 404) {
      return 'not_found';
    }
    if (msg.includes('invalid') || res.status === 401 || res.status === 200) {
      return 'verified';
    }
    return 'error';
  } catch (error) {
    console.error('checkEmailStatus Error:', error);
    return 'error';
  }
}

export async function resendConfirmation(
  email: string,
): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(
      `${API_URL}/auth/register/resend-confirmation`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      },
    );
    const data = await response.json();
    let message = data.message || (response.ok ? 'New code sent.' : 'Failed to resend code.');

    if (
      /535|gsmtp|BadCredentials|Username and Password not accepted/i.test(message) ||
      response.status === 500
    ) {
      message = 'Email service is temporarily unavailable. Please try again shortly.';
    } else if (/exceeded|limit/i.test(message) || response.status === 429) {
      message = 'Please wait a moment before requesting another code.';
    }

    return {
      success: data.success || data.status === 'success' || response.ok,
      message,
      data: data.data || data,
      statusCode: response.status,
    };
  } catch (error: any) {
    console.error('resendConfirmation Error:', error);
    return {
      success: false,
      message: 'Email service is temporarily unavailable. Please try again shortly.',
      statusCode: 500,
    };
  }
}
