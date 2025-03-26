import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Regular utility for merging classNames
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
