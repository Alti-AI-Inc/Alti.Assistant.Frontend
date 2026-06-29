'use client';

import {
  getConnections,
} from '@/actions/apps';
import { useQuery } from '@tanstack/react-query';

export const useConnectionsQuery = (accessToken?: string) => {
  return useQuery({
    queryKey: ['connections', accessToken],
    queryFn: async () => {
      const response = await getConnections(accessToken);
      if (!response.success) {
        console.error('getConnections failed:', response.debugMessage);
        return [];
      }
      return response.data!;
    },
    enabled: !!accessToken, // only run when userId is available
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
