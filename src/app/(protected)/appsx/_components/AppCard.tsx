import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  useInitiateConnectionMutation,
  useWaitForConnectionMutation,
} from '@/hooks/useConnectApps';
import { APP } from '@/lib/all-apps';
import { cn } from '@/lib/utils';
import { LoaderCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useState } from 'react';

const AppCard = ({
  app,
  isAlreadyConnected,
}: {
  app: APP;
  isAlreadyConnected: boolean;
}) => {
  const { data: session } = useSession();
  const { mutate: initiateConnection, isPending } =
    useInitiateConnectionMutation();

  const { mutate: waitForConnection, isPending: isWaiting } =
    useWaitForConnectionMutation();

  const [errorMessage, setErrorMessage] = useState('');

  const handleClick = () => {
    setErrorMessage('');
    initiateConnection(
      {
        app_name: app.app_name,
        user_id: session?.user?.id ?? '',
        accessToken: session?.accessToken ?? '',
      },
      {
        onSuccess: response => {
          if (!response || response.error) {
            setErrorMessage(response?.error || 'An unexpected error occurred');
            return;
          }
          const redirectUrl = response.authConfig.authConfig.redirectUrl;
          const connectedAccountId = response.authConfig.authConfig.id;

          window.open(redirectUrl, '_blank');

          if (connectedAccountId) {
            waitForConnection(connectedAccountId, {
              onSuccess: result => {
                console.log('✅ Connection established:', result);
              },
              onError: err => {
                console.error('❌ Error while waiting:', err);
              },
            });
          }
        },
        onError: error => {
          console.error('❌ Error initiating connection:', error);
        },
      },
    );
  };

  return (
    <div className="h-full">
      <Card className="h-full border border-gray-200 bg-gray-100 p-0 transition-all duration-200 hover:shadow-md">
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
          {errorMessage && (
            <p className="mt-2 flex flex-1 flex-col text-center text-sm text-red-500">
              {errorMessage}
            </p>
          )}
          <Button
            className={cn(
              'mt-6 w-full hover:bg-white/90',
              errorMessage && 'mt-0',
            )}
            variant="outline"
            disabled={isAlreadyConnected || isPending || isWaiting}
            onClick={handleClick}
          >
            {(isPending || isWaiting) && (
              <LoaderCircle className="mr-2 animate-spin" />
            )}
            {isAlreadyConnected
              ? 'Connected'
              : isPending || isWaiting
                ? 'Connecting...'
                : 'Connect'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppCard;
