import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { CircleCheck } from 'lucide-react';

const plans = [
  {
    name: 'Company Plan',
    per: 'company',
    price: '1,000',
    description: 'This price is per company.',
    features: ['1TB shared storage'],
    buttonText: 'Get Company Plan',
  },
  {
    name: 'User Plan',
    price: 100,
    per: 'user',
    isRecommended: true,
    description:
      'Get 50 AI-generated portraits with 5 unique styles and filters.',
    features: ['100GB personal storage'],
    buttonText: 'Get User Plan',
    isPopular: true,
  },
  {
    name: 'Additional Storage',
    price: 1,
    per: 'GB',
    description:
      'Get 100 AI-generated portraits with 10 unique styles and filters.',
    features: ['Expand company or user storage anytime'],
    buttonText: 'Get 100 portraits in 1 hour',
    hideButton: true,
  },
];

const Pricing = () => {
  return (
    <div
      id="pricing"
      className="mx-auto mb-28 w-full max-w-(--breakpoint-xl) px-5 py-10 lg:px-0 lg:py-20"
    >
      <h2 className="font-secondary font-montserrat w-full text-center text-[32px] leading-[56px] font-bold text-[#000] md:text-5xl lg:text-center">
        Our Pricing
      </h2>
      <div className="mx-auto mt-12 grid grid-cols-1 gap-8 sm:mt-16 lg:grid-cols-3">
        {plans.map(plan => (
          <div
            key={plan.name}
            className="h-fit rounded-lg border border-none bg-gray-100 p-6"
          >
            <h3 className="text-2xl font-semibold">{plan.name}</h3>
            <p className="mt-2 text-4xl font-bold">
              ${plan.price}
              <span className="text-muted-foreground text-sm font-medium">
                /{plan.per}
              </span>
            </p>

            <Separator className={cn('my-4', plan?.hideButton && 'hidden')} />
            <ul className={cn('space-y-2', plan?.hideButton && 'hidden')}>
              {plan.features.map(feature => (
                <li key={feature} className="flex items-start gap-2">
                  <CircleCheck className="mt-1 h-4 w-4 text-blue-700" />{' '}
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              size="lg"
              className={cn(
                'mt-6 w-full bg-blue-700 text-white hover:bg-blue-800 hover:text-white',
                plan?.hideButton && 'hidden',
              )}
            >
              {plan.buttonText}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
