'use client';

import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Users, CreditCard, Database, FileText, Shield } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: 'Members', href: '/admin/members', icon: Users },
    { name: 'Billing', href: '/admin/billing', icon: CreditCard },
    { name: 'Data', href: '/admin/data', icon: Database },
    { name: 'Instructions', href: '/admin/instructions', icon: FileText },
    { name: 'Guardrails', href: '/admin/guardrails', icon: Shield },
  ];

  return (
    <div className="flex w-full h-full bg-[#FCFCFC] dark:bg-zinc-950 overflow-hidden">
      {/* Secondary Sidebar */}
      <aside className="w-64 flex-none border-l border-r border-black/10 dark:border-white/10 bg-[#F2F3F5] dark:bg-zinc-900 flex flex-col h-full">
        <div className="p-4 border-b border-black/10">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Admin</h2>
        </div>
        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => router.push(item.href)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-black/5 text-black dark:bg-white/10 dark:text-white'
                    : 'text-gray-600 hover:bg-black/5 hover:text-black dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white'
                )}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
