import { NavigationItem } from './settings.contants';

type PersonalizationItem = {
    id: string;
    title: string;
    show: boolean;
    href?: string;
    children?: PersonalizationItem[];
};

export function convertPersonalizationToNavigation(data?: PersonalizationItem[]): NavigationItem[] {
    if (!Array.isArray(data)) return [];

    return data.map((item) => ({
        id: item.id,
        title: item.title,
        href: item.href || '',
        show: item.show,
        subLinks:
            item.children && Array.isArray(item.children) && item.children.length > 0
                ? item.children.map((child) => ({
                      id: child.id,
                      title: child.title,
                      href: child.href || '',
                      show: child.show,
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

    current.forEach((currentItem, index) => {
        const initialItem = initial[index];

        if (!currentItem) return;

        if (initialItem?.title !== currentItem.title) {
            diff[`extraConfig.personalizationMenu[${index}].title`] = currentItem.title;
        }

        if (initialItem?.show !== currentItem.show) {
            diff[`extraConfig.personalizationMenu[${index}].show`] = currentItem.show;
        }

        if (initialItem?.href !== currentItem.href) {
            diff[`extraConfig.personalizationMenu[${index}].href`] = currentItem.href;
        }

        if (initialItem?.id !== currentItem.id) {
            diff[`extraConfig.personalizationMenu[${index}].id`] = currentItem.id;
        }

        if ((initialItem?.subLinks?.length || 0) > 0 || (currentItem?.subLinks?.length || 0) > 0) {
            const childDiff = getPersonalizationDiff(currentItem?.subLinks || [], initialItem?.subLinks || []);
            Object.keys(childDiff).forEach((key) => {
                const newKey = key.replace(
                    'extraConfig.personalizationMenu',
                    `extraConfig.personalizationMenu[${index}].children`
                );
                diff[newKey] = childDiff[key];
            });
        }

        if (!currentItem.subLinks?.length && initialItem?.subLinks?.length) {
            diff[`extraConfig.personalizationMenu[${index}].children`] = [];

            initialItem.subLinks?.forEach((subItem, subIndex) => {
                diff[`extraConfig.personalizationMenu[${index}].children[${subIndex}].title`] = null;
                diff[`extraConfig.personalizationMenu[${index}].children[${subIndex}].show`] = null;
                diff[`extraConfig.personalizationMenu[${index}].children[${subIndex}].href`] = null;
                diff[`extraConfig.personalizationMenu[${index}].children[${subIndex}].id`] = null;
            });
        }
    });

    return diff;
}
