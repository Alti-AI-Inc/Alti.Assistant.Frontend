'use client';

import {
  checkEmailStatus,
  confirmRegistration,
  RegisterUser,
  resendConfirmation,
} from '@/actions/register';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useModalStore } from '@/stores/useModalStore';
import { signIn } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';

export function AuthModal() {
  const { isOpen, type, onClose, actionId } = useModalStore();
  const isModalOpen = isOpen && type === 'auth-modal';

  const [view, setView] = useState<'login' | 'register'>(
    (actionId as 'login' | 'register') || 'login',
  );
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (actionId === 'register' || actionId === 'login') {
      setView(actionId);
      setStep('email');
      setEmail('');
      setOtp(['', '', '', '', '', '']);
      setErrorMessage(null);
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('otp_sent_at');
      }
    }
  }, [actionId, isOpen]);

  useEffect(() => {
    if (step === 'otp') {
      const timer = setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [step]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [resendCooldown]);

  const handleResendCode = async () => {
    if (resendCooldown > 0 || isLoading) return;
    setIsLoading(true);
    setResendStatus(null);
    setErrorMessage(null);
    try {
      const res = await resendConfirmation(email.trim());
      if (res.success) {
        setResendStatus('A new code has been sent to your email.');
        setResendCooldown(60);
      } else {
        const msg = res.message || '';
        if (/535|gsmtp|BadCredentials|Username and Password not accepted/i.test(msg)) {
          setErrorMessage('Email service is temporarily unavailable. Please try again shortly.');
        } else if (/exceeded|limit/i.test(msg)) {
          setErrorMessage('Please wait a moment before requesting another code.');
        } else {
          setErrorMessage(msg || 'Failed to resend code.');
        }
      }
    } catch {
      setErrorMessage('Email service is temporarily unavailable. Please try again shortly.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      setTimeout(() => {
        setStep('email');
        setEmail('');
        setOtp(['', '', '', '', '', '']);
        setErrorMessage(null);
        setResendStatus(null);
        setResendCooldown(0);
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('otp_sent_at');
        }
      }, 300);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (view === 'register') {
        const fallbackPassword = `Auth!${trimmedEmail.replace(/[^a-zA-Z0-9]/g, '')}2026`;
        const response = await RegisterUser({
          email: trimmedEmail,
          password: fallbackPassword,
          confirmPassword: fallbackPassword,
        });

        if (response.success) {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('otp_sent_at', Date.now().toString());
          }
          setStep('otp');
        } else {
          const msg = response.message || '';
          if (/already exists/i.test(msg)) {
            // Check if the email is unverified (user started registration but never confirmed OTP)
            const status = await checkEmailStatus(trimmedEmail);
            if (status === 'unverified') {
              // Registration not completed yet — proceed to OTP step to allow confirming code
              if (typeof window !== 'undefined') {
                sessionStorage.setItem('otp_sent_at', Date.now().toString());
              }
              setStep('otp');
              return;
            }
            setErrorMessage('This email is already registered. Click Login below.');
          } else {
            setErrorMessage(msg || 'Failed to register.');
          }
        }
      } else {
        const status = await checkEmailStatus(trimmedEmail);
        if (status === 'not_found') {
          setErrorMessage('Account not found. Please create an account first.');
          return;
        }
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('otp_sent_at', Date.now().toString());
        }
        setStep('otp');
      }
    } catch {
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length > 1) {
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        if (i < digits.length) {
          newOtp[i] = digits[i];
        }
      }
      setOtp(newOtp);
      setErrorMessage(null);
      const nextIdx = Math.min(digits.length, 5);
      otpRefs.current[nextIdx]?.focus();
      return;
    }

    const digit = digits.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setErrorMessage(null);

    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        e.preventDefault();
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        otpRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      otpRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault();
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasted[i] || '';
    }
    setOtp(newOtp);
    setErrorMessage(null);

    const focusIdx = Math.min(pasted.length, 5);
    otpRefs.current[focusIdx]?.focus();
  };

  const handleOtpSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) {
      setErrorMessage('Please enter the 6-digit code');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await confirmRegistration(fullOtp);
      if (response.success) {
        if (response.data?.accessToken) {
          await signIn('social-token', {
            accessToken: response.data.accessToken,
            redirect: false,
          });
        }
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('otp_sent_at');
        }
        onClose();
        window.location.reload();
      } else {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 400);
        setOtp(['', '', '', '', '', '']);
        setTimeout(() => {
          otpRefs.current[0]?.focus();
        }, 50);

        const rawMsg = response.message || '';
        const sentAtStr = typeof window !== 'undefined' ? sessionStorage.getItem('otp_sent_at') : null;
        const sentAt = sentAtStr ? parseInt(sentAtStr, 10) : 0;
        const isExpired = sentAt > 0 && Date.now() - sentAt > 5 * 60 * 1000;

        if (/invalid or expired/i.test(rawMsg)) {
          setErrorMessage(
            isExpired
              ? 'Code expired. Please request a new code.'
              : 'Incorrect code. Please try again.',
          );
        } else if (/expired/i.test(rawMsg)) {
          setErrorMessage('Code expired. Please request a new code.');
        } else if (/invalid/i.test(rawMsg)) {
          setErrorMessage('Incorrect code. Please try again.');
        } else {
          setErrorMessage(rawMsg || 'Incorrect code. Please try again.');
        }
      }
    } catch {
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleModalOpenChange}>
      <DialogContent
        onPointerDownOutside={() => handleModalOpenChange(false)}
        onInteractOutside={() => handleModalOpenChange(false)}
        className="sm:max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-black/10 bg-white p-6 sm:p-8 shadow-2xl dark:border-zinc-800/80 dark:bg-zinc-900 gap-0 [&>button]:hidden"
      >
        {/* Header with clear value prop (Email step only) */}
        {step === 'email' ? (
          <div className="mb-3.5 text-center">
            <DialogTitle className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              {view === 'login' ? 'Login to Aphura' : 'Welcome to Aphura'}
            </DialogTitle>
            <DialogDescription className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {view === 'login'
                ? 'Enter your email to receive a secure login code.'
                : 'Create an account to run your prompt. 250 prompts included on us.'}
            </DialogDescription>
          </div>
        ) : (
          <DialogTitle className="sr-only">Enter Verification Code</DialogTitle>
        )}

        {/* Error message notification (Email step only) */}
        {step === 'email' && errorMessage && (
          <div className="mb-4 rounded-[5px] bg-red-50 p-3 text-center text-sm text-red-500 dark:bg-red-950/20 dark:text-red-400">
            {errorMessage}
          </div>
        )}

        {/* Step 1: Email */}
        {step === 'email' ? (
          <form onSubmit={handleEmailSubmit} className="flex flex-col space-y-4">
            <Input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                setErrorMessage(null);
              }}
              className="h-11 w-full rounded-[5px] border-0 border-none bg-[#dedede] px-3.5 text-sm text-black outline-none shadow-none ring-0 placeholder:text-zinc-500 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-400"
              autoFocus
            />

            <button
              type="submit"
              disabled={isLoading}
              className="flex h-11 w-full items-center justify-center rounded-[5px] bg-black text-sm font-medium text-white transition hover:bg-black/90 active:scale-[0.99] disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-white/90 cursor-pointer"
            >
              {isLoading && (
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-current border-r-transparent"></span>
              )}
              {view === 'login' ? 'Login' : 'Create Free Account'}
            </button>
          </form>
        ) : (
          /* Step 2: OTP (6 individual boxes) */
          <form onSubmit={handleOtpSubmit} className="flex flex-col">
            {email.length > 22 ? (
              <div className="text-sm text-center mb-6">
                <div className="text-zinc-600 dark:text-zinc-300">
                  Enter the 6-digit code sent to:
                </div>
                <div className="font-semibold text-black dark:text-white mt-1 break-all">
                  {email}
                </div>
              </div>
            ) : (
              <div className="text-sm text-zinc-600 dark:text-zinc-300 mb-6 text-center">
                Enter the 6-digit code sent to{' '}
                <span className="font-semibold text-black dark:text-white">{email}</span>:
              </div>
            )}
            <div className={`grid grid-cols-6 gap-2 mb-3 ${isShaking ? 'animate-shake' : ''}`}>
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={el => {
                    otpRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(index, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(index, e)}
                  onPaste={handleOtpPaste}
                  className="h-11 w-full rounded-[5px] border-0 border-none bg-[#dedede] text-center text-lg font-semibold text-black outline-none shadow-none ring-0 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none dark:bg-zinc-800 dark:text-white"
                />
              ))}
            </div>

            {/* Error message under boxes */}
            {errorMessage && (
              <div className="mb-3 text-center text-xs font-medium text-red-500 dark:text-red-400">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || otp.join('').length !== 6}
              className="flex h-11 w-full items-center justify-center rounded-[5px] bg-black text-sm font-medium text-white transition hover:bg-black/90 active:scale-[0.99] disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-white/90 cursor-pointer"
            >
              {isLoading && (
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-current border-r-transparent"></span>
              )}
              Verify Code
            </button>

            {/* OTP footer actions: Change email & Resend code */}
            <div className="mt-3.5 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 px-0.5">
              <button
                type="button"
                onClick={() => {
                  setStep('email');
                  setErrorMessage(null);
                  setResendStatus(null);
                }}
                className="hover:text-black dark:hover:text-white hover:underline cursor-pointer"
              >
                Change email
              </button>

              <button
                type="button"
                disabled={resendCooldown > 0 || isLoading}
                onClick={handleResendCode}
                className="hover:text-black dark:hover:text-white hover:underline disabled:opacity-50 disabled:no-underline cursor-pointer font-medium"
              >
                {resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : 'Resend code'}
              </button>
            </div>

            {resendStatus && (
              <div className="mt-2 text-center text-xs text-green-600 dark:text-green-400">
                {resendStatus}
              </div>
            )}
          </form>
        )}

        {/* Toggle between Login and Register (Email step only) */}
        {step === 'email' && (
          <div className="mt-3.5 text-center text-xs text-zinc-500 dark:text-zinc-400">
            {view === 'register' ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setView('login');
                    setStep('email');
                    setErrorMessage(null);
                  }}
                  className="font-semibold text-black dark:text-white hover:underline ml-1 cursor-pointer"
                >
                  Login
                </button>
              </p>
            ) : (
              <p>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setView('register');
                    setStep('email');
                    setErrorMessage(null);
                  }}
                  className="font-semibold text-black dark:text-white hover:underline ml-1 cursor-pointer"
                >
                  Create Free Account (100 Prompts)
                </button>
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
