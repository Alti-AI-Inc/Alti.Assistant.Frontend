'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
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
            Login
          </h2>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-500 dark:bg-red-950/20 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-xl bg-black py-3 text-sm font-medium text-white transition hover:bg-black/90 active:scale-[0.99] disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-white/90"
          >
            {loading ? (
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-current border-r-transparent"></span>
            ) : null}
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
