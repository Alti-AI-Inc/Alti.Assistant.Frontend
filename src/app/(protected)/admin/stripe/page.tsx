'use client';

import { useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Users,
  CreditCard,
  Package,
  BarChart3,
  Plus,
  Search,
  RefreshCw,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Spinner } from '@/components/ui/spinner';

import { CustomersTable } from '@/components/stripe/admin/CustomersTable';
import { SubscriptionsTable } from '@/components/stripe/admin/SubscriptionsTable';
import { ProductsTable } from '@/components/stripe/admin/ProductsTable';
import { CreateCustomerDialog } from '@/components/stripe/admin/CreateCustomerDialog';

import {
  getStripeCustomers,
  getStripeSubscriptions,
  getStripeProducts,
} from '@/actions/stripeActions';

import { useStripeAdminStore } from '@/stores/useStripeAdminStore';

export default function StripeAdminDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const accessToken = session?.accessToken as string;

  // Zustand store
  const {
    customers,
    subscriptions,
    products,
    isLoading,
    searchTerm,
    activeTab,
    isCreateCustomerOpen,
    filteredCustomers,
    activeSubscriptions,
    totalRevenue,
    setStripeData,
    setLoading,
    setSearchTerm,
    setActiveTab,
    setCreateCustomerOpen,
  } = useStripeAdminStore();

  const loadData = useCallback(async () => {
    if (!accessToken) return;

    setLoading(true);
    try {
      const [customersRes, subscriptionsRes, productsRes] = await Promise.all([
        getStripeCustomers(accessToken),
        getStripeSubscriptions(accessToken),
        getStripeProducts(accessToken),
      ]);

      setStripeData({
        customers:
          customersRes.success && Array.isArray(customersRes.data)
            ? customersRes.data
            : [],
        subscriptions:
          subscriptionsRes.success && Array.isArray(subscriptionsRes.data)
            ? subscriptionsRes.data
            : [],
        products:
          productsRes.success && Array.isArray(productsRes.data)
            ? productsRes.data
            : [],
      });
    } catch (error) {
      console.error('Failed to load Stripe data:', error);
    } finally {
      setLoading(false);
    }
  }, [accessToken, setLoading, setStripeData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCustomerClick = (customerId: string) => {
    router.push(`/admin/stripe/customers/${customerId}`);
  };

  const handleCustomerCreated = () => {
    setCreateCustomerOpen(false);
    loadData();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl space-y-8 px-4 py-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Stripe Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage customers, subscriptions, and payments for all organizations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={loadData}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
            />
          </Button>
          <Button onClick={() => setCreateCustomerOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Customers
            </CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-muted-foreground text-xs">
              Organizations registered
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Subscriptions
            </CardTitle>
            <CreditCard className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeSubscriptions().length}
            </div>
            <p className="text-muted-foreground text-xs">
              Currently active plans
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Revenue
            </CardTitle>
            <BarChart3 className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(totalRevenue() / 100).toFixed(2)}
            </div>
            <p className="text-muted-foreground text-xs">
              From active subscriptions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products.filter(p => p.active).length}
            </div>
            <p className="text-muted-foreground text-xs">
              Active pricing plans
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs
        value={activeTab}
        onValueChange={tab => setActiveTab(tab as typeof activeTab)}
        className="space-y-4"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="customers" className="gap-2">
              <Users className="h-4 w-4" />
              Customers
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="gap-2">
              <CreditCard className="h-4 w-4" />
              Subscriptions
            </TabsTrigger>
            <TabsTrigger value="products" className="gap-2">
              <Package className="h-4 w-4" />
              Products
            </TabsTrigger>
          </TabsList>

          <div className="relative w-full sm:w-64">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <TabsContent value="customers" className="space-y-4">
          <CustomersTable
            customers={filteredCustomers()}
            onCustomerClick={handleCustomerClick}
            onRefresh={loadData}
          />
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-4">
          <SubscriptionsTable
            subscriptions={subscriptions}
            customers={customers}
            onRefresh={loadData}
          />
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <ProductsTable products={products} onRefresh={loadData} />
        </TabsContent>
      </Tabs>

      {/* Create Customer Dialog */}
      <CreateCustomerDialog
        open={isCreateCustomerOpen}
        onOpenChange={setCreateCustomerOpen}
        onSuccess={handleCustomerCreated}
      />
    </div>
  );
}
