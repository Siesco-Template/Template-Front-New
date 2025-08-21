import '@/app/globals.css';
import '@/app/helper-styles.css';

import type { Preview } from '@storybook/react-vite';

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
};

export default preview;
