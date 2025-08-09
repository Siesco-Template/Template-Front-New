import { PermissionSizes } from '@/modules/_settings/settings.contants';
import { useTypographyStore } from '@/modules/_settings/typography/typography.store';

export const useLetterSpacing = () => {
    const difference = 5;
    const percentage = 10;
    const { letterSpacing, setLetterSpacing } = useTypographyStore();

    const letterSpaceMin = Number(PermissionSizes.letterSpacing.min.slice(0, -2)) * percentage + difference;
    const letterSpaceMax = Number(PermissionSizes.letterSpacing.max.slice(0, -2)) * percentage + difference;

    const letterSpacingAsNumber = Number(letterSpacing.slice(0, -2)) * percentage + difference;

    const onChangeLetterSpacing = (changeNum: number[]) => {
        setLetterSpacing(`${(changeNum?.[0] - difference) / percentage}em`);
    };
    return {
        percentage,
        difference,
        letterSpacingAsNumber,
        onChangeLetterSpacing,
        letterSpaceMin,
        letterSpaceMax,
    };
};
