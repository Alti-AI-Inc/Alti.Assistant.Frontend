'use client';
import ChangePassword from '@/components/ChangePassword';
import SwitchThem from '@/components/SwitchThem';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const optionsList = [
  {
    id: 1,
    title: 'Theme',
    value: 'theme',
  },
  {
    id: 2,
    title: 'Password',
    value: 'password',
  },
];
const Page = () => {
  const [selectedOption, setSelectedOption] = useState(1);
  return (
    <div className="mt-40 pl-20">
      <div className="flex space-x-6">
        <div className="flex w-40 flex-col space-y-2">
          {optionsList.map(item => (
            <Button
              key={item.id}
              variant={selectedOption === item.id ? 'default' : 'outline'}
              onClick={() => setSelectedOption(item.id)}
            >
              {item.title}
            </Button>
          ))}
        </div>
        <div className="flex flex-1 items-center justify-center">
          {selectedOption === 1 && <SwitchThem />}
          {selectedOption === 2 && <ChangePassword />}
        </div>
      </div>
    </div>
  );
};

export default Page;
