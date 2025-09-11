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
