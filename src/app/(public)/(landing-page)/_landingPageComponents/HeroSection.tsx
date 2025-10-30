import { Button } from '@/components/ui/button';
import Image from 'next/image';

const HeroSection = () => {
  return (
    <div className="mx-auto max-w-(--breakpoint-xl)">
      <h1 className="mx-auto mt-[110px] mb-2 w-full max-w-[1007px] text-center text-[50px] font-bold text-[#0E0D17]">
        Secure AI for Industrial Intelligence
      </h1>
      <h2 className="mb-8 text-center text-2xl">
        Transform how your organization manages technical data
      </h2>
      {/* hero-img */}
      <Image
        src="/assets/hero-img.jpg"
        alt="Logo"
        height={607}
        priority
        width={1500}
        className="mx-auto h-[400px] w-[88vw] rounded-[20px]"
      />
      <div className="mt-12 flex items-center justify-center space-x-6">
        <Button className="rounded-full bg-blue-700 text-white" size="lg">
          Learn More
        </Button>
        <Button className="rounded-full" size="lg">
          Schedule Demo
        </Button>
      </div>
    </div>
  );
};

export default HeroSection;
