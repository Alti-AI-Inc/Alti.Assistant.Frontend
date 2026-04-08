'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Send } from 'lucide-react';
import { useState } from 'react';
import { UploadedFile } from './DataRoom';

interface Message {
  id: string;
  type: 'question' | 'answer';
  content: string;
  timestamp: string;
}

interface DataQueryInterfaceProps {
  selectedMatterId?: string;
  selectedMatterName?: string;
  uploadedFiles: UploadedFile[];
}

export const DataQueryInterface = ({
  selectedMatterId,
  selectedMatterName,
  uploadedFiles,
}: DataQueryInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Filter files for the selected matter
  const matterFiles = selectedMatterId
    ? uploadedFiles.filter(file => file.matterId === selectedMatterId)
    : [];

  const handleSendQuery = async () => {
    if (!query.trim() || !selectedMatterId) return;

    // Add user question to messages
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      type: 'question',
      content: query,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate a mock answer (in real app, this would call your backend)
    const answerMessage: Message = {
      id: `msg-${Date.now()}-ans`,
      type: 'answer',
      content: `This is a response to your question about "${query}" based on the ${matterFiles.length} file(s) in this matter.`,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages(prev => [...prev, answerMessage]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendQuery();
    }
  };

  if (!selectedMatterId) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-white p-6 dark:bg-gray-950">
        <AlertCircle className="mb-4 h-12 w-12 text-gray-400 dark:text-gray-600" />
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Select a Matter
        </h3>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Please select a matter from the Matters panel to start asking
          questions about its data.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-white dark:bg-gray-950">
      {/* Header with Matter Info */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 dark:border-gray-800 dark:from-blue-950/50 dark:to-indigo-950/50">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {selectedMatterName}
        </h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {matterFiles.length} file{matterFiles.length !== 1 ? 's' : ''}{' '}
          uploaded
        </p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 space-y-4 overflow-y-auto p-6">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center">
            <div>
              <Send className="mx-auto mb-3 h-8 w-8 text-gray-400 dark:text-gray-600" />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Ask a question about your data
              </p>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                Get insights from your uploaded files
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === 'question' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs rounded-lg px-4 py-3 ${
                    message.type === 'question'
                      ? 'bg-blue-600 text-white dark:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={`mt-1 text-xs ${
                      message.type === 'question'
                        ? 'text-blue-100'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-lg bg-gray-100 px-4 py-3 dark:bg-gray-800">
                  <div className="flex gap-2">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-gray-500" />
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-gray-500"
                      style={{ animationDelay: '0.1s' }}
                    />
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-gray-500"
                      style={{ animationDelay: '0.2s' }}
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
        <div className="flex gap-2">
          <Input
            placeholder="Ask a question about your data..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSendQuery}
            disabled={isLoading || !query.trim()}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      
      </div>
    </div>
  );
};

export default DataQueryInterface;
