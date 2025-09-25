'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Person = {
  firstName: string;
  lastName: string;
  email: string;
};

export const data: Person[] = [
  {
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@example.com',
  },
  {
    firstName: 'Emily',
    lastName: 'Johnson',
    email: 'emily.johnson@example.com',
  },
  {
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.brown@example.com',
  },
  {
    firstName: 'Sophia',
    lastName: 'Davis',
    email: 'sophia.davis@example.com',
  },
  {
    firstName: 'James',
    lastName: 'Wilson',
    email: 'james.wilson@example.com',
  },
  {
    firstName: 'Olivia',
    lastName: 'Martinez',
    email: 'olivia.martinez@example.com',
  },
  {
    firstName: 'Daniel',
    lastName: 'Taylor',
    email: 'daniel.taylor@example.com',
  },
  {
    firstName: 'Ava',
    lastName: 'Anderson',
    email: 'ava.anderson@example.com',
  },
  {
    firstName: 'William',
    lastName: 'Thomas',
    email: 'william.thomas@example.com',
  },
  {
    firstName: 'Mia',
    lastName: 'Harris',
    email: 'mia.harris@example.com',
  },
];

export const columns: ColumnDef<Person>[] = [
  {
    accessorKey: 'firstName',
    header: 'First name',
  },
  {
    accessorKey: 'lastName',
    header: 'Last name',
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },

  {
    id: 'actions',
    cell: ({ row }) => {
      const client = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(client.email)}
            >
              Copy email
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Send message</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
