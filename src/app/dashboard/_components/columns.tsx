"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Person = {
  name: string;
  email: string;
  phone: string;
  cases: string;
};

export const columns: ColumnDef<Person>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "cases",
    header: "Cases",
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
              onClick={() => navigator.clipboard.writeText(client.phone)}
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

export const data: Person[] = [
  {
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "555-0123",
    cases: "Case123",
  },
  {
    name: "Emma Johnson",
    email: "emma.johnson@example.com",
    phone: "555-0456",
    cases: "Case456",
  },
  {
    name: "Michael Brown",
    email: "michael.brown@example.com",
    phone: "555-0789",
    cases: "Case789",
  },
  {
    name: "Sarah Davis",
    email: "sarah.davis@example.com",
    phone: "555-1012",
    cases: "Case101",
  },
  {
    name: "David Wilson",
    email: "david.wilson@example.com",
    phone: "555-1314",
    cases: "Case202",
  },
  {
    name: "Laura Martinez",
    email: "laura.martinez@example.com",
    phone: "555-1617",
    cases: "Case303",
  },
  {
    name: "James Taylor",
    email: "james.taylor@example.com",
    phone: "555-1920",
    cases: "Case404",
  },
  {
    name: "Emily Anderson",
    email: "emily.anderson@example.com",
    phone: "555-2223",
    cases: "Case505",
  },
  {
    name: "Robert Lee",
    email: "robert.lee@example.com",
    phone: "555-2526",
    cases: "Case606",
  },
  {
    name: "Olivia Clark",
    email: "olivia.clark@example.com",
    phone: "555-2829",
    cases: "Case707",
  },
];
