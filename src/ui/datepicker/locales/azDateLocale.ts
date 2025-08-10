const azDateLocale = {
    localize: {
        month: (n: number, _options?: any) =>
            ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'İyn', 'İyl', 'Avq', 'Sen', 'Okt', 'Noy', 'Dek'][n],
        day: (n: number, _options?: any) => ['Bz', 'B.E', 'Ç.A', 'Ç', 'C.A', 'C', 'Ş'][n],
    },
    formatLong: {
        date: () => 'dd.MM.yyyy',
        time: () => 'HH:mm',
        dateTime: () => 'dd.MM.yyyy HH:mm',
    },
};

export default azDateLocale;
