'use client';

import AppsPanelsContainer from '@/components/panels/AppsPanelsContainer';
import SpacesLayout from '@/components/sidebars/SpacesLayout';

const AppsPage = () => {
  return (
    <SpacesLayout showColumnPanels={false}>
      <AppsPanelsContainer />
    </SpacesLayout>
  );
};

export default AppsPage;
