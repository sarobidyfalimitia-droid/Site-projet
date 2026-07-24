'use client'

import { useState, useEffect } from 'react'

/**
 * Debounce a value — delays updates until the user stops typing.
 * @param value The value to debounce
 * @param delay Milliseconds (default 300)
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
