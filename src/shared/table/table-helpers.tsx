import dayjs from 'dayjs';

export const FILTER_QUERY_URL = 'filterData';
export const statuses = [
    { id: 0, label: 'Ödənilib', type: 'statusUnPaid' },
    { id: 1, label: 'Ödənilməyib', type: 'statusPaid' },
    { id: 2, label: 'Ləğv edilib', type: 'statusCancel' },
] as const;

type Primitive = string | number | boolean | null | undefined;
type FilterValue = Primitive | Primitive[];
type FilterItem = { id: string; value: FilterValue };

type SortFilters = {
    id: string;
    desc: boolean;
};

export enum FilterTypeEnum {
    Like = 3, // `Contains` yerinə
    Equal = 1, // `Exact` yerinə
    RangeNumberOrDate = 11,
}
export type CurrentFilters = {
    filter: FilterItem[];
    skip?: number;
    take?: number;
    sort?: SortFilters[];
} & Record<string, unknown>;

type FiltersDataTypes = 'saleDate' | 'status' | (string & {});

type ProcessField = {
    [key in FiltersDataTypes]?: (value: FilterValue) => FilterValue;
};
type ReturnFilterDataForFetchQuery = {
    skip: number;
    take: number;
    saleDate?: string[];
    totalAmount?: number[];
    sort?: SortFilters[];
};
const initialFilter = {
    filter: [],
    skip: 0,
    take: 20,
    sort: [],
};
export const getFilterDataOnUrl = () => {
    const hash = window.location.hash;
    const queryString = hash.split('?')[1];
    const searchParams = new URLSearchParams(queryString);
    const query = searchParams.get(FILTER_QUERY_URL);
    const filterOnQuery = query ? JSON.parse(query) : initialFilter;

    return {
        filter: filterOnQuery?.filter || [],
        skip: filterOnQuery?.skip || initialFilter.skip,
        take: filterOnQuery?.take || initialFilter.take,
        sort: filterOnQuery?.sort || initialFilter.sort,
    };
};
export const changeFilterDataForFetchQuery = (currentFilters: CurrentFilters): ReturnFilterDataForFetchQuery => {
    const processField: ProcessField = {
        saleDate: (value) => {
            if (Array.isArray(value)) {
                return value.map((date) =>
                    typeof date === 'string' || typeof date === 'number'
                        ? dayjs(date)?.isValid()
                            ? dayjs(date)?.format('YYYY-MM-DDTHH:mm:ss')
                            : ''
                        : ''
                );
            }
            return typeof value === 'string' || typeof value === 'number'
                ? dayjs(value)?.isValid()
                    ? dayjs(value)?.format('YYYY-MM-DDTHH:mm:ss')
                    : ''
                : '';
        },
        status: (value) => {
            const status = statuses.find((s) => s.label === value);
            return status ? status.id : value;
        },
    };
    const filterData = currentFilters.filter.reduce<Record<string, FilterValue>>((acc, { id, value }) => {
        acc[id] = processField[id]?.(value) ?? value;
        return acc;
    }, {});

    return {
        ...filterData,
        skip: currentFilters.skip ?? 0,
        take: currentFilters.take ?? 20,
        sort: currentFilters.sort ?? undefined,
    };
};

export const changeFilterDataForTable = (currentFilters: CurrentFilters) => {
    const processField: ProcessField = {
        //@ts-ignore
        saleDate: (value) => (Array.isArray(value) ? value.map((d) => dayjs(d as string)) : value),
        status: (value) => {
            const status = statuses.find((s) => s.id === value);
            return status ? status.label : value;
        },
    };
    const filterData = currentFilters.filter.map(({ id, value }) => {
        const changedFilterData = processField[id]?.(value) ?? value;
        return { id, value: changedFilterData };
    });
    return {
        filter: filterData,
        skip: currentFilters.skip ?? 0,
        take: currentFilters.take ?? 20,
        sort: currentFilters.sort ?? [],
    };
};

// arqumentdə state vermesez url dan filter datalari goturur ve obyekt kimi duzeldir,
// return elediyi data-ni api ucun servisinde urlParamsa qoymaq kifayetdir

export const filterDataForFetch = (takeParams?: any, filterDatas?: any) => {
    const filterDataOnUrl = filterDatas ?? getFilterDataOnUrl();
    const { skip, take, sort } = changeFilterDataForFetchQuery(filterDataOnUrl);

    const filter = filterDataOnUrl.filter as FilterItem[];

    const filterState =
        filter?.length <= 0
            ? []
            : filter
                  ?.map((filterItem, idx) => {
                      if (!filterItem.id || !filterItem.value) {
                          return null;
                      }
                      const { id, value } = filterItem;
                      // filterlerin hansi type de oldugunu yoxlayir
                      const isFilterTypeRangeOrDate =
                          Array.isArray(value) && value?.length === 2 && typeof value[0] !== 'object';
                      const isFilterTypeExact =
                          typeof value === 'boolean' ||
                          typeof value === 'number' ||
                          (typeof value === 'string' && /^[0-9]+$/.test(value)) || // ⬅️ Əlavə etdik
                          (typeof value === 'string' && /^[0-9a-fA-F-]{36}$/.test(value)); // GUID
                      const isFilterTypeContains = typeof value === 'string' && !/^[0-9]+$/.test(value); // Əgər sadə ədəd deyilsə

                      const isDateString = (val: any) =>
                          typeof val === 'string' && dayjs(val, 'DD.MM.YYYY', true).isValid();

                      // 1. Range tarix filteri (2 tarix varsa arraydə)
                      if (
                          Array.isArray(value) &&
                          value.length === 2 &&
                          typeof value[0] === 'string' &&
                          typeof value[1] === 'string'
                      ) {
                          const [from, to] = value;

                          const isFromValid = isDateString(from);
                          const isToValid = isDateString(to);

                          if (isFromValid && isToValid) {
                              console.log('bura dusdu');
                              return {
                                  id,
                                  type: FilterTypeEnum.RangeNumberOrDate,
                                  value: `${dayjs(from, 'DD.MM.YYYY').format('YYYY-MM-DD')},${dayjs(to, 'DD.MM.YYYY').format('YYYY-MM-DD')}`,
                              };
                          }

                          // ✅ Yalnız from varsa — >=
                          if (isFromValid && !isToValid) {
                              console.log('bura dusdu 2');
                              return {
                                  id,
                                  type: 7,
                                  value: dayjs(from, 'DD.MM.YYYY').format('YYYY-MM-DD'),
                                  operationType: 7, // GreaterThanOrEqual
                              };
                          }

                          // ✅ Yalnız to varsa — <=
                          if (!isFromValid && isToValid) {
                              console.log('bura dusdu 3');
                              return {
                                  id,
                                  type: 8,
                                  value: dayjs(to, 'DD.MM.YYYY').format('YYYY-MM-DD'),
                                  operationType: 8, // LessThanOrEqual
                              };
                          }
                      }

                      // 2. Tək tarix varsa, onu range kimi təyin et (today, today + 1 gün)
                      if (typeof value === 'string' && isDateString(value)) {
                          const start = dayjs(value, 'DD.MM.YYYY');
                          const end = start.add(1, 'day');
                          return {
                              id,
                              type: 11,
                              value: `${start.format('YYYY-MM-DD')},${end.format('YYYY-MM-DD')}`,
                          };
                      }

                      if (
                          typeof value === 'object' &&
                          value !== null &&
                          'min' in value &&
                          'max' in value &&
                          !isNaN(Number(value.min)) &&
                          !isNaN(Number(value.max))
                      ) {
                          return {
                              id,
                              type: FilterTypeEnum.RangeNumberOrDate,
                              value: `${value.min},${value.max}`,
                          };
                      }

                      if (isFilterTypeExact) {
                          return {
                              id,
                              type: FilterTypeEnum.Equal,
                              value,
                          };
                      }

                      if (isFilterTypeContains) {
                          return {
                              id,
                              type: FilterTypeEnum.Like,
                              value,
                          };
                      }
                  })
                  .filter(Boolean);

    const sortField = sort?.[0];
    const sortFields = sortField
        ? {
              sortBy: sortField?.id ?? null,
              sortDirection: sortField ? !sortField.desc : true,
          }
        : {};

    const filterFields = filterState?.length > 0 ? { filter: filterState } : {};
    const filterRequest = {
        ...filterFields,
        skip: skip ?? 0,
        take: takeParams ?? take,
        ...sortFields,
    };
    return filterRequest;
};
