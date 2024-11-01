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

/**
 * This is a hack to determine if the app is running in Docker Compose.
 * And allow to use services names as hostnames.
 * This env is setted on enrironment directive in docker-compose.yml
 */
export function isRunningInDockerCompose() {
  return process.env?.NEXT_PUBLIC_DOCKER_COMPOSE === "1";
}
