import { ReactNode, useEffect } from 'react';

import { useTypographyStore } from './typography.store';
import { addTypographySizesOnHtmlRoot } from './typography.utils';

const TypographyProvider = ({ children }: { children: ReactNode }) => {
    const { fontSize, letterSpacing, highlightLinks, highlightTitles } = useTypographyStore();
    useEffect(() => {
        addTypographySizesOnHtmlRoot({
            fontSize,
        });
    }, [fontSize]);

    useEffect(() => {
        document.documentElement.style.setProperty('--letter-spacing', letterSpacing);
    }, [letterSpacing]);

    useEffect(() => {
        if (highlightTitles) {
            document.documentElement.classList.add('highlight-titles');
        } else {
            document.documentElement.classList.remove('highlight-titles');
        }
    }, [highlightTitles]);

    useEffect(() => {
        if (highlightLinks) {
            document.documentElement.classList.add('highlight-links');
        } else {
            document.documentElement.classList.remove('highlight-links');
        }
    }, [highlightLinks]);

    return <>{children}</>;
};

export default TypographyProvider;
