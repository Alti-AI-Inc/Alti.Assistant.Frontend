'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Package, Check, X, Plus, Loader2, DollarSign } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

import {
  type StripeProduct,
  type StripePrice,
  createStripeProducts,
  getStripePrices,
} from '@/actions/stripeActions';
import { formatDate, formatCurrency } from '@/utils/formatters';

interface ProductsTableProps {
  products: StripeProduct[];
  onRefresh: () => void;
}

export function ProductsTable({ products, onRefresh }: ProductsTableProps) {
  const { data: session } = useSession();
  const accessToken = session?.accessToken as string;

  const [prices, setPrices] = useState<StripePrice[]>([]);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isLoadingPrices, setIsLoadingPrices] = useState(false);

  useEffect(() => {
    if (accessToken && products.length > 0) {
      loadPrices();
    }
  }, [accessToken, products.length]);

  const loadPrices = async () => {
    if (!accessToken) return;
    setIsLoadingPrices(true);
    try {
      const result = await getStripePrices(accessToken);
      if (result.success && result.data) {
        setPrices(result.data);
      }
    } catch (error) {
      console.error('Failed to load prices:', error);
    } finally {
      setIsLoadingPrices(false);
    }
  };

  const handleInitializeProducts = async () => {
    if (!accessToken) return;
    setIsInitializing(true);
    try {
      const result = await createStripeProducts(accessToken);
      if (result.success) {
        onRefresh();
      } else {
        console.error('Failed to initialize products:', result.message);
      }
    } catch (error) {
      console.error('Initialize products error:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  const getProductPrices = (productId: string) => {
    return prices.filter(p => p.product === productId);
  };

  if (products.length === 0) {
    return (
      <Card>
        <CardHeader className="text-center">
          <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <Package className="text-muted-foreground h-8 w-8" />
          </div>
          <CardTitle>No Products Yet</CardTitle>
          <CardDescription>
            Initialize your subscription products to get started with Base,
            Professional, and Enterprise plans.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pb-6">
          <Button
            onClick={handleInitializeProducts}
            disabled={isInitializing}
            size="lg"
          >
            {isInitializing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Initializing...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Initialize Products
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-lg">Products & Pricing</CardTitle>
          <CardDescription>
            {products.length} product{products.length !== 1 ? 's' : ''}{' '}
            available
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleInitializeProducts}
          disabled={isInitializing}
        >
          {isInitializing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Plus className="mr-1 h-3 w-3" />
              Reinitialize
            </>
          )}
        </Button>
      </CardHeader>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Pricing</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map(product => {
            const productPrices = getProductPrices(product.id);
            return (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                      <Package className="text-primary h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-muted-foreground text-xs">
                        {product.description || product.id}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {isLoadingPrices ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : productPrices.length > 0 ? (
                    <div className="space-y-1">
                      {productPrices.map(price => (
                        <div key={price.id} className="flex items-center gap-2">
                          <DollarSign className="text-muted-foreground h-3 w-3" />
                          <span className="text-sm font-medium">
                            {formatCurrency(price.unit_amount)}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            /{price.recurring?.interval || 'one-time'}
                          </span>
                          {price.nickname && (
                            <Badge variant="outline" className="text-xs">
                              {price.nickname}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">
                      No pricing
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {product.active ? (
                    <Badge variant="default" className="gap-1">
                      <Check className="h-3 w-3" />
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="gap-1">
                      <X className="h-3 w-3" />
                      Inactive
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDate(new Date(product.created * 1000))}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
