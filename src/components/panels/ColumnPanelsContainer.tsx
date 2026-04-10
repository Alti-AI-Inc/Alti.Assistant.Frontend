'use client';

import { useColumnPanelStore } from '@/stores/useColumnPanelStore';
import { Activity, BookOpen, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import ChatOptionsSelector, { type ChatOption } from './ChatOptionsSelector';
import ColumnPanel from './ColumnPanel';
import DataQueryInterface from './DataQueryInterface';
import DataRoom, { UploadedFile } from './DataRoom';
import MattersList from './MattersList';

interface Message {
  id: string;
  type: 'question' | 'answer';
  content: string;
  timestamp: string;
}

interface Matter {
  id: string;
  name: string;
  status: 'Active' | 'Completed' | 'Pending';
  statusColor: string;
}

const DEFAULT_MATTERS: Matter[] = [
  {
    id: '1',
    name: 'Project Documentation Review',
    status: 'Active',
    statusColor:
      'bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-100',
  },
  {
    id: '2',
    name: 'Contract Analysis',
    status: 'Completed',
    statusColor:
      'bg-green-200 dark:bg-green-900 text-green-900 dark:text-green-100',
  },
  {
    id: '3',
    name: 'Data Analysis & Review',
    status: 'Pending',
    statusColor:
      'bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100',
  },
];

const DEFAULT_CHAT_OPTIONS: ChatOption[] = [
  {
    id: 'chat1',
    name: 'General Discussion',
    createdAt: new Date().toISOString(),
  },
];

export const ColumnPanelsContainer = () => {
  const store = useColumnPanelStore();
  const [matters, setMatters] = useState<Matter[]>(DEFAULT_MATTERS);
  const [selectedMatterId, setSelectedMatterId] = useState<
    string | undefined
  >();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [chatOptions, setChatOptions] =
    useState<ChatOption[]>(DEFAULT_CHAT_OPTIONS);
  const [selectedChatOptionId, setSelectedChatOptionId] = useState<
    string | undefined
  >(DEFAULT_CHAT_OPTIONS[0]?.id);
  const [chatHistory, setChatHistory] = useState<
    Record<string, Record<string, Message[]>>
  >({});

  const handleCreateMatter = (matterName: string) => {
    const newMatter: Matter = {
      id: String(matters.length + 1),
      name: matterName,
      status: 'Active',
      statusColor:
        'bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-100',
    };
    setMatters([newMatter, ...matters]);
  };

  const handleCreateChatOption = (name: string) => {
    const newChatOption: ChatOption = {
      id: `chat${Date.now()}`,
      name,
      createdAt: new Date().toISOString(),
    };
    setChatOptions([newChatOption, ...chatOptions]);
    setSelectedChatOptionId(newChatOption.id);
  };

  const handleDeleteChatOption = (id: string) => {
    setChatOptions(chatOptions.filter(option => option.id !== id));
    if (selectedChatOptionId === id) {
      const remaining = chatOptions.filter(option => option.id !== id);
      setSelectedChatOptionId(remaining[0]?.id);
    }
  };

  const handleUpdateChatName = (id: string, newName: string) => {
    setChatOptions(prev =>
      prev.map(option =>
        option.id === id
          ? { ...option, name: newName, isNameFromQuestion: true }
          : option,
      ),
    );
  };

  const handleFileUpload = (files: UploadedFile[]) => {
    setUploadedFiles(files);
  };

  const handleFileDelete = (fileId: string) => {
    setUploadedFiles(uploadedFiles.filter(file => file.id !== fileId));
  };

  const handleAddMessage = (message: Message) => {
    if (!selectedMatterId || !selectedChatOptionId) return;
    setChatHistory(prev => ({
      ...prev,
      [selectedChatOptionId]: {
        ...prev[selectedChatOptionId],
        [selectedMatterId]: [
          ...(prev[selectedChatOptionId]?.[selectedMatterId] || []),
          message,
        ],
      },
    }));
  };

  return (
    <div className="flex h-full w-full bg-gray-50 dark:bg-gray-900">
      {/* Panels Container - Always visible */}
      <div className="flex overflow-hidden">
        {/* Panel 1 - Workspace with Chat Options */}
        <ColumnPanel
          id="panel1"
          title="Workspace"
          icon={
            <BookOpen className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          }
          isVisible={store.panels.panel1.isVisible}
          width={store.panels.panel1.width}
          onToggle={() => store.togglePanel('panel1')}
        >
          <MattersList
            matters={matters}
            onCreateMatter={handleCreateMatter}
            onSelectMatter={setSelectedMatterId}
            selectedMatterId={selectedMatterId}
          />
        </ColumnPanel>

        {/* Panel 2 - Data Room */}
        <ColumnPanel
          id="panel2"
          title="Data Room"
          icon={
            <Activity className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          }
          isVisible={store.panels.panel2.isVisible}
          width={store.panels.panel2.width}
          onToggle={() => store.togglePanel('panel2')}
        >
          <DataRoom
            selectedMatterId={selectedMatterId}
            uploadedFiles={uploadedFiles}
            onFileUpload={handleFileUpload}
            onFileDelete={handleFileDelete}
          />
        </ColumnPanel>

        {/* Panel 3 - Chat History */}
        <ColumnPanel
          id="panel3"
          title="Chat History"
          icon={
            <MessageSquare className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          }
          isVisible={store.panels.panel3.isVisible}
          width={store.panels.panel3.width}
          onToggle={() => store.togglePanel('panel3')}
        >
          <div className="flex h-full flex-col">
            {/* Chat Switcher */}
            <ChatOptionsSelector
              chatOptions={chatOptions}
              selectedChatOptionId={selectedChatOptionId}
              onSelectChatOption={setSelectedChatOptionId}
              onDeleteChatOption={handleDeleteChatOption}
            />
          </div>
        </ColumnPanel>
      </div>

      {/* Main Content Area - Data Query Interface */}
      <main className="flex flex-1 flex-col overflow-auto bg-white dark:bg-gray-950">
        <DataQueryInterface
          selectedMatterId={selectedMatterId}
          uploadedFiles={uploadedFiles}
          onAddMessage={handleAddMessage}
          selectedChatOptionId={selectedChatOptionId}
          onCreateChatOption={handleCreateChatOption}
          onUpdateChatName={handleUpdateChatName}
        />
      </main>
    </div>
  );
};

export default ColumnPanelsContainer;
