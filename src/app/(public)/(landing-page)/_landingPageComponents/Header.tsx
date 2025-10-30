'use client';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const menuItems = [
  { href: '#home', label: 'Home', type: 'anchor' },
  { href: '#about', label: 'About', type: 'anchor' },
  { href: '#features', label: 'Features', type: 'anchor' },
  { href: '#industries', label: 'Industries', type: 'anchor' },
  { href: '#pricing', label: 'Pricing', type: 'anchor' },
  { href: '/contact', label: 'Contact', type: 'route' },
];

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLinkClick = (item: {
    href: string;
    label: string;
    type: string;
  }) => {
    const offset =
      item.href === '#home'
        ? 140
        : item.href === '#features'
          ? 220
          : item.href === '#industries'
            ? 120
            : 80;
    if (item.type === 'anchor') {
      if (pathname === '/') {
        const element = document.querySelector(item.href);
        if (element) {
          const offsetTop =
            element.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth',
          });
        }
      } else {
        router.push(`/${item.href}`);

        setTimeout(() => {
          const element = document.querySelector(item.href);
          if (element) {
            const offsetTop =
              element.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
              top: offsetTop,
              behavior: 'smooth',
            });
          }
        }, 800);
      }
    }
  };
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
          {/* Desktop Menu */}
          {/*  className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 transform items-center space-x-5 text-sm" */}
          <ul className="flex items-center space-x-5 text-sm">
            {menuItems.map(subItem =>
              subItem.type === 'anchor' ? (
                <li
                  key={subItem.href}
                  className="cursor-pointer bg-transparent font-normal text-white shadow-none hover:bg-transparent"
                  onClick={e => {
                    e.preventDefault();
                    handleLinkClick(subItem);
                  }}
                >
                  {subItem.label}
                </li>
              ) : (
                <div key={subItem.href}>
                  <Link href={subItem.href}>{subItem.label}</Link>
                </div>
              ),
            )}
          </ul>
          {/* <NavMenu className="hidden md:block" /> */}
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
