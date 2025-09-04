export function toCssColor(value: unknown): string | undefined {
    if (value == null) return undefined;

    const s = String(value).trim();
    if (!s) return undefined;

    // Əgər artıq var(...) formasındadırsa, elə olduğu kimi qaytarırıq
    if (s.startsWith('var(')) return s;

    // CSS dəyişənidirsə ( -- ilə başlayır ), var(--...) kimi qaytar
    if (s.startsWith('--')) return `var(${s})`;

    // Digər hallarda dəyəri olduğu kimi qaytar (hex, rgb, hsl, ad rənglər və s.)
    return s;
}
