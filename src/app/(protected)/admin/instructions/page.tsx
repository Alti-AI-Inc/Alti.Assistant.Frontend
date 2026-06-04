'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Terminal,
  Trash2,
  Pencil,
  Plus,
  Search,
  FileText,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAdminStore } from '@/stores/useAdminStore';

export default function AdminInstructionsPage() {
  const { instructions, setInstructions } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState('');

  // Dialog state for adding
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newInstruction, setNewInstruction] = useState('');

  // Dialog state for editing
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  // Dialog state for deleting
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  const instructionsList = instructions
    ? instructions.split('\n\n').filter(Boolean)
    : [];

  const handleAdd = () => {
    if (!newInstruction.trim()) return;
    const newList = [newInstruction.trim(), ...instructionsList];
    setInstructions(newList.join('\n\n'));
    setNewInstruction('');
    setIsAddOpen(false);
  };

  const handleStartEdit = (index: number, val: string) => {
    setEditingIndex(index);
    setEditValue(val);
  };

  const handleSaveEdit = () => {
    if (editingIndex === null || !editValue.trim()) return;
    const newList = instructionsList.map((item, idx) =>
      idx === editingIndex ? editValue.trim() : item,
    );
    setInstructions(newList.join('\n\n'));
    setEditingIndex(null);
    setEditValue('');
  };

  const handleDelete = () => {
    if (deletingIndex === null) return;
    const newList = instructionsList.filter((_, idx) => idx !== deletingIndex);
    setInstructions(newList.join('\n\n'));
    setDeletingIndex(null);
  };

  const filteredInstructions = instructionsList
    .map((text, index) => ({ text, index }))
    .filter(({ text }) =>
      text.toLowerCase().includes(searchTerm.toLowerCase().trim()),
    );

  return (
    <div className="h-full flex flex-col bg-[#F5F5F7] dark:bg-gray-955 overflow-hidden">
      {/* Dynamic Header */}
      <div className="h-[52px] border-b border-black/10 dark:border-white/10 flex items-center justify-between px-8 flex-none bg-[#F5F5F7] dark:bg-gray-955">
        <h1 className="text-base font-semibold text-gray-900 dark:text-white">
          Instructions
        </h1>
        <div className="flex items-center gap-2">
          {/* Add Instruction Button */}
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Instruction
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg rounded-[20px] bg-white dark:bg-zinc-900 border-none shadow-xl">
              <DialogHeader>
                <DialogTitle>Add System Instruction</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <Textarea
                  placeholder="Enter the system instruction rule here..."
                  value={newInstruction}
                  onChange={e => setNewInstruction(e.target.value)}
                  rows={4}
                  className="w-full resize-none border-black/10 dark:border-white/10 rounded-lg"
                  autoFocus
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleAdd} disabled={!newInstruction.trim()}>
                  Save Rule
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

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
          {/* KPI summary cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 flex-none">
            {[
              { title: 'Total Rules', value: String(instructionsList.length) },
              { title: 'Status', value: 'Active' },
              { title: 'Type', value: 'Global System' },
              { title: 'Scope', value: 'All Agents' },
            ].map(card => (
              <Card key={card.title}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    {card.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex-1 min-h-0 flex flex-col gap-4">
            {/* Full-width Search Bar */}
            <div className="relative w-full flex-none">
              <Search className="text-muted-foreground absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2" />
              <Input
                placeholder="Search instructions..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 h-12 w-full text-base rounded-lg border-black/10 dark:border-white/10 bg-white dark:bg-gray-900 shadow-sm focus-visible:ring-1 focus-visible:ring-primary"
              />
            </div>

            {/* Structured list identical in layout to user lists */}
            <div className="flex-1 min-h-0 overflow-y-auto pr-1">
              {filteredInstructions.length === 0 ? (
                <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground text-sm bg-white dark:bg-gray-900">
                  No matching instructions found
                </div>
              ) : (
                <div className="flex flex-col gap-2 pb-4">
                  {filteredInstructions.map(({ text, index }) => (
                    <div
                      key={index}
                      className="grid grid-cols-12 gap-4 px-6 py-3.5 bg-white/90 dark:bg-gray-900/90 border border-black/5 dark:border-white/5 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 items-center animate-in fade-in-50 duration-150"
                    >
                      {/* Left Icon (Terminal or FileText) */}
                      <div className="col-span-1 flex items-center justify-start">
                        <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-955/40 text-indigo-650 dark:text-indigo-400 flex items-center justify-center">
                          <Terminal className="h-4 w-4" />
                        </div>
                      </div>

                      {/* Content column */}
                      <div className="col-span-9 flex flex-col justify-center min-w-0">
                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-normal break-words">
                          {text}
                        </span>
                        <span className="text-[9px] text-gray-400 font-medium block mt-0.5 uppercase font-mono tracking-wider">
                          Instruction Rule #{index + 1}
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
                          <DialogContent className="max-w-lg rounded-[20px] bg-white dark:bg-zinc-900 border-none shadow-xl">
                            <DialogHeader>
                              <DialogTitle>Edit Instruction Rule</DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                              <Textarea
                                placeholder="Edit the instruction rule..."
                                value={editValue}
                                onChange={e => setEditValue(e.target.value)}
                                rows={4}
                                className="w-full resize-none border-black/10 dark:border-white/10 rounded-lg"
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
                              <h2 className="text-[17px] font-semibold text-black dark:text-white leading-tight">
                                Delete Instruction
                              </h2>
                              <p className="mt-1.5 text-[13px] text-gray-500 dark:text-gray-400 leading-normal px-1">
                                Are you sure you want to remove this instruction?
                              </p>
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
