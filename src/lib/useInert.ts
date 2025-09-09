export const inertProps = (isInert: boolean) =>
    isInert ? ({ inert: '', 'aria-hidden': true, style: { pointerEvents: 'none' } } as any) : {};
