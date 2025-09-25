/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

// import { DeleteFilledIcon } from "@/components/dashboard/delete";
// import DeleteModal from "@/components/delete";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { documentsDummyData } from '@/lib/documents-dummy-data';

import DeleteKnowledgeModal from '@/components/modals/DeleteKnowledgeModal';
import jsPDF from 'jspdf';
import { ArrowLeft, File, X } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { DeleteFilledIcon } from './_components/delete';

function DocumentsPage() {
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [currentFolder, setCurrentFolder] = useState(documentsDummyData);
  const [history, setHistory] = useState<any[]>([]);
  const [folderName, setFoldername] = useState('');
  const [isDeleteModelOpen, setIsDeleteModelOpen] = useState(false);
  const [isDeleteFolder, setIsDeleteFolder] = useState(false);
  const [isFileOpen, setFileOpen] = useState(false);
  const [file, setFile] = useState('');
  const [isDeleteFolderNameModelOpen, setIsDeleteFolderNameModelOpen] =
    useState(false);

  // States for text editor
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorContent, setEditorContent] = useState('');
  const [documentTitle, setDocumentTitle] = useState('');

  const handleEnterFolder = (folder: any) => {
    console.log('handleEnterFolder called with:', folder);

    if (folder.type === 'folder') {
      setFoldername(folder.name);
      if (folder.children) {
        setHistory([...history, { folder: currentFolder, name: folder.name }]);
        setCurrentFolder(folder.children);
      }
    } else if (folder.type === 'file') {
      console.log('Opening file:', folder.name);
      setFileOpen(true);
      setFile(folder.href || '#');
    }
  };

  const handleGoBack = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setCurrentFolder(prev.folder);
    setHistory(history.slice(0, history.length - 1));
  };

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileFocus = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name);
    }
  };

  const handleCloseDeleteModel = () => {
    setIsDeleteModelOpen(false);
    setIsDeleteFolder(false);
  };

  // Text editor functions

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setEditorContent('');
    setDocumentTitle('');
  };

  const handleSavePDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text(documentTitle || 'Untitled Document', 20, 30);

    // Add content
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(editorContent, 170);
    doc.text(lines, 20, 50);

    // Save the PDF
    const fileName = `${documentTitle || 'untitled'}.pdf`;
    doc.save(fileName);

    // Add to current folder (mock functionality)
    const newDoc: any = {
      name: fileName,
      type: 'file',
      href: '#',
    };
    setCurrentFolder([...currentFolder, newDoc]);

    handleCloseEditor();
  };

  const handleItemClick = (item: any, index: number) => {
    // Prevent any potential event bubbling issues
    console.log(`=== ITEM CLICK DEBUG ===`);
    console.log(`Item index: ${index}`);
    console.log(`Item data:`, item);
    console.log(`Item type: ${item?.type}`);
    console.log(`Item name: ${item?.name}`);
    console.log(`Current folder length: ${currentFolder?.length}`);
    console.log(`========================`);

    handleEnterFolder(item);
  };

  const handleDeleteClick = (e: React.MouseEvent, item: any) => {
    console.log('Delete clicked for:', item.name);
    e.preventDefault();
    e.stopPropagation();
    setIsDeleteModelOpen(true);
  };

  return (
    <div
      className="relative h-full w-full p-6"
      style={{ pointerEvents: 'auto' }}
    >
      <div className="flex items-center justify-between">
        <div className="mb-6 flex items-center gap-3">
          {history.length > 0 && <ArrowLeft onClick={handleGoBack} />}
          <h1 className="text-3xl leading-[32px] font-[700]">
            {history.length > 0 ? folderName : 'Knowledge Bank'}
          </h1>
        </div>
        {history.length > 0 && (
          <div>
            <DeleteFilledIcon
              className="text-default-400 cursor-pointer"
              height={24}
              width={24}
              onClick={() => {
                setIsDeleteFolder(true);
              }}
            />
          </div>
        )}
      </div>

      <div className="mb-8 flex items-center justify-between">
        <Input
          className="h-12 w-[500px] border-none bg-gray-100"
          placeholder="Search"
        />
        <div className="flex items-center gap-5">
          {history.length > 0 ? (
            <div className="flex gap-5">
              <Button className="bg-black text-white" onClick={handleFileFocus}>
                Upload file
              </Button>
              <input
                ref={inputRef}
                className="hidden"
                type="file"
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <Button
              className="rounded-lg bg-black text-white"
              onClick={() => setIsModelOpen(true)}
            >
              New folder
            </Button>
          )}
        </div>
      </div>

      {/* Main content area with explicit click handling */}
      <div
        className={`flex w-full overflow-y-auto ${
          history.length > 0
            ? 'h-[calc(100vh_-_220px)] flex-col gap-2'
            : 'h-[calc(100vh_-_180px)] flex-row flex-wrap gap-5'
        }`}
      >
        {currentFolder && currentFolder.length > 0 ? (
          currentFolder.map((item, index) => (
            <div
              key={`item-${index}-${item?.name || 'unnamed'}`}
              className={`flex cursor-pointer items-center transition-all duration-200 ${
                item.type === 'folder'
                  ? 'h-40 w-40 flex-col justify-center rounded-2xl bg-gray-100 p-2 hover:bg-gray-200'
                  : 'h-fit w-full flex-row justify-between bg-gray-100 py-4 ps-2 pe-4 hover:bg-gray-200'
              }`}
              onClick={() => handleItemClick(item, index)}
              role="button"
              tabIndex={0}
              onKeyPress={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleItemClick(item, index);
                }
              }}
            >
              <div className="pointer-events-none flex items-center gap-3">
                {item.type === 'file' && <File />}
                <p
                  className={`w-full font-medium break-words ${
                    item.type === 'folder'
                      ? 'text-center text-black'
                      : 'text-start text-black'
                  }`}
                >
                  {item.name || 'Unnamed'}
                </p>
              </div>
              {item.type === 'file' && (
                <div
                  className="pointer-events-auto"
                  onClick={e => handleDeleteClick(e, item)}
                >
                  <DeleteFilledIcon
                    className="cursor-pointer text-gray-400 transition-colors hover:text-red-500"
                    height={20}
                    width={20}
                  />
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-500">
            <p>No files or folders to display</p>
          </div>
        )}
      </div>

      {/* Create Folder Modal */}
      {isModelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/10"
            onClick={() => setIsModelOpen(false)}
          />
          <div className="relative z-10 flex w-full max-w-md flex-col gap-3 rounded-xl bg-gray-50 p-4 shadow-lg">
            <div className="flex absolute right-3 top-3 items-center justify-end">
              <X onClick={() => setIsModelOpen(false)} />
            </div>

            <h2 className="text-base font-medium mt-2">Create Folder</h2>
            <Input placeholder="Folder Name" />
            <div className="mt-3 flex justify-end gap-2">
              <Button
                onClick={() => setIsModelOpen(false)}
                className="border-[1px] border-black bg-white hover:bg-white/90 text-black"
              >
                Cancel
              </Button>
              <Button
                onClick={() => setIsModelOpen(false)}
                className="bg-black text-white dark:bg-white dark:text-black"
              >
                Create
              </Button>
            </div>
          </div>
        </div>
      )}

      {isDeleteFolderNameModelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div
            className="absolute top-0 right-0 z-10 h-[calc(100vh-61px)] w-screen bg-black/10"
            onClick={() => {
              setIsDeleteFolderNameModelOpen(false);
            }}
          ></div>
          <div className="relative z-20 flex w-full max-w-md flex-col gap-6 rounded-xl bg-white p-4 shadow-lg">
            <X
              onClick={() => {
                setIsDeleteFolderNameModelOpen(false);
              }}
            />

            <h2 className="text-base font-medium">
              Type <span className="text-[15px] font-bold">{folderName}</span>{' '}
              to delete folder
            </h2>
            <Input placeholder="folder name" />
            <div className="mt-3 flex justify-end gap-2">
              <Button
                onClick={() => {
                  setIsDeleteFolderNameModelOpen(false);
                }}
                className="border-[1px] border-black bg-white text-black hover:bg-black hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setIsDeleteFolderNameModelOpen(false);
                }}
                className="bg-black text-white dark:bg-white dark:text-black"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Text Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/10"
            onClick={handleCloseEditor}
          />
          <div className="relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col gap-6 rounded-xl bg-gray-50 p-4 shadow-lg">
            <X onClick={handleCloseEditor} />

            <h2 className="text-base font-medium">Create New Document</h2>
            <Input
              placeholder="Document Title"
              value={documentTitle}
              onChange={e => setDocumentTitle(e.target.value)}
            />
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Content</label>
              <textarea
                className="h-64 w-full resize-none rounded-lg border border-gray-200 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Start writing your document..."
                value={editorContent}
                onChange={e => setEditorContent(e.target.value)}
              />
            </div>
            <div className="mt-3 flex justify-end gap-2">
              <Button
                onClick={handleCloseEditor}
                className="border-[1px] border-black bg-white text-black"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSavePDF}
                className="bg-black text-white dark:bg-white dark:text-black"
                disabled={!documentTitle.trim() || !editorContent.trim()}
              >
                Save as PDF
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <DeleteKnowledgeModal
        title="file"
        onClose={handleCloseDeleteModel}
        onLogout={handleCloseDeleteModel}
        isOpen={isDeleteModelOpen}
      />
      <DeleteKnowledgeModal
        title="entire folder"
        onClose={handleCloseDeleteModel}
        onLogout={() => {
          setIsDeleteFolder(false);
          setIsDeleteFolderNameModelOpen(true);
        }}
        isOpen={isDeleteFolder}
      />

      {/* File Preview Modal */}
      {isFileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/10"
            onClick={() => setFileOpen(false)}
          />
          <div className="flex h-full w-full items-center justify-center p-8">
            <iframe
              className="h-full max-h-full w-full max-w-6xl rounded-lg bg-white"
              src={file || '#'}
              title="File Preview"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default DocumentsPage;
