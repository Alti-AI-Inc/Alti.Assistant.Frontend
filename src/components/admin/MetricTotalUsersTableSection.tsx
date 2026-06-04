'use client';

import { getAllUsers, type AdminUser } from '@/actions/adminActions';
import { parseAdminListPayload } from '@/components/admin/AdminPaginatedDatasetHelpers';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Search, Mail, Pencil, ChevronDown } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { DUMMY_USERS } from '@/utils/dummyData';
import { useSearchParams } from 'next/navigation';

export function MetricTotalUsersTableSection() {
  const { data: session } = useSession();
  const accessToken = session?.accessToken as string | undefined;
  const searchParams = useSearchParams();
  const planFilter = searchParams ? searchParams.get('plan') : null;

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Local state to store custom pricing / plan adjustments
  const [userSettings, setUserSettings] = useState<Record<string, { isSubscribed: boolean; amount: string }>>({});

  // Editing state for the dialog
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [editPlan, setEditPlan] = useState<'free' | 'paid'>('free');
  const [editAmount, setEditAmount] = useState<string>('$0');

  const loadUsers = useCallback(async () => {
    if (!accessToken) return;
    setIsLoading(true);
    try {
      const res = await getAllUsers(accessToken, {
        page: 1,
        limit: 5000,
        sortBy: 'email',
        sortOrder: 'asc',
      });
      if (res.success && res.data !== undefined && res.data !== null) {
        const { list } = parseAdminListPayload<AdminUser>(res.data);
        setUsers(list);
      } else {
        setUsers([]);
      }
    } catch (e) {
      console.error(e);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Retrieve current active plan details (merged with custom settings)
  const getUserPlanAndAmount = useCallback((user: AdminUser) => {
    const custom = userSettings[user._id];
    if (custom) {
      return {
        isSubscribed: custom.isSubscribed,
        amount: custom.amount,
      };
    }
    return {
      isSubscribed: user.isSubscribed,
      amount: user.isSubscribed ? '$20' : '$0',
    };
  }, [userSettings]);

  const handleStartEdit = (user: AdminUser) => {
    const custom = getUserPlanAndAmount(user);
    setEditingUser(user);
    setEditPlan(custom.isSubscribed ? 'paid' : 'free');
    const cleanAmount = custom.amount.split('.')[0].replace('/mo', '');
    setEditAmount(cleanAmount);
  };

  const handlePlanChange = (plan: 'free' | 'paid') => {
    setEditPlan(plan);
    if (plan === 'free') {
      setEditAmount('$0');
    } else {
      setEditAmount('$20');
    }
  };

  const handleAmountChange = (amount: string) => {
    setEditAmount(amount);
    if (amount === '$0') {
      setEditPlan('free');
    } else {
      setEditPlan('paid');
    }
  };

  const handleSave = () => {
    if (!editingUser) return;
    const isSubscribed = editPlan === 'paid';
    const amountStr = editAmount;
    
    setUserSettings(prev => ({
      ...prev,
      [editingUser._id]: {
        isSubscribed,
        amount: amountStr,
      },
    }));
    
    setEditingUser(null);
  };

  // Combine real users and dummy users, avoiding duplicate emails
  const combinedUsers = [...users];
  DUMMY_USERS.forEach(dummy => {
    if (!combinedUsers.some(u => (u.email || '').toLowerCase() === dummy.email.toLowerCase())) {
      combinedUsers.push(dummy);
    }
  });

  const filteredUsers = combinedUsers
    .filter(u => {
      const matchesSearch = (u.email || '').toLowerCase().includes(searchTerm.toLowerCase().trim());
      if (!matchesSearch) return false;
      
      const custom = getUserPlanAndAmount(u);
      const isPaid = custom.isSubscribed;
      if (planFilter === 'free') {
        return !isPaid;
      }
      if (planFilter === 'paid') {
        return isPaid;
      }
      return true;
    })
    .sort((a, b) => (a.email || '').localeCompare(b.email || ''));

  const placeholderText = planFilter === 'free'
    ? 'Search free users'
    : planFilter === 'paid'
      ? 'Search paid users'
      : 'Search user email addresses';

  if (!accessToken) {
    return (
      <Card className="mt-4">
        <CardContent className="p-6 text-center text-muted-foreground">
          Sign in to load the user list.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-4">
      {/* Full-width Search Bar */}
      <div className="relative w-full flex-none">
        <Search className="text-muted-foreground absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2" />
        <Input
          placeholder={placeholderText}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="pl-12 pr-4 h-12 w-full text-base rounded-lg border-black/10 dark:border-white/10 bg-white dark:bg-gray-900 shadow-sm focus-visible:ring-1 focus-visible:ring-primary"
        />
      </div>

      {/* Structured Users Grid List */}
      {isLoading && users.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <Spinner className="h-8 w-8" />
        </div>
      ) : (
        <div className="flex-1 min-h-0 overflow-y-auto pr-1">
          {filteredUsers.length === 0 ? (
            <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground text-sm bg-white dark:bg-gray-900">
              No matching users found
            </div>
          ) : (
            <div className="flex flex-col gap-2 pb-4">
              {filteredUsers.map(user => {
                const custom = getUserPlanAndAmount(user);
                const isPaid = custom.isSubscribed;
                const planText = isPaid ? 'Paid Plan' : 'Free Plan';
                const amountText = custom.amount;
                return (
                  <div
                    key={user._id}
                    className="grid grid-cols-12 gap-4 px-6 py-3.5 bg-white/90 dark:bg-gray-900/90 border border-black/5 dark:border-white/5 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 items-center"
                  >
                    <div className="col-span-5 flex items-center min-w-0">
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate select-all">
                        {user.email}
                      </span>
                    </div>
                    <div className="col-span-3 flex justify-center">
                    </div>
                    <div className="col-span-2 flex items-center justify-end text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {isPaid ? amountText : null}
                    </div>
                    <div className="col-span-2 flex items-center justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                        onClick={() => handleStartEdit(user)}
                        title="Edit Pricing"
                      >
                        <Pencil className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Edit Pricing Modal */}
      <Dialog open={!!editingUser} onOpenChange={open => !open && setEditingUser(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Membership Pricing</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground uppercase font-semibold">User Email</span>
                <div className="text-sm font-medium text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded-md border border-black/5 dark:border-white/5 truncate">
                  {editingUser.email}
                </div>
              </div>



              <div className="space-y-1">
                <label className="text-xs text-muted-foreground uppercase font-semibold">Custom Pricing Amount</label>
                <div className="relative">
                  <select
                    value={editAmount}
                    onChange={e => handleAmountChange(e.target.value)}
                    className="w-full h-10 pl-3 pr-12 py-2 text-sm rounded-md border border-black/10 dark:border-white/10 bg-white dark:bg-gray-900 appearance-none focus:outline-none focus:ring-0 focus:border-black/10 dark:focus:border-white/10 focus-visible:outline-none focus-visible:ring-0 outline-none ring-0 cursor-pointer"
                  >
                    <option value="$20">$20</option>
                    <option value="$15">$15</option>
                    <option value="$10">$10</option>
                    <option value="$5">$5</option>
                    <option value="$0">$0</option>
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex gap-3 justify-end mt-2">
            <Button
              variant="outline"
              onClick={() => setEditingUser(null)}
              className="w-36 rounded-lg border-black/10 dark:border-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="w-36 rounded-lg bg-black hover:bg-black/90 text-white dark:bg-white dark:text-black dark:hover:bg-white/90"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
