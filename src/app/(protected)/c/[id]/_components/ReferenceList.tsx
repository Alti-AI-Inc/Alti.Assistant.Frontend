// your interface file

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Reference } from '@/stores/useConverstionsStore';
import Link from 'next/link';
interface ReferencesProps {
  references: Reference[];
}

export default function ReferencesList({ references }: ReferencesProps) {
  return (
    <div className="">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-primary items-center justify-start text-base focus-visible:border-none focus-visible:ring-0">
            References
          </AccordionTrigger>
          <AccordionContent>
            <ol className="space-y-2">
              {references.map((ref, index) => {
                return (
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
                );
              })}
            </ol>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
