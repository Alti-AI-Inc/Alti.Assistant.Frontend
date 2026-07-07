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
  status: string;
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
        isMcpManaged: boolean;
        isDisabled: boolean;
      };
      data: {
        status: string;
      };
    };
  };
}

/**
 * Fetches connections by querying active MCP servers status and mapping them to connection objects.
 */
export const getConnections = async (
  accessToken?: string,
): Promise<ApiResponse<Connection[]>> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/mcp-toolbox/servers/status`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'content-type': 'application/json',
        },
      },
    );
    const data = await response.json();
    
    // Map active MCP servers to standard connection structures
    const serversList = data?.servers || [];
    const connections: Connection[] = serversList
      .filter((s: any) => s.status === 'active' || s.status === 'connected')
      .map((s: any) => ({
        _id: s.id,
        userId: '',
        authConfigId: '',
        connectedAccountId: '',
        redirectUrl: '',
        status: 'active',
        __v: 0,
        toolkit: {
          slug: s.id
        }
      }));

    return { success: true, message: 'Success', data: connections };
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

export const installApp = async (
  accessToken?: string,
  appId?: string,
  env?: Record<string, string>,
  databaseUrl?: string
): Promise<ApiResponse> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/mcp-toolbox/install-app`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({ appId, env, databaseUrl }),
      },
    );
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('installApp Error:', error);
    return {
      success: false,
      message: 'Failed to install application.',
      debugMessage: error.message || String(error),
      statusCode: 500,
    };
  }
};

export const stopApp = async (
  accessToken?: string,
  appId?: string
): Promise<ApiResponse> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/mcp-toolbox/stop-server`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({ serverId: appId }),
      },
    );
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('stopApp Error:', error);
    return {
      success: false,
      message: 'Failed to stop application.',
      debugMessage: error.message || String(error),
      statusCode: 500,
    };
  }
};

