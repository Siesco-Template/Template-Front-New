import enGB from 'rsuite/locales/en_GB';
import ruRU from 'rsuite/locales/ru_RU';

import Cookies from 'universal-cookie';

import azDateLocale from './azDateLocale';

type LanguageCode = 'az' | 'en' | 'ru';

const DateTimeFormats = {
    sunday: 'Bz',
    monday: 'B.e',
    tuesday: 'Ç.a',
    wednesday: 'Ç',
    thursday: 'C.a',
    friday: 'C',
    saturday: 'Ş',
    ok: 'OK',
    today: 'Bugün',
    yesterday: 'Dünən',
    last7Days: 'Son 7 gün',
    now: 'İndi',
    hours: 'Saat',
    minutes: 'Dəqiqə',
    seconds: 'Saniyə',
    formattedMonthPattern: 'MMM yyyy',
    formattedDayPattern: 'dd MMM yyyy',
    shortDateFormat: 'dd.MM.yyyy',
    shortTimeFormat: 'HH:mm',
    dateLocale: azDateLocale,
};

const azAZ = {
    code: 'az-AZ',
    DateTimeFormats,
    Calendar: DateTimeFormats,
    DatePicker: DateTimeFormats,
    DateRangePicker: DateTimeFormats,
};

const cookies = new Cookies();
const language = (cookies.get('lang') as LanguageCode) || 'az';

const langData = {
    az: azAZ,
    en: enGB,
    ru: ruRU,
};

export default function formatPickerLang() {
    return langData[language];
}
