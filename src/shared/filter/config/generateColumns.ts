import { FilterKey } from './filterTypeEnum';

export const generateFiltersFromColumns = (columns: any[]) => {
    const filters: any = [];

    columns.forEach((col) => {
        let filterKey: number;

        switch (col.filterVariant) {
            case 'select':
                filterKey = FilterKey.Select; // 4
                filters.push({
                    type: filterKey, // FilterKey.Select
                    label: col.header,
                    key: col.accessorKey,
                    options: (col.filterSelectOptions || []).map((opt: any) => ({
                        label: opt.label ?? opt.name ?? opt.value,
                        value: opt.value ?? opt.name,
                    })),
                    showMoreColumns: col.showMoreColumns || [],
                });
                break;
            case 'multi-select':
                filterKey = FilterKey.MultiSelect; // 5
                filters.push({
                    type: filterKey, // FilterKey.MultiSelect
                    label: col.header,
                    key: col.accessorKey,
                    options: (col.filterSelectOptions || []).map((opt: any) => ({
                        label: opt.label ?? opt.name ?? opt.value,
                        value: opt.value ?? opt.name,
                    })),
                });
                break;
            case 'date-interval':
                filterKey = FilterKey.DateInterval; // 7
                filters.push({
                    type: filterKey, // FilterKey.DateInterval
                    label: col.header,
                    key: col.accessorKey,
                    placeholder: col.header,
                });
                break;
            case 'number-interval':
                filterKey = FilterKey.NumberInterval; // 3
                filters.push({
                    type: filterKey, // FilterKey.NumberInterval
                    label: col.header,
                    key: col.accessorKey,
                    placeholder: col.header,
                });
                break;
            default:
                filterKey = FilterKey.Text; // 1
                filters.push({
                    type: filterKey, // FilterKey.Text
                    label: col.header,
                    key: col.accessorKey,
                    placeholder: col.header,
                });
                break;
        }
    });

    return filters;
};
