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
  confirmPassword: z.string().min(6, {
    message: 'Password must be at least 6 characters long',
  }),
});

// import { RegisterUser } from '@/actions/register';
import { RegisterUser } from '@/actions/register';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function Component() {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    console.log({ values });

    try {
      //  const res = await fetch(
      //   `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
      //   {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify({ email:values.email, password:values.password, confirmPassword:values.confirmPassword }),
      //   },
      // );
      // const data = await res.json();
      // console.log(data);
      const response = await RegisterUser({
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });
      console.log({ response });
      if (response.success) {
        setShowSuccessMessage(true);
      }
      if (!response.status) {
        setErrorMessage(response.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div>
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
      {showSuccessMessage ? (
        <div className="flex h-[calc(100vh_-_80px)] items-center justify-center">
          <div className="pb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              Check Your Email
            </div>
            <p className="mt-2 text-gray-600">
              We&apos;ve sent a confirmation link to your email address
            </p>
          </div>
        </div>
      ) : (
        <div className="flex h-[calc(100vh_-_80px)] w-full items-center justify-center bg-white">
          <div className="flex w-full max-w-md items-center justify-center md:translate-x-[10%]">
            <div className="rounded-large flex w-full max-w-lg flex-col gap-4 px-8 pt-6 pb-10">
              <p className="pb-4 text-center text-3xl font-semibold">
                Register
              </p>
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
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            id="confirmPassword"
                            placeholder="Confirm password"
                            className="max-w-md border-none bg-gray-100 focus-visible:ring-0"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    disabled={isLoading}
                    className="w-full bg-black text-white dark:bg-white dark:text-black"
                    color="primary"
                    type="submit"
                  >
                    {isLoading && (
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></span>
                    )}
                    Register
                  </Button>
                </form>
              </Form>
              {errorMessage && (
                <p className="text-center text-sm text-red-500">
                  {errorMessage}
                </p>
              )}
              <p className="text-small flex items-center justify-center space-x-2 text-center">
                <span>Already have an account?</span>
                <Link href="/login" className="text-[#00f] underline">
                  Login
                </Link>
              </p>
            </div>
          </div>
          <div className="hidden w-1/2 translate-x-[10%] items-center justify-center lg:flex">
            <Image
              src="/assets/logo-full.jpeg"
              height={250}
              width={250}
              alt="logo"
            />
          </div>
        </div>
      )}
    </div>
  );
}
