import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
const images = [
  {
    name: '100 Images',
    price: 10,
    buttonText: 'Purchase Images',
    currentPlan: true,
  },
  {
    name: '250 Images',
    price: 25,
    buttonText: 'Purchase Images',
    currentPlan: false,
  },
  {
    name: '500 Images',
    price: 50,
    buttonText: 'Purchase Images',
    currentPlan: false,
  },
  {
    name: '1,000 Images',
    price: 100,
    buttonText: 'Purchase Images',
    currentPlan: false,
  },
];

const codes = [
  {
    name: '100 Code Generation',
    price: 10,
    buttonText: 'Purchase Code',
    currentPlan: true,
  },
  {
    name: '500 Code Generation',
    price: 25,
    buttonText: 'Purchase Code',
    currentPlan: false,
  },
  {
    name: '1,000 Code Generation',
    price: 50,
    buttonText: 'Purchase Code',
    currentPlan: false,
  },
  {
    name: '2,500 Code Generation',
    price: 100,
    buttonText: 'Purchase Code',
    currentPlan: false,
  },
];
const researches = [
  {
    name: '25 Deep Research',
    price: 10,
    buttonText: 'Purchase Research',
    currentPlan: true,
  },
  {
    name: '50 Deep Research',
    price: 25,
    buttonText: 'Purchase Research',
    currentPlan: false,
  },
  {
    name: '100 Deep Research',
    price: 50,
    buttonText: 'Purchase Research',
    currentPlan: false,
  },
  {
    name: '250 Deep Research',
    price: 100,
    buttonText: 'Purchase Research',
    currentPlan: false,
  },
];
const searches = [
  {
    name: '1,000 Web Search',
    price: 10,
    buttonText: 'Purchase Search',
    currentPlan: true,
  },
  {
    name: '2,500 Web Search',
    price: 25,
    buttonText: 'Purchase Search',
    currentPlan: false,
  },
  {
    name: '5,000 Web Search',
    price: 50,
    buttonText: 'Purchase Search',
    currentPlan: false,
  },
  {
    name: '10,000 Web Search',
    price: 100,
    buttonText: 'Purchase Search',
    currentPlan: false,
  },
];

const Pricing01 = () => {
  return (
    <div className="flex min-h-screen flex-col items-center px-6 py-12">
      <h1 className="mt-10 text-center text-5xl font-semibold tracking-tighter">
        Upgrade Plans
      </h1>
      <Tabs defaultValue="plan" className="mt-8 w-full">
        <TabsList className="bg-muted/50 inline-flex-none mx-auto mb-6 grid h-auto w-full max-w-[840px] grid-cols-3 gap-2 rounded-lg p-2 sm:flex sm:flex-nowrap sm:justify-start">
          <TabsTrigger value="plan">Plans</TabsTrigger>

          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="research">Research</TabsTrigger>
        </TabsList>
        <TabsContent value="plan">
          <div className="mx-auto grid w-full max-w-[940px] grid-cols-1 gap-5 lg:grid-cols-3">
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
        </TabsContent>

        <TabsContent value="image">
          <div className="mx-auto grid w-full max-w-[1080px] grid-cols-1 gap-5 lg:grid-cols-4">
            {images.map(plan => (
              <div
                key={plan.name}
                className="bg-secondary w-full rounded-lg border p-6"
              >
                <h3 className="text-lg font-medium">{plan.name}</h3>
                <p className="mt-2 text-4xl font-bold">
                  ${plan.price}{' '}
                  <span className="text-muted-foreground text-sm font-medium">
                    /month
                  </span>{' '}
                </p>

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

        <TabsContent value="code">
          <div className="mx-auto grid w-full max-w-[1080px] grid-cols-1 gap-5 lg:grid-cols-4">
            {codes.map(plan => (
              <div
                key={plan.name}
                className="bg-secondary w-full rounded-lg border p-6"
              >
                <h3 className="text-lg font-medium">{plan.name}</h3>
                <p className="mt-2 text-4xl font-bold">
                  ${plan.price}{' '}
                  <span className="text-muted-foreground text-sm font-medium">
                    /month
                  </span>{' '}
                </p>

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
        <TabsContent value="research">
          <div className="mx-auto grid w-full max-w-[1080px] grid-cols-1 gap-5 lg:grid-cols-4">
            {researches.map(plan => (
              <div
                key={plan.name}
                className="bg-secondary w-full rounded-lg border p-6"
              >
                <h3 className="text-lg font-medium">{plan.name}</h3>
                <p className="mt-2 text-4xl font-bold">
                  ${plan.price}{' '}
                  <span className="text-muted-foreground text-sm font-medium">
                    /month
                  </span>{' '}
                </p>

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
        <TabsContent value="search">
          <div className="mx-auto grid w-full max-w-[1080px] grid-cols-1 gap-5 lg:grid-cols-4">
            {searches.map(plan => (
              <div
                key={plan.name}
                className="bg-secondary w-full rounded-lg border p-6"
              >
                <h3 className="text-lg font-medium">{plan.name}</h3>
                <p className="mt-2 text-4xl font-bold">
                  ${plan.price}{' '}
                  <span className="text-muted-foreground text-sm font-medium">
                    /month
                  </span>{' '}
                </p>

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
