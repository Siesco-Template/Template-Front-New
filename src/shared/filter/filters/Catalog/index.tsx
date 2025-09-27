import { useEffect, useState } from 'react';

import { catalogService } from '@/services/catalog/catalog.service';

import Catalog from '@/shared/catalog';

const CatalogFilter: React.FC<{
    filter: any;
    onChange: (key: string, val: any) => void;
    tableId: string;
    isFromTable: boolean;
}> = ({ filter, onChange, tableId, isFromTable }) => {
    const [options, setOptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const [totalItems, setTotalItems] = useState(0);

    const tableColumns = [
        {
            header: 'Təşkilat',
            accessorKey: 'Name',
            id: 'Name',
            filterVariant: 'text',
            Cell: ({ cell }: any) => cell.getValue(),
        },
    ];

    const fetchOptions = async (nextPage = 1, reset = false) => {
        if (loading) return;
        setLoading(true);

        try {
            const res = await catalogService.getCatalogsByTableId(filter.endpoint, {
                tableId: 'Organizations',
                columns: 'Name, Id',
                page: nextPage,
            });

            if (res.items.length === 0) {
                setHasMore(false);
                return;
            }

            setTotalItems(res.totalCount);

            const mapped = res.items.map((o: any) => ({
                label: o.Name,
                value: o.Id,
                ...o,
            }));

            setOptions((prev) => (reset ? mapped : [...prev, ...mapped]));
            setPage(nextPage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setOptions([]);
        setPage(1);
        setHasMore(true);

        const preload = async () => {
            await fetchOptions(1, true);
            await fetchOptions(2);
            await fetchOptions(3);
        };

        preload();
    }, [tableId, filter.endpoint]);

    const [selectedObj, setSelectedObj] = useState<any>(null);

    useEffect(() => {
        if (filter?.value && options.length > 0) {
            const match = options.find((i) => String(i.value) === String(filter.value));
            setSelectedObj(match);
        } else {
            setSelectedObj(null);
        }
    }, [filter?.value]);

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
            enableModal={isFromTable ? false : true}
            sizePreset="md-lg"
            totalItemCount={options.length}
            onRefetch={() => {
                if (hasMore) fetchOptions(page + 1);
            }}
            isLoading={loading}
            label={isFromTable ? undefined : filter.label}
            // @ts-expect-error
            showMoreColumns={tableColumns}
            totalDBRowCount={totalItems}
            fetchh={() => fetchOptions(page + 1)}
            totalFetched={options?.length}
            isInfinite={true}
        />
    );
};

export default CatalogFilter;
