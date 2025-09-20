// your interface file

import { Reference } from '@/stores/useConverstionsStore';
import Link from 'next/link';

interface ReferencesProps {
  references: Reference[];
}

export default function ReferencesList({ references }: ReferencesProps) {
  if (!references?.length) return null;

  return (
    <div className="">
      <h1 className="mb-2 text-2xl font-bold">References</h1>

      <ol className="space-y-2 ">
        {references.map((ref, index) => (
          <li key={index} className="flex">
            <span className="mr-2">{index + 1}.</span>
            <Link
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-medium text-primary"
            >
              {ref.title}
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
