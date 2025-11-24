import { Button } from '@/components/ui/button';
import Link from 'next/link';

const LoginRegisterButtons = () => {
  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        asChild
        className="relative rounded-full max-md:hover:bg-black max-md:hover:text-white max-md:bg-black max-md:text-white text-black "
      >
        <Link href="/login" className="absolute inset-0">
          Sign In
        </Link>
      </Button>
      <Button
        asChild
        className="relative rounded-full bg-blue-700 hover:bg-blue-800"
      >
        <Link href="/register" className="absolute inset-0">
          Sign Up
        </Link>
      </Button>
    </div>
  );
};

export default LoginRegisterButtons;
