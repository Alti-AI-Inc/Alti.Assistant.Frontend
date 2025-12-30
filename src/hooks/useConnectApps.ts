'use client';

import {
  getConnections,
  initiateConnection,
  waitForConnection,
} from '@/actions/apps';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useConnectionsQuery = (accessToken?: string) => {
  return useQuery({
    queryKey: ['connections', accessToken],
    queryFn: async () => {
      const response = await getConnections(accessToken);
      if (!response.success) {
        console.error('getConnections failed:', response.debugMessage);
        console.error('getConnections failed:', response.debugMessage);
        // throw new Error(response.message);
        return [];
      }
      return response.data!;
    },
    enabled: !!accessToken, // only run when userId is available
  });
};

export const useInitiateConnectionMutation = () => {
  return useMutation({
    mutationFn: async ({
      app_name,
      user_id,
      accessToken,
    }: {
      app_name: string;
      user_id: string;
      accessToken: string;
    }) => {
      const response = await initiateConnection(app_name, user_id, accessToken);
      if (!response.success) {
        console.error('initiateConnection failed:', response.debugMessage);
        console.error(response.debugMessage);
        // throw new Error(response.message);
        return null;
      }
      return response.data!;
    },
  });
};

export const useWaitForConnectionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (connectedAccountId: string) => {
      const response = await waitForConnection(connectedAccountId);
      if (!response.success) {
        console.error('waitForConnection failed:', response.debugMessage);
        console.error(response.debugMessage);
        // throw new Error(response.message);
        return null;
      }
      return response.data!;
    },
    onSuccess: () => {
      console.log('✅ Connection established, refreshing connections');
      // ✅ refresh connections after success
      queryClient.invalidateQueries({ queryKey: ['connections'] });
    },
  });
};
