import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
      'Code Generation → 1,000',
      'Task Automation → 1,000 actions',
      'My Chatbots → save up to 10 bots',
      'My Knowledge → manual uploads',
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
      'Code Generation → 5,000',
      'Task Automation → 5,000 actions',
      'My Chatbots → save up to 50 bots',
      'My Knowledge → app connectors',
    ],
    buttonText: 'Get Power Plan',
    currentPlan: false,
  },
];
const memroy = [
  {
    name: '1 Month Memory',
    price: 5,
    buttonText: 'Upgrade Memory',
    currentPlan: true,
  },
  {
    name: '3 Month Memory',
    price: 10,
    buttonText: 'Upgrade Memory',
    currentPlan: false,
  },
  {
    name: '6 Month Memory',
    price: 15,
    buttonText: 'Upgrade Memory',
    currentPlan: false,
  },
  {
    name: '12 Month Memory',
    price: 20,
    buttonText: 'Upgrade Memory',
    currentPlan: false,
  },
];

const Pricing01 = () => {
  return (
    <div className="flex min-h-screen flex-col items-center px-6 py-12">
      <h1 className="mt-10 text-center text-5xl font-semibold tracking-tighter">
        Upgrade Plans
      </h1>
      <Tabs defaultValue="plan" className="mt-12 w-full sm:mt-16">
        <TabsList className="mx-auto mb-6 w-full max-w-[280px]">
          <TabsTrigger value="plan">Plans</TabsTrigger>
          <TabsTrigger value="memory">Memory</TabsTrigger>
        </TabsList>
        <TabsContent value="plan">
          <div className="mx-auto grid w-full max-w-[840px] grid-cols-1 gap-5 lg:grid-cols-2">
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
                <p className="text-muted-foreground mt-4 font-medium">
                  {plan.description}
                </p>
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
        </TabsContent>
        <TabsContent value="memory">
          <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-5 lg:grid-cols-4">
            {memroy.map(plan => (
              <div
                key={plan.name}
                className="bg-secondary w-full rounded-lg border p-6"
              >
                <h3 className="text-lg font-medium">{plan.name}</h3>
                <p className="mt-2 text-4xl font-bold">${plan.price} </p>

                <Button
                  size="lg"
                  className={cn(
                    'mt-4 w-full bg-white text-black shadow-none hover:bg-white hover:text-black',
                    plan.currentPlan &&
                      'bg-primary/90 hover:bg-primary/80 text-white hover:text-white',
                  )}
                >
                  {plan.currentPlan ? 'Current Plan' : plan.buttonText}
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Pricing01;
