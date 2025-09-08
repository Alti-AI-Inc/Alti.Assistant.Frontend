import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ChatPricingComponent() {
  const pricingTiers = [
    {
      name: 'Lightweight',
      price: '$49',
      description:
        'Access lightweight models such as Llama 7B, Gemma 8B, and Mistral 7B.',
      apiTitle: 'Lightweight API',
      inputPrice: '$2',
      outputPrice: '$5',
    },
    {
      name: 'Midweight',
      price: '$99',
      description:
        'Access midweight models such as Llama 70B, Yi 34B, and Qwen 72B.',
      apiTitle: 'Midweight API',
      inputPrice: '$4',
      outputPrice: '$10',
    },
    {
      name: 'Heavyweight',
      price: '$199',
      description:
        'Access heavyweight models such as Llama 405B and Deepseek R1 671B.',
      apiTitle: 'Heavyweight API',
      inputPrice: '$8',
      outputPrice: '$20',
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-12">
      <div className="space-y-8">
        {pricingTiers.map((tier, index) => (
          <div key={index} className="flex items-end gap-3">
            <h1 className="text-4xl font-bold">{tier.price}</h1>
            <h2 className="text-3xl font-bold">{tier.name}:</h2>
            <p className="text-xl">{tier.description}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 pt-8 md:grid-cols-3">
        {pricingTiers.map((tier, index) => (
          <Card key={index} className="border-2">
            <CardHeader className="pb-4">
              <CardTitle className="text-center text-2xl font-bold">
                {tier.apiTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-xl">
                <p>Input: {tier.inputPrice} / 1M Tokens</p>
                <p>Output: {tier.outputPrice} / 1M Tokens</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
