import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const plans = [
  {
    name: 'Professional',
    price: 250,
    isRecommended: true,
    description: 'Advanced AI, deeper knowledge.',
    features: [
      'Knowledge Bank → 100 GB',
      'Knowledge Bots → 100',
      'AI Tasks → 10,000',
      'AI Workflows → 1,000',
      'Web Search → 10,000',
      'Deep Research → 100',
      'Text Generations → 10,000',
      'Code Generations → 1,000',
    ],
    buttonText: 'Select Plan',
    currentPlan: false,
  },
  {
    name: 'Business',
    price: 500,
    isRecommended: false,
    description: 'Scale your operations with powerful AI tools.',
    features: [
      'Knowledge Bank → 500 GB',
      'Knowledge Bots → 500',
      'AI Tasks → 50,000',
      'AI Workflows → 5,000',
      'Web Search → 50,000',
      'Deep Research → 500',
      'Text Generations → 50,000',
      'Code Generations → 5,000',
    ],
    buttonText: 'Select Plan',
    currentPlan: false,
  },
  {
    name: 'Enterprise',
    price: '1,000',
    isRecommended: false,
    description: 'Enterprise-grade intelligence and scalability.',
    features: [
      'Knowledge Bank → 1 TB',
      'Knowledge Bots → 1,000',
      'Ingestion Connectors → 1,000',
      'AI Tasks → 100,000',
      'AI Workflows → 10,000',
      'Web Search → 100,000',
      'Deep Research → 1,000',
      'Text Generations → 100,000',
      'Code Generations → 10,000',
    ],
    buttonText: 'Select Plan',
    currentPlan: false,
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
      <div className="mx-aut mt-12 grid w-full grid-cols-1 gap-5 lg:grid-cols-3">
        {plans.map(plan => (
          <div key={plan.name} className="bg-secondary rounded-lg border p-6">
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
                <li key={feature} className="flex items-center gap-2">
                  <div className="size-1.5 rounded-full bg-black/80" />{' '}
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
