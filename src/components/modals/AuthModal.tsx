'use client';

import { confirmRegistration, RegisterUser } from '@/actions/register';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useModalStore } from '@/stores/useModalStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
});

const registerSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
  confirmPassword: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
});

export function AuthModal() {
  const { isOpen, type, onClose, actionId } = useModalStore();
  const isModalOpen = isOpen && type === 'auth-modal';

  // actionId can be 'login' or 'register'
  const [view, setView] = useState<'login' | 'register'>(
    (actionId as 'login' | 'register') || 'login',
  );

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Registration specific state
  const [showVerification, setShowVerification] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const handleModalOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      // Reset state after close animation
      setTimeout(() => {
        setErrorMessage(null);
        setShowVerification(false);
        setVerifyCode('');
        setVerifyError(null);
        loginForm.reset();
        registerForm.reset();
      }, 300);
    }
  };

  const onLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (response?.ok && !response?.error) {
        onClose();
        window.location.reload();
      } else {
        setErrorMessage(response?.error || 'Invalid email or password');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onRegisterSubmit = async (values: z.infer<typeof registerSchema>) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await RegisterUser({
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });

      if (response.success) {
        setShowVerification(true);
      } else {
        setErrorMessage(response.message);
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (verifyCode.length !== 6) {
      setVerifyError('Please enter the 6-digit code');
      return;
    }
    setIsVerifying(true);
    setVerifyError(null);
    try {
      const response = await confirmRegistration(verifyCode);
      if (response.success) {
        setShowVerification(false);
        setView('login');
        setErrorMessage(null);
      } else {
        setVerifyError(response.message || 'Invalid code. Please try again.');
      }
    } catch {
      setVerifyError('An error occurred. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleModalOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="sr-only">
          {view === 'login' ? 'Login' : 'Register'}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {view === 'login' ? 'Login to your account' : 'Create a new account'}
        </DialogDescription>

        {view === 'login' && !showVerification && (
          <div className="flex flex-col gap-4 p-4">
            <p className="pb-4 text-center text-3xl font-semibold">Login</p>
            <Form {...loginForm}>
              <form
                onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="Email"
                          className="w-full border-none bg-gray-100 focus-visible:ring-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="relative">
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            type={isPasswordVisible ? 'text' : 'password'}
                            placeholder="Password"
                            className="w-full border-none bg-gray-100 focus-visible:ring-0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    className="absolute top-2 right-2 cursor-pointer"
                  >
                    {isPasswordVisible ? (
                      <EyeOff className="size-5 text-[#7f7f7f]" />
                    ) : (
                      <Eye className="size-5 text-[#7f7f7f]" />
                    )}
                  </div>
                </div>

                <Button
                  disabled={isLoading}
                  className="mt-4 w-full bg-black text-white dark:bg-white dark:text-black"
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

            <p className="mt-4 text-center text-sm">
              <span className="text-gray-500">
                Don&apos;t have an account?{' '}
              </span>
              <button
                onClick={() => {
                  setView('register');
                  setErrorMessage(null);
                }}
                className="font-medium text-blue-600 underline"
              >
                Register
              </button>
            </p>
          </div>
        )}

        {view === 'register' && !showVerification && (
          <div className="flex flex-col gap-4 p-4">
            <p className="pb-4 text-center text-3xl font-semibold">Register</p>
            <Form {...registerForm}>
              <form
                onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="Email"
                          className="w-full border-none bg-gray-100 focus-visible:ring-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="relative">
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            type={isPasswordVisible ? 'text' : 'password'}
                            placeholder="Password"
                            className="w-full border-none bg-gray-100 focus-visible:ring-0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    className="absolute top-2 right-2 cursor-pointer"
                  >
                    {isPasswordVisible ? (
                      <EyeOff className="size-5 text-[#7f7f7f]" />
                    ) : (
                      <Eye className="size-5 text-[#7f7f7f]" />
                    )}
                  </div>
                </div>

                <FormField
                  control={registerForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Confirm Password"
                          className="w-full border-none bg-gray-100 focus-visible:ring-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  disabled={isLoading}
                  className="mt-4 w-full bg-black text-white dark:bg-white dark:text-black"
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
              <p className="text-center text-sm text-red-500">{errorMessage}</p>
            )}

            <p className="mt-4 text-center text-sm">
              <span className="text-gray-500">Already have an account? </span>
              <button
                onClick={() => {
                  setView('login');
                  setErrorMessage(null);
                }}
                className="font-medium text-blue-600 underline"
              >
                Login
              </button>
            </p>
          </div>
        )}

        {showVerification && (
          <div className="flex flex-col items-center gap-4 p-4">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <svg
                className="h-8 w-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="mb-2 text-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Check Your Email
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                We've sent a 6-digit verification code to your email address.
              </p>
            </div>
            <div className="w-full space-y-4">
              <Input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="Enter 6-digit code"
                value={verifyCode}
                onChange={e => {
                  setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                  setVerifyError(null);
                }}
                className="w-full border-none bg-gray-100 text-center text-xl tracking-[0.5em] focus-visible:ring-0"
              />
              {verifyError && (
                <p className="text-center text-sm text-red-500">
                  {verifyError}
                </p>
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
                className="w-full text-center text-sm text-gray-500 underline hover:text-gray-700"
              >
                Back to registration
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
