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
import { Search, Mail, User, ArrowLeft } from 'lucide-react';
import { DUMMY_TENANTS } from '@/utils/dummyData';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';

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
      <div className="h-[52px] border-b border-black/10 dark:border-white/10 flex items-center justify-between px-8 flex-none bg-[#F5F5F7] dark:bg-zinc-950">
        <h1 className="text-base font-semibold text-gray-900 dark:text-white truncate">
          Team Members {detail?.name ? `— ${detail.name}` : ''}
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
              <div className="grid grid-cols-12 gap-4 px-6 py-3.5 bg-white/90 dark:bg-gray-900/90 border border-black/5 dark:border-white/5 rounded-lg shadow-sm items-center flex-none">
                <div className="col-span-4 flex items-center gap-2.5 min-w-0">
                  <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate select-all">
                    {ownerEmail}
                  </span>
                </div>
                <div className="col-span-8 text-sm text-gray-500 dark:text-gray-400 truncate">
                  Account Creator & Owner
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative w-full flex-none">
                <Search className="text-muted-foreground absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2" />
                <Input
                  placeholder="Search other team users..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 h-12 w-full text-base rounded-lg border-black/10 dark:border-white/10 bg-white dark:bg-gray-900 shadow-sm focus-visible:ring-1 focus-visible:ring-primary"
                />
              </div>

              {/* Team Users List (styled exactly as Team rows) */}
              <div className="flex-1 min-h-0 overflow-y-auto pr-1">
                <div className="flex flex-col gap-2 pb-4">
                  {filteredMembers.length === 0 ? (
                    <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground text-sm bg-white dark:bg-gray-900">
                      {searchTerm.trim() ? 'No matching users found' : 'No other users on this team'}
                    </div>
                  ) : (
                    filteredMembers.map(member => {
                      const email = member.userId?.email || '—';
                      const role = member.role || member.tenantRole || 'member';
                      return (
                        <div
                          key={member._id}
                          className="grid grid-cols-12 gap-4 px-6 py-3.5 bg-white/90 dark:bg-gray-900/90 border border-black/5 dark:border-white/5 rounded-lg shadow-sm items-center"
                        >
                          <div className="col-span-4 flex items-center gap-2.5 min-w-0">
                            <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate select-all">
                              {email}
                            </span>
                          </div>
                          <div className="col-span-6 text-sm text-gray-500 dark:text-gray-400 truncate">
                            Team User
                          </div>
                          <div className="col-span-2 flex justify-end">
                            <Badge variant="secondary" className="capitalize text-[10px] px-2 py-0.5 rounded-md font-semibold bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400">
                              {role}
                            </Badge>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
