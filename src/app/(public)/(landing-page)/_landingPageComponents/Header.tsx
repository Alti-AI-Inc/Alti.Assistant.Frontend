import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { NavMenu } from './NavMenu';

const Header = () => {
  return (
    <div>
      <nav className="fixed inset-x-4 top-6 z-50 mx-auto h-16 max-w-(--breakpoint-xl) rounded-full border bg-black text-white dark:border-slate-700/70">
        <div className="mx-auto flex h-full items-center justify-between px-4">
          <Image
            src="/assets/logo-white.png"
            alt="Logo"
            height={25}
            width={50}
            className="ml-4"
          />
          {/* Desktop Menu */}
          <NavMenu className="hidden md:block" />
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="hidden rounded-full text-black sm:inline-flex"
            >
              Sign In
            </Button>
            <Button className="rounded-full bg-blue-700 hover:bg-blue-800">
              Sign Up
            </Button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
