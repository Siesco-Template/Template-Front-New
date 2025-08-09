export type IQueryParams = Record<string, string | number | boolean | undefined | null | (string | number | boolean)[]>;

export default function queryParamsBuilder(params: IQueryParams): string {
    const queryString = Object.entries(params)
        .flatMap(([key, value]) => {
            if (value === undefined || value === null) return [];
            if (Array.isArray(value)) {
                return value.map((v) => `${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`);
            }
            return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
        })
        .join('&');

    return queryString ? `?${queryString}` : '';
}

export function getUserDiffFromConfig(defaultConfig: any, currentConfig: any, parentKey = ''): Record<string, any> {
    // Nəticəni saxlayacaq obyekt
    let result: Record<string, any> = {};

    // currentConfig obyektindəki bütün açarları (sahələri) dövrə salırıq
    for (const key in currentConfig) {
        // Əgər parentKey varsa, tam path düzəldirik. Yoxdursa sadəcə key
        const fullKey = parentKey ? `${parentKey}.${key}` : key;

        //  personalizationMenu skip edilsin
        if (fullKey.startsWith('extraConfig.personalizationMenu')) {
            continue;
        }

        // Cari obyektin və default obyektin dəyərlərini alırıq
        const currentVal = currentConfig[key];
        const defaultVal = defaultConfig?.[key];

        // if (Array.isArray(currentVal)) {
        //     if (JSON.stringify(currentVal) !== JSON.stringify(defaultVal)) {
        //         result[fullKey] = currentVal;
        //     }
        // }
        // Əgər cari dəyər obyekt tipindədirsə (array deyil), rekursiv şəkildə yoxla
        if (currentVal && typeof currentVal === 'object' && !Array.isArray(currentVal)) {
            // Daxili obyektlərin fərqlərini rekursiv olaraq alırıq
            const nestedDiff = getUserDiffFromConfig(defaultVal, currentVal, fullKey);

            // Əldə olunan fərqləri əsas nəticəyə birləşdiririk
            result = { ...result, ...nestedDiff };
        } else {
            // Əgər dəyərlər fərqlidirsə, bu fərqi nəticəyə əlavə et
            if (currentVal !== defaultVal) {
                result[fullKey] = currentVal;
            }
        }
    }

    // Yekun nəticəni geri qaytarırıq
    return result;
}

// iki obyektin (defaultConfig və userConfig) birləşdirilməsi
export function mergeWithEval(defaultConfig: any, userConfig: Record<string, any>) {
    const clone = structuredClone(defaultConfig);

    for (const [key, value] of Object.entries(userConfig)) {
        const parts = key.split('.');

        try {
            // Lazım olan bütün nested obyektləri əvvəlcədən yarat
            let cur = clone;
            for (let i = 0; i < parts.length - 1; i++) {
                const part = parts[i];
                if (!(part in cur) || cur[part] === undefined || cur[part] === null) {
                    cur[part] = {};
                }
                cur = cur[part];
            }

            //  key value ilə əvəzlə (normalize tətbiq etdiəm)
            const normalizedValue =
            typeof value === 'string' ? (value === 'true' ? true : value === 'false' ? false : value) : value;
            // Eval-lə əslində "clone.path.to.key = value" ifadəsini çalışdırırıq
            eval(`clone.${key} = ${JSON.stringify(normalizedValue)}`);
        } catch (e) {
            console.error(`Eval merge error at ${key}:`, e);
        }
    }

    return clone;
}

// setNestedValue(config, 'tables.table1.columns.color', 'red')
// tables.table1.columns.color
export function setNestedValue(obj: any, path: string, value: any) {
    const keys = path.split('.');
    let current = obj;
    keys.forEach((key, index) => {
        if (index === keys.length - 1) {
            current[key] = normalize(value);
        } else {
            if (!current[key] || typeof current[key] !== 'object') {
                current[key] = {};
            }
            current = current[key];
        }
    });
}

// String tipində gələn "true" və "false" dəyərlərini real boolean tipinə çevirir
export function normalize(val: any) {
    if (val === 'true') return true;
    if (val === 'false') return false;
    return val;
}
