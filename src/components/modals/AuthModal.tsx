'use client';

import { confirmRegistration, RegisterUser } from '@/actions/register';
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
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (actionId === 'register' || actionId === 'login') {
      setView(actionId);
      setStep('email');
      setEmail('');
      setOtp(['', '', '', '', '', '']);
      setErrorMessage(null);
    }
  }, [actionId, isOpen]);

  useEffect(() => {
    if (step === 'otp') {
      const timer = setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleModalOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      setTimeout(() => {
        setStep('email');
        setEmail('');
        setOtp(['', '', '', '', '', '']);
        setErrorMessage(null);
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
          setStep('otp');
        } else {
          setErrorMessage(response.message);
        }
      } else {
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
        onClose();
        window.location.reload();
      } else {
        setErrorMessage(response.message || 'Invalid code. Please try again.');
      }
    } catch {
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
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

        {/* Error message notification */}
        {errorMessage && (
          <div className="rounded-[5px] bg-red-50 p-3 text-center text-sm text-red-500 dark:bg-red-950/20 dark:text-red-400">
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
              className="h-11 w-full rounded-[5px] border-none bg-[#e1e1e1] bg-auth-input px-3.5 text-sm text-black outline-none placeholder:text-zinc-500 focus-visible:ring-0 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-400"
              autoFocus
            />

            <button
              type="submit"
              disabled={isLoading}
              className="flex h-11 w-full items-center justify-center rounded-[5px] bg-black text-sm font-medium text-white transition hover:bg-black/90 active:scale-[0.99] disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-white/90"
            >
              {isLoading && (
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-current border-r-transparent"></span>
              )}
              {view === 'login' ? 'Login' : 'Register'}
            </button>
          </form>
        ) : (
          /* Step 2: OTP (6 individual boxes) */
          <form onSubmit={handleOtpSubmit} className="flex flex-col space-y-4">
            <div className="grid grid-cols-6 gap-2">
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
                  className="h-11 w-full rounded-[5px] border-none bg-[#e1e1e1] bg-auth-input text-center text-lg font-semibold text-black outline-none focus-visible:ring-0 dark:bg-zinc-800 dark:text-white"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.join('').length !== 6}
              className="flex h-11 w-full items-center justify-center rounded-[5px] bg-black text-sm font-medium text-white transition hover:bg-black/90 active:scale-[0.99] disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-white/90"
            >
              {isLoading && (
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-current border-r-transparent"></span>
              )}
              {view === 'login' ? 'Login' : 'Register'}
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
