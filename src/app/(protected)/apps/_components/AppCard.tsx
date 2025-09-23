import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  useConnectionsQuery,
  useInitiateConnectionMutation,
  useWaitForConnectionMutation,
} from '@/hooks/useConnectApps';
import { APP } from '@/lib/all-apps';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

const AppCard = ({ app }: { app: APP }) => {
  const { data: session } = useSession();
  console.log({ session });
  const userId = '6830a57675ab371485a0be3a';

  const { data: connections, isLoading } = useConnectionsQuery(userId);

  const initiateMutation = useInitiateConnectionMutation();
  const waitMutation = useWaitForConnectionMutation(userId);

  const handleConnect = async () => {
    // Step 1: initiate
    const res = await initiateMutation.mutateAsync({
      app_name: 'slack',
      user_id: userId,
    });

    // redirect user to res.authConfig.authConfig.redirectUrl
    window.open(res.authConfig.authConfig.redirectUrl, '_blank');

    // Step 2: wait for connection
    await waitMutation.mutateAsync({
      connected_account_id: res.authConfig.authConfig.id,
    });
  };
  return (
    <div className="h-full">
      <Card className="h-full cursor-pointer border border-gray-200 bg-gray-100 p-0 transition-all duration-200 hover:shadow-md">
        <CardContent className="flex flex-1 flex-col p-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-white transition-all duration-200 group-hover:scale-105">
              <Image
                src={app.image}
                alt={app.title}
                width={50}
                height={50}
                className="size-9 object-contain"
              />
            </div>

            <h3 className="text-xl font-medium text-gray-900">{app.title}</h3>
          </div>

          <p className="mt-2 flex flex-1 flex-col text-sm text-gray-500">
            {app.description}
          </p>
          <Button className="mt-6 w-full" variant="outline">
            Connect
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppCard;
