'use client';
import {
  Calendar,
  Github,
  MessageSquare,
  Table,
  Trello,
  Zap,
} from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type APP = {
  id: string;
  name: string;
  description: string;
  fullDescription: string;
  icon: React.ReactNode;
  category: string;
};

const apps: APP[] = [
  {
    id: 'gmail',
    name: 'Gmail',
    description: "Gmail is Google's email service, featuring spam...",
    fullDescription:
      "Gmail is Google's email service, featuring spam protection, search functions, and seamless integration with other G Suite apps for productivity.",
    icon: (
      <div className="flex h-8 w-8 items-center justify-center rounded bg-red-500 text-sm font-bold text-white">
        M
      </div>
    ),
    category: 'Integrations',
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'GitHub is a code hosting platform for version...',
    fullDescription:
      'GitHub is a code hosting platform for version control and collaboration, allowing developers to store, manage, and track changes to their code.',
    icon: <Github className="h-8 w-8" />,
    category: 'Development',
  },
  {
    id: 'googlecalendar',
    name: 'Google Calendar',
    description: 'Google Calendar is a time management tool...',
    fullDescription:
      'Google Calendar is a time management tool that helps you schedule events, set reminders, and coordinate with others seamlessly.',
    icon: <Calendar className="h-8 w-8 text-blue-600" />,
    category: 'Productivity',
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Notion centralizes notes, docs, wikis, and tasks i...',
    fullDescription:
      'Notion centralizes notes, docs, wikis, and tasks in one collaborative workspace for enhanced productivity and organization.',
    icon: (
      <div className="flex h-8 w-8 items-center justify-center rounded bg-black text-sm font-bold text-white">
        N
      </div>
    ),
    category: 'Productivity',
  },
  {
    id: 'googlesheets',
    name: 'Google Sheets',
    description: 'Google Sheets is a cloud-based...',
    fullDescription:
      'Google Sheets is a cloud-based spreadsheet application that enables real-time collaboration and data analysis.',
    icon: <Table className="h-8 w-8 text-green-600" />,
    category: 'Productivity',
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Slack is a channel-based messaging...',
    fullDescription:
      'Slack is a channel-based messaging platform that facilitates team communication and collaboration in the workplace.',
    icon: <MessageSquare className="h-8 w-8 text-purple-600" />,
    category: 'Communication',
  },
  {
    id: 'linear',
    name: 'Linear',
    description: 'Linear is a streamlined issue tracking and...',
    fullDescription:
      'Linear is a streamlined issue tracking and project management tool designed for high-performance software development teams.',
    icon: <Zap className="h-8 w-8 text-blue-500" />,
    category: 'Development',
  },
  {
    id: 'trello',
    name: 'Trello',
    description: 'A web-based, kanban-style, list-making...',
    fullDescription:
      'A web-based, kanban-style, list-making application for project management and task organization using boards, lists, and cards.',
    icon: <Trello className="h-8 w-8 text-blue-600" />,
    category: 'Project Management',
  },
];

export default function AppIntegrationsGrid() {
  const sorted = apps.sort((a, b) => a.name.localeCompare(b.name));
  return (
    <div className="p-8">
      <Input
        placeholder="Search apps..."
        className="focus-visible:border-border h-10 max-w-md bg-gray-100 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <div className="mx-auto mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {sorted.map(app => (
          <div key={app.id} className="h-full">
            <Card className="h-full cursor-pointer border border-gray-200 bg-gray-100 p-0 transition-all duration-200 hover:shadow-md">
              <CardContent className="flex flex-1 flex-col p-4">
                <div className="flex items-center space-x-3">
                  <h3 className="text-xl font-medium text-gray-900">
                    {app.name}
                  </h3>
                </div>

                <p className="mt-2 flex flex-1 flex-col text-sm text-gray-500">
                  {app.fullDescription}
                </p>
                <Button className="mt-6 w-full" variant="outline">
                  Connect
                </Button>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
