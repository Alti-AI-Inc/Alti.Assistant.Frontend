'use client';

import type {
  AdminTenantListItem,
  TenantLifecycleStatus,
} from '@/actions/adminActions';
import { TenantStatusBadge } from '@/components/admin/TenantStatusBadge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate } from '@/utils/formatters';
import {
  ArrowDown,
  ArrowUp,
  Building2,
  MoreHorizontal,
  Shield,
} from 'lucide-react';

export type TenantsTableSortable = {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (apiField: string) => void;
};

function SortHeaderTenants({
  label,
  field,
  sortable,
  align = 'left',
}: {
  label: string;
  field: string;
  sortable?: TenantsTableSortable;
  align?: 'left' | 'right';
}) {
  if (!sortable) {
    return <span>{label}</span>;
  }

  const active = sortable.sortBy === field;
  return (
    <button
      type="button"
      onClick={() => sortable.onSort(field)}
      className={
        align === 'right'
          ? 'hover:text-foreground text-muted-foreground ml-auto inline-flex items-center gap-1 font-medium transition-colors'
          : 'hover:text-foreground text-muted-foreground inline-flex items-center gap-1 font-medium transition-colors'
      }
    >
      {label}
      {active ? (
        sortable.sortOrder === 'asc' ? (
          <ArrowUp className="size-3.5" />
        ) : (
          <ArrowDown className="size-3.5" />
        )
      ) : null}
    </button>
  );
}

interface TenantsTableProps {
  tenants: AdminTenantListItem[];
  sortable?: TenantsTableSortable;
  onRowClick: (tenantId: string) => void;
  /** Row menu: admin requests a lifecycle status change (parent may confirm). */
  onTenantStatusIntent?: (args: {
    tenantId: string;
    tenantName: string;
    status: TenantLifecycleStatus;
  }) => void;
  /** Row menu: open administration dialog (status + trial). */
  onOpenAdministration?: (args: {
    tenantId: string;
    tenantName: string;
  }) => void;
}

export function TenantsTable({
  tenants,
  sortable,
  onRowClick,
  onTenantStatusIntent,
  onOpenAdministration,
}: TenantsTableProps) {
  const showRowMenu = Boolean(onTenantStatusIntent || onOpenAdministration);
  if (!tenants || tenants.length === 0) {
    return (
      <Card>
        <div className="text-muted-foreground flex flex-col items-center gap-2 p-8 text-center text-sm">
          <Building2 className="h-10 w-10 opacity-50" />
          <span>No tenants found</span>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <SortHeaderTenants label="Name" field="name" sortable={sortable} />
            </TableHead>
            <TableHead>
              <SortHeaderTenants
                label="Subdomain"
                field="subdomain"
                sortable={sortable}
              />
            </TableHead>
            <TableHead>
              <SortHeaderTenants
                label="Status"
                field="status"
                sortable={sortable}
              />
            </TableHead>
            <TableHead>
              <SortHeaderTenants label="Plan" field="plan" sortable={sortable} />
            </TableHead>
            <TableHead className="text-right">
              <div className="flex justify-end">
                <SortHeaderTenants
                  label="Created"
                  field="createdAt"
                  sortable={sortable}
                  align="right"
                />
              </div>
            </TableHead>
            {showRowMenu ? (
              <TableHead className="w-[52px] text-right">
                <span className="sr-only">Actions</span>
              </TableHead>
            ) : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tenants.map(t => (
            <TableRow
              key={t._id}
              className="hover:bg-muted/50 cursor-pointer"
              onClick={() => onRowClick(t._id)}
            >
              <TableCell className="font-medium">{t.name || '—'}</TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {t.subdomain || '—'}
              </TableCell>
              <TableCell onClick={e => e.stopPropagation()}>
                <TenantStatusBadge status={t.status} />
              </TableCell>
              <TableCell>
                <span className="text-muted-foreground text-sm capitalize">
                  {t.plan || '—'}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground text-right text-sm">
                {t.createdAt ? formatDate(new Date(t.createdAt)) : '—'}
              </TableCell>
              {showRowMenu ? (
                <TableCell
                  className="text-right"
                  onClick={e => e.stopPropagation()}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        aria-label="Open tenant actions"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      {onOpenAdministration ? (
                        <DropdownMenuItem
                          onClick={() =>
                            onOpenAdministration({
                              tenantId: t._id,
                              tenantName: t.name || t.subdomain || t._id,
                            })
                          }
                        >
                          <Shield className="mr-2 h-4 w-4 opacity-70" />
                          Administration
                        </DropdownMenuItem>
                      ) : null}
                      {onOpenAdministration && onTenantStatusIntent ? (
                        <DropdownMenuSeparator />
                      ) : null}
                      {onTenantStatusIntent ? (
                        <>
                          <DropdownMenuLabel>Quick status</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() =>
                              onTenantStatusIntent({
                                tenantId: t._id,
                                tenantName: t.name || t.subdomain || t._id,
                                status: 'active',
                              })
                            }
                          >
                            Set to Active
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              onTenantStatusIntent({
                                tenantId: t._id,
                                tenantName: t.name || t.subdomain || t._id,
                                status: 'suspended',
                              })
                            }
                          >
                            Set to Suspended
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-rose-700 focus:text-rose-800 dark:text-rose-400 dark:focus:text-rose-300"
                            onClick={() =>
                              onTenantStatusIntent({
                                tenantId: t._id,
                                tenantName: t.name || t.subdomain || t._id,
                                status: 'cancelled',
                              })
                            }
                          >
                            Set to Cancelled
                          </DropdownMenuItem>
                        </>
                      ) : null}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onRowClick(t._id)}>
                        View details…
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              ) : null}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
