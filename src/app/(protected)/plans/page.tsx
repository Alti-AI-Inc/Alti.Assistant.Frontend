import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Pro',
    price: 20,
    description: 'Private assistant, smarter tools.',
    features: [
      'Web Search → unlimited',
      'Deep Research → 100',
      'Code Generation → 250',
      'Task Automation → 250 actions',
      'My Chatbots → save up to 5 bots',
      'My Knowledge → manual uploads up to 1GB',
    ],
    buttonText: 'Get Pro Plan',
    currentPlan: true,
  },
  {
    name: 'Power',
    price: 50,
    isRecommended: true,
    description: 'Advanced AI, deeper knowledge.',
    features: [
      'Web Search → unlimited',
      'Deep Research → 500',
      'Code Generation → 1000',
      'Task Automation → 1000 actions',
      'My Chatbots → save up to 25 bots',
      'My Knowledge → app connectors up to 10GB',
    ],
    buttonText: 'Get Power Plan',
    currentPlan: false,
  },
];

const Pricing01 = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <h1 className="text-center text-5xl font-semibold tracking-tighter">
        Plans that grow with you
      </h1>
      <div className="mx-auto mt-12 grid max-w-[840px] grid-cols-1 gap-5 sm:mt-16 lg:grid-cols-2">
        {plans.map(plan => (
          <div key={plan.name} className="bg-secondary rounded-lg border p-6">
            <h3 className="text-lg font-medium">{plan.name}</h3>
            <p className="mt-2 text-4xl font-bold">
              ${plan.price}{' '}
              <span className="text-muted-foreground text-sm font-medium">
                /month
              </span>
            </p>
            <p className="text-muted-foreground mt-4 font-medium">
              {plan.description}
            </p>
            <Button
              // variant="outline"
              // variant={plan.currentPlan ? "default" : "outline"}
              size="lg"
              className={cn(
                'mt-4 mb-8 w-full bg-white text-black shadow-none hover:bg-white hover:text-black',
                plan.currentPlan && 'bg-primary/90 hover:bg-primary/80 hover:text-white text-white',
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
