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
import { Eye, EyeOff } from 'lucide-react';

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
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

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
                        <div className="relative max-w-md">
                          <Input
                            {...field}
                            type={showOldPassword ? "text" : "password"}
                            id="oldPassword"
                            placeholder="Old Password"
                            className="w-full h-10 rounded-lg border border-black/5 dark:border-white/5 bg-[#F5F5F7] dark:bg-zinc-800 bg-auth-input pl-4 pr-10 text-sm text-gray-800 placeholder-gray-400 dark:text-gray-100 dark:placeholder-gray-400 outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowOldPassword(!showOldPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                          >
                            {showOldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
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
                        <div className="relative max-w-md">
                          <Input
                            {...field}
                            type={showNewPassword ? "text" : "password"}
                            id="newPassword"
                            placeholder="New Password"
                            className="w-full h-10 rounded-lg border border-black/5 dark:border-white/5 bg-[#F5F5F7] dark:bg-zinc-800 bg-auth-input pl-4 pr-10 text-sm text-gray-800 placeholder-gray-400 dark:text-gray-100 dark:placeholder-gray-400 outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                          >
                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
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
                        <div className="relative max-w-md">
                          <Input
                            {...field}
                            type={showConfirmNewPassword ? "text" : "password"}
                            id="confirmNewPassword"
                            placeholder="Confirm New Password"
                            className="w-full h-10 rounded-lg border border-black/5 dark:border-white/5 bg-[#F5F5F7] dark:bg-zinc-800 bg-auth-input pl-4 pr-10 text-sm text-gray-800 placeholder-gray-400 dark:text-gray-100 dark:placeholder-gray-400 outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                          >
                            {showConfirmNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
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
