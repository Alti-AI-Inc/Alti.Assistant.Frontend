// Server component — force-dynamic is correctly honoured here, preventing
// Next.js from pre-rendering and caching this route at build time.
export const dynamic = 'force-dynamic';

import WorkflowsClient from './WorkflowsClient';

export default function WorkflowsDashboardPage() {
  return <WorkflowsClient />;
}
