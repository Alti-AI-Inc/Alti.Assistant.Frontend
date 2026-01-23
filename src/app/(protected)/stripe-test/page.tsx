import CheckoutForm from '@/components/stripe/checkout';
import { stripe } from '@/lib/stripe';

interface OrderItem {
  id: string;
  quantity?: number;
}

/**
 * Calculate order amount in cents
 * Replace this with your actual order calculation logic
 */
function calculateOrderAmount(items: OrderItem[]): number {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client

  // Example: You would typically look up prices from your database
  // and calculate based on quantity
  console.log('Calculating order for items:', items);
  return 1400; // Amount in cents (e.g., €14.00)
}

interface IntentPageProps {
  // Add any props if needed (e.g., from searchParams or params)
}

export default async function IntentPage({}: IntentPageProps) {
  try {
    // Create PaymentIntent as soon as the page loads
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount([{ id: 'xl-tshirt' }]),
      currency: 'eur',
      // In the latest version of the API, specifying the `automatic_payment_methods`
      // parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
    });

    if (!paymentIntent.client_secret) {
      throw new Error(
        'Failed to create payment intent: No client secret returned',
      );
    }

    return (
      <div id="checkout">
        <CheckoutForm clientSecret={paymentIntent.client_secret} />
      </div>
    );
  } catch (error) {
    console.error('Error creating payment intent:', error);

    return (
      <div id="checkout-error">
        <h2>Unable to initialize payment</h2>
        <p>
          There was an error setting up your payment. Please try again later.
        </p>
      </div>
    );
  }
}
