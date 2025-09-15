import { ReactNode, useEffect } from 'react';

import { getSystemTheme } from '@/shared/utils';

import { useLayoutStore } from './layout.store';

const LayoutProvider = ({ children }: { children: ReactNode }) => {
    const { mode } = useLayoutStore();

    useEffect(() => {
        const rootElement = document.documentElement;
        rootElement.setAttribute('data-theme', mode === 'system' ? getSystemTheme() : mode);
    }, [mode]);

    return <>{children}</>;
};

export default LayoutProvider;
