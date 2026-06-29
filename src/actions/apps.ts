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
        isComposioManaged: boolean;
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

