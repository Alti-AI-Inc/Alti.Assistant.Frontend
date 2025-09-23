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
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Component() {
  const router = useRouter();
  const { onOpen } = useModalStore();
  // const { data: session } = useSession();
  // console.log({ session });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // 1) Call our API directly so we get the real error message (if any)
      const apiRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
          }),
        },
      );

      const data = await apiRes.json();
      console.log('API login response:', data);

      if (!apiRes.ok) {
        // show backend-provided error message(s)
        setErrorMessage(
          data?.message ?? data?.errorMessages?.[0]?.message ?? 'Login failed',
        );
        return;
      }

      // 2) Success — now tell NextAuth to sign in using the token we got
      const signInRes = await signIn('credentials', {
        redirect: false,
        accessToken: data.data.accessToken, // forwarded to authorize()
        id: data.data._id, // optional
      });

      console.log('signIn response:', signInRes);

      if (signInRes?.ok) {
        router.push('/');
      } else {
        // fallback - normally this shouldn't happen because authorize will return user for valid token
        setErrorMessage(signInRes?.error ?? 'Sign in failed');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Something went wrong. Try again.');
    } finally {
      setIsLoading(false);
    }
  }
  // 2. Define a submit handler.
  // async function onSubmit(values: z.infer<typeof formSchema>) {
  //   setIsLoading(true);

  //   try {
  //     const response = await signIn('credentials', {
  //       email: values.email,
  //       password: values.password,
  //       redirect: false,
  //     });
  //     console.log('response at login page', { response });
  //     if (response.ok) {
  //       router.push('/');
  //     } else if (response?.error) {
  //       console.log(response.error);
  //       // set error from backend
  //       setErrorMessage(response.error);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     setErrorMessage('Something went wrong. Try again.');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }
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
        <div className="flex w-full max-w-md items-center justify-center">
          <div className="rounded-large flex w-full max-w-lg flex-col gap-4 px-8 pt-6 pb-10">
            <p className="pb-4 text-center text-3xl font-semibold">Login</p>
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
                          className="max-w-md border-none bg-gray-100 focus-visible:ring-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          id="password"
                          placeholder="Password"
                          className="max-w-md border-none bg-gray-100 focus-visible:ring-0"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

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
              <p className="text-center text-red-500">{errorMessage}</p>
            )}
            <p className="text-small text-center">
              <Link href="/register" className="text-[#00f] underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
        <div className="hidden translate-x-[20%] items-center justify-center lg:flex">
          <video
            src="/assets/login-register.mov"
            autoPlay
            loop
            muted
            className="h-[350px] object-cover object-left"
          ></video>
        </div>
      </div>
    </div>
  );
}
