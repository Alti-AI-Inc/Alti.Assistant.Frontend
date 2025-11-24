'use client';
import Image from 'next/image';
import Link from 'next/link';
import LoginRegisterButtons from './LoginRegisterButtons';
import { NavigationSheet } from './NavigationSheet';
import NavMenu from './NavMenu';

const Header = () => {
  return (
    <div>
      <nav className="fixed inset-x-4 top-6 z-50 mx-auto h-16 max-w-(--breakpoint-xl) rounded-full border bg-black text-white dark:border-slate-700/70">
        <div className="mx-auto flex h-full items-center justify-between px-4">
          <div className="w-[174px]">
            <Link href="/" className="inline-block w-12.5">
              <Image
                src="/assets/logo-white.png"
                alt="Logo"
                height={25}
                width={50}
                className="ml-4"
              />
            </Link>
          </div>
          <div className="hidden md:block">
            <NavMenu />
          </div>
          <div className="hidden md:flex">
            <LoginRegisterButtons />
          </div>
          {/* Mobile Menu */}
          <div className="md:hidden">
            <NavigationSheet />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
