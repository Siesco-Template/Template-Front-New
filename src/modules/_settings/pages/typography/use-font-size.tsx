import { PermissionSizes } from '@/modules/_settings/settings.contants';
import { useTypographyStore } from '@/modules/_settings/typography/typography.store';
import { addTypographySizesOnHtmlRoot } from '@/modules/_settings/typography/typography.utils';

export const useFontSize = () => {
    const { fontSize, previousFontSize, saveFontSize, discardFontSize, setFontSize } = useTypographyStore();

    const fontSizeMin = Number(PermissionSizes.fontSize.min.slice(0, -2));
    const fontSizeMax = Number(PermissionSizes.fontSize.max.slice(0, -2));

    const size = Number(fontSize.slice(0, -2));

    const onChangeFontSize = (changeNum: number[]) => {
        setFontSize(`${changeNum}px`);
        addTypographySizesOnHtmlRoot({
            fontSize: `${changeNum}px`,
        });
    };
    return {
        fontSize: size,
        previousFontSize,
        onChangeFontSize,
        fontSizeMin,
        fontSizeMax,
        saveFontSize,
        discardFontSize,
    };
};
