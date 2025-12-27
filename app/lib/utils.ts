import {type ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';

export enum EnumAuthMethod {
  MANUAL = 'manual',
  CUSTOMER_ACCOUNT = 'customer_account',
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
