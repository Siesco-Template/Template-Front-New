import { useEffect, useState } from 'react';

function useWidthViewport(): number {
    const [width, setWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 0);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleResize = () => {
            requestAnimationFrame(() => setWidth(window.innerWidth));
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return width;
}

export default useWidthViewport;
