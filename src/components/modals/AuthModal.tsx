'use client';

import { confirmRegistration, RegisterUser } from '@/actions/register';
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
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().optional(),
});

const registerSchema = z
  .object({
    email: z.string().email({ message: 'Please enter a valid email address' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' }),
    confirmPassword: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export function AuthModal() {
  const { isOpen, type, onClose, actionId } = useModalStore();
  const isModalOpen = isOpen && type === 'auth-modal';

  const [view, setView] = useState<'login' | 'register'>(
    (actionId as 'login' | 'register') || 'login',
  );

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  // Registration specific state
  const [showVerification, setShowVerification] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  useEffect(() => {
    if (actionId === 'register' || actionId === 'login') {
      setView(actionId);
      setErrorMessage(null);
      setShowVerification(false);
    }
  }, [actionId, isOpen]);

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
        password: values.password || '',
        redirect: false,
      });

      if (response?.ok && !response?.error) {
        onClose();
        window.location.reload();
      } else {
        setErrorMessage(response?.error || 'Invalid email or password');
      }
    } catch {
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
    } catch {
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
      <DialogContent className="sm:max-w-md overflow-hidden rounded-2xl border border-black/10 bg-white p-6 sm:p-8 shadow-2xl dark:border-zinc-800/80 dark:bg-zinc-900 [&>button]:hidden">
        <DialogTitle className="sr-only">
          {view === 'login' ? 'Login Account' : 'Register Account'}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {view === 'login' ? 'Login to your account' : 'Create a new account'}
        </DialogDescription>

        {/* Header */}
        {(showVerification || view !== 'login') && (
          <div className="flex flex-col items-center space-y-2 text-center pt-2">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
              {showVerification ? 'Verify Email' : 'Register Account'}
            </h2>
            {showVerification && (
              <p className="text-sm text-gray-500 dark:text-zinc-400">
                Enter the 6-digit confirmation code sent to your email
              </p>
            )}
          </div>
        )}

        {/* Error message notification */}
        {errorMessage && (
          <div className="rounded-[5px] bg-red-50 p-3 text-center text-sm text-red-500 dark:bg-red-950/20 dark:text-red-400">
            {errorMessage}
          </div>
        )}

        {/* Login View */}
        {view === 'login' && !showVerification && (
          <div className="flex flex-col space-y-4">
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
                          placeholder="Email Address"
                          className="w-full rounded-[5px] border-none bg-[#e1e1e1] bg-auth-input p-3 text-sm text-black outline-none placeholder:text-zinc-500 focus-visible:ring-0 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full items-center justify-center rounded-[5px] bg-black py-3 text-sm font-medium text-white transition hover:bg-black/90 active:scale-[0.99] disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-white/90"
                >
                  {isLoading && (
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-current border-r-transparent"></span>
                  )}
                  Login
                </button>
              </form>
            </Form>

            <div className="text-center text-sm text-gray-500 dark:text-zinc-400">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setView('register');
                  setErrorMessage(null);
                }}
                className="font-semibold text-black hover:underline dark:text-white"
              >
                Register
              </button>
            </div>
          </div>
        )}

        {/* Register View */}
        {view === 'register' && !showVerification && (
          <div className="flex flex-col space-y-4">
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
                          placeholder="Email Address"
                          className="w-full rounded-[5px] border-none bg-[#e1e1e1] bg-auth-input p-3 text-sm text-black outline-none placeholder:text-zinc-500 focus-visible:ring-0 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="relative">
                        <FormControl>
                          <Input
                            {...field}
                            type={isPasswordVisible ? 'text' : 'password'}
                            placeholder="Password"
                            className="w-full rounded-[5px] border-none bg-[#e1e1e1] bg-auth-input p-3 pr-10 text-sm text-black outline-none placeholder:text-zinc-500 focus-visible:ring-0 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-400"
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() =>
                            setIsPasswordVisible(!isPasswordVisible)
                          }
                          className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 dark:text-zinc-400 dark:hover:text-white"
                        >
                          {isPasswordVisible ? (
                            <EyeOff className="size-5" />
                          ) : (
                            <Eye className="size-5" />
                          )}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <div className="relative">
                        <FormControl>
                          <Input
                            {...field}
                            type={
                              isConfirmPasswordVisible ? 'text' : 'password'
                            }
                            placeholder="Confirm Password"
                            className="w-full rounded-[5px] border-none bg-[#e1e1e1] bg-auth-input p-3 pr-10 text-sm text-black outline-none placeholder:text-zinc-500 focus-visible:ring-0 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-400"
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() =>
                            setIsConfirmPasswordVisible(
                              !isConfirmPasswordVisible,
                            )
                          }
                          className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 dark:text-zinc-400 dark:hover:text-white"
                        >
                          {isConfirmPasswordVisible ? (
                            <EyeOff className="size-5" />
                          ) : (
                            <Eye className="size-5" />
                          )}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full items-center justify-center rounded-[5px] bg-black py-3 text-sm font-medium text-white transition hover:bg-black/90 active:scale-[0.99] disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-white/90"
                >
                  {isLoading && (
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-current border-r-transparent"></span>
                  )}
                  Register
                </button>
              </form>
            </Form>

            <div className="text-center text-sm text-gray-500 dark:text-zinc-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setView('login');
                  setErrorMessage(null);
                }}
                className="font-semibold text-black hover:underline dark:text-white"
              >
                Login
              </button>
            </div>
          </div>
        )}

        {/* Verification View */}
        {showVerification && (
          <div className="flex flex-col items-center space-y-4">
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
                className="w-full rounded-[5px] border-none bg-[#e1e1e1] bg-auth-input p-3 text-center text-xl tracking-[0.5em] text-black outline-none focus-visible:ring-0 dark:bg-zinc-800 dark:text-white"
              />

              {verifyError && (
                <p className="text-center text-sm text-red-500">
                  {verifyError}
                </p>
              )}

              <button
                type="button"
                onClick={handleVerify}
                disabled={isVerifying || verifyCode.length !== 6}
                className="flex w-full items-center justify-center rounded-[5px] bg-black py-3 text-sm font-medium text-white transition hover:bg-black/90 active:scale-[0.99] disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-white/90"
              >
                {isVerifying && (
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-current border-r-transparent"></span>
                )}
                Verify Email
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowVerification(false);
                  setVerifyCode('');
                  setVerifyError(null);
                }}
                className="w-full text-center text-sm text-gray-500 underline hover:text-gray-700 dark:text-zinc-400 dark:hover:text-white"
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
