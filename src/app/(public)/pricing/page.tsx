import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function PricingPage() {
  const pricingTiers = [
    {
      name: 'Lightweight',
      price: '$49',
      description:
        'Access lightweight models such as Llama 7B, Gemma 8B, Mistral 7B, and more.',
      apiTitle: 'Lightweight',
      inputPrice: '$2',
      outputPrice: '$5',
    },
    {
      name: 'Midweight',
      price: '$99',
      description: 'Access midweight models such as Llama 70B, Yi 34B, Qwen 72B, and more.',
      apiTitle: 'Midweight',
      inputPrice: '$4',
      outputPrice: '$10',
    },
    {
      name: 'Heavyweight',
      price: '$199',
      description:
        'Access heavyweight models such as Llama 405B and Deepseek R1 671B.',
      apiTitle: 'Heavyweight',
      inputPrice: '$8',
      outputPrice: '$20',
    },
  ];
  return (
    <Tabs defaultValue="chat" className="mx-auto mt-10 w-5xl">
      <TabsList className="mx-auto mb-10 grid w-[400px] grid-cols-2">
        <TabsTrigger className="cursor-pointer" value="chat">
          Chat
        </TabsTrigger>
        <TabsTrigger className="cursor-pointer" value="api">
          API
        </TabsTrigger>
      </TabsList>
      <TabsContent value="chat">
        <div className="grid grid-cols-1 gap-8 pt-8 md:grid-cols-3">
          {pricingTiers.map((tier, index) => (
            <Card key={index} className="border-2">
              <CardContent>
                <div className='flex flex-col gap-4'>
                  <div className="text-center text-2xl font-bold">
                    {tier.price}
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <p className='text-2xl font-bold mb-2'>{tier.name}</p>
                    <p className='text-sm'>{tier.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
      <TabsContent value="api">
        <div className="grid grid-cols-1 gap-8 pt-8 md:grid-cols-3">
          {pricingTiers.map((tier, index) => (
            <Card key={index} className="border-2">
              <CardContent>
                <div className="flex flex-col gap-4 items-center">
                  <div className="text-center text-2xl font-bold">
                    {tier.apiTitle}
                  </div>
                  <div className="text-sm">
                    <p>Input: {tier.inputPrice} / 1M Tokens</p>
                    <p>Output: {tier.outputPrice} / 1M Tokens</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
