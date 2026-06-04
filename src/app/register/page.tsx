'use client';

import { useState } from 'react';
import { RegisterUser, confirmRegistration } from '@/actions/register';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const router = useRouter();

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await RegisterUser({
        email,
        password,
        confirmPassword,
      });

      if (!res.success) {
        setError(res.message || 'Registration failed. Please try again.');
      } else {
        setShowVerification(true);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyCode.length !== 6) {
      setVerifyError('Please enter the 6-digit code');
      return;
    }
    setVerifying(true);
    setVerifyError(null);

    try {
      const res = await confirmRegistration(verifyCode);
      if (!res.success) {
        setVerifyError(res.message || 'Invalid code. Please try again.');
      } else {
        // Success: Redirect to login
        router.push('/login');
      }
    } catch (err) {
      setVerifyError('An error occurred. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F5F7] px-4 dark:bg-zinc-950">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-black/10 bg-white p-8 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Link href="/">
            <Image
              src="/assets/logo-icon.png"
              alt="Alti Logo"
              width={40}
              height={40}
              className="mb-2"
            />
          </Link>
          <h2 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {showVerification ? 'Verify Email' : 'Register Account'}
          </h2>
          {showVerification && (
            <p className="text-sm text-gray-500 dark:text-zinc-400">
              Enter the 6-digit confirmation code sent to your email
            </p>
          )}
        </div>

        {!showVerification ? (
          <>
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-500 dark:bg-red-950/20 dark:text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full rounded-xl border-none bg-[#F5F5F7] bg-auth-input p-3 text-sm text-black outline-none placeholder:text-zinc-500 focus:ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-400 autofill:shadow-[0_0_0_1000px_#F5F5F7_inset] dark:autofill:shadow-[0_0_0_1000px_#27272a_inset]"
              />

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full rounded-xl border-none bg-[#F5F5F7] bg-auth-input p-3 pr-10 text-sm text-black outline-none placeholder:text-zinc-500 focus:ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-400 autofill:shadow-[0_0_0_1000px_#F5F5F7_inset] dark:autofill:shadow-[0_0_0_1000px_#27272a_inset]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-zinc-400 dark:hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  className="w-full rounded-xl border-none bg-[#F5F5F7] bg-auth-input p-3 pr-10 text-sm text-black outline-none placeholder:text-zinc-500 focus:ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-400 autofill:shadow-[0_0_0_1000px_#F5F5F7_inset] dark:autofill:shadow-[0_0_0_1000px_#27272a_inset]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-zinc-400 dark:hover:text-white"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center rounded-xl bg-black py-3 text-sm font-medium text-white transition hover:bg-black/90 active:scale-[0.99] disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-white/90"
              >
                {loading ? (
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-current border-r-transparent"></span>
                ) : null}
                Register
              </button>
            </form>

            <div className="text-center text-sm text-gray-500 dark:text-zinc-400">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-black hover:underline dark:text-white">
                Login
              </Link>
            </div>
          </>
        ) : (
          <>
            {verifyError && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-500 dark:bg-red-950/20 dark:text-red-400">
                {verifyError}
              </div>
            )}

            <form onSubmit={handleVerifySubmit} className="space-y-6">
              <input
                id="verifyCode"
                type="text"
                required
                maxLength={6}
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
                placeholder="6-Digit Verification Code"
                className="w-full rounded-xl border-none bg-[#F5F5F7] bg-auth-input p-3 text-center text-lg font-bold tracking-widest text-black outline-none placeholder:text-zinc-400 focus:ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500 autofill:shadow-[0_0_0_1000px_#F5F5F7_inset] dark:autofill:shadow-[0_0_0_1000px_#27272a_inset]"
              />

              <button
                type="submit"
                disabled={verifying}
                className="flex w-full items-center justify-center rounded-xl bg-black py-3 text-sm font-medium text-white transition hover:bg-black/90 active:scale-[0.99] disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-white/90"
              >
                {verifying ? (
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-current border-r-transparent"></span>
                ) : null}
                Verify Code
              </button>

              <button
                type="button"
                onClick={() => setShowVerification(false)}
                className="w-full text-center text-sm font-medium text-gray-500 hover:text-black dark:text-zinc-400 dark:hover:text-white"
              >
                Back to Sign Up
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
