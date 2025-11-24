import { cn } from '@/lib/utils';
import Image from 'next/image';
import InfoBoxesContainer from './InfoBoxesContainer';

const Automate = ({ className }: { className?: string }) => {
  return (
    <div>
      <div
        id="mission"
        className={cn(
          'mx-auto flex max-w-(--breakpoint-xl) items-center px-5 py-10 lg:px-0 lg:pt-0 lg:pb-20',
          className,
        )}
      >
        <div className="flex w-full flex-col-reverse flex-wrap items-center justify-between lg:flex-row">
          <div className="mt-10 flex w-full translate-x-0 justify-center lg:mb-0 lg:w-1/2 lg:justify-start">
            <Image
              height={350}
              width={500}
              alt="Out mission image"
              src="/assets/automate-image.png"
            />
          </div>
          <div className="flex w-full justify-center lg:mt-0 lg:w-1/2 lg:justify-end">
            <InfoBoxesContainer
              title="Automation"
              box1Title="Task Automation"
              box1Desc="Execute one time AI-driven actions across connected apps and systems instantly."
              box2Desc="Build recurring, intelligent workflows that keep operations running automatically."
              box2Title="Workflow Automation"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Automate;
