'use server';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  debugMessage?: string;
  statusCode?: number;
}

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

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    );
    const data = await response.json();
    return {
      success: data.success || data.status === 'success' || response.ok,
      message: data.message || (response.ok ? 'Success' : 'Failed'),
      data: data.data || data,
      statusCode: response.status,
    };
  } catch (error: any) {
    console.error('RegisterUser Error:', error);
    return {
      success: false,
      message: 'Failed to register.',
      debugMessage: error.message || String(error),
      statusCode: 500,
    };
  }
}

export async function confirmRegistration(token: string): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/register/confirmation`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      },
    );
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
      message: 'Failed to verify code.',
      debugMessage: error.message || String(error),
      statusCode: 500,
    };
  }
}
