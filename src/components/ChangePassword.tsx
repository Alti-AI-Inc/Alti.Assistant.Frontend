'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

const formSchema = z.object({
  oldPassword: z.string().min(6, {
    message: 'Password must be at least 6 characters long',
  }),
  newPassword: z.string().min(6, {
    message: 'Password must be at least 6 characters long',
  }),
  confirmNewPassword: z.string().min(6, {
    message: 'Password must be at least 6 characters long',
  }),
});


export default function ChangePassword({ onSuccess }: { onSuccess?: () => void }) {
  const { data } = useSession();

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.newPassword !== values.confirmNewPassword) {
      setError('Passwords do not match');
      return;
    }
    setIsLoading(true);
    console.log(values);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`,
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${data?.accessToken}`,
          },
          method: 'POST',
          body: JSON.stringify({
            oldPassword: values.oldPassword,
            newPassword: values.newPassword,
          }),
        },
      );
      console.log({ response });
      if (response.ok) {
        setSuccess('Password changed successfully');
        form.reset();
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 1500);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="flex-1">
      {/*  h-[calc(100vh_-_80px)] */}
      <div className="flex h-full w-full">
        <div className="flex w-full max-w-md items-center justify-center">
          <div className="rounded-large flex w-full max-w-lg flex-col gap-4 pb-10">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          id="password"
                          placeholder="Old Password"
                          className="max-w-md h-10 rounded-lg border border-black/5 dark:border-white/5 bg-zinc-100 dark:bg-zinc-800 px-4 text-sm text-gray-800 placeholder-gray-400 dark:text-gray-100 dark:placeholder-gray-400 outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 transition-all"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          id="password"
                          placeholder="New Password"
                          className="max-w-md h-10 rounded-lg border border-black/5 dark:border-white/5 bg-zinc-100 dark:bg-zinc-800 px-4 text-sm text-gray-800 placeholder-gray-400 dark:text-gray-100 dark:placeholder-gray-400 outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 transition-all"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmNewPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          id="new-password"
                          placeholder="Confirm New Password"
                          className="max-w-md h-10 rounded-lg border border-black/5 dark:border-white/5 bg-zinc-100 dark:bg-zinc-800 px-4 text-sm text-gray-800 placeholder-gray-400 dark:text-gray-100 dark:placeholder-gray-400 outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 transition-all"
                        />
                      </FormControl>
                      <FormMessage />
                      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                    </FormItem>
                  )}
                />

                <Button
                  disabled={isLoading}
                  className="w-full bg-black hover:bg-black/90 text-white dark:bg-white dark:text-black dark:hover:bg-white/90"
                  color="primary"
                  type="submit"
                >
                  {isLoading && (
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></span>
                  )}
                  Update Password
                </Button>
                {success && (
                  <p className="text-center text-green-500 text-sm">{success}</p>
                )}
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
