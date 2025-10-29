import { cn } from '@/lib/utils';
import Image from 'next/image';
import InfoBoxesContainer from './InfoBoxesContainer';

const Automate = ({ className }: { className?: string }) => {
  return (
    <div>
      <div
        id="mission"
        className={cn(
          'mx-auto flex max-w-[1300px] items-center px-5 py-10 lg:px-10 lg:pt-0 lg:pb-20',
          className,
        )}
      >
        <div className="flex w-full flex-col-reverse flex-wrap items-center justify-between lg:flex-row">
          <div className="mt-10 flex w-full -translate-x-20 justify-center lg:mb-0 lg:w-1/2 lg:justify-start">
            <Image
              height={350}
              width={500}
              alt="Out mission image"
              src="/assets/automate-image.png"
            />
          </div>
          <div className="w-full lg:w-1/2">
            <InfoBoxesContainer
              title="Automate"
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
