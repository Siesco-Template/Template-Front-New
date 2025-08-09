type ClassValue =
    | string
    | number
    | boolean
    | null
    | undefined
    | ClassValue[]
    | Record<string, boolean | string | number>;

export default function cls(...args: ClassValue[]): string {
    const flatten = (arr: ClassValue[]): (string | number | boolean | Record<string, boolean | string | number>)[] =>
        arr.reduce<(string | number | boolean | Record<string, boolean | string | number>)[]>((acc, val) => {
            if (val === null || val === undefined) return acc;
            return acc.concat(Array.isArray(val) ? flatten(val) : val);
        }, []);

    return flatten(args)
        .filter(Boolean)
        .map((arg) => {
            if (typeof arg === 'string' || typeof arg === 'number') {
                return arg;
            }
            if (typeof arg === 'object' && arg !== null) {
                return Object.entries(arg)
                    .filter(([, value]) => Boolean(value))
                    .map(([key]) => key)
                    .join(' ');
            }
            return '';
        })
        .filter(Boolean)
        .join(' ');
}
