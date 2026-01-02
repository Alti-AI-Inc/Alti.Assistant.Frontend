'use server';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  debugMessage?: string;
  statusCode?: number;
}

export interface Connection {
  _id: string;
  userId: string;
  authConfigId: string;
  connectedAccountId: string;
  redirectUrl: string;
  status: APP_STATUS;
  __v: number;
  toolkit: {
    slug: string;
  };
}

interface InitiateResponse {
  authConfig: {
    authConfig: {
      id: string;
      status: string;
      redirectUrl: string;
      connectedAccountId: string;
    };
    message: string;
  };
  error: string;
}

interface WaitForConnectionResponse {
  connection: {
    connection: {
      id: string;
      authConfig: {
        id: string;
        isComposioManaged: boolean;
        isDisabled: boolean;
      };
      data: {
        status: string;
      };
    };
  };
}

export const getConnections = async (
  accessToken?: string,
): Promise<ApiResponse<Connection[]>> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/composio_v2/user-connections`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'content-type': 'application/json',
        },
      },
    );
    const data = await response.json();

    return { success: true, message: 'Success', data: data.data ?? [] };
  } catch (error: any) {
    console.error('getConnections Error:', error);
    return {
      success: false,
      message: 'Failed to fetch connections.',
      debugMessage: error.message || String(error),
      statusCode: 500,
    };
  }
};

export async function initiateConnection(
  app_name: string,
  user_id: string,
  accessToken: string,
): Promise<ApiResponse<InitiateResponse>> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/composio_v2/initiate`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          app_name,
          user_id,
        }),
      },
    );
    const data = await response.json();
    return { success: true, message: 'Success', data };
  } catch (error: any) {
    console.error('initiateConnection Error:', error);
    return {
      success: false,
      message: 'Failed to initiate connection.',
      debugMessage: error.message || String(error),
      statusCode: 500,
    };
  }
}

export async function waitForConnection(
  connected_account_id: string,
): Promise<ApiResponse<WaitForConnectionResponse>> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/composio_v2/wait-for-connection`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          connected_account_id,
        }),
      },
    );
    const data = await response.json();
    return { success: true, message: 'Success', data };
  } catch (error: any) {
    console.error('waitForConnection Error:', error);
    return {
      success: false,
      message: 'Failed to wait for connection.',
      debugMessage: error.message || String(error),
      statusCode: 500,
    };
  }
}
