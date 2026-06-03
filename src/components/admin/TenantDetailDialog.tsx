'use client';

import {
  getTenantById,
  type AdminTenantDetail,
  type AdminTenantOwnerRef,
  getAdminTenantMembers,
  type AdminTenantMember,
} from '@/actions/adminActions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { type ReactNode, useEffect, useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Mail, User } from 'lucide-react';
import { DUMMY_TENANTS } from '@/utils/dummyData';

interface TenantDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenantId: string | null;
  accessToken: string | undefined;
}

export function TenantDetailDialog({
  open,
  onOpenChange,
  tenantId,
  accessToken,
}: TenantDetailDialogProps) {
  const [detail, setDetail] = useState<AdminTenantDetail | null>(null);
  const [members, setMembers] = useState<AdminTenantMember[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!open || !tenantId) {
      setDetail(null);
      setMembers([]);
      setError(null);
      setSearchTerm('');
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    // Handle dummy tenant cases
    if (tenantId.startsWith('dt-')) {
      const dummyTenant = DUMMY_TENANTS.find(t => t._id === tenantId);
      if (dummyTenant) {
        const ownerEmail = typeof dummyTenant.ownerId === 'object' && dummyTenant.ownerId !== null
          ? dummyTenant.ownerId.email
          : typeof dummyTenant.ownerId === 'string'
            ? dummyTenant.ownerId
            : '—';

        setDetail({
          _id: dummyTenant._id,
          name: dummyTenant.name,
          subdomain: dummyTenant.subdomain,
          status: dummyTenant.status,
          plan: dummyTenant.plan,
          ownerId: (dummyTenant.ownerId ?? undefined) as string | AdminTenantOwnerRef | undefined,
          createdAt: dummyTenant.createdAt,
          memberCount: dummyTenant.memberCount,
        });

        // Generate mock members matching the count
        const count = dummyTenant.memberCount ?? 5;
        const generated: AdminTenantMember[] = [];
        
        // Owner is always in the list but we will filter it out for the secondary list
        generated.push({
          _id: `m-owner-${tenantId}`,
          userId: {
            _id: typeof dummyTenant.ownerId === 'object' && dummyTenant.ownerId !== null ? dummyTenant.ownerId._id : 'dummy-owner',
            email: ownerEmail,
          },
          tenantId,
          role: 'owner',
          status: 'active',
        });

        const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen'];
        const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];

        for (let i = 0; i < count - 1; i++) {
          const fn = firstNames[(i + tenantId.charCodeAt(tenantId.length - 1)) % firstNames.length];
          const ln = lastNames[(i + 7) % lastNames.length];
          const email = `${fn.toLowerCase()}.${ln.toLowerCase()}@${dummyTenant.subdomain || 'company'}.com`;
          generated.push({
            _id: `m-gen-${i}-${tenantId}`,
            userId: {
              _id: `u-gen-${i}`,
              email,
            },
            tenantId,
            role: i === 0 ? 'admin' : 'member',
            status: 'active',
          });
        }
        setMembers(generated);
        setLoading(false);
      } else {
        setDetail(null);
        setMembers([]);
        setError('Tenant not found');
        setLoading(false);
      }
      return;
    }

    if (!accessToken) {
      setLoading(false);
      return;
    }

    void (async () => {
      try {
        const detailRes = await getTenantById(tenantId, accessToken);
        if (cancelled) return;

        if (detailRes.success && detailRes.data) {
          setDetail(detailRes.data);
        } else {
          setError(detailRes.message || 'Could not load tenant details');
        }

        const membersRes = await getAdminTenantMembers(tenantId, accessToken);
        if (cancelled) return;

        if (membersRes.success && membersRes.data) {
          setMembers(membersRes.data);
        } else {
          setMembers([]);
        }
      } catch (err) {
        console.error(err);
        setError('An error occurred while loading details');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, tenantId, accessToken]);

  const ownerEmail = useMemo(() => {
    if (!detail) return '—';
    if (typeof detail.ownerId === 'object' && detail.ownerId !== null) {
      return detail.ownerId.email;
    }
    if (typeof detail.ownerId === 'string') {
      return detail.ownerId;
    }
    return '—';
  }, [detail]);

  const filteredMembers = useMemo(() => {
    return members
      .filter(member => {
        const email = member.userId?.email || '';
        // Filter out owner from the other users list
        if (email.toLowerCase() === ownerEmail.toLowerCase()) return false;
        
        // Apply search term
        return email.toLowerCase().includes(searchTerm.toLowerCase().trim());
      })
      .sort((a, b) => {
        const emailA = a.userId?.email || '';
        const emailB = b.userId?.email || '';
        return emailA.localeCompare(emailB);
      });
  }, [members, ownerEmail, searchTerm]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(85vh,700px)] max-w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-md rounded-2xl border border-black/10 dark:border-white/10 bg-[#F5F5F7] dark:bg-zinc-950">
        <DialogHeader className="shrink-0 border-b border-black/10 dark:border-white/10 px-6 pt-6 pr-12 pb-4 bg-white dark:bg-zinc-900">
          <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Team Members
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground truncate">
            {detail?.name ?? (loading ? 'Loading…' : 'Workspace users list')}
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {loading && (
            <div className="flex justify-center py-12">
              <Spinner className="h-8 w-8" />
            </div>
          )}
          {!loading && error && (
            <p className="text-destructive text-sm text-center py-4">{error}</p>
          )}
          {!loading && detail && (
            <div className="flex flex-col gap-4">
              {/* Account Creator / Admin (Top Row) */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">
                  Account Creator
                </span>
                <div className="flex items-center justify-between px-4 py-3.5 bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-xl shadow-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <User className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate select-all">
                      {ownerEmail}
                    </span>
                  </div>
                  <Badge className="bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                    Admin
                  </Badge>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative w-full">
                <Search className="text-muted-foreground absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2" />
                <Input
                  placeholder="Search other team users..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 h-12 w-full text-base rounded-xl border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-sm focus-visible:ring-1 focus-visible:ring-primary"
                />
              </div>

              {/* Team Members List */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">
                  Team Users ({filteredMembers.length})
                </span>
                <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto pr-1">
                  {filteredMembers.length === 0 ? (
                    <div className="text-center py-8 border border-dashed border-black/10 dark:border-white/10 rounded-xl text-muted-foreground text-sm bg-white dark:bg-zinc-900">
                      {searchTerm.trim() ? 'No matching users found' : 'No other users on this team'}
                    </div>
                  ) : (
                    filteredMembers.map(member => {
                      const email = member.userId?.email || '—';
                      const role = member.role || member.tenantRole || 'member';
                      return (
                        <div
                          key={member._id}
                          className="flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-zinc-900/80 border border-black/5 dark:border-white/5 rounded-xl shadow-xs hover:shadow-sm transition-all duration-150"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate select-all">
                              {email}
                            </span>
                          </div>
                          <Badge variant="secondary" className="capitalize text-[10px] px-2 py-0.5 rounded-md font-semibold bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400">
                            {role}
                          </Badge>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="shrink-0 border-t border-black/10 dark:border-white/10 px-6 py-4 bg-white dark:bg-zinc-900">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto rounded-xl border-black/10 dark:border-white/10"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
