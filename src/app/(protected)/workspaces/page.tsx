'use client';

import SpacesLayout from '@/components/sidebars/SpacesLayout';
import KnowledgeBots from '../knowledge/_components/KnowledgeBots';

const page = () => {
  return (
    <SpacesLayout>
      <div className="p-6">
        <KnowledgeBots />
      </div>
    </SpacesLayout>
  );
};

export default page;
