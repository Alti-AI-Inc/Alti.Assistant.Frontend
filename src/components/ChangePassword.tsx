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
    <div className="w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-full"
        >
          {/* Box 1: Old Password */}
          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormControl>
                  <div className="relative w-full h-12 flex items-center bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-xl shadow-sm px-4 focus-within:border-black/10 dark:focus-within:border-white/10 focus-within:ring-0 focus-within:outline-none transition-all">
                    <Input
                      {...field}
                      type={showOldPassword ? "text" : "password"}
                      id="oldPassword"
                      placeholder="Old Password"
                      className="w-full bg-transparent border-none p-0 text-base text-gray-800 placeholder-gray-400 dark:text-gray-100 dark:placeholder-gray-400 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none cursor-pointer"
                    >
                      {showOldPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Box 2: New Password */}
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormControl>
                  <div className="relative w-full h-12 flex items-center bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-xl shadow-sm px-4 focus-within:border-black/10 dark:focus-within:border-white/10 focus-within:ring-0 focus-within:outline-none transition-all">
                    <Input
                      {...field}
                      type={showNewPassword ? "text" : "password"}
                      id="newPassword"
                      placeholder="New Password"
                      className="w-full bg-transparent border-none p-0 text-base text-gray-800 placeholder-gray-400 dark:text-gray-100 dark:placeholder-gray-400 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none cursor-pointer"
                    >
                      {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Box 3: Confirm New Password */}
          <FormField
            control={form.control}
            name="confirmNewPassword"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormControl>
                  <div className="relative w-full h-12 flex items-center bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-xl shadow-sm px-4 focus-within:border-black/10 dark:focus-within:border-white/10 focus-within:ring-0 focus-within:outline-none transition-all">
                    <Input
                      {...field}
                      type={showConfirmNewPassword ? "text" : "password"}
                      id="confirmNewPassword"
                      placeholder="Confirm New Password"
                      className="w-full bg-transparent border-none p-0 text-base text-gray-800 placeholder-gray-400 dark:text-gray-100 dark:placeholder-gray-400 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none cursor-pointer"
                    >
                      {showConfirmNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
              </FormItem>
            )}
          />

          {/* Box 4: Update Password Button */}
          <Button
            disabled={isLoading}
            className="w-full h-12 rounded-xl bg-black hover:bg-black/90 text-white dark:bg-white dark:text-black dark:hover:bg-white/90 font-medium shadow-sm transition-all cursor-pointer flex items-center justify-center disabled:opacity-100 disabled:bg-black disabled:text-white dark:disabled:bg-white dark:disabled:text-black"
            type="submit"
          >
            {isLoading && (
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-current border-r-transparent"></span>
            )}
            Update Password
          </Button>
          {success && (
            <p className="text-center text-green-500 text-sm mt-2 font-medium">{success}</p>
          )}
        </form>
      </Form>
    </div>
  );
}
