'use client';

import { ArrowDown, ArrowUp, Building2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate } from '@/utils/formatters';

import type { AdminTenantListItem } from '@/actions/adminActions';

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
}

export function TenantsTable({
  tenants,
  sortable,
  onRowClick,
}: TenantsTableProps) {
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
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {t.status || '—'}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="capitalize">
                  {t.plan || '—'}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground text-right text-sm">
                {t.createdAt ? formatDate(new Date(t.createdAt)) : '—'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
