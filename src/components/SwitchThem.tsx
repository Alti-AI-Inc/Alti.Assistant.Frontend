'use client';
import { MoonIcon, SunMediumIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Switch } from './ui/switch';

const SwitchThem = () => {
  const { theme, setTheme } = useTheme();
  return (
    <Switch
      icon={
        theme === 'dark' ? (
          <MoonIcon className="h-4 w-4" />
        ) : (
          <SunMediumIcon className="h-4 w-4" />
        )
      }
      checked={theme === 'dark'}
      onCheckedChange={(checked: boolean) =>
        setTheme(checked ? 'dark' : 'light')
      }
      className="h-7 w-12"
      thumbClassName="h-6 w-6 data-[state=checked]:translate-x-5"
    />
  );
};

export default SwitchThem;
