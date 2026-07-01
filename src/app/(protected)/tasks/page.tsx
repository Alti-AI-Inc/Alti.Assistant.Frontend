import { Suspense } from 'react';
import TasksClient from './TasksClient';

export default function TasksDashboardPage() {
  return (
    <Suspense fallback={<div className="flex-1 h-full flex items-center justify-center text-sm text-gray-500">Loading tasks...</div>}>
      <TasksClient />
    </Suspense>
  );
}
