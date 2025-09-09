
"use client";
import { cn } from "@/lib/utils";
import { Switch as SwitchPrimitive, Thumb as SwitchThumb } from "@radix-ui/react-switch";
import * as React from "react";

// Replace the `Switch` component in `@components/ui/switch` with below component and use it here to support this customization.
const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive> & {
    icon?: React.ReactNode;
    thumbClassName?: string;
  }
>(({ className, icon, thumbClassName, ...props }, ref) => (
  <SwitchPrimitive
    className={cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchThumb
      className={cn(
        "pointer-events-none flex h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0 items-center justify-center",
        thumbClassName
      )}
    >
      {icon ? icon : null}
    </SwitchThumb>
  </SwitchPrimitive>
));
Switch.displayName = SwitchPrimitive.displayName;

export { Switch };
