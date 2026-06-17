'use client';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { toast } from 'sonner';

const SwitchThem = () => {
  const { theme, setTheme } = useTheme();
  const [clickCount, setClickCount] = useState(0);

  const handleHeadingClick = () => {
    setClickCount(prev => {
      const next = prev + 1;
      if (next === 5) {
        toast.success('🌭 Secret "Hot Dog Stand" mode unlocked!');
      }
      return next;
    });
  };

  const showHotdog = clickCount >= 5 || theme === 'hotdog';

  return (
    <div>
      <h1 
        className="text-2xl font-semibold cursor-pointer select-none" 
        onClick={handleHeadingClick}
      >
        Change Theme
      </h1>

      <div className="mt-10 rounded-2xl border bg-gray-100 p-6">
        <RadioGroup
          value={theme}
          className=""
          onValueChange={value => {
            setTheme(value);
          }}
        >
          <div className="flex items-center gap-3">
            <RadioGroupItem className="border-black" value="light" id="r1" />
            <Label className="text-base" htmlFor="r1">
              Light Mode
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem className="border-black" value="dark" id="r2" />
            <Label className="text-base" htmlFor="r2">
              Dark Mode
            </Label>
          </div>
          {showHotdog && (
            <div className="flex items-center gap-3 animate-bounce">
              <RadioGroupItem className="border-black" value="hotdog" id="r3" />
              <Label className="text-base" htmlFor="r3">
                🌭 Hot Dog Stand Mode
              </Label>
            </div>
          )}
        </RadioGroup>
      </div>
    </div>
  );
};

export default SwitchThem;
