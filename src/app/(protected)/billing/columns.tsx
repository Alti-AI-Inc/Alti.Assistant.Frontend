"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Bill = {
  date: string;
  type: string;
  receipt: string;
};
export const data: Bill[] = [
{
    date: 'January 5, 2025',
    type: 'Utilities',
    receipt: 'R-1001',
  },
  {
    date: 'January 10, 2025',
    type: 'Groceries',
    receipt: 'R-1002',
  },
  {
    date: 'January 15, 2025',
    type: 'Rent',
    receipt: 'R-1003',
  },
  {
    date: 'January 20, 2025',
    type: 'Internet',
    receipt: 'R-1004',
  },
  {
    date: 'January 25, 2025',
    type: 'Dining',
    receipt: 'R-1005',
  },
  {
    date: 'February 1, 2025',
    type: 'Transportation',
    receipt: 'R-1006',
  },
  {
    date: 'February 5, 2025',
    type: 'Medical',
    receipt: 'R-1007',
  },
  {
    date: 'February 10, 2025',
    type: 'Entertainment',
    receipt: 'R-1008',
  },
  {
    date: 'February 15, 2025',
    type: 'Clothing',
    receipt: 'R-1009',
  },
  {
    date: 'February 20, 2025',
    type: 'Travel',
    receipt: 'R-1010',
  },
];

export const columns: ColumnDef<Bill>[] = [
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "receipt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Receipt
          {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
        </Button>
      );
    },
  },
  
  {
    id: "actions",
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
              onClick={() => navigator.clipboard.writeText(client.type)}
            >
              Copy phone
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

