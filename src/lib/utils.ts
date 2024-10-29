import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Pauses the execution for a specified number of seconds.
 *
 * @param seconds - The number of seconds to sleep.
 * @returns A promise that resolves after the specified number of seconds.
 */
export const sleep = async (seconds: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
};
