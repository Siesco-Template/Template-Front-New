import { useEffect } from 'react';

import { useTableConfig } from '@/shared/table/tableConfigContext';

import PageHeader from '@/ui/page-header';

import HomeMain from './components';
import styles from './style.module.css';

const HomePage = () => {
    const { loadConfigFromApi } = useTableConfig();

    useEffect(() => {
        loadConfigFromApi();
    }, []);

    return (
        <>
            <PageHeader title="Ana səhifə" />
            <HomeMain />
        </>
    );
};

export default HomePage;
