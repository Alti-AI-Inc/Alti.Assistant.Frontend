'use server';

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
): Promise<Connection[]> => {
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

  return data.data ?? [];
};

export async function initiateConnection(
  app_name: string,
  user_id: string,
  accessToken: string,
): Promise<InitiateResponse> {
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
  return data;
}

export async function waitForConnection(
  connected_account_id: string,
): Promise<WaitForConnectionResponse> {
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
  return data;
}
