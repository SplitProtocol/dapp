import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const clsxMerge = (...classes: ClassValue[]) => {
	return twMerge(clsx(...classes));
};
