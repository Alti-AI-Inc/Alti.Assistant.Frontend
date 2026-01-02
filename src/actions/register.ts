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
}: {
  email: string;
  password: string;
  confirmPassword: string;
}): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          confirmPassword,
        }),
      },
    );
    const data = await response.json();
    // Assuming backend returns { success: boolean, message: string, ... } or similar
    // We assume data itself is the response structure
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
