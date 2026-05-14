import { useState, useEffect, useRef } from 'react'

/**
 * Returns a debounced version of the provided value.
 * The debounced value only updates after the specified delay has elapsed
 * since the last change to the input value.
 *
 * @param value - The value to debounce
 * @param delay - Debounce delay in milliseconds (default: 300)
 */
export const useDebounce = <T>(value: T, delay = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

/**
 * Returns a debounced callback function.
 * The callback is only invoked after the specified delay has elapsed
 * since the last call, with the latest arguments.
 *
 * @param callback - Function to debounce
 * @param delay - Debounce delay in milliseconds (default: 300)
 */
export const useDebouncedCallback = <T extends (...args: unknown[]) => void>(
  callback: T,
  delay = 300
): ((...args: Parameters<T>) => void) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const callbackRef = useRef(callback)

  // Keep callback ref up-to-date so callers don't need to include it in deps
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  return (...args: Parameters<T>) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      callbackRef.current(...args)
    }, delay)
  }
}

export default useDebounce
