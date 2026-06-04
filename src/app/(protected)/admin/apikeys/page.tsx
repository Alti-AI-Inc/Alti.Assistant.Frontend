'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Key,
  Trash2,
  Pencil,
  Search,
  Eye,
  EyeOff,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAdminStore } from '@/stores/useAdminStore';

interface ApiKeyEntry {
  name: string;
  website?: string;
  secretKey?: string;
}

export default function AdminApiKeysPage() {
  const { apiKeys, setApiKeys } = useAdminStore();
  const [newName, setNewName] = useState('');
  const [newWebsite, setNewWebsite] = useState('');
  const [newSecretKey, setNewSecretKey] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Dialog state for creating
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Dialog state for editing
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editWebsite, setEditWebsite] = useState('');
  const [editSecretKey, setEditSecretKey] = useState('');

  // Dialog state for deleting
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  // Eye toggle visibility states
  const [showCreateSecret, setShowCreateSecret] = useState(false);
  const [showEditSecret, setShowEditSecret] = useState(false);

  // Row secret key reveal states
  const [revealedIndices, setRevealedIndices] = useState<Record<number, boolean>>({});

  const toggleRevealSecret = (index: number) => {
    setRevealedIndices(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const apiKeysList: ApiKeyEntry[] = apiKeys
    ? apiKeys.split('\n\n').filter(Boolean).map(item => {
        try {
          return JSON.parse(item);
        } catch (e) {
          return { name: item, website: '', secretKey: '' };
        }
      })
    : [];

  const handleCreate = () => {
    if (!newName.trim()) return;
    const newEntry: ApiKeyEntry = {
      name: newName.trim(),
      website: newWebsite.trim(),
      secretKey: newSecretKey,
    };
    const newList = [newEntry, ...apiKeysList];
    setApiKeys(newList.map(item => JSON.stringify(item)).join('\n\n'));
    setNewName('');
    setNewWebsite('');
    setNewSecretKey('');
    setIsCreateOpen(false);
  };

  const handleStartEdit = (index: number, val: ApiKeyEntry) => {
    setEditingIndex(index);
    setEditName(val.name);
    setEditWebsite(val.website || '');
    setEditSecretKey(val.secretKey || '');
  };

  const handleSaveEdit = () => {
    if (editingIndex === null || !editName.trim()) return;
    const newList = apiKeysList.map((item, idx) =>
      idx === editingIndex
        ? { name: editName.trim(), website: editWebsite.trim(), secretKey: editSecretKey }
        : item,
    );
    setApiKeys(newList.map(item => JSON.stringify(item)).join('\n\n'));
    setEditingIndex(null);
    setEditName('');
    setEditWebsite('');
    setEditSecretKey('');
  };

  const handleDelete = () => {
    if (deletingIndex === null) return;
    const newList = apiKeysList.filter((_, idx) => idx !== deletingIndex);
    setApiKeys(newList.map(item => JSON.stringify(item)).join('\n\n'));
    setDeletingIndex(null);
  };

  const filteredApiKeys = apiKeysList
    .map((item, index) => ({ item, index }))
    .filter(({ item }) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase().trim()),
    );

  return (
    <div className="h-full flex flex-col bg-[#F5F5F7] dark:bg-gray-955 overflow-hidden">
      {/* Dynamic Header */}
      <div className="h-[52px] border-b border-black/10 dark:border-white/10 flex items-center justify-between px-8 flex-none bg-white dark:bg-gray-950">
        <h1 className="text-base font-semibold text-gray-900 dark:text-white">
          API Keys
        </h1>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 min-h-0 px-8 py-6 overflow-hidden flex flex-col">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 flex-1 min-h-0">

          <div className="flex-1 min-h-0 flex flex-col gap-4">
            {/* Top Bar Create Button */}
            <div className="flex-none flex justify-center w-full">
              <Dialog
                open={isCreateOpen}
                onOpenChange={open => {
                  setIsCreateOpen(open);
                  setNewName('');
                  setNewWebsite('');
                  setNewSecretKey('');
                  setShowCreateSecret(false);
                }}
              >
                <DialogTrigger asChild>
                  <Button className="w-full h-12 bg-black hover:bg-black/90 text-white dark:bg-white dark:text-black dark:hover:bg-white/90 rounded-lg font-medium text-base shadow-sm border border-black/10 cursor-pointer">
                    Create New API Key
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg rounded-[20px] bg-[#F5F5F7] dark:bg-zinc-900 border-none shadow-xl animate-in fade-in-50 duration-150">
                  <DialogHeader>
                    <DialogTitle>Create New API Key</DialogTitle>
                    <DialogDescription className="text-gray-500 dark:text-gray-400 text-sm">
                      Enter the details for the new API Key below.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4 flex flex-col gap-3">
                    <div>
                      <Input
                        placeholder="Enter account name"
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                        autoComplete="new-password"
                        className="w-full h-12 text-base rounded-lg border-black/10 dark:border-white/10 bg-white dark:bg-gray-900 shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus-visible:outline-none outline-none"
                        autoFocus
                      />
                    </div>
                    <div>
                      <Input
                        placeholder="Enter account website"
                        value={newWebsite}
                        onChange={e => setNewWebsite(e.target.value)}
                        autoComplete="new-password"
                        className="w-full h-12 text-base rounded-lg border-black/10 dark:border-white/10 bg-white dark:bg-gray-900 shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus-visible:outline-none outline-none"
                      />
                    </div>
                    <div>
                      <div className="relative">
                        <Input
                          type={showCreateSecret ? "text" : "password"}
                          placeholder="Enter secret key"
                          value={newSecretKey}
                          onChange={e => setNewSecretKey(e.target.value)}
                          autoComplete="new-password"
                          onKeyDown={e => {
                            if (e.key === 'Enter' && newName.trim() && newWebsite.trim() && newSecretKey.trim()) {
                              e.preventDefault();
                              handleCreate();
                            }
                          }}
                          className="w-full h-12 pl-4 pr-12 text-base rounded-lg border-black/10 dark:border-white/10 bg-white dark:bg-gray-900 shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus-visible:outline-none outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCreateSecret(!showCreateSecret)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white cursor-pointer h-5 w-5 flex items-center justify-center"
                        >
                          {showCreateSecret ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                      onClick={handleCreate}
                      disabled={!newName.trim() || !newWebsite.trim() || !newSecretKey.trim()}
                      className={(!newName.trim() || !newWebsite.trim() || !newSecretKey.trim())
                        ? "bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500 cursor-not-allowed"
                        : "bg-black hover:bg-black/90 text-white dark:bg-white dark:text-black dark:hover:bg-white/95"
                      }
                    >
                      Create
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Second Full-width Search Bar */}
            <div className="relative w-full flex-none">
              <Search className="text-muted-foreground absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2" />
              <Input
                placeholder="Search API keys"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 h-12 w-full text-base rounded-lg border-black/10 dark:border-white/10 bg-white dark:bg-gray-900 shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus-visible:outline-none outline-none"
              />
            </div>

            {/* Structured list identical in layout to user lists */}
            <div className="flex-1 min-h-0 overflow-y-auto pr-1">
              {filteredApiKeys.length === 0 ? null : (
                <div className="flex flex-col gap-2 pb-4">
                  {filteredApiKeys.map(({ item, index }) => (
                    <div
                      key={index}
                      className="grid grid-cols-12 gap-4 px-6 py-3.5 bg-white/90 dark:bg-gray-900/90 border border-black/5 dark:border-white/5 rounded-lg shadow-sm items-center animate-in fade-in-50 duration-150"
                    >
                      {/* Left Icon (Key) & Content column merged */}
                      <div className="col-span-10 flex items-center gap-5 min-w-0">
                        <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-955/40 text-indigo-650 dark:text-indigo-400 flex items-center justify-center flex-none">
                          <Key className="h-4 w-4" />
                        </div>
                        <div className="flex-1 flex items-center gap-8 min-w-0">
                          <div className="flex-1 min-w-0">
                            <span className="text-[9px] font-semibold text-gray-400 dark:text-gray-500 block uppercase tracking-wider mb-0.5 select-none">
                              Account Name
                            </span>
                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate block">
                              {item.name}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[9px] font-semibold text-gray-400 dark:text-gray-500 block uppercase tracking-wider mb-0.5 select-none">
                              Website
                            </span>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate block">
                              {item.website || 'None'}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[9px] font-semibold text-gray-400 dark:text-gray-500 block uppercase tracking-wider mb-0.5 select-none">
                              Secret Key
                            </span>
                            <span className="text-xs font-mono font-medium text-gray-500 dark:text-gray-400 block mt-0.5 tracking-wider">
                              {revealedIndices[index] ? (item.secretKey || 'None') : (item.secretKey ? '••••••••' : 'None')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions columns */}
                      <div className="col-span-2 flex items-center justify-end gap-2">
                        {/* Reveal Secret Key Toggle */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg text-gray-400 hover:text-black dark:hover:text-white"
                          onClick={() => toggleRevealSecret(index)}
                        >
                          {revealedIndices[index] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>

                        {/* Edit Dialog */}
                        <Dialog
                          open={editingIndex === index}
                          onOpenChange={open => {
                            if (!open) {
                              setEditingIndex(null);
                              setEditName('');
                              setEditWebsite('');
                              setEditSecretKey('');
                              setShowEditSecret(false);
                            }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg text-gray-400 hover:text-black dark:hover:text-white"
                              onClick={() => handleStartEdit(index, item)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg rounded-[20px] bg-[#F5F5F7] dark:bg-zinc-900 border-none shadow-xl animate-in fade-in-50 duration-150">
                            <DialogHeader>
                              <DialogTitle>Edit API Key</DialogTitle>
                              <DialogDescription className="text-gray-500 dark:text-gray-400 text-sm">
                                Make changes to the API Key details below.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-4 flex flex-col gap-3">
                              <div>
                                <Input
                                  placeholder="Enter account name"
                                  value={editName}
                                  onChange={e => setEditName(e.target.value)}
                                  autoComplete="new-password"
                                  className="w-full h-12 text-base rounded-lg border-black/10 dark:border-white/10 bg-white dark:bg-gray-900 shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus-visible:outline-none outline-none"
                                  autoFocus
                                />
                              </div>
                              <div>
                                <Input
                                  placeholder="Enter account website"
                                  value={editWebsite}
                                  onChange={e => setEditWebsite(e.target.value)}
                                  autoComplete="new-password"
                                  className="w-full h-12 text-base rounded-lg border-black/10 dark:border-white/10 bg-white dark:bg-gray-900 shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus-visible:outline-none outline-none"
                                />
                              </div>
                              <div>
                                <div className="relative">
                                  <Input
                                    type={showEditSecret ? "text" : "password"}
                                    placeholder="Enter secret key"
                                    value={editSecretKey}
                                    onChange={e => setEditSecretKey(e.target.value)}
                                    autoComplete="new-password"
                                    onKeyDown={e => {
                                      if (e.key === 'Enter' && editName.trim() && editWebsite.trim() && editSecretKey.trim()) {
                                        e.preventDefault();
                                        handleSaveEdit();
                                      }
                                    }}
                                    className="w-full h-12 pl-4 pr-12 text-base rounded-lg border-black/10 dark:border-white/10 bg-white dark:bg-gray-900 shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus-visible:outline-none outline-none"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowEditSecret(!showEditSecret)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white cursor-pointer h-5 w-5 flex items-center justify-center"
                                  >
                                    {showEditSecret ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                  </button>
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
                              <Button
                                onClick={handleSaveEdit}
                                disabled={!editName.trim() || !editWebsite.trim() || !editSecretKey.trim()}
                                className={(!editName.trim() || !editWebsite.trim() || !editSecretKey.trim())
                                  ? "bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500 cursor-not-allowed"
                                  : "bg-black hover:bg-black/90 text-white dark:bg-white dark:text-black dark:hover:bg-white/95"
                                }
                              >
                                Save Changes
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        {/* Delete Dialog */}
                        <Dialog
                          open={deletingIndex === index}
                          onOpenChange={open => {
                            if (!open) setDeletingIndex(null);
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-955/20"
                              onClick={() => setDeletingIndex(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="p-0 overflow-hidden rounded-[20px] max-w-[400px] sm:max-w-[400px] border-none shadow-xl bg-white dark:bg-zinc-900 [&>button]:hidden animate-in fade-in-50 duration-150">
                            <div className="px-5 pt-5 pb-4 text-center">
                              <DialogTitle className="text-[17px] font-semibold text-black dark:text-white leading-tight text-center">
                                Delete API Key
                              </DialogTitle>
                              <DialogDescription className="mt-1.5 text-[13px] text-gray-500 dark:text-gray-400 leading-normal px-1 text-center">
                                Are you sure you want to remove this API Key?
                              </DialogDescription>
                            </div>
                            <div className="border-t border-black/10 dark:border-white/10 flex h-11">
                              <DialogClose asChild>
                                <button className="flex-1 text-[15px] font-normal text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors h-full flex items-center justify-center border-r border-black/10 dark:border-white/10 outline-none">
                                  Cancel
                                </button>
                              </DialogClose>
                              <DialogClose asChild>
                                <button
                                  onClick={handleDelete}
                                  className="flex-1 text-[15px] font-medium text-red-500 hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors h-full flex items-center justify-center outline-none"
                                >
                                  Delete
                                </button>
                              </DialogClose>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
