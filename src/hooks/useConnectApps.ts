'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// ----------------- Types -----------------
interface Connection {
  id: string;
  status: string;
  // [key: string]: any;
}

interface InitiateResponse {
  authConfig: {
    authConfig: {
      id: string;
      status: string;
      redirectUrl: string;
    };
  };
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

// ----------------- API Calls -----------------
const getConnections = async (userId: string): Promise<Connection[]> => {
  const { data } = await axios.get(`/api/v1/composio_v2/user-connections`, {
    params: { user_id: userId },
  });
  return data;
};

const initiateConnection = async (payload: {
  app_name: string;
  user_id: string;
}): Promise<InitiateResponse> => {
  const { data } = await axios.post(`/api/v1/composio_v2/initiate`, payload);
  return data;
};

const waitForConnection = async (payload: {
  connected_account_id: string;
}): Promise<WaitForConnectionResponse> => {
  const { data } = await axios.post(`/api/v1/composio_v2/wait-for-connection`, payload);
  return data;
};

// ----------------- Hooks -----------------
export const useConnectionsQuery = (userId: string) => {
  return useQuery({
    queryKey: ['connections', userId],
    queryFn: () => getConnections(userId),
    enabled: !!userId, // only run when userId is available
  });
};

export const useInitiateConnectionMutation = () => {
  return useMutation({
    mutationFn: initiateConnection,
  });
};

export const useWaitForConnectionMutation = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: waitForConnection,
    onSuccess: (data) => {
      const status = data.connection.connection.data.status;
      if (status === 'ACTIVE') {
        // invalidate & refetch connections
        queryClient.invalidateQueries({ queryKey: ['connections', userId] });
      }
    },
  });
};
