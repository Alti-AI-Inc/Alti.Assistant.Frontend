'use client';
import ChangePassword from '@/components/ChangePassword';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useState } from 'react';

const optionsList = [
  // {
  //   id: 1,
  //   title: 'Theme',
  //   value: 'theme',
  // },
  {
    id: 1,
    title: 'Memory',
    value: 'memory',
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
        <div className="flex flex-1 items-center justify-start ml-10">
          {/* {selectedOption === 1 && <SwitchThem />} */}
          {selectedOption === 1 && <Memory />}
          {selectedOption === 2 && <ChangePassword />}
        </div>
      </div>
    </div>
  );
};

const Memory = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Long Term Memory</h1>
      <p className="my-4">
        Select the length of time for the alti assistant to remember your
        conversations.
      </p>
      <div className="mt-10 rounded-2xl border p-6 bg-gray-100">
        <RadioGroup defaultValue="1-month" className="">
          <div className="flex items-center gap-3">
            <RadioGroupItem className='border-black' value="off" id="r1" />
            <Label className="text-base" htmlFor="r1">
              Off
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem className='border-black' value="1-month" id="r2" />
            <Label className="text-base" htmlFor="r2">
              1 Month
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem className='border-black' value="3-month" id="r3" />
            <Label className="text-base" htmlFor="r3">
              3 Months
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem className='border-black' value="6-month" id="r4" />
            <Label className="text-base" htmlFor="r4">
              6 Months
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem className='border-black' value="12-month" id="r5" />
            <Label className="text-base" htmlFor="r5">
              12 Months
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default Page;
