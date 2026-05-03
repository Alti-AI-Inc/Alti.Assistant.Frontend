'use client';

import { RefreshCw, Search } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

import { getAllPayments } from '@/actions/adminActions';
import { PaymentsTable } from '@/components/admin/PaymentsTable';

export default function AdminPaymentsPage() {
  const { data: session } = useSession();
  const accessToken = session?.accessToken as string;

  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const loadPayments = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getAllPayments(accessToken, {
        page,
        limit,
        searchTerm: searchTerm || undefined,
      });
      if (res.success && res.data) {
        setPayments(res.data.data || res.data);
      } else {
        setPayments([]);
      }
    } catch (err) {
      console.error('Failed to load payments', err);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, page, limit, searchTerm]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin - Payments</h1>
          <p className="text-muted-foreground">View and filter payments.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon" onClick={loadPayments}>
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
            />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payments</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex min-h-[40vh] items-center justify-center">
              <Spinner className="h-8 w-8" />
            </div>
          ) : (
            <PaymentsTable payments={payments} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
