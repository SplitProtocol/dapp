/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useRef } from "react";

type CallbackFunction = (...args: any[]) => void;

export const useDebounceCallback = (
  callback: CallbackFunction,
  delay: number
) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(
    (...args: any[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  return debouncedCallback;
};
