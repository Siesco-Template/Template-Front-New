import { useLayoutEffect } from 'react';

import { useAuthStore } from '@/store/authStore';

import { useTableConfig } from '@/shared/table/tableConfigContext';

import S_Toast from '@/ui/toast/S_Toast';

import './globals.css';
import './helper-styles.css';
import Providers from './providers';
import Routing from './routing';
import { AppInitializer } from './routing/routes';

const App = () => {
    const { config, loadConfigFromApi } = useTableConfig();
    const { user } = useAuthStore();

    useLayoutEffect(() => {
        loadConfigFromApi();
    }, [user]);

    console.log(config, 'config');
    return (
        <Providers>
            <S_Toast expand={true} visibleToasts={4} position="top-right" />
            <AppInitializer config={config} />
            <Routing />
        </Providers>
    );
};

export default App;
