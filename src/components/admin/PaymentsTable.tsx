// PaymentsTable.tsx
'use client';

import { ArrowDown, ArrowUp } from 'lucide-react';

import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatDate } from '@/utils/formatters';

import type { PaymentRecord } from '@/actions/adminActions';

export type PaymentsTableSortable = {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (apiField: string) => void;
};

function SortHeaderPayments({
  label,
  field,
  sortable,
  align = 'left',
}: {
  label: string;
  field: string;
  sortable?: PaymentsTableSortable;
  align?: 'left' | 'right';
}) {
  if (!sortable) return <span>{label}</span>;

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

interface PaymentsTableProps {
  payments: PaymentRecord[];
  sortable?: PaymentsTableSortable;
}

export function PaymentsTable({ payments, sortable }: PaymentsTableProps) {
  if (!payments || payments.length === 0) {
    return (
      <Card>
        <div className="text-muted-foreground p-8 text-center text-sm">
          No payments found
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Payment ID</TableHead>
            <TableHead>
              <SortHeaderPayments
                label="User"
                field="userEmail"
                sortable={sortable}
              />
            </TableHead>
            <TableHead>
              <SortHeaderPayments
                label="Plan"
                field="planName"
                sortable={sortable}
              />
            </TableHead>
            <TableHead className="text-right">
              <div className="flex justify-end">
                <SortHeaderPayments
                  label="Amount"
                  field="price"
                  sortable={sortable}
                  align="right"
                />
              </div>
            </TableHead>
            <TableHead className="text-right">
              <div className="flex justify-end">
                <SortHeaderPayments
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
          {payments.map(p => (
            <TableRow key={p._id}>
              <TableCell className="font-mono text-xs">{p._id}</TableCell>
              {/* userEmail is already resolved by the page-level mapping */}
              <TableCell className="text-sm">{p.userEmail || '—'}</TableCell>
              <TableCell className="text-sm">{p.planName || '—'}</TableCell>
              {/* price arrives as cents from the page mapping (50 dollars → 5000) */}
              <TableCell className="text-right">
                {formatCurrency(p.price ?? 0)}
              </TableCell>
              <TableCell className="text-muted-foreground text-right text-sm">
                {p.createdAt ? formatDate(new Date(p.createdAt)) : '—'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}