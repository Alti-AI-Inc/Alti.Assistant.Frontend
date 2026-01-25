import 'server-only';

import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

// This file is deprecated for frontend usage as we use the backend API now.
// Keeping it for now to avoid breaking other unknown references, but removing the hard crash.

export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey)
  : ({} as Stripe); // Fallback to empty object if key missing to avoid crash, since we shouldn't use this file anymore.
