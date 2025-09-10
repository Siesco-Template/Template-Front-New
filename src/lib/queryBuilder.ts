interface FilterItem {
    id: string;
    type: number;
    value: string;
}

interface SortItem {
    SortBy: string;
    SortDirection: boolean;
}

interface Pagination {
    skip: number;
    take: number;
    IsInfiniteScroll: boolean;
}

interface TableQueryPayload {
    filter?: FilterItem[];
    sort?: SortItem[];
    skip?: number;
    take?: number;
    sortBy?: string;
    sortDirection?: boolean;
}

export function buildQueryParamsFromTableRequest(
    data: TableQueryPayload,
    options?: {
        isInfiniteScroll?: boolean;
        page?: number;
        initialFilter?: boolean; 
    }
): Record<string, any> {
    const params: Record<string, any> = {};
    const isInfiniteScroll = options?.isInfiniteScroll ?? false;

    const take = data.take ?? 10;
    const page = isInfiniteScroll ? (options?.page ?? 1) : (data.skip ?? 0) + 1;

    if (options?.initialFilter) {
        params['InitialFilter'] = true;
        params['Pagination.Page'] = 0;
        params['Pagination.Take'] = take;
        params['Pagination.IsInfiniteScroll'] = isInfiniteScroll.toString();
        return params;
    }

    // Filters
    if (Array.isArray(data.filter)) {
        data.filter.forEach((f, i) => {
            params[`Filters[${i}].column`] = f.id;
            params[`Filters[${i}].filterOperation`] = f.type;

            if (f.type === 11 && Array.isArray(f.value)) {
                const [start, end] = f.value;
                if (start && end) {
                    params[`Filters[${i}].value`] = `${start},${end}`;
                }
            } else {
                params[`Filters[${i}].value`] = f.value;
            }
        });
    }

    // Sorting
    if (Array.isArray(data.sort)) {
        data.sort.forEach((s, i) => {
            params[`Sort[${i}].SortBy`] = s.SortBy;
            params[`Sort[${i}].SortDirection`] = s.SortDirection;
        });
    } else if (data.sortBy && data.sortDirection !== undefined) {
        params['SortBy'] = data.sortBy;
        params['SortDirection'] = data.sortDirection;
    }

    // Pagination
    params['Pagination.Page'] = page;
    params['Pagination.Take'] = take;
    params['Pagination.IsInfiniteScroll'] = isInfiniteScroll.toString();

    return params;
}
