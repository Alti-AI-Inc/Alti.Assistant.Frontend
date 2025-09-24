// your interface file

import { Button } from '@/components/ui/button';
import { Reference } from '@/stores/useConverstionsStore';
import Link from 'next/link';
import { useState } from 'react';
import { YouTubePlayer } from './YoutubePlayer';

interface ReferencesProps {
  references: Reference[];
}

export default function ReferencesList({ references }: ReferencesProps) {
  const [showFullList, setShowFullList] = useState(false);
  return (
    <div className="">
      <h1 className="mb-2 text-2xl font-bold">References</h1>

      <ol className="space-y-2">
        {references
          .slice(0, showFullList ? references.length : 2)
          .map((ref, index) => {
            return (
              <>
                {ref.source === 'youtube' ? (
                  <YouTubePlayer videoData={ref} />
                ) : (
                  <li key={index} className="flex">
                    <span className="mr-2">{index + 1}.</span>
                    <Link
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-medium underline"
                    >
                      {ref.title ? ref.title : ref.url}
                    </Link>
                  </li>
                )}
              </>
            );
          })}

        {references.length > 2 && (
          <Button
            variant={'link'}
            onClick={() => setShowFullList(!showFullList)}
            className="text-primary underline"
          >
            {showFullList ? 'Show less' : 'Show more'}
          </Button>
        )}
      </ol>
    </div>
  );
}
