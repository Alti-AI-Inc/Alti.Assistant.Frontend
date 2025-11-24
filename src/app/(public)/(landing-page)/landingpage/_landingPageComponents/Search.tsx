import { cn } from '@/lib/utils';
import Image from 'next/image';
import InfoBoxesContainer from './InfoBoxesContainer';

const Search = ({ className }: { className?: string }) => {
  return (
    <div>
      <div
        id="features"
        className={cn(
          'mx-auto flex w-full max-w-(--breakpoint-xl) items-center px-5 py-10 lg:px-0 lg:pt-0 lg:pb-20',
          className,
        )}
      >
        <div className="flex w-full flex-col-reverse flex-wrap items-center justify-between lg:flex-row">
          <div className="mt-10 flex w-full lg:-translate-x-10 justify-center lg:mb-0 lg:w-1/2 lg:justify-start">
            <Image
              height={400}
              width={1200}
              alt="Out mission image"
              src="/assets/our-mission.png"
            />
          </div>
          <div className="flex w-full justify-center lg:mt-0 lg:w-1/2 lg:justify-end">
            <InfoBoxesContainer
              title="Search"
              box1Title="Web Search"
              box1Desc="Real-time answers from the open web, enriched with verified and
                trusted sources."
              box2Title="Deep Research"
              box2Desc=" In depth analysis across multiple online sources to deliver comprehensive, citation backed intelligence."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
