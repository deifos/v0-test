import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const trackEvent = (eventName: string) => {
  if (typeof window !== "undefined" && "beam" in window) {
    window.beam(`/custom-events/minigamesai/${eventName}`);
  }
};
