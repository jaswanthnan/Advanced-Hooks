import { useState, useEffect, RefObject } from 'react';

/**
 * useDebounce: Returns a debounced version of the provided value.
 * Delays rapid input changes to improve search and filtering performance.
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
      console.log(`%c [useDebounce] Value updated: ${value} `, 'background: #6366f1; color: white; padding: 2px 4px; border-radius: 4px; font-weight: bold;');
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

/**
 * useLocalStorage: Syncs state with localStorage.
 * Persists React state in browser local storage.
 */
export const useLocalStorage = <T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        console.log(`%c [useLocalStorage] Loaded ${key} from storage `, 'background: #10b981; color: white; padding: 2px 4px; border-radius: 4px; font-weight: bold;');
        return JSON.parse(item);
      }
      return initialValue;
    } catch (error) {
      console.error(`[useLocalStorage] Error loading ${key}:`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      console.log(`%c [useLocalStorage] Saved ${key} to storage `, 'background: #059669; color: white; padding: 2px 4px; border-radius: 4px; font-weight: bold;');
    } catch (error) {
      console.error(`[useLocalStorage] Error saving ${key}:`, error);
    }
  };

  return [storedValue, setValue];
};

interface FetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * useFetch: Handles data fetching with AbortController support.
 * Handles API requests with cancellation to prevent memory leaks and stale updates.
 */
export const useFetch = <T>(url: string, options: RequestInit = {}): FetchResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [toggle, setToggle] = useState<boolean>(false);

  const refetch = () => setToggle(prev => !prev);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log(`%c [useFetch] Requesting: ${url} `, 'background: #f59e0b; color: black; padding: 2px 4px; border-radius: 4px; font-weight: bold;');
        const response = await fetch(url, { ...options, signal: controller.signal });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const json = await response.json();
        setData(json);
        console.log(`%c [useFetch] Success: ${url} `, 'background: #3b82f6; color: white; padding: 2px 4px; border-radius: 4px; font-weight: bold;');
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError(err.message);
          console.error(`%c [useFetch] Error: ${err.message} `, 'background: #ef4444; color: white; padding: 2px 4px; border-radius: 4px; font-weight: bold;');
        } else {
          console.log(`%c [useFetch] Request Aborted: ${url} `, 'background: #94a3b8; color: white; padding: 2px 4px; border-radius: 4px; font-weight: bold;');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => {
      console.log(`%c [useFetch] Cleaning up (Aborting): ${url} `, 'background: #475569; color: white; padding: 2px 4px; border-radius: 4px;');
      controller.abort();
    };
  }, [url, toggle]);

  return { data, loading, error, refetch };
};

/**
 * useIntersectionObserver: Detects when an element enters the viewport.
 * Useful for lazy loading and scroll-based features.
 */
export const useIntersectionObserver = (
  ref: RefObject<HTMLElement>,
  options: IntersectionObserverInit = {}
): boolean => {
  const [isIntersecting, setIntersecting] = useState<boolean>(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIntersecting(entry.isIntersecting);
      if (entry.isIntersecting) {
        console.log(`%c [useIntersectionObserver] Element visible! `, 'background: #ec4899; color: white; padding: 2px 4px; border-radius: 4px; font-weight: bold;');
      } else {
        console.log(`%c [useIntersectionObserver] Element hidden! `, 'background: #9d174d; color: white; padding: 2px 4px; border-radius: 4px;');
      }
    }, options);

    observer.observe(ref.current);
    return () => {
      console.log('%c [useIntersectionObserver] Disconnecting observer ', 'background: #475569; color: white; padding: 2px 4px; border-radius: 4px;');
      observer.disconnect();
    };
  }, [ref, options]);

  return isIntersecting;
};

