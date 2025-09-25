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
    queryFn: () => getConnections(accessToken),
    enabled: !!accessToken, // only run when userId is available
  });
};

export const useInitiateConnectionMutation = () => {
  return useMutation({
    mutationFn: ({
      app_name,
      user_id,
      accessToken,
    }: {
      app_name: string;
      user_id: string;
      accessToken: string;
    }) => initiateConnection(app_name, user_id, accessToken),
  });
};

export const useWaitForConnectionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (connectedAccountId: string) =>
      waitForConnection(connectedAccountId),
    onSuccess: () => {
      console.log('✅ Connection established, refreshing connections');
      // ✅ refresh connections after success
      queryClient.invalidateQueries({ queryKey: ['connections'] });
    },
  });
};
