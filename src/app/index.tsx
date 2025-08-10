import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

import { useTableConfig } from '@/shared/table/tableConfigContext';

import './globals.css';
import './helper-styles.css';
import Providers from './providers';
import Routing from './routing';
import { AppInitializer } from './routing/routes';

const App = () => {
    const { config, loadConfigFromApi } = useTableConfig();

    useEffect(() => {
        loadConfigFromApi();
    }, []);
    return (
        <Providers>
            <Toaster position="top-right" reverseOrder={false} />
            <AppInitializer config={config} />
            <Routing />
        </Providers>
    );
};

export default App;
