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
import { Spinner } from '@/components/ui/spinner';
import { type ReactNode, useEffect, useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Mail, User, ArrowLeft, Pencil, ChevronDown } from 'lucide-react';
import { DUMMY_TENANTS } from '@/utils/dummyData';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function TeamMembersPage() {
  const params = useParams();
  const tenantId = params.tenantId as string;
  const { data: session } = useSession();
  const accessToken = session?.accessToken as string | undefined;

  const [detail, setDetail] = useState<AdminTenantDetail | null>(null);
  const [members, setMembers] = useState<AdminTenantMember[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [teamPricing, setTeamPricing] = useState<string>('$25');
  const [selectedPrice, setSelectedPrice] = useState<string>('$25');
  const [isEditingPrice, setIsEditingPrice] = useState(false);

  useEffect(() => {
    if (!tenantId) return;

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
        setError('Team not found');
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
  }, [tenantId, accessToken]);

  useEffect(() => {
    if (tenantId && typeof window !== 'undefined') {
      const stored = localStorage.getItem(`team_price_${tenantId}`);
      if (stored) {
        setTeamPricing(stored);
      } else {
        setTeamPricing('$25');
      }
    }
  }, [tenantId]);

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
    <div className="h-full flex flex-col bg-[#F5F5F7] dark:bg-zinc-950 overflow-hidden">
      {/* Header */}
      <div className="h-[52px] border-b border-black/10 dark:border-white/10 flex items-center justify-between px-8 flex-none bg-white dark:bg-gray-950">
        <h1 className="text-base font-semibold text-gray-900 dark:text-white truncate">
          Team Members
        </h1>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/metrics/active-organizations">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Teams
          </Link>
        </Button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 px-8 py-6 overflow-hidden flex flex-col">
        <div className="mx-auto flex w-full max-w-7xl flex-1 min-h-0 flex-col gap-6">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <Spinner className="h-8 w-8" />
            </div>
          ) : error ? (
            <p className="text-destructive text-sm text-center py-4">{error}</p>
          ) : (
            <div className="flex-1 min-h-0 flex flex-col gap-4">
              {/* Account Creator / Admin (Top Row, styled exactly as Team rows) */}
              <div className="grid grid-cols-12 gap-4 px-6 h-12 bg-white/90 dark:bg-gray-900/90 border border-black/5 dark:border-white/5 rounded-lg shadow-sm items-center flex-none">
                <div className="col-span-8 flex items-center gap-2.5 min-w-0">
                  <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate select-all">
                    {ownerEmail}
                  </span>
                </div>
                <div className="col-span-2 flex items-center justify-end text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {teamPricing}
                </div>
                <div className="col-span-2 flex items-center justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 rounded-md"
                    onClick={() => {
                      setSelectedPrice(teamPricing);
                      setIsEditingPrice(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative w-full flex-none">
                <Search className="text-muted-foreground absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2" />
                <Input
                  placeholder="Search team members"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 h-12 w-full text-base rounded-lg border-black/10 dark:border-white/10 bg-white dark:bg-gray-900 shadow-sm focus-visible:ring-1 focus-visible:ring-primary"
                />
              </div>

              {/* Team Users List (styled exactly as Team rows) */}
              <div className="flex-1 min-h-0 overflow-y-auto pr-1">
                <div className="flex flex-col gap-2 pb-4">
                  {filteredMembers.length === 0 ? null : (
                    filteredMembers.map(member => {
                      const email = member.userId?.email || '—';
                      return (
                        <div
                          key={member._id}
                          className="grid grid-cols-12 gap-4 px-6 h-12 bg-white/90 dark:bg-gray-900/90 border border-black/5 dark:border-white/5 rounded-lg shadow-sm items-center"
                        >
                          <div className="col-span-12 flex items-center gap-2.5 min-w-0">
                            <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate select-all">
                              {email}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Pricing Edit Dialog */}
              <Dialog open={isEditingPrice} onOpenChange={setIsEditingPrice}>
                <DialogContent className="max-w-md rounded-2xl border border-black/10 dark:border-white/10 bg-[#F5F5F7] dark:bg-zinc-950 p-6 flex flex-col gap-4">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                      Edit Team Pricing
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                      Update the subscription pricing tier for this entire team.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="py-2 flex flex-col gap-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">
                      Price per user / month
                    </label>
                    <div className="relative">
                      <select
                        value={selectedPrice}
                        onChange={e => setSelectedPrice(e.target.value)}
                        className="w-full h-11 pl-4 pr-12 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 text-sm font-medium text-gray-900 dark:text-gray-100 shadow-sm appearance-none focus:outline-none focus:ring-0 focus:border-black/10 dark:focus:border-white/10 focus-visible:outline-none focus-visible:ring-0 outline-none ring-0 cursor-pointer animate-none"
                      >
                        <option value="$25">$25</option>
                        <option value="$20">$20</option>
                        <option value="$15">$15</option>
                        <option value="$10">$10</option>
                        <option value="$5">$5</option>
                        <option value="$0">$0</option>
                      </select>
                      <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <DialogFooter className="flex gap-3 justify-end mt-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditingPrice(false)}
                      className="w-36 rounded-lg border-black/10 dark:border-white/10"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        setTeamPricing(selectedPrice);
                        if (tenantId) {
                          localStorage.setItem(`team_price_${tenantId}`, selectedPrice);
                        }
                        setIsEditingPrice(false);
                      }}
                      className="w-36 rounded-lg bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                    >
                      Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
