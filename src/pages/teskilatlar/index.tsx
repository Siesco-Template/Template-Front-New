import React, { useEffect } from 'react';

import { useTableConfig } from '@/shared/table/tableConfigContext';

const Teskilatlar = () => {
    const { loadConfigFromApi } = useTableConfig();
    useEffect(() => {
        loadConfigFromApi();
    }, []);
    return <div>Teskilatlar</div>;
};

export default Teskilatlar;
