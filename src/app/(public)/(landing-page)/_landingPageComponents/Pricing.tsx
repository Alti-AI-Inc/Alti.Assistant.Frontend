import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CircleCheck } from 'lucide-react';

const plans = [
  {
    name: 'Company Plan',
    price: 19,
    description:
      'Get 20 AI-generated portraits with 2 unique styles and filters.',
    features: [
      '5 hours turnaround time',
      '20 AI portraits',
      'Choice of 2 styles',
      'Choice of 2 filters',
      '2 retouch credits',
    ],
    buttonText: 'Get 20 portraits in 5 hours',
  },
  {
    name: 'User Plan',
    price: 29,
    isRecommended: true,
    description:
      'Get 50 AI-generated portraits with 5 unique styles and filters.',
    features: [
      '3 hours turnaround time',
      '50 AI portraits',
      'Choice of 5 styles',
      'Choice of 5 filters',
      '5 retouch credits',
    ],
    buttonText: 'Get 50 portraits in 3 hours',
    isPopular: true,
  },
  {
    name: 'Additional Storage',
    price: 49,
    description:
      'Get 100 AI-generated portraits with 10 unique styles and filters.',
    features: [
      '1-hour turnaround time',
      '100 AI portraits',
      'Choice of 10 styles',
      'Choice of 10 filters',
      '10 retouch credits',
    ],
    buttonText: 'Get 100 portraits in 1 hour',
  },
];

const Pricing = () => {
  return (
    <div className="mx-auto w-full max-w-(--breakpoint-xl) px-5 py-10 lg:px-0 lg:py-20">
      <h2 className="font-secondary font-montserrat w-full text-center text-[32px] leading-[56px] font-bold text-[#000] md:text-5xl">
        Pricing
      </h2>
      <div className="mx-auto mt-12 grid max-w-(--breakpoint-lg) grid-cols-1 gap-8 sm:mt-16 lg:grid-cols-3">
        {plans.map(plan => (
          <div key={plan.name} className="rounded-lg border p-6">
            <h3 className="text-lg font-medium">{plan.name}</h3>
            <p className="mt-2 text-4xl font-bold">${plan.price}</p>
            <p className="text-muted-foreground mt-4 font-medium">
              {plan.description}
            </p>
            <Separator className="my-4" />
            <ul className="space-y-2">
              {plan.features.map(feature => (
                <li key={feature} className="flex items-start gap-2">
                  <CircleCheck className="mt-1 h-4 w-4 text-green-600" />{' '}
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              variant={plan.isPopular ? 'default' : 'outline'}
              size="lg"
              className="mt-6 w-full"
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
