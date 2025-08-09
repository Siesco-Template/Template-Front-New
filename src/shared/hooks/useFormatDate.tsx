export default function formatDate(dateString: string | Date, format: string = 'default') {
    const date = new Date(dateString);
    const now = new Date();
    const dateUTC = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    const nowUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

    const weekdays = ['Bazar', 'Bazar ertəsi', 'Çərşənbə axşamı', 'Çərşənbə', 'Cümə axşamı', 'Cümə', 'Şənbə'];
    const months = [
        'Yanvar',
        'Fevral',
        'Mart',
        'Aprel',
        'May',
        'İyun',
        'İyul',
        'Avqust',
        'Sentyabr',
        'Oktyabr',
        'Noyabr',
        'Dekabr',
    ];

    const weekday = weekdays[date.getUTCDay()];
    const day = date.getUTCDate();
    const month = months[date.getUTCMonth()];
    const year = date.getUTCFullYear();

    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');

    const diffMs = nowUTC.getTime() - dateUTC.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return `Bugün, ${hours}:${minutes}`;
    } else if (diffDays === 1) {
        return `Dünən, ${hours}:${minutes}`;
    } else if (diffDays > 1 && diffDays < 7) {
        return `${diffDays} gün əvvəl`;
    }
    switch (format) {
        case 'detailed':
            return `${weekday}, ${day} ${month} ${year}, ${hours}:${minutes}`;
        case 'short':
            return `${day} ${month}`;
        case 'onlyDate':
            return `${day} ${month} ${year}`;
        default:
            return `${day} ${month} ${year}`;
    }
}
