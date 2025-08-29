import React, { useLayoutEffect } from 'react';
import { MemoryRouter } from 'react-router';

import '@/app/globals.css';

import type { Decorator, Preview } from '@storybook/react';

import { DefaultThemes } from '../src/modules/_settings/settings.contants';
import { addThemeOnHtmlRoot, transformThemeToCss } from '../src/modules/_settings/theme/theme.utils';

const withTheme: Decorator = (Story, context) => {
    const theme = (context.globals.theme as 'light' | 'dark') ?? 'light';

    useLayoutEffect(() => {
        if (typeof document === 'undefined') return;
        const getTheme = transformThemeToCss(DefaultThemes.find((t) => t.type === theme));
        addThemeOnHtmlRoot(getTheme);
    }, [theme]);

    return <Story />;
};

const withRouter: Decorator = (Story) => (
    <MemoryRouter initialEntries={['/']}>
        <Story />
    </MemoryRouter>
);

const preview: Preview = {
    parameters: {
        controls: {
            matchers: { color: /(background|color)$/i, date: /Date$/i },
        },
        options: {
            storySort: {
                order: [
                    'Introduction',
                    ['Introduction configure your project'],
                    'Tokens',
                    ['Colors', 'Sizes'],
                    'Components',
                ],
            },
        },
        docs: {
            autodocs: true,
        },
    },
    globalTypes: {
        theme: {
            name: 'Theme',
            description: 'Global theme for components',
            defaultValue: 'light',
            toolbar: {
                icon: 'sun',
                items: [
                    { value: 'light', title: 'Light' },
                    { value: 'dark', title: 'Dark' },
                ],
                dynamicTitle: true,
            },
        },
    },
    decorators: [withTheme, withRouter],
};

export default preview;
