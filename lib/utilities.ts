import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import { ClassValue } from 'clsx';

export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs));
};

export const price = (value: number) => {
	return new Intl.NumberFormat('hi-IN', {
		style: 'currency',
		currency: 'INR',
	}).format(value);
};
