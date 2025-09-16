import { DefaultAlign } from '../settings.contants';
import { ViewAndContentState } from './view-and-content.store';

export const getViewAndContentFromContext = (visualSettings: any): ViewAndContentState => {
    const cursorVariant = visualSettings?.cursor ?? DefaultAlign.cursorVariant;
    const cursorSize = visualSettings?.cursorSize ?? DefaultAlign.cursorSize;

    return {
        cursorVariant,
        previousCursorVariant: cursorVariant,
        cursorSize,
        previousCursorSize: cursorSize,
    };
};
