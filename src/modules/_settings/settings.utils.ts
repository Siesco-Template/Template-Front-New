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
    const diff: Record<string, any> = {};

    const compare = (curr: NavigationItem[], init: NavigationItem[], path: string) => {
        const maxLength = Math.max(curr.length, init.length);

        for (let i = 0; i < maxLength; i++) {
            const currentItem = curr[i];
            const initialItem = init[i];

            if (!currentItem || !initialItem) continue;

            // ID-lər fərqli olarsa sırada dəyişiklik baş verib
            if (currentItem.id !== initialItem.id) {
                // tap curr[] içində initialItem.id-nin indexini (əgər tapılarsa)
                const newIndex = curr.findIndex((it) => it.id === initialItem.id);
                if (newIndex !== -1 && newIndex !== i) {
                    diff[`${path}[${newIndex}].order`] = i;
                }
                // həmçinin, əgər curr[i] → yeni elementdirsə, onun da indexini qeyd et
                const expectedIndex = init.findIndex((it) => it.id === currentItem.id);
                if (expectedIndex !== -1 && expectedIndex !== i) {
                    diff[`${path}[${i}].order`] = expectedIndex;
                }
            }

            const fieldsToCompare: [keyof NavigationItem, string][] = [
                ['show', 'visible'],
                ['title', 'label'],
            ];

            for (const [itemKey, configKey] of fieldsToCompare) {
                if (currentItem[itemKey] !== initialItem[itemKey]) {
                    diff[`${path}[${i}].${configKey}`] = currentItem[itemKey];
                }
            }

            // Rekursiv alt menyulara bax
            if ((currentItem.subLinks?.length || 0) > 0 || (initialItem.subLinks?.length || 0) > 0) {
                compare(currentItem.subLinks || [], initialItem.subLinks || [], `${path}[${i}].children`);
            }
        }
    };

    compare(current, initial, 'extraConfig.personalizationMenu');
    return diff;
}
