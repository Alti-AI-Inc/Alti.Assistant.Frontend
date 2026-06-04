'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Wallet,
  Trash2,
  Pencil,
  Search,
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

export default function AdminAccountsPage() {
  const { accounts, setAccounts } = useAdminStore();
  const [newAccount, setNewAccount] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Dialog state for creating
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Dialog state for editing
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  // Dialog state for deleting
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  const accountsList = accounts
    ? accounts.split('\n\n').filter(Boolean)
    : [];

  const handleCreate = () => {
    if (!newAccount.trim()) return;
    const newList = [newAccount.trim(), ...accountsList];
    setAccounts(newList.join('\n\n'));
    setNewAccount('');
    setIsCreateOpen(false);
  };

  const handleStartEdit = (index: number, val: string) => {
    setEditingIndex(index);
    setEditValue(val);
  };

  const handleSaveEdit = () => {
    if (editingIndex === null || !editValue.trim()) return;
    const newList = accountsList.map((item, idx) =>
      idx === editingIndex ? editValue.trim() : item,
    );
    setAccounts(newList.join('\n\n'));
    setEditingIndex(null);
    setEditValue('');
  };

  const handleDelete = () => {
    if (deletingIndex === null) return;
    const newList = accountsList.filter((_, idx) => idx !== deletingIndex);
    setAccounts(newList.join('\n\n'));
    setDeletingIndex(null);
  };

  const filteredAccounts = accountsList
    .map((text, index) => ({ text, index }))
    .filter(({ text }) =>
      text.toLowerCase().includes(searchTerm.toLowerCase().trim()),
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
                  if (!open) {
                    setNewAccount('');
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button className="w-full h-12 bg-black hover:bg-black/90 text-white dark:bg-white dark:text-black dark:hover:bg-white/90 rounded-lg font-medium text-base shadow-sm border border-black/10 cursor-pointer">
                    Create New Account
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg rounded-[20px] bg-[#F5F5F7] dark:bg-zinc-900 border-none shadow-xl">
                  <DialogHeader>
                    <DialogTitle>Create New Account</DialogTitle>
                    <DialogDescription className="text-gray-500 dark:text-gray-400 text-sm">
                      Enter the name or detail of the new account below.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Input
                      placeholder="Enter account name"
                      value={newAccount}
                      onChange={e => setNewAccount(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && newAccount.trim()) {
                          e.preventDefault();
                          handleCreate();
                        }
                      }}
                      className="w-full h-12 text-base rounded-lg border-black/10 dark:border-white/10 bg-white dark:bg-gray-900 shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus-visible:outline-none outline-none"
                      autoFocus
                    />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                      onClick={handleCreate}
                      disabled={!newAccount.trim()}
                      className="bg-black hover:bg-black/90 text-white dark:bg-white dark:text-black dark:hover:bg-white/95"
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
              {filteredAccounts.length === 0 ? (
                <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground text-sm bg-white dark:bg-gray-900">
                  No matching accounts found
                </div>
              ) : (
                <div className="flex flex-col gap-2 pb-4">
                  {filteredAccounts.map(({ text, index }) => (
                    <div
                      key={index}
                      className="grid grid-cols-12 gap-4 px-6 py-3.5 bg-white/90 dark:bg-gray-900/90 border border-black/5 dark:border-white/5 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 items-center animate-in fade-in-50 duration-150"
                    >
                      {/* Left Icon (Wallet) */}
                      <div className="col-span-1 flex items-center justify-start">
                        <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-955/40 text-indigo-650 dark:text-indigo-400 flex items-center justify-center">
                          <Wallet className="h-4 w-4" />
                        </div>
                      </div>

                      {/* Content column */}
                      <div className="col-span-9 flex flex-col justify-center min-w-0">
                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-normal break-words">
                          {text}
                        </span>
                        <span className="text-[9px] text-gray-400 font-medium block mt-0.5 uppercase font-mono tracking-wider">
                          Account
                        </span>
                      </div>

                      {/* Actions columns */}
                      <div className="col-span-2 flex items-center justify-end gap-2">
                        {/* Edit Dialog */}
                        <Dialog
                          open={editingIndex === index}
                          onOpenChange={open => {
                            if (!open) {
                              setEditingIndex(null);
                              setEditValue('');
                            }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg text-gray-400 hover:text-black dark:hover:text-white"
                              onClick={() => handleStartEdit(index, text)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg rounded-[20px] bg-[#F5F5F7] dark:bg-zinc-900 border-none shadow-xl">
                            <DialogHeader>
                              <DialogTitle>Edit Account</DialogTitle>
                              <DialogDescription className="text-gray-500 dark:text-gray-400 text-sm">
                                Make changes to the account detail below.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                              <Input
                                placeholder="Enter account name"
                                value={editValue}
                                onChange={e => setEditValue(e.target.value)}
                                onKeyDown={e => {
                                  if (e.key === 'Enter' && editValue.trim()) {
                                    e.preventDefault();
                                    handleSaveEdit();
                                  }
                                }}
                                className="w-full h-12 text-base rounded-lg border-black/10 dark:border-white/10 bg-white dark:bg-gray-900 shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus-visible:outline-none outline-none"
                                autoFocus
                              />
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
                              <Button
                                onClick={handleSaveEdit}
                                disabled={!editValue.trim()}
                                className="bg-black hover:bg-black/90 text-white dark:bg-white dark:text-black dark:hover:bg-white/95"
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
