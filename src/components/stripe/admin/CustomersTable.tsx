'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  MoreHorizontal,
  Trash2,
  Edit,
  Eye,
  CreditCard,
  Mail,
  Phone,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

import { EditCustomerDialog } from './EditCustomerDialog';

import {
  deleteStripeCustomer,
  type StripeCustomer,
} from '@/actions/stripeActions';
import { formatDate } from '@/utils/formatters';

interface CustomersTableProps {
  customers: StripeCustomer[];
  onCustomerClick: (customerId: string) => void;
  onRefresh: () => void;
}

export function CustomersTable({
  customers,
  onCustomerClick,
  onRefresh,
}: CustomersTableProps) {
  const { data: session } = useSession();
  const accessToken = session?.accessToken as string;

  const [deleteCustomerId, setDeleteCustomerId] = useState<string | null>(null);
  const [editCustomer, setEditCustomer] = useState<StripeCustomer | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteCustomerId || !accessToken) return;

    setIsDeleting(true);
    try {
      const result = await deleteStripeCustomer(deleteCustomerId, accessToken);
      if (result.success) {
        onRefresh();
      } else {
        console.error('Failed to delete customer:', result.message);
      }
    } finally {
      setIsDeleting(false);
      setDeleteCustomerId(null);
    }
  };

  if (customers.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CreditCard className="text-muted-foreground mb-4 h-12 w-12" />
          <h3 className="mb-2 text-lg font-semibold">No customers yet</h3>
          <p className="text-muted-foreground text-sm">
            Create your first customer to get started
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Customer ID</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map(customer => (
              <TableRow
                key={customer.id}
                className="cursor-pointer"
                onClick={() => onCustomerClick(customer.id)}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                      <span className="text-primary text-sm font-medium">
                        {customer.name?.[0]?.toUpperCase() || '?'}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">
                        {customer.name || 'Unnamed Customer'}
                      </div>
                      {customer.address?.city && (
                        <div className="text-muted-foreground text-xs">
                          {customer.address.city}, {customer.address.country}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {customer.email ? (
                    <div className="flex items-center gap-2">
                      <Mail className="text-muted-foreground h-4 w-4" />
                      <span className="text-sm">{customer.email}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {customer.phone ? (
                    <div className="flex items-center gap-2">
                      <Phone className="text-muted-foreground h-4 w-4" />
                      <span className="text-sm">{customer.phone}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {customer.id}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDate(new Date(customer.created * 1000))}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={e => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={e => {
                          e.stopPropagation();
                          onCustomerClick(customer.id);
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={e => {
                          e.stopPropagation();
                          setEditCustomer(customer);
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Customer
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={e => {
                          e.stopPropagation();
                          setDeleteCustomerId(customer.id);
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Customer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Edit Customer Dialog */}
      <EditCustomerDialog
        open={!!editCustomer}
        onOpenChange={open => !open && setEditCustomer(null)}
        customer={editCustomer || undefined}
        onSuccess={onRefresh}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteCustomerId}
        onOpenChange={() => setDeleteCustomerId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Customer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this customer? This action cannot
              be undone and will remove all associated payment methods and
              subscriptions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
