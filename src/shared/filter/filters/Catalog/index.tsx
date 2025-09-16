import { useEffect, useState } from 'react';

import { catalogService } from '@/services/catalog/catalog.service';

import Catalog from '@/shared/catalog';

const CatalogFilter: React.FC<{ filter: any; onChange: (key: string, val: any) => void; tableId: string }> = ({
    filter,
    onChange,
    tableId,
}) => {
    const [options, setOptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchOptions = async () => {
        setLoading(true);
        try {
            if (true) {
                const res = await catalogService.getCatalogsByTableId(filter.endpoint, {
                    tableId,
                    columns: filter.column,
                });
                console.log(res, 'res');
                setOptions(
                    res.data.map((o: any) => ({
                        label: o[filter.labelField],
                        value: o[filter.valueField],
                    }))
                );
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOptions();
    }, []);

    const selectedObj =
        filter.value != null && filter.value !== ''
            ? (options.find((i) => String(i.value) === String(filter.value)) ?? null)
            : null;

    return (
        <Catalog
            key={filter.key}
            items={options}
            getLabel={(i: any) => i?.label}
            getRowId={(i: any) => String(i?.value)}
            value={selectedObj ? [selectedObj] : []}
            onChange={(sel) => {
                const picked = Array.isArray(sel) ? sel[0] : sel;
                const newVal = picked ? (picked as any).value : '';
                onChange(filter.key, newVal);
            }}
            multiple={false}
            enableModal={false}
            sizePreset="md-lg"
            totalItemCount={options.length}
            onRefetch={fetchOptions}
            isLoading={loading}
            label={filter.label}
            showMoreColumns={filter.showMoreColumns || []}
        />
    );
};

export default CatalogFilter;
