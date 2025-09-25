function rgbToHex(rgb: string): string {
    const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!match) return rgb;
    const [_, r, g, b] = match;
    return (
        '#' +
        [r, g, b]
            .map((x) => {
                const hex = parseInt(x).toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            })
            .join('')
    );
}

export function resolveCssVariable(color: string): string {
    if (!color) return '#D9D9D9';
    if (color.startsWith('#') || color.startsWith('rgb')) return color;

    if (color.startsWith('--')) {
        const computed = getComputedStyle(document.documentElement).getPropertyValue(color);
        if (!computed) return color;
        return rgbToHex(computed.trim());
    }

    return color;
}
