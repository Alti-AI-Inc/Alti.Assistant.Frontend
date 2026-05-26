// Server component — this allows child page segments to properly use
// `export const dynamic = 'force-dynamic'` which is ignored when the
// parent layout is a client component.
import ProtectedLayoutClient from './ProtectedLayoutClient';

import { motion } from 'framer-motion';

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ProtectedLayoutClient>{children}</ProtectedLayoutClient>;
}
