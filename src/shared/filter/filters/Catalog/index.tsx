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

    const tableColumns = [
        {
            header: 'Təşkilat',
            accessorKey: 'Name',
            id: 'Name',
            filterVariant: 'text', Cell: ({ cell }: any) => cell.getValue(),
        },
    ];

    const fetchOptions = async () => {
        setLoading(true);
        try {
            const res = await catalogService.getCatalogsByTableId(filter.endpoint, {
                tableId: 'Organizations',
                columns: 'Name, Id',
                page: 1,
            });

            setOptions(
                res.items.map((o: any) => ({
                    label: o.Name,
                    value: o.Id,
                    ...o,
                }))
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOptions();
    }, [tableId, filter.endpoint]);

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
            enableModal={true}
            sizePreset="md-lg"
            totalItemCount={options.length}
            onRefetch={fetchOptions}
            isLoading={loading}
            label={filter.label}
            showMoreColumns={tableColumns}
        />
    );
};

export default CatalogFilter;
