import { cn } from '@/lib/utils';
import Image from 'next/image';
import InfoBoxesContainer from './InfoBoxesContainer';

const Agents = ({ className }: { className?: string }) => {
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
              height={400}
              width={550}
              alt="Out mission image"
              src="/assets/agents-image.png"
            />
          </div>
          <div className="flex w-full justify-center lg:mt-0 lg:w-1/2 lg:justify-end">
            <InfoBoxesContainer
              title="Agents"
              box1Title="Agent Builder"
              box1Desc="Design, customize, and deploy intelligent AI agents with goals, tools, and behaviors tailored to your business."
              box2Desc="Coordinate multiple agents to collaborate, delegate tasks, and solve complex workflows together."
              box2Title="Agent Orchestrator"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agents;
