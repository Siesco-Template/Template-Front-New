import { useEffect, useRef } from 'react';

export function useDebounce<T>(value: T, delay: number, callback: (debouncedValue: T) => void) {
    const handler = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (handler.current) {
            clearTimeout(handler.current);
        }

        handler.current = setTimeout(() => {
            callback(value);
        }, delay);

        return () => {
            if (handler.current) {
                clearTimeout(handler.current);
            }
        };
    }, [value, delay, callback]);
}
