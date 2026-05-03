'use client';

import { Mail, MoreHorizontal, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

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
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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

import { deleteUser, type AdminUser } from '@/actions/adminActions';
import { formatDate } from '@/utils/formatters';

interface UsersTableProps {
  users: AdminUser[];
  onRefresh: () => void;
}

export function UsersTable({ users, onRefresh }: UsersTableProps) {
  const { data: session } = useSession();
  const accessToken = session?.accessToken as string;

  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteUserId) return;
    setIsDeleting(true);
    try {
      const res = await deleteUser(deleteUserId, accessToken);
      if (res.success) {
        onRefresh();
      } else {
        console.error('Delete user failed:', res.message);
      }
    } finally {
      setIsDeleting(false);
      setDeleteUserId(null);
    }
  };

  if (!users || users.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Mail className="text-muted-foreground mb-4 h-12 w-12" />
          <h3 className="mb-2 text-lg font-semibold">No users found</h3>
          <p className="text-muted-foreground text-sm">
            No user records returned from admin API.
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
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Subscribed</TableHead>
              <TableHead className="text-right">Created</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(u => (
              <TableRow key={u._id}>
                <TableCell className="font-medium">{u.email}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {u.email}
                </TableCell>
                <TableCell className="text-sm">{u.role}</TableCell>
                <TableCell>
                  <Badge
                    variant={u.isSubscribed ? 'success' : 'outline'}
                    className="capitalize"
                  >
                    {u.isSubscribed ? 'paid' : 'free'}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-right text-sm">
                  {u.createdAt ? formatDate(new Date(u.createdAt)) : '—'}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => navigator.clipboard.writeText(u.email)}
                      >
                        Copy Email
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => setDeleteUserId(u._id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <AlertDialog
        open={!!deleteUserId}
        onOpenChange={() => setDeleteUserId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
