import type { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type Person = {
  name: string;
  email: string;
  phone: string;
  cases: string;
};