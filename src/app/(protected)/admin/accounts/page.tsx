'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  KeyRound,
  Trash2,
  Pencil,
  Search,
  Eye,
  EyeOff,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

interface AccountEntry {
  name: string;
  username?: string;
  password?: string;
}

export default function AdminAccountsPage() {
  const { accounts, setAccounts } = useAdminStore();
  const [newAccount, setNewAccount] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Dialog state for creating
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Dialog state for editing
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');

  // Dialog state for deleting
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  // Eye toggle visibility states
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);

  // Account row password reveal states
  const [revealedIndices, setRevealedIndices] = useState<Record<number, boolean>>({});

  const toggleRevealPassword = (index: number) => {
    setRevealedIndices(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const accountsList: AccountEntry[] = accounts
    ? accounts.split('\n\n').filter(Boolean).map(item => {
        try {
          return JSON.parse(item);
        } catch (e) {
          return { name: item, username: '', password: '' };
        }
      })
    : [];

  const handleCreate = () => {
    if (!newAccount.trim()) return;
    const newEntry: AccountEntry = {
      name: newAccount.trim(),
      username: newUsername.trim(),
      password: newPassword,
    };
    const newList = [newEntry, ...accountsList];
    setAccounts(newList.map(item => JSON.stringify(item)).join('\n\n'));
    setNewAccount('');
    setNewUsername('');
    setNewPassword('');
    setIsCreateOpen(false);
  };

  const handleStartEdit = (index: number, val: AccountEntry) => {
    setEditingIndex(index);
    setEditValue(val.name);
    setEditUsername(val.username || '');
    setEditPassword(val.password || '');
  };

  const handleSaveEdit = () => {
    if (editingIndex === null || !editValue.trim()) return;
    const newList = accountsList.map((item, idx) =>
      idx === editingIndex
        ? { name: editValue.trim(), username: editUsername.trim(), password: editPassword }
        : item,
    );
    setAccounts(newList.map(item => JSON.stringify(item)).join('\n\n'));
    setEditingIndex(null);
    setEditValue('');
    setEditUsername('');
    setEditPassword('');
  };

  const handleDelete = () => {
    if (deletingIndex === null) return;
    const newList = accountsList.filter((_, idx) => idx !== deletingIndex);
    setAccounts(newList.map(item => JSON.stringify(item)).join('\n\n'));
    setDeletingIndex(null);
  };

  const filteredAccounts = accountsList
    .map((item, index) => ({ item, index }))
    .filter(({ item }) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase().trim()),
    );

  return (
    <div className="h-full flex flex-col bg-[#F5F5F7] dark:bg-gray-955 overflow-hidden">
      {/* Dynamic Header */}
      <div className="h-[52px] border-b border-black/10 dark:border-white/10 flex items-center justify-between px-8 flex-none bg-[#F5F5F7] dark:bg-gray-955">
        <h1 className="text-base font-semibold text-gray-900 dark:text-white">
          My Accounts
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
                  setNewAccount('');
                  setNewUsername('');
                  setNewPassword('');
                  setShowCreatePassword(false);
                }}
              >
                <DialogTrigger asChild>
                  <Button className="w-full h-12 bg-black hover:bg-black/90 text-white dark:bg-white dark:text-black dark:hover:bg-white/90 rounded-lg font-medium text-base shadow-sm border border-black/10 cursor-pointer">
                    Create New Account
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg rounded-[20px] bg-[#F5F5F7] dark:bg-zinc-900 border-none shadow-xl animate-in fade-in-50 duration-150">
                  <DialogHeader>
                    <DialogTitle>Create New Account</DialogTitle>
                    <DialogDescription className="text-gray-500 dark:text-gray-400 text-sm">
                      Enter the name and password details for the new account below.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4 flex flex-col gap-3">
                    <div>
                      <Input
                        placeholder="Enter account name"
                        value={newAccount}
                        onChange={e => setNewAccount(e.target.value)}
                        autoComplete="new-password"
                        className="w-full h-12 text-base rounded-lg border-black/10 dark:border-white/10 bg-white dark:bg-gray-900 shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus-visible:outline-none outline-none"
                        autoFocus
                      />
                    </div>
                    <div>
                      <Input
                        placeholder="Enter account username"
                        value={newUsername}
                        onChange={e => setNewUsername(e.target.value)}
                        autoComplete="new-password"
                        className="w-full h-12 text-base rounded-lg border-black/10 dark:border-white/10 bg-white dark:bg-gray-900 shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus-visible:outline-none outline-none"
                      />
                    </div>
                    <div>
                      <div className="relative">
                        <Input
                          type={showCreatePassword ? "text" : "password"}
                          placeholder="Enter account password"
                          value={newPassword}
                          onChange={e => setNewPassword(e.target.value)}
                          autoComplete="new-password"
                          onKeyDown={e => {
                            if (e.key === 'Enter' && newAccount.trim() && newUsername.trim() && newPassword.trim()) {
                              e.preventDefault();
                              handleCreate();
                            }
                          }}
                          className="w-full h-12 pl-4 pr-12 text-base rounded-lg border-black/10 dark:border-white/10 bg-white dark:bg-gray-900 shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus-visible:outline-none outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCreatePassword(!showCreatePassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white cursor-pointer h-5 w-5 flex items-center justify-center"
                        >
                          {showCreatePassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
                      disabled={!newAccount.trim() || !newUsername.trim() || !newPassword.trim()}
                      className={(!newAccount.trim() || !newUsername.trim() || !newPassword.trim())
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
                placeholder="Search accounts"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 h-12 w-full text-base rounded-lg border-black/10 dark:border-white/10 bg-white dark:bg-gray-900 shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus-visible:outline-none outline-none"
              />
            </div>

            {/* Structured list identical in layout to user lists */}
            <div className="flex-1 min-h-0 overflow-y-auto pr-1">
              {filteredAccounts.length === 0 ? null : (
                <div className="flex flex-col gap-2 pb-4">
                  {filteredAccounts.map(({ item, index }) => (
                    <div
                      key={index}
                      className="grid grid-cols-12 gap-4 px-6 py-3.5 bg-white/90 dark:bg-gray-900/90 border border-black/5 dark:border-white/5 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 items-center animate-in fade-in-50 duration-150"
                    >
                      {/* Left Icon (KeyRound) & Content column merged */}
                      <div className="col-span-10 flex items-center gap-5 min-w-0">
                        <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-955/40 text-indigo-650 dark:text-indigo-400 flex items-center justify-center flex-none">
                          <KeyRound className="h-4 w-4" />
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
                              Username
                            </span>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate block">
                              {item.username || 'None'}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[9px] font-semibold text-gray-400 dark:text-gray-500 block uppercase tracking-wider mb-0.5 select-none">
                              Password
                            </span>
                            <span className="text-xs font-mono font-medium text-gray-500 dark:text-gray-400 block mt-0.5 tracking-wider">
                              {revealedIndices[index] ? (item.password || 'None') : (item.password ? '••••••••' : 'None')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions columns */}
                      <div className="col-span-2 flex items-center justify-end gap-2">
                        {/* Reveal Password Toggle */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg text-gray-400 hover:text-black dark:hover:text-white"
                          onClick={() => toggleRevealPassword(index)}
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
                              setEditValue('');
                              setEditUsername('');
                              setEditPassword('');
                              setShowEditPassword(false);
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
                              <DialogTitle>Edit Account</DialogTitle>
                              <DialogDescription className="text-gray-500 dark:text-gray-400 text-sm">
                                Make changes to the account details below.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-4 flex flex-col gap-3">
                              <div>
                                <Input
                                  placeholder="Enter account name"
                                  value={editValue}
                                  onChange={e => setEditValue(e.target.value)}
                                  autoComplete="new-password"
                                  className="w-full h-12 text-base rounded-lg border-black/10 dark:border-white/10 bg-white dark:bg-gray-900 shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus-visible:outline-none outline-none"
                                  autoFocus
                                />
                              </div>
                              <div>
                                <Input
                                  placeholder="Enter account username"
                                  value={editUsername}
                                  onChange={e => setEditUsername(e.target.value)}
                                  autoComplete="new-password"
                                  className="w-full h-12 text-base rounded-lg border-black/10 dark:border-white/10 bg-white dark:bg-gray-900 shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus-visible:outline-none outline-none"
                                />
                              </div>
                              <div>
                                <div className="relative">
                                  <Input
                                    type={showEditPassword ? "text" : "password"}
                                    placeholder="Enter account password"
                                    value={editPassword}
                                    onChange={e => setEditPassword(e.target.value)}
                                    autoComplete="new-password"
                                    onKeyDown={e => {
                                      if (e.key === 'Enter' && editValue.trim() && editUsername.trim() && editPassword.trim()) {
                                        e.preventDefault();
                                        handleSaveEdit();
                                      }
                                    }}
                                    className="w-full h-12 pl-4 pr-12 text-base rounded-lg border-black/10 dark:border-white/10 bg-white dark:bg-gray-900 shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus-visible:outline-none outline-none"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowEditPassword(!showEditPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white cursor-pointer h-5 w-5 flex items-center justify-center"
                                  >
                                    {showEditPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
                                disabled={!editValue.trim() || !editUsername.trim() || !editPassword.trim()}
                                className={(!editValue.trim() || !editUsername.trim() || !editPassword.trim())
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
                                Delete Account
                              </DialogTitle>
                              <DialogDescription className="mt-1.5 text-[13px] text-gray-500 dark:text-gray-400 leading-normal px-1 text-center">
                                Are you sure you want to remove this account?
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
