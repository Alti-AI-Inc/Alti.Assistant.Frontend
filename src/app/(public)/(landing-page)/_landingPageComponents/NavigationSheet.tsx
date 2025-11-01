import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import LoginRegisterButtons from './LoginRegisterButtons';
import NavMenu from './NavMenu';

export const NavigationSheet = () => {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <VisuallyHidden>
        <SheetTitle>Navigation Menu</SheetTitle>
      </VisuallyHidden>

      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Menu className="text-gray-700" />
        </Button>
      </SheetTrigger>
      <SheetContent className="px-6 py-3 [&_>button]:focus:ring-0">
        <div className="w-[174px]">
          <Link href="/" className="inline-block w-12.5">
            <Image
              src="/assets/logo-black.png"
              alt="Logo"
              height={25}
              width={50}
              className=""
            />
          </Link>
        </div>
        <NavMenu setOpen={setOpen} />
        <LoginRegisterButtons />
      </SheetContent>
    </Sheet>
  );
};
