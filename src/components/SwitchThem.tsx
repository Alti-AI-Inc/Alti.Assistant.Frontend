'use client';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTheme } from 'next-themes';

const SwitchThem = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <h1 className="text-2xl font-semibold">Change Theme</h1>

      <div className="mt-10 rounded-2xl border bg-gray-100 p-6">
        <RadioGroup
          defaultValue={theme === 'dark' ? 'dark' : 'light'}
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
        </RadioGroup>
      </div>
    </div>
    // <Switch
    //   icon={
    //     theme === 'dark' ? (
    //       <MoonIcon className="h-4 w-4" />
    //     ) : (
    //       <SunMediumIcon className="h-4 w-4" />
    //     )
    //   }
    //   checked={theme === 'dark'}
    //   onCheckedChange={(checked: boolean) =>
    //     setTheme(checked ? 'dark' : 'light')
    //   }
    //   className="h-7 w-12"
    //   thumbClassName="h-6 w-6 data-[state=checked]:translate-x-5"
    // />
  );
};

export default SwitchThem;
