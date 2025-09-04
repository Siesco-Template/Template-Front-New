import { FilterConfig } from '../types';

export const isValidFilterValue = (filter: FilterConfig): boolean => {
    const value = filter?.value;
    const type = filter?.type;

    if (value === null || value === undefined) return false;

    if (type === 'select') {
        return value !== '';
    }

    if (typeof value === 'string') {
        return value.trim() !== '';
    }

    if (Array.isArray(value)) {
        return value.length > 0;
    }

    if (typeof value === 'object' && 'min' in value && 'max' in value) {
        return value.min !== '' || value.max !== '';
    }

    return true;
};

export const parseFiltersFromUrl = (filters: FilterConfig[]): FilterConfig[] => {
    const url = new URL(window.location.href);
    const filterDataString = url.hash.split('?')[1]?.split('filterData=')[1];

    if (!filterDataString) return filters;
    try {
        const decodedFilterData = JSON.parse(decodeURIComponent(filterDataString));
        const urlFilters = decodedFilterData?.filter || [];

        const getInitialValue = (filter: any, urlValue: any): any => {
            if (filter.type === 1 || filter.type === 'text') {
                return typeof urlValue === 'string' ? urlValue.replace(/\+/g, ' ') : '';
            }

            if (filter.type === 3 || filter.type === 'number-interval') {
                if (typeof urlValue === 'string' && urlValue.includes(',')) {
                    const [min, max] = urlValue.split(',');
                    return { min, max };
                }

                if (typeof urlValue === 'number' || (typeof urlValue === 'string' && !urlValue.includes(','))) {
                    return { min: urlValue, max: urlValue };
                }

                if (typeof urlValue === 'object' && urlValue !== null && 'min' in urlValue && 'max' in urlValue) {
                    return urlValue;
                }

                return { min: '', max: '' };
            }

            if (filter.type === 7 || filter.type === 'date-interval') {
                if (Array.isArray(urlValue)) {
                    return urlValue;
                }

                const formatDate = (d: string) => {
                    const [y, m, d2] = d.split('-');
                    return `${d2}.${m}.${y}`;
                };

                if (typeof urlValue === 'string' && urlValue.includes(',')) {
                    const [start, end] = urlValue.split(',');
                    return [formatDate(start), formatDate(end)];
                }

                if (typeof urlValue === 'string') {
                    return [formatDate(urlValue), formatDate(urlValue)];
                }

                return ['', ''];
            }

            if (filter.type === 4 || filter.type === 'select') return urlValue || '';
            if (filter.type === 5 || filter.type === 'multi-select')
                return typeof urlValue === 'string' ? urlValue.split(',') : [];

            return urlValue;
        };

        return filters?.map((filter) => {
            const match = urlFilters?.find((uf: any) => uf.id === filter.key || uf.column === filter.key);
            if (!match) return filter;
            return { ...filter, value: getInitialValue(filter, match.value) };
        });
    } catch (err) {
        console.error('filterData parsing error:', err);
        return filters;
    }
};

export const applyFiltersToUrl = (
    filters: { id: string; value: any }[],
    skip: number = 0,
    take: number = 20,
    sort: any[] = [],
    opts?: { replace?: boolean }
): boolean => {
    const validFilters = (filters || [])
        .filter((f) => {
            if (f.value === null || f.value === undefined) return false;
            if (typeof f.value === 'string' && f.value.trim() === '') return false;
            if (Array.isArray(f.value) && f.value.length === 0) return false;
            if (
                typeof f.value === 'object' &&
                'min' in f.value &&
                'max' in f.value &&
                (f.value.min === '' || f.value.min == null) &&
                (f.value.max === '' || f.value.max == null)
            )
                return false;
            return true;
        })
        .map((f) => ({
            id: f.id,
            value:
                typeof f.value === 'object' && 'min' in f.value && 'max' in f.value
                    ? `${f.value.min ?? ''},${f.value.max ?? ''}`
                    : Array.isArray(f.value)
                      ? f.value
                      : f.value,
        }));

    const newFilterData: any = { filter: validFilters, skip, take, sort };

    const currentHash = window.location.hash || '';
    const base = currentHash.split('?')[0];
    const nextHash = `${base}?filterData=${JSON.stringify(newFilterData)}`;

    if (currentHash === nextHash) return false;

    if (opts?.replace) {
        const url = window.location.pathname + window.location.search + nextHash;
        window.history.replaceState(null, '', url);
    } else {
        window.location.hash = nextHash;
    }
    setTimeout(() => {
        window.dispatchEvent(new HashChangeEvent('hashchange'));
    }, 0);

    return true;
};

export const clearUrlParams = () => {
    const url = new URL(window.location.href);
    url.search = '';

    if (url.hash.includes('?')) {
        url.hash = url.hash.split('?')[0];
    }
    window.history.replaceState(null, '', url.toString());
};

export const toUrlFilterData = (saved: any) => {
    const raw = saved?.payload ?? saved?.filterData ?? saved?.filters ?? saved?.data ?? saved?.query;

    if (Array.isArray(raw)) {
        return { filter: raw, skip: 0, take: 20, sort: [] };
    }

    if (raw?.filter) {
        return {
            filter: raw.filter,
            skip: raw.skip ?? 0,
            take: raw.take ?? 20,
            sort: raw.sort ?? [],
        };
    }

    return { filter: [], skip: 0, take: 20, sort: [] };
};
