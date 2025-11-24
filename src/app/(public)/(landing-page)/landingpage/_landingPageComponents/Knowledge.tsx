import { cn } from '@/lib/utils';
import Image from 'next/image';
import InfoBoxesContainer from './InfoBoxesContainer';

const Knowledge = ({ className }: { className?: string }) => {
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
            title="Knowledge"
            box1Title="Knowledge Bank"
            box1Desc="Centralized intelligence hub that securely stores and organizes your organization’s technical data."
            box2Title="Knowledge Bots"
            box2Desc=" Private AI assistants trained on your company’s knowledge to deliver instant, context aware answers."
          />
        </div>
        <div className="flex w-full lg:translate-x-10 justify-center lg:mt-0 lg:w-1/2 lg:justify-end">
          <Image
            height={400}
            width={1200}
            alt="Out vision image"
            src="/assets/our-vision.png"
            className="h-[350px] w-[500px] translate-y-10 object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Knowledge;
