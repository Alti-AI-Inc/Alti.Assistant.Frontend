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

const formSchema = z.object({
  email: z.email(),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters long',
  }),
});

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useModalStore } from '@/stores/useModalStore';
import { Building2, Eye, EyeOff } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

function LoginForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { onOpen } = useModalStore();

  const invitationToken = searchParams.get('invitationToken') ?? undefined;
  const invitedEmail = searchParams.get('email') ?? '';
  const tenantName = searchParams.get('tenantName') ?? '';
  const isInvited = !!invitationToken;

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: invitedEmail,
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await signIn('credentials', {
        email: values.email,
        password: values.password,
        invitationToken: invitationToken ?? '',
        redirect: false,
      });

      if (response?.ok) {
        router.push(isInvited ? '/organizations' : '/');
      } else {
        setErrorMessage('Invalid email or password');
      }
    } catch (error) {
      console.log(error);
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex-1">
      <div className="h-20 p-10">
        <Link href="/">
          <Image
            src="/assets/logo-icon.png"
            alt="logo"
            height={60}
            width={60}
          />
        </Link>
      </div>
      <div className="flex h-[calc(100vh_-_80px)] w-full items-center justify-center bg-white">
        <div className="flex w-full max-w-md items-center justify-center md:translate-x-[10%]">
          <div className="rounded-large flex w-full max-w-lg flex-col gap-4 px-8 pt-6 pb-10">
            <p className="pb-4 text-center text-3xl font-semibold">Login</p>

            {/* Invitation banner */}
            {isInvited && tenantName && (
              <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-800 dark:bg-blue-950/30">
                <Building2 className="mt-0.5 size-4 shrink-0 text-blue-600 dark:text-blue-400" />
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  Sign in to join{' '}
                  <span className="font-semibold">{tenantName}</span>.
                </p>
              </div>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          id="email"
                          placeholder="Email"
                          readOnly={isInvited}
                          className={`max-w-md border-none bg-gray-100 focus-visible:ring-0${
                            isInvited ? ' cursor-not-allowed opacity-70' : ''
                          }`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='relative'>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            type={isPasswordVisible ? "text" : "password"}
                            id="password"
                            placeholder="Password"
                            className="max-w-md border-none bg-gray-100 focus-visible:ring-0"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div onClick={() => setIsPasswordVisible(!isPasswordVisible)} className='absolute right-2 cursor-pointer top-2'>
                    {isPasswordVisible ? <EyeOff className='text-[#7f7f7f] size-5.5' /> : <Eye className='text-[#7f7f7f] size-5.5' />}
                  </div>
                </div>

                <Button
                  type="button"
                  variant="link"
                  className="px-0"
                  onClick={() =>
                    onOpen({
                      type: 'forgot-password',
                    })
                  }
                >
                  Forgot password?
                </Button>
                <Button
                  disabled={isLoading}
                  className="w-full bg-black text-white dark:bg-white dark:text-black"
                  color="primary"
                  type="submit"
                >
                  {isLoading && (
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></span>
                  )}
                  Login
                </Button>
              </form>
            </Form>
            {errorMessage && (
              <p className="text-center text-sm text-red-500">{errorMessage}</p>
            )}
            <p className="text-small text-center">
              <Link href="/register" className="text-[#00f] underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
        <div className="hidden translate-x-[10%] w-1/2 items-center justify-center lg:flex">
          <Image
            src="/assets/logo-full.jpeg"
            height={250}
            width={250}
            alt="logo"
          />
        </div>
      </div>
    </div>
  );
}

export default function Component() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
