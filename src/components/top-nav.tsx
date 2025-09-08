'use client'

import React, { Dispatch, SetStateAction } from 'react';
import { Login } from './login';
import { Register } from './register';
import { AlignJustify, GripVertical, X } from 'lucide-react';
import { ModeToggle } from './mode-toggler';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

const TopNav = ({ isLoggeIn, toggleSidebar, hideSidebar }: { isLoggeIn?: boolean, hideSidebar: boolean, toggleSidebar: Dispatch<SetStateAction<boolean>> }) => {
  const router = useRouter()
  const theme = useTheme()
  return (
    <div className="sticky h-[70px] top-0 mx-4 lg:mx-10 flex items-center justify-between py-4">
      <div className="flex items-center gap-2">
        {isLoggeIn && <GripVertical className="cursor-pointer" />}
        <div className='cursor-pointer' onClick={() => router.push('/')} >
          {theme.resolvedTheme === 'dark' ? <Image src='/logo-dark.png' width={120} height={100} alt='logo' /> : <Image src='/logo.png' width={120} height={100} alt='logo' />}
        </div>
      </div>
      <div className="hidden lg:flex items-center gap-4">
        {isLoggeIn ? (
          <div></div>
        ) : (
          <>
            <Login />
            <Register />
            <ModeToggle />
          </>
        )}
      </div>
      <div className='block lg:hidden'>
        {hideSidebar ? <AlignJustify className='cursor-pointer' onClick={() => toggleSidebar(pre => !pre)} /> : <X className='cursor-pointer' onClick={() => toggleSidebar(pre => !pre)} />}
      </div>
    </div>
  );
};

export default TopNav;
