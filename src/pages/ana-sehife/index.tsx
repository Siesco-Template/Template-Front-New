import { useEffect } from 'react';

import { useTableConfig } from '@/shared/table/tableConfigContext';

import PageHeader from '@/ui/page-header';

const HomePage = () => {
    return (
        <>
            <PageHeader title="Ana səhifə" />
            <h1>Salam</h1>
        </>
    );
};

export default HomePage;
