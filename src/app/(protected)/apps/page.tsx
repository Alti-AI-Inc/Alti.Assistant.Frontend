'use client';

import { Suspense } from 'react';
import AppsPanelsContainer from '@/components/panels/AppsPanelsContainer';
import SpacesLayout from '@/components/sidebars/SpacesLayout';

const AppsPage = () => {
  return (
    <Suspense fallback={null}>
      <SpacesLayout showColumnPanels={false}>
        <AppsPanelsContainer />
      </SpacesLayout>
    </Suspense>
  );
};

export default AppsPage;
