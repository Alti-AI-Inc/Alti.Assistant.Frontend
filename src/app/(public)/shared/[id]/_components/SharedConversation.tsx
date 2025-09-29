'use client';

import ReferencesList from '@/app/(protected)/c/[id]/_components/ReferenceList';
import VideoComponent from '@/app/(protected)/c/[id]/_components/VideoComponent';
import VideoComponentForContent from '@/app/(protected)/c/[id]/_components/YoutubePlayer';
import CopyButton from '@/components/CopyButton';
import { useSharedConversation } from '@/hooks/useConversations';
import { cn, containsYouTubeUrl } from '@/lib/utils';
import { Streamdown } from 'streamdown';

const SharedConversation = ({ id }: { id: string }) => {
  const {
    data: activeConversation,
    isLoading,
    // error,
  } = useSharedConversation(id);

  return (
    <div>
      {activeConversation?.messages.length && (
        <div className="flex-1 overflow-y-auto">
          <div
            className={cn(
              'mx-auto w-full max-w-[796px] space-y-6 px-4 py-6 lg:pr-2',
            )}
          >
            {activeConversation?.messages.length &&
              activeConversation.messages.map((message, idx) => (
                <div key={idx} className="space-y-4">
                  {message.role === 'user' && (
                    <div className="flex items-center justify-end">
                      <div
                        className={cn(
                          'w-fit max-w-[85%] rounded-2xl bg-gray-100 px-4 py-2 text-black shadow',
                        )}
                      >
                        {message.content}
                      </div>
                    </div>
                  )}

                  {message.role === 'assistant' &&
                    message.content !== 'Image generated successfully' &&
                    message.content !== 'Video generated successfully' && (
                      <div>
                        {containsYouTubeUrl(message.content) ? (
                          <VideoComponentForContent content={message.content} />
                        ) : (
                          <div>
                            <Streamdown className="w-full max-w-[85%] rounded-lg">
                              {message.content}
                            </Streamdown>

                            <CopyButton content={message.content} />
                          </div>
                        )}
                      </div>
                    )}

                  {message.metadata?.images && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={message.metadata.images}
                      alt={message.metadata.type}
                    />
                  )}
                  {message.metadata?.video?.name && (
                    <VideoComponent
                      operationId={message.metadata?.video?.name}
                    />
                  )}
                  {!!message.metadata?.reference?.length && (
                    <ReferencesList references={message.metadata.reference} />
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
      {isLoading && (
        <div
          className={cn(
            'flex h-[calc(100vh_-110px] flex-1 items-center justify-center py-4',
          )}
        >
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
            <span>loading chat...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SharedConversation;
