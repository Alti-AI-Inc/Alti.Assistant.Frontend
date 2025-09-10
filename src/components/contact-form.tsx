'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

export default function ContactForm() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here

    // Reset form
    setSubject('');
    setMessage('');
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <h1 className="mb-6 text-center text-3xl font-bold">CONTACT US</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="border-gray-100 bg-gray-50"
        />
        <Input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border-gray-100 bg-gray-50"
        />
        <Input
          placeholder="Subject"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          className="border-gray-100 bg-gray-50"
        />
        <Textarea
          placeholder="Enter Message"
          value={message}
          onChange={e => setMessage(e.target.value)}
          className="min-h-[160px] border-gray-100 bg-gray-50"
        />

        <Button type="submit" className="w-full hover:bg-black/90">
          Submit
        </Button>
      </form>
    </div>
  );
}
