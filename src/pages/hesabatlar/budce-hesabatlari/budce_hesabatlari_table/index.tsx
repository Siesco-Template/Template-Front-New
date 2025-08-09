import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { TableProvider } from '@/shared/table/table-context';

import Elave1 from './elave1';
import Elave2 from './elave2';

const slugConfig = {
    'elave-1': { component: Elave1, tableKey: 'customer_table' },
    'elave-2': { component: Elave2, tableKey: 'report' },
} as const;

type Slug = keyof typeof slugConfig;

export default function Budce_hesabatlari_table() {
    const { id } = useParams<{ id: Slug }>();
    const [isFilterCollapsed, setIsFilterCollapsed] = useState(true);
    const [isConfigCollapsed, setIsConfigCollapsed] = useState(true);

    const handleToggleFilterPanel = () => {
        if (isFilterCollapsed) {
            setIsFilterCollapsed(false);
            setIsConfigCollapsed(true);
        } else {
            setIsFilterCollapsed(true);
        }
    };

    const handleToggleConfigPanel = () => {
        if (isConfigCollapsed) {
            setIsConfigCollapsed(false);
            setIsFilterCollapsed(true);
        } else {
            setIsConfigCollapsed(true);
        }
    };
    const { component: ReportComponent, tableKey } = slugConfig[id as Slug];

    if (!ReportComponent) {
        return <div>.</div>;
    }

    return (
        <TableProvider tableKey={tableKey}>
            <ReportComponent
                isFilterCollapsed={isFilterCollapsed}
                onToggleCollapse={handleToggleFilterPanel}
                isConfigCollapsed={isConfigCollapsed}
                onToggleConfigCollapse={handleToggleConfigPanel}
            />
        </TableProvider>
    );
}
