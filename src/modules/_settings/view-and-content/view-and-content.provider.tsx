import { ReactNode, useEffect } from 'react';

import { Cursors } from '../pages/visual-settings';
import { useViewAndContentStore } from './view-and-content.store';

const ViewAndContentProvider = ({ children }: { children: ReactNode }) => {
    const { cursorSize, cursorVariant } = useViewAndContentStore((state) => state);

    useEffect(() => {
        const cursor = Cursors.find((cursor) => cursor.value === cursorVariant);

        if (cursor && cursorVariant !== 'default') {
            // ${/* cursorSize */''}
            document.body.style.setProperty('cursor', `url(${cursor.img}-${cursorSize}.png) 0 0, auto`, 'important');
        } else {
            document.body.style.removeProperty('cursor');
        }
    }, [cursorSize, cursorVariant]);
    return <>{children}</>;
};
export default ViewAndContentProvider;
