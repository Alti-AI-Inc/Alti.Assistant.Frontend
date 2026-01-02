import {
  createKnowledgeBankFolderAction,
  deleteKnowledgeBankFile,
  deleteKnowledgeBankFolderAction,
  fetchKnowledgeBankFolderContent,
  fetchKnowledgeBankFolders,
  KnowledgeBankFolder,
  KnowledgeBankFolderContentResponse,
  processKnowledgeBankFile,
  updateKnowledgeBankFolderAction,
} from '@/actions/knowledgeBankAction';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function useKnowledgeBankGetFoldersQuery() {
  const { data: session } = useSession();
  return useQuery<KnowledgeBankFolder[]>({
    queryKey: ['knowledgeBankFolders', session?.accessToken],
    queryFn: async () => {
      const response = await fetchKnowledgeBankFolders(
        session?.accessToken as string,
      );
      if (!response.success) {
        console.error(
          'fetchKnowledgeBankFolders failed:',
          response.debugMessage,
        );
        console.error(response.debugMessage);
        // throw new Error(response.message);
        return null as any;
      }
      return response.data!;
    },
    enabled: !!session?.accessToken, // only run if token exists
    staleTime: 15000 * 60, // 15 min caching
  });
}

export function useKnowledgeBankFolderContent(
  folderId: string,
  accessToken?: string,
): UseQueryResult<KnowledgeBankFolderContentResponse> {
  return useQuery<KnowledgeBankFolderContentResponse>({
    queryKey: ['knowledgeBankFolderContent', folderId],
    queryFn: async () => {
      const response = await fetchKnowledgeBankFolderContent(
        folderId,
        accessToken!,
      );
      if (!response.success) {
        console.error(
          'fetchKnowledgeBankFolderContent failed:',
          response.debugMessage,
        );
        console.error(response.debugMessage);
        // throw new Error(response.message);
        return null as any;
      }
      return response.data!;
    },
    enabled: !!accessToken && !!folderId, // only run if token exists
    staleTime: 15000 * 60, // 15 min caching
  });
}

export function useKnowledgeBankCreateFolderMutation(onClose: () => void) {
  const session = useSession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      description,
    }: {
      name: string;
      description: string;
    }) => {
      if (!session?.data?.accessToken) {
        console.error('Token not found');
        return null;
      }
      const response = await createKnowledgeBankFolderAction(
        name,
        description,
        session.data.accessToken,
      );
      if (!response.success) {
        console.error(
          'createKnowledgeBankFolderAction failed:',
          response.debugMessage,
        );
        console.error(response.debugMessage);
        // throw new Error(response.message);
        return null;
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['knowledgeBankFolders', session?.data?.accessToken],
      });
      onClose();
    },
    onError: error => {
      console.error(' failed', error);
    },
  });
}
export function useKnowledgeBankUpdateFolderMutation(onClose: () => void) {
  const session = useSession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      description,
      folderId,
    }: {
      name: string;
      description: string;
      folderId: string;
    }) => {
      if (!session?.data?.accessToken) {
        console.error('Token not found');
        return null;
      }
      const response = await updateKnowledgeBankFolderAction(
        name,
        description,
        folderId,
        session.data.accessToken,
      );
      if (!response.success) {
        console.error(
          'updateKnowledgeBankFolderAction failed:',
          response.debugMessage,
        );
        console.error(response.debugMessage);
        // throw new Error(response.message);
        return null;
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['knowledgeBankFolders', session?.data?.accessToken],
      });
      onClose();
    },
    onError: error => {
      console.error(' failed', error);
    },
  });
}

export function useDeleteKnowledgeBankFolder(onClose?: () => void) {
  const queryClient = useQueryClient();
  const { data } = useSession();

  return useMutation({
    mutationFn: async (folderId: string) => {
      const response = await deleteKnowledgeBankFolderAction(
        folderId,
        data?.accessToken,
      );
      if (!response.success) {
        console.error(
          'deleteKnowledgeBankFolderAction failed:',
          response.debugMessage,
        );
        console.error(response.debugMessage);
        // throw new Error(response.message);
        return null;
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['knowledgeBankFolders', data?.accessToken],
      });
      if (onClose) onClose();
    },
    onError: error => {
      console.error('Folder deletion failed:', error);
    },
  });
}

export function useDeleteKnowledgeBankFile(
  folderId: string,
  onClose?: () => void,
) {
  const queryClient = useQueryClient();
  const { data } = useSession();

  return useMutation({
    mutationFn: async ({ fileId }: { fileId: string }) => {
      const response = await deleteKnowledgeBankFile(fileId, data?.accessToken);
      if (!response.success) {
        console.error('deleteKnowledgeBankFile failed:', response.debugMessage);
        console.error(response.debugMessage);
        // throw new Error(response.message);
        return null;
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['knowledgeBankFolderContent', folderId],
      });
      if (onClose) onClose();
    },
    onError: error => {
      console.error('File deletion failed:', error);
    },
  });
}
export function useProcessKnowledgeBankFile(folderId: string) {
  const queryClient = useQueryClient();
  const { data } = useSession();

  return useMutation({
    mutationFn: async ({ fileId }: { fileId: string }) => {
      const response = await processKnowledgeBankFile(
        fileId,
        data?.accessToken as string,
      );
      if (!response.success) {
        console.error(
          'processKnowledgeBankFile failed:',
          response.debugMessage,
        );
        console.error(response.debugMessage);
        // throw new Error(response.message);
        return null;
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['knowledgeBankFolderContent', folderId],
      });
    },
    onError: error => {
      console.error('File deletion failed:', error);
    },
  });
}
