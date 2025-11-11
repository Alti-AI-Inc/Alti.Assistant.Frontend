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
    queryFn: () => fetchKnowledgeBankFolders(session?.accessToken as string),
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
    queryFn: () => fetchKnowledgeBankFolderContent(folderId, accessToken!),
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
        throw new Error('Token not found');
      }
      return createKnowledgeBankFolderAction(
        name,
        description,
        session.data.accessToken,
      );
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
        throw new Error('Token not found');
      }
      return updateKnowledgeBankFolderAction(
        name,
        description,
        folderId,
        session.data.accessToken,
      );
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
    mutationFn: (folderId: string) =>
      deleteKnowledgeBankFolderAction(folderId, data?.accessToken),
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
    mutationFn: ({ fileId }: { fileId: string }) =>
      deleteKnowledgeBankFile(fileId, data?.accessToken),
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
    mutationFn: ({ fileId }: { fileId: string }) =>
      processKnowledgeBankFile(fileId, data?.accessToken as string),
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
