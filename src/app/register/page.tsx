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
import Link from 'next/link';
import { useState } from 'react';

export default function Component() {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <>
      {showSuccessMessage ? (
        <div className="flex h-screen items-center justify-center">
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
        <div className="flex h-screen w-full items-center justify-center bg-white">
          <div className="flex min-w-md items-center justify-center">
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
              <p className="text-small flex items-center space-x-2 justify-center text-center">
                <span>Already have an account?</span>
                <Link href="/login" className="text-[#00f] underline">
                  Login
                </Link>
              </p>
            </div>
          </div>
          {/* <div className="hidden translate-x-[20%] items-center justify-center lg:flex">
          <video
            src="/assets/login-register.mov"
            autoPlay
            loop
            muted
            className="h-[350px] object-cover object-left"
          ></video>
        </div> */}
        </div>
      )}
    </>
  );
}
