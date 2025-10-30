import { cn } from '@/lib/utils';
import Image from 'next/image';

const AiBuiltFor = ({ className }: { className?: string }) => {
  return (
    <div
      id="about"
      className={cn(
        'mx-auto flex w-full max-w-(--breakpoint-xl) items-center px-5 py-10 lg:px-0 lg:py-20',
        className,
      )}
    >
      <div className="flex w-full flex-wrap items-center justify-between">
        <div className="w-full lg:w-1/2">
          <h2 className="font-secondary font-montserrat text-center text-[32px] leading-[56px] font-bold text-[#000] md:text-5xl lg:text-start">
            AI Built for the Economy
          </h2>
          <p className="mt-2 md:mt-6 md:text-lg">
            Alti is a secure, enterprise grade AI platform built to power
            industrial intelligence. It helps organizations transform how they
            manage, access, and act on complex technical data, turning
            information into instant, actionable insight. Centered around three
            core pillars of search, knowledge, and automate, we enable teams to
            find answers faster, preserve critical expertise, and streamline your business
            operations through intelligent automation and workflows.
          </p>
        </div>
        <div className="flex w-full translate-x-7 justify-center lg:mt-0 lg:w-1/2 lg:justify-end">
          <Image
            height={400}
            width={1200}
            alt="Out company image"
            src="/assets/our-company.png"
            className="h-[350px] w-[500px] object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default AiBuiltFor;
