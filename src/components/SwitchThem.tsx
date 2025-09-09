'use client';
import { useTheme } from 'next-themes';
import { Button } from './ui/button';

const items = [
  {
    id: 2,
    title: 'Light',
    value: 'light',
  },
  {
    id: 3,
    title: 'Dark',
    value: 'dark',
  },
];

const SwitchThem = () => {
  const { theme, setTheme } = useTheme();
  console.log({ theme });
  return (
    <div className='space-x-2'>
      {items.map(item => (
        <Button
          key={item.id}
          variant={theme === item.value ? 'default' : 'outline'}
          onClick={() => setTheme(item.value)}
        >
          {item.title}
        </Button>
      ))}
    </div>
  );
};

export default SwitchThem;
