'use client';

import { useState } from 'react';
import { useBotsStore } from '@/stores/useBotsStore';
import { Button } from '@/components/ui/button';
import { Folder, Plus, Trash2, ArrowUp } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function AdminProjectsEditor() {
  const { bots, addBot, deleteBot } = useBotsStore();
  
  // State for the new project modal
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');

  // Filter out only the shared (team) projects for the admin page
  const teamProjects = bots.filter((b) => b.isShared);

  const handleCreate = () => {
    if (!name.trim()) return;

    addBot({
      name: name.trim(),
      description: description.trim(),
      instructions: instructions.trim(),
      model: 'gpt-4',
      avatar: '📁',
      isShared: true,
    });
    
    setIsOpen(false);
    setName('');
    setDescription('');
    setInstructions('');
  };

  return (
    <div className="flex flex-col w-full h-full p-8 max-w-[796px] mx-auto pt-16 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Team Projects</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Projects created here will be shared with all members of your organization.
          </p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200 rounded-lg text-sm px-4 h-9">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] p-6 rounded-[24px]">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">Create Shared Project</h3>
                <p className="text-sm text-gray-500">This project will be visible to everyone in your organization under "Team Projects".</p>
              </div>
              
              <div className="space-y-3">
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Project Name (e.g. Sales Playbook)"
                  className="rounded-xl"
                />
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short Description"
                  className="rounded-xl"
                />
                <Textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Custom Instructions for this project"
                  className="rounded-xl min-h-[100px] resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <DialogClose asChild>
                  <Button variant="ghost" className="rounded-xl">Cancel</Button>
                </DialogClose>
                <Button 
                  onClick={handleCreate} 
                  disabled={!name.trim()}
                  className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 rounded-xl px-6"
                >
                  Create
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 pb-4 custom-scrollbar space-y-3">
        {teamProjects.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
            <Folder className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">No team projects yet</h3>
            <p className="text-xs text-gray-500 mt-1">Create a shared project to collaborate with your team.</p>
          </div>
        ) : (
          teamProjects.map((project) => (
            <div
              key={project.id}
              className="group flex items-center justify-between py-3 px-4 border border-black/10 dark:border-white/10 bg-white dark:bg-gray-900/30 rounded-2xl shadow-xs transition-all duration-150 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/10"
            >
              <div className="flex items-center gap-3 min-w-0 pr-3 flex-1">
                <div className="h-9 w-9 rounded-xl bg-indigo-50 dark:bg-indigo-955/40 text-indigo-650 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                  <Folder className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {project.name}
                  </p>
                  {project.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                      {project.description}
                    </p>
                  )}
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="h-8 w-8 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-955/20 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-none ml-2 flex items-center justify-center cursor-pointer"
                    title="Delete Project"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </DialogTrigger>
                <DialogContent className="p-0 overflow-hidden rounded-[20px] max-w-[400px] sm:max-w-[400px] border-none shadow-xl bg-white dark:bg-zinc-900 [&>button]:hidden">
                  <div className="px-5 pt-5 pb-4 text-center">
                    <h2 className="text-[17px] font-semibold text-black dark:text-white leading-tight">
                      Delete Team Project
                    </h2>
                    <p className="mt-1.5 text-[13px] text-gray-500 dark:text-gray-400 leading-normal px-1">
                      Are you sure you want to remove "{project.name}"? This action cannot be undone and will remove it for all organization members.
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
                        onClick={() => deleteBot(project.id)}
                        className="flex-1 text-[15px] font-medium text-red-500 hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors h-full flex items-center justify-center outline-none"
                      >
                        Delete
                      </button>
                    </DialogClose>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
