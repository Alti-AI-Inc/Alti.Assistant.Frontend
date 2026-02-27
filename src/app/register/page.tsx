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

import { confirmRegistration, RegisterUser } from '@/actions/register';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Building2, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const invitationToken = searchParams.get('invitationToken') ?? undefined;
  const invitedEmail = searchParams.get('email') ?? '';
  const tenantName = searchParams.get('tenantName') ?? '';

  const isInvited = !!invitationToken;
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: invitedEmail,
      password: '',
      confirmPassword: '',
    },
  });
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    console.log({ values });

    try {
      const response = await RegisterUser({
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        invitationToken,
      });
      console.log({ response });
      if (response.success) {
        if (isInvited) {
          // Backend auto-accepted the invitation — go straight to the org dashboard
          router.push('/organizations');
        } else {
          setShowVerification(true);
        }
      } else {
        setErrorMessage(response.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVerify() {
    if (verifyCode.length !== 6) {
      setVerifyError('Please enter the 6-digit code');
      return;
    }
    setIsVerifying(true);
    setVerifyError(null);
    try {
      const response = await confirmRegistration(verifyCode);
      if (response.success) {
        router.push('/login');
      } else {
        setVerifyError(response.message || 'Invalid code. Please try again.');
      }
    } catch {
      setVerifyError('An error occurred. Please try again.');
    } finally {
      setIsVerifying(false);
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
      {showVerification ? (
        <div className="flex h-[calc(100vh-80px)] items-center justify-center">
          <div className="flex w-full max-w-sm flex-col items-center gap-6 px-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Check Your Email</h2>
              <p className="mt-2 text-sm text-gray-600">
                We&apos;ve sent a 6-digit verification code to your email address.
              </p>
            </div>
            <div className="w-full space-y-4">
              <Input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="Enter 6-digit code"
                value={verifyCode}
                onChange={(e) => {
                  setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                  setVerifyError(null);
                }}
                className="w-full border-none bg-gray-100 text-center text-xl tracking-[0.5em] focus-visible:ring-0"
              />
              {verifyError && (
                <p className="text-center text-sm text-red-500">{verifyError}</p>
              )}
              <Button
                onClick={handleVerify}
                disabled={isVerifying || verifyCode.length !== 6}
                className="w-full bg-black text-white dark:bg-white dark:text-black"
              >
                {isVerifying && (
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></span>
                )}
                Verify Email
              </Button>
              <button
                type="button"
                onClick={() => {
                  setShowVerification(false);
                  setVerifyCode('');
                  setVerifyError(null);
                }}
                className="w-full text-center text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Back to registration
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-[calc(100vh-80px)] w-full items-center justify-center bg-white">
          <div className="flex w-full max-w-md items-center justify-center md:translate-x-[10%]">
            <div className="rounded-large flex w-full max-w-lg flex-col gap-4 px-8 pt-6 pb-10">
              <p className="pb-4 text-center text-3xl font-semibold">
                Register
              </p>

              {/* Invitation banner */}
              {isInvited && tenantName && (
                <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-800 dark:bg-blue-950/30">
                  <Building2 className="mt-0.5 size-4 shrink-0 text-blue-600 dark:text-blue-400" />
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    You&apos;ve been invited to join{' '}
                    <span className="font-semibold">{tenantName}</span> — create your account to continue.
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
                    <div onClick={() => setIsPasswordVisible(!isPasswordVisible)} className='absolute right-2 cursor-pointer top-2'>
                      {isPasswordVisible ? <EyeOff className='text-[#7f7f7f] size-5.5' /> : <Eye className='text-[#7f7f7f] size-5.5' />}
                    </div>
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
                  </div>
                  <div className='relative'>

                    <div onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)} className='absolute right-2 cursor-pointer top-2'>
                      {isConfirmPasswordVisible ? <EyeOff className='text-[#7f7f7f] size-5.5' /> : <Eye className='text-[#7f7f7f] size-5.5' />}
                    </div>

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              type={isConfirmPasswordVisible ? "text" : "password"}
                              id="confirmPassword"
                              placeholder="Confirm password"
                              className="max-w-md border-none bg-gray-100 focus-visible:ring-0"
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

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

export default function Component() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
