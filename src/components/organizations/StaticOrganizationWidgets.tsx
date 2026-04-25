import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { useState } from 'react';

const staticMembers = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'Admin',
    joined: '2024-01-10',
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob@example.com',
    role: 'Member',
    joined: '2024-02-15',
  },
  {
    id: 3,
    name: 'Charlie Lee',
    email: 'charlie@example.com',
    role: 'Member',
    joined: '2024-03-20',
  },
  {
    id: 4,
    name: 'Diana Prince',
    email: 'diana@example.com',
    role: 'Owner',
    joined: '2024-01-05',
  },
];

const staticWidgets = [
  { title: 'Total Projects', value: 12 },
  { title: 'Active Integrations', value: 5 },
  { title: 'Storage Used', value: '2.3 GB' },
  { title: 'API Calls (month)', value: 1340 },
];

export function StaticOrganizationWidgets() {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('name');
  const [sortAsc, setSortAsc] = useState(true);

  const filteredMembers = staticMembers.filter(
    m =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()),
  );

  const sortedMembers = [...filteredMembers].sort((a, b) => {
    if (a[sortKey] < b[sortKey]) return sortAsc ? -1 : 1;
    if (a[sortKey] > b[sortKey]) return sortAsc ? 1 : -1;
    return 0;
  });

  const handleSort = (key: string) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  return (
    <div className="flex w-full flex-col gap-8">
      {/* Statistic cards first */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {staticWidgets.map(widget => (
          <Card key={widget.title}>
            <CardHeader>
              <CardTitle>{widget.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">{widget.value}</span>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Static Members Table below */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Static Members Table</CardTitle>
          <CardDescription>
            Manage, search, and sort members (static data)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <Input
              placeholder="Search members..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="max-w-xs"
            />
            <div className="text-muted-foreground text-sm">
              {sortedMembers.length} member(s) found
            </div>
          </div>
          <div className="border-border bg-background overflow-x-auto rounded-lg border">
            <Table className="w-full min-w-[700px]">
              <TableHeader>
                <TableRow>
                  <TableHead
                    onClick={() => handleSort('name')}
                    className="cursor-pointer whitespace-nowrap"
                  >
                    Name{' '}
                    {sortKey === 'name' &&
                      (sortAsc ? (
                        <ArrowUp size={14} />
                      ) : (
                        <ArrowDown size={14} />
                      ))}
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort('email')}
                    className="cursor-pointer whitespace-nowrap"
                  >
                    Email{' '}
                    {sortKey === 'email' &&
                      (sortAsc ? (
                        <ArrowUp size={14} />
                      ) : (
                        <ArrowDown size={14} />
                      ))}
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort('role')}
                    className="cursor-pointer whitespace-nowrap"
                  >
                    Role{' '}
                    {sortKey === 'role' &&
                      (sortAsc ? (
                        <ArrowUp size={14} />
                      ) : (
                        <ArrowDown size={14} />
                      ))}
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort('joined')}
                    className="cursor-pointer whitespace-nowrap"
                  >
                    Joined{' '}
                    {sortKey === 'joined' &&
                      (sortAsc ? (
                        <ArrowUp size={14} />
                      ) : (
                        <ArrowDown size={14} />
                      ))}
                  </TableHead>
                  <TableHead className="whitespace-nowrap">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedMembers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-muted-foreground py-8 text-center"
                    >
                      No members found.
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedMembers.map(member => (
                    <TableRow key={member.id} className="hover:bg-accent/40">
                      <TableCell>{member.name}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell>{member.joined}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="ml-2"
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default StaticOrganizationWidgets;
