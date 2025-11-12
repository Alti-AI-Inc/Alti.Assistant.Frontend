'use client';
import { KnowledgeBankFolder } from '@/actions/knowledgeBankAction';
import KnowledgeBankFileUpload from '@/components/KnowledgeBankFileUpload';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useKnowledgeBankGetFoldersQuery } from '@/hooks/useKnowledgeBank';
import { useModalStore } from '@/stores/useModalStore';
import {
  ArrowLeft,
  EllipsisVertical,
  LoaderCircle,
  Pencil,
  Trash,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { KnowledgeBankFolderContent } from './KnowledgeBankFolderContent';

const BanksList = () => {
  const { onOpen } = useModalStore();
  const { data: knowledgeBankFolders, isLoading } =
    useKnowledgeBankGetFoldersQuery();

  const [selectedFolder, setSelectedFolder] =
    useState<KnowledgeBankFolder | null>(null);

  return (
    <div className="relative h-full w-full p-8 pt-0">
      <div className="flex items-center justify-between">
        <Input placeholder="Search" className="max-w-sm" />
        {!selectedFolder ? (
          <div className="flex items-center justify-end">
            <Button
              className="w-[115px]"
              onClick={() => {
                onOpen({
                  type: 'create-knowledge-bank-folder',
                });
              }}
            >
              New Folder
            </Button>
          </div>
        ) : (
          // <div className="mt-6 mb-4 flex items-center justify-end">
          <KnowledgeBankFileUpload folderId={selectedFolder?.id} />
          // </div>
        )}
      </div>
      {selectedFolder ? (
        <div>
          <div className="mt-6 mb-0 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ArrowLeft
                onClick={() => {
                  setSelectedFolder(null);
                }}
              />

              <h1 className="text-3xl font-bold text-gray-900">
                {selectedFolder.name} Files
              </h1>
            </div>

            <div>
              <Trash
                onClick={() => {
                  onOpen({
                    type: 'delete-knowledge-base',
                    actionId: selectedFolder?.id,
                  });
                }}
              />
            </div>
          </div>

          <KnowledgeBankFolderContent folderId={selectedFolder?.id} />
        </div>
      ) : isLoading ? (
        <div className="flex h-[calc(100vh-200px)] w-full items-center justify-center">
          <LoaderCircle className="animate-spin" />
        </div>
      ) : !knowledgeBankFolders?.length ? (
        <div className="flex h-[calc(100vh-200px)] w-full items-center justify-center">
          No folders
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {knowledgeBankFolders?.map(folder => (
            <div
              key={folder.id}
              onClick={() => setSelectedFolder(folder)}
              className="group relative space-y-2 rounded-md bg-gray-100 p-6"
            >
              <div className="absolute top-2 right-2 z-10">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <EllipsisVertical className="size-5 rotate-90 opacity-0 group-hover:opacity-100" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="mr-5 rounded-2xl">
                    {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
                    <DropdownMenuItem
                      onClick={e => {
                        e.stopPropagation();
                        onOpen({
                          type: 'create-knowledge-bank-folder',
                          actionId: folder.id,
                        });
                      }}
                    >
                      <Pencil className="text-black" /> Edit
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={e => {
                        e.stopPropagation();
                        onOpen({
                          type: 'delete-knowledge-bank-folder',
                          actionId: folder.id,
                        });
                      }}
                    >
                      <Trash2 className="text-black" />{' '}
                      <span className="text-black">Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <h2 className="font-bold">{folder.name}</h2>
              <p className="line-clamp-2">{folder.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BanksList;
