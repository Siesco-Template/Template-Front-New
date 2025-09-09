import { ReactNode, useEffect } from 'react';

import { useThemeStore } from './theme.store';
import { addThemeOnHtmlRoot } from './theme.utils';

const ThemeProvider = ({ children }: { children: ReactNode }) => {
    // const { currentTheme, getThemeForCss } = useThemeStore();
    // useEffect(() => {
    //     const getTheme = getThemeForCss();
    //     addThemeOnHtmlRoot(getTheme);
    // }, [currentTheme]);

    return <>{children}</>;
};

export default ThemeProvider;
