import Image from 'next/image';

const HeroSection = () => {
  return (
    <div>
      <h1 className="mx-auto mt-[140px] mb-2 w-full max-w-[1007px] text-center text-[50px] font-bold text-[#0E0D17]">
        Secure AI for Industrial Intelligence
      </h1>
      <h2 className="mb-14 text-center text-2xl">
        Transform how your organization manages technical data
      </h2>
      {/* hero-img */}
      <Image
        src="/assets/hero-img.jpg"
        alt="Logo"
        height={607}
        priority
        width={1500}
        className="mx-auto h-[500px] w-[88vw] rounded-[20px]"
      />
    </div>
  );
};

export default HeroSection;
