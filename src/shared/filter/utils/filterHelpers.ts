import { FilterConfig } from '../types';

export const applyFiltersToUrl = (
    filters: { id: string; value: any }[] = [],
    skip: number = 0,
    take: number = 20,
    sort: any[] = [],
    defaultFilter?: boolean
): boolean => {
    const validFilters = filters
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

    const encodedFilter = JSON.stringify(newFilterData);
    const nextHash = defaultFilter
        ? `${base}?filterData=${encodedFilter}&defaultFilter=true`
        : `${base}?filterData=${encodedFilter}`;

    if (currentHash === nextHash) return false;

    window.location.hash = nextHash;

    setTimeout(() => {
        window.dispatchEvent(new HashChangeEvent('hashchange'));
    }, 0);

    return true;
};

export const applyConfigToFilters = (filters: FilterConfig[], configFilters: any[]) => {
    if (!configFilters) return filters;

    console.log(filters, configFilters, 'd');

    const filterMap: Record<string, { order: number; visibility: boolean }> = {};
    configFilters.forEach((f: any) => {
        filterMap[f.id] = { order: f.order, visibility: f.visibility };
    });

    const merged = filters.map((f: any) => {
        const cfg = filterMap[f.key];
        return cfg ? { ...f, visible: cfg?.visibility, order: cfg?.order } : f;
    });

    merged.sort((a, b) => {
        const oa = filterMap[a.key]?.order ?? 9999;
        const ob = filterMap[b.key]?.order ?? 9999;
        return oa - ob;
    });

    console.log(merged, 'merged');
    return merged;
};

export const isEmpty = (v: any) =>
    v == null ||
    (typeof v === 'string' && v.trim() === '') ||
    (Array.isArray(v) && v.length === 0) ||
    (typeof v === 'object' && 'min' in v && 'max' in v && v.min === '' && v.max === '');

export const getEmptyValue = (f: any) => {
    if (f.type === 'number-interval') return { min: '', max: '' };
    if (f.type === 'date-interval') return Array.isArray(f.value) ? [null, null] : null;
    if (f.type === 'multi-select') return [];
    return '';
};
