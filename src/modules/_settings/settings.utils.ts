import { NavigationItem } from './settings.contants';

type PersonalizationItem = {
    id: string;
    label: string;
    visible: boolean;
    order: number;
    href?: string;
    children?: PersonalizationItem[];
};

export function convertPersonalizationToNavigation(data?: PersonalizationItem[]): NavigationItem[] {
    if (!Array.isArray(data)) return [];

    return data
        .sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0))
        .map((item) => ({
            id: item.id,
            title: item.label,
            href: item.href || '',
            show: item.visible,
            subLinks:
                item.children && Array.isArray(item.children) && item.children.length > 0
                    ? item.children
                          ?.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                          .map((child) => ({
                              id: child.id,
                              title: child.label,
                              href: child.href || '',
                              show: child.visible,
                              roles: [],
                              permissionKey: [],
                          }))
                    : undefined,
            roles: [],
            permissionKey: [],
        }));
}

export function getPersonalizationDiff(current: NavigationItem[], initial: NavigationItem[]): Record<string, any> {
    const diff: Record<string, any> = {}; // Fərqlər

    // İki menyu muq
    const compare = (curr: NavigationItem[], init: NavigationItem[], path: string) => {
        const length = Math.max(curr.length, init.length); // İkisinə görə maksimum uzunluq

        for (let i = 0; i < length; i++) {
            const item = curr[i]; // Hazırkı konfiqurasiya
            const initItem = init[i]; // İlkin konfiqurasiya
            const basePath = `${path}[${i}]`; //  extraConfig.personalizationMenu[0])

            if (!item || !initItem) continue; // Hər iki obyekt varsa müqayisə edək

            const fieldsToCompare: [keyof NavigationItem, string][] = [
                ['show', 'visible'], // show → visible
                ['title', 'label'], // title → label
            ];

            for (const [itemKey, configKey] of fieldsToCompare) {
                const currentVal = item[itemKey]; // Hazırkı dəyər
                const initialVal = initItem[itemKey]; // İlkin dəyər

                if (currentVal !== initialVal) {
                    // Əgər dəyişiklik varsa diff obyektinə əlavə et
                    diff[`${basePath}.${configKey}`] = currentVal;
                }
            }

            // Əgər alt menyular varsa, rekursiv müqayisə et
            if ((item.subLinks?.length || 0) > 0 || (initItem.subLinks?.length || 0) > 0) {
                compare(item.subLinks || [], initItem.subLinks || [], `${basePath}.children`);
            }
        }
    };

    compare(current, initial, 'extraConfig.personalizationMenu');
    return diff; // Tapılan fərqləri qaytar
}
