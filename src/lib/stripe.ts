import 'server-only';

import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error(
    'Missing STRIPE_SECRET_KEY environment variable. Please add it to your .env.local file.',
  );
}

export const stripe = new Stripe(stripeSecretKey);
