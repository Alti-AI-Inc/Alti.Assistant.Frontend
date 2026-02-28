'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  User,
  CreditCard,
  Mail,
  Phone,
  MapPin,
  Plus,
  RefreshCw,
  Trash2,
  DollarSign,
  Edit,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
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

import { PaymentMethodsList } from '@/components/stripe/admin/PaymentMethodsList';
import { CreatePaymentDialog } from '@/components/stripe/admin/CreatePaymentDialog';
import { AddPaymentMethodDialog } from '@/components/stripe/admin/AddPaymentMethodDialog';
import { CreateSubscriptionDialog } from '@/components/stripe/admin/CreateSubscriptionDialog';
import { EditCustomerDialog } from '@/components/stripe/admin/EditCustomerDialog';

import {
  getStripeCustomer,
  getPaymentMethods,
  deleteStripeCustomer,
  type StripeCustomer,
  type StripePaymentMethod,
} from '@/actions/stripeActions';
import { formatDate } from '@/utils/formatters';

export default function CustomerDetailPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const customerId = params.customerId as string;
  const accessToken = session?.accessToken as string;

  const [customer, setCustomer] = useState<StripeCustomer | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<StripePaymentMethod[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isAddPaymentMethodOpen, setIsAddPaymentMethodOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const loadData = useCallback(async () => {
    if (!accessToken || !customerId) return;

    setIsLoading(true);
    try {
      const [customerRes, paymentMethodsRes] = await Promise.all([
        getStripeCustomer(customerId, accessToken),
        getPaymentMethods(accessToken),
      ]);

      if (customerRes.success && customerRes.data) {
        setCustomer(customerRes.data);
      }
      if (paymentMethodsRes.success && paymentMethodsRes.data) {
        setPaymentMethods(paymentMethodsRes.data);
      }
    } catch (error) {
      console.error('Failed to load customer data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, customerId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = async () => {
    if (!accessToken || !customerId) return;

    setIsDeleting(true);
    try {
      const result = await deleteStripeCustomer(customerId, accessToken);
      if (result.success) {
        router.push('/admin/stripe');
      } else {
        console.error('Failed to delete customer:', result.message);
      }
    } finally {
      setIsDeleting(false);
      setIsDeleteOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Button variant="ghost" onClick={() => router.push('/admin/stripe')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <div className="mt-8 text-center">
          <h2 className="text-xl font-semibold">Customer not found</h2>
          <p className="text-muted-foreground mt-2">
            The customer you&apos;re looking for doesn&apos;t exist or has been
            deleted.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push('/admin/stripe')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div>
            <h1 className="text-2xl font-bold">
              {customer.name || 'Unnamed Customer'}
            </h1>
            <Badge variant="secondary" className="mt-1 font-mono text-xs">
              {customer.id}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsEditOpen(true)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={loadData}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => setIsDeleteOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Customer Info */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
                <span className="text-primary text-2xl font-semibold">
                  {customer.name?.[0]?.toUpperCase() || '?'}
                </span>
              </div>
              <div>
                <div className="font-medium">{customer.name || 'No name'}</div>
                <div className="text-muted-foreground text-sm">
                  Organization
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              {customer.email && (
                <div className="flex items-center gap-3">
                  <Mail className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm">{customer.email}</span>
                </div>
              )}
              {customer.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm">{customer.phone}</span>
                </div>
              )}
              {customer.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="text-muted-foreground mt-0.5 h-4 w-4" />
                  <div className="text-sm">
                    {customer.address.line1 && (
                      <div>{customer.address.line1}</div>
                    )}
                    {customer.address.city && (
                      <div>
                        {customer.address.city}, {customer.address.state}{' '}
                        {customer.address.postal_code}
                      </div>
                    )}
                    {customer.address.country && (
                      <div>{customer.address.country}</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <Separator />

            <div className="text-muted-foreground text-sm">
              Created: {formatDate(new Date(customer.created * 1000))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods & Actions */}
        <div className="space-y-6 lg:col-span-2">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Process payments and manage subscriptions for this customer
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button onClick={() => setIsPaymentOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Payment
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsAddPaymentMethodOpen(true)}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Add Payment Method
              </Button>
              <Button
                variant="secondary"
                onClick={() => setIsSubscriptionOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Subscription
              </Button>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Methods
              </CardTitle>
              <CardDescription>
                Cards and payment methods attached to this customer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentMethodsList
                paymentMethods={paymentMethods}
                onRefresh={loadData}
                customerId={customerId}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Customer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;
              {customer.name || customerId}&quot;? This will permanently remove
              the customer and all associated data from Stripe.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete Customer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create Payment Dialog */}
      <CreatePaymentDialog
        open={isPaymentOpen}
        onOpenChange={setIsPaymentOpen}
        customerId={customerId}
        customerName={customer.name || customerId}
      />

      {/* Add Payment Method Dialog */}
      <AddPaymentMethodDialog
        key={`add-pm-${customerId}`}
        open={isAddPaymentMethodOpen}
        onOpenChange={setIsAddPaymentMethodOpen}
        customerId={customerId}
        customerName={customer.name || undefined}
        onSuccess={loadData}
      />

      {/* Create Subscription Dialog */}
      <CreateSubscriptionDialog
        open={isSubscriptionOpen}
        onOpenChange={setIsSubscriptionOpen}
        customer={customer}
        onSuccess={loadData}
      />

      {/* Edit Customer Dialog */}
      <EditCustomerDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        customer={customer}
        onSuccess={loadData}
      />
    </div>
  );
}
