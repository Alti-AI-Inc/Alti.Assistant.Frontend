'use client';

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

interface PaymentsTableProps {
  payments: PaymentRecord[];
}

export function PaymentsTable({ payments }: PaymentsTableProps) {
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
            <TableHead>User</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map(p => (
            <TableRow key={p._id}>
              <TableCell className="font-mono text-xs">{p._id}</TableCell>
              <TableCell className="text-sm">{p.userEmail || '—'}</TableCell>
              <TableCell className="text-sm">{p.planName || '—'}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(p.price || 0)}
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
