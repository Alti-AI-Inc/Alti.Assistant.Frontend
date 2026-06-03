'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClientJson, buildApiUrl } from '@/lib/api-client';

export interface InboxItem {
  _id: string;
  title: string;
  description: string;
  isRead: boolean;
  isArchived: boolean;
  link?: string;
  category: string;
  userId: string;
  tenantId?: string;
  payload?: {
    status?: 'success' | 'failed';
    executionId?: string;
    workflowName?: string;
    completedSteps?: number;
    totalSteps?: number;
    duration?: number;
    summary?: string;
    error?: string;
    results?: Array<{
      stepId: string;
      success: boolean;
      duration?: number;
      result?: any;
      error?: string;
    }>;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Hook to fetch the user's completed outputs / inbox items
 */
export function useInboxQuery(userId?: string, category?: string, archived?: boolean, accessToken?: string) {
  return useQuery<InboxItem[]>({
    queryKey: ['inbox', userId, category, archived, accessToken],
    queryFn: async () => {
      if (!userId || !accessToken) return [];
      
      const categoryParam = category ? `&category=${category}` : '';
      const archivedParam = archived !== undefined ? `&archived=${archived}` : '&archived=false';
      const url = buildApiUrl(`/notification/user/${userId}/inbox?${categoryParam}${archivedParam}`);
      
      const response = await apiClientJson<InboxItem[]>(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      if (!response.success) {
        console.error('Failed to fetch user inbox items:', response.debugMessage);
        return [];
      }
      
      return response.data || [];
    },
    enabled: !!userId && !!accessToken,
    staleTime: 1000 * 30, // 30s caching
  });
}

/**
 * Hook to toggle archiving state of an inbox notification item
 */
export function useArchiveInboxItemMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      notificationId,
      archived = true,
      accessToken,
    }: {
      notificationId: string;
      archived?: boolean;
      accessToken: string;
    }) => {
      const url = buildApiUrl(`/notification/archive/${notificationId}`);
      
      const response = await apiClientJson(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ archived }),
      });
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to archive inbox item');
      }
      
      return response.data;
    },
    onSuccess: () => {
      // Invalidate both inbox queries to refresh active and archived feeds
      queryClient.invalidateQueries({ queryKey: ['inbox'] });
    },
  });
}
