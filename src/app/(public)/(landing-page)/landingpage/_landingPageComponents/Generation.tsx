import { cn } from '@/lib/utils';
import Image from 'next/image';
import InfoBoxesContainer from './InfoBoxesContainer';

const Generation = ({ className }: { className?: string }) => {
  return (
    <div
      id="vision"
      className={cn(
        'mx-auto flex w-full max-w-(--breakpoint-xl) items-center px-5 py-10 lg:px-0 lg:pt-0 lg:pb-20',
        className,
      )}
    >
      <div className="flex w-full flex-wrap items-center justify-between">
        <div className="w-full lg:w-1/2">
          <InfoBoxesContainer
            title="Generation"
            box1Title="Text Generation"
            box1Desc="Generate, summarize, and reason over technical documents, reports, and communications with precision."
            box2Title="Code Generation"
            box2Desc="Write, optimize, and automate scripts, workflows, and integrations across your systems."
          />
        </div>
        <div className="flex w-full justify-center lg:mt-0 lg:w-1/2 lg:justify-end">
          <Image
            height={400}
            width={1200}
            alt="Out vision image"
            src="/assets/Generation.png"
            className="h-[350px] w-[500px] translate-y-7.5 object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Generation;
