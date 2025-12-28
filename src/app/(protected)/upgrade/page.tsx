import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Explore',
    price: 20,
    description: 'Private assistant, smarter tools.',
    features: ['Web Search → 1,000', 'Deep Research → 10'],
    buttonText: 'Select Plan',
    currentPlan: true,
  },
  {
    name: 'Execute',
    price: 50,
    isRecommended: true,
    description: 'Advanced AI, deeper knowledge.',
    features: ['Web Search → 5,000', 'Deep Research → 50'],
    buttonText: 'Select Plan',
    currentPlan: false,
  },
  {
    name: 'Command',
    price: 100,
    isRecommended: false,
    description: 'Advanced AI, deeper knowledge.',
    features: ['Web Search → 15,000', 'Deep Research → 150'],
    buttonText: 'Select Plan',
    currentPlan: false,
  },
];


const Pricing01 = () => {
  return (
    <div className="flex min-h-screen flex-col items-center px-6 py-12">
      <h1 className="mt-10 text-center text-5xl font-semibold tracking-tighter">
        Upgrade Plan
      </h1>

      <div className="mx-auto grid mt-20 w-full max-w-[940px] grid-cols-1 gap-5 lg:grid-cols-3">
        {plans.map(plan => (
          <div
            key={plan.name}
            className="bg-secondary rounded-lg border p-6"
          >
            <h3 className="text-lg font-medium">{plan.name}</h3>
            <p className="mt-2 text-4xl font-bold">
              ${plan.price}{' '}
              <span className="text-muted-foreground text-sm font-medium">
                /month
              </span>
            </p>
            {/* <p className="text-muted-foreground mt-4 font-medium">
                  {plan.description}
                </p> */}
            <Button
              size="lg"
              className={cn(
                'mt-4 mb-8 w-full bg-white text-black shadow-none hover:bg-white hover:text-black',
                plan.currentPlan &&
                'bg-primary/90 hover:bg-primary/80 text-white hover:text-white',
              )}
            >
              {plan.currentPlan ? 'Current Plan' : plan.buttonText}
            </Button>
            {/* <Separator className="my-4" /> */}
            <ul className="space-y-2">
              {plan.features.map(feature => (
                <li key={feature} className="flex items-start gap-2">
                  <Check className="mt-1 h-4 w-4 text-gray-600" /> {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Pricing01;
