import { cn } from '@/lib/utils';
import {
  Building,
  Car,
  ChartNoAxesCombined,
  CircleDollarSign,
  Cog,
  DraftingCompass,
  Droplet,
  Factory,
  Forklift,
  Fuel,
  Hammer,
  HandCoins,
  Pickaxe,
  Rocket,
  Umbrella,
  Zap,
} from 'lucide-react';

const industries = [
  { name: 'Construction', icon: <Hammer className="mr-6" /> },
  { name: 'Architecture', icon: <DraftingCompass className="mr-6" /> },
  { name: 'Real Estate', icon: <Building className="mr-6" /> },
  { name: 'Engineering', icon: <Cog className="mr-6" /> },
  { name: 'Manufacturing', icon: <Factory className="mr-6" /> },
  { name: 'Automotive', icon: <Car className="mr-6" /> },
  { name: 'Aerospace', icon: <Rocket className="mr-6" /> },
  { name: 'Logistics', icon: <Forklift className="mr-6" /> },
  { name: 'Energy', icon: <Zap className="mr-6" /> },
  { name: 'Oil', icon: <Fuel className="mr-6" /> },
  { name: 'Mining', icon: <Pickaxe className="mr-6" /> },
  { name: 'Utilities', icon: <Droplet className="mr-6" /> },
  { name: 'Finance', icon: <CircleDollarSign className="mr-6" /> },
  { name: 'Mortgage', icon: <HandCoins className="mr-6" /> },
  { name: 'Insurance', icon: <Umbrella className="mr-6" /> },
  { name: 'Capital Markets', icon: <ChartNoAxesCombined className="mr-6" /> },
];

const Industries = ({ className }: { className?: string }) => {
  return (
    <div
      id="industries"
      className={cn(
        'mx-auto w-full max-w-(--breakpoint-xl) px-5 py-10 lg:px-0 lg:py-20',
        className,
      )}
    >
      <h2 className="font-secondary font-montserrat text-center text-[32px] leading-[56px] font-bold text-[#000] md:text-5xl">
        Industries We Serve
      </h2>
      <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {industries.map((item, index) => (
          <div
            key={index}
            className="flex items-center rounded-2xl bg-gray-100 pl-4 md:px-8 py-4 md:text-xl"
          >
            <span className='flex-none'> {item.icon}</span>
            <span> {item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Industries;
