import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';
const menuItems = [
  { href: '#home', label: 'Home', type: 'anchor' },
  { href: '#about', label: 'About', type: 'anchor' },
  { href: '#features', label: 'Features', type: 'anchor' },
  { href: '#industries', label: 'Industries', type: 'anchor' },
  { href: '#pricing', label: 'Pricing', type: 'anchor' },
  { href: '/contact', label: 'Contact', type: 'route' },
];
const NavMenu = ({
  setOpen,
}: {
  setOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
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
    if (setOpen) {
      setTimeout(() => {
        setOpen(false);
      }, 400);
    }
  };
  return (
    <ul className="flex flex-col space-y-5 text-sm md:flex-row md:items-center md:space-y-0 md:space-x-5">
      {menuItems.map(subItem =>
        subItem.type === 'anchor' ? (
          <li
            key={subItem.href}
            className="cursor-pointer bg-transparent font-normal shadow-none hover:bg-transparent md:text-white"
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
  );
};

export default NavMenu;
