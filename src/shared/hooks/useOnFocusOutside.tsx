import { RefObject, useEffect } from 'react';

function useOnFocusOutside<T extends HTMLElement>(
    refs: RefObject<T | null>[],
    handler: (event: FocusEvent | MouseEvent) => void
) {
    useEffect(() => {
        function listener(event: FocusEvent | MouseEvent) {
            if (refs.some((ref) => ref.current?.contains(event.target as Node))) {
                return;
            }
            handler(event);
        }

        document.addEventListener('mousedown', listener);
        document.addEventListener('focusin', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('focusin', listener);
        };
    }, [refs, handler]);
}

export default useOnFocusOutside;
