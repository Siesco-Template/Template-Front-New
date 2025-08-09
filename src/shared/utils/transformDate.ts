import { Duration } from '@/ui/date-picker/DurationPicker';

export const toIsoPreservingLocal1 = (d: Date) => {
    const utcTs = Date.UTC(
        d.getFullYear(),
        d.getMonth(),
        d.getDate(),
        d.getHours(),
        d.getMinutes(),
        d.getSeconds(),
        d.getMilliseconds()
    );

    return new Date(utcTs).toISOString().slice(0, -5);
};

export const fromCustomStringToISO = (dateStr: string): string => {
    const [day, month, rest] = dateStr.split('.');
    const [year, time] = rest.split(' ');

    const date = new Date(`${year}-${month}-${day}T${time}`);
    return date.toISOString();
};

export const toIsoPreservingLocal = (d: Date) => {
    const pad = (n: number) => n.toString().padStart(2, '0');

    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    const seconds = pad(d.getSeconds());

    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
};

export const formatOnlyDate = (d: Date) => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    return `${day}.${month}.${year}`;
};

export const toIsoPreservingLocalWithoutSecond = (d: Date) => {
    const pad = (n: number) => n.toString().padStart(2, '0');

    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    const seconds = pad(d.getSeconds());

    return `${day}.${month}.${year} ${hours}:${minutes}`;
};

export const toIsoPreservingLocal3 = (date: Date | undefined): string | undefined => {
    if (!date) {
        return undefined;
    }
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
};

export const parseDurationFromDateTime = (dateStr?: string): Duration => {
    const date = dateStr ? new Date(dateStr) : new Date();
    return {
        hours: date.getHours(),
        minutes: date.getMinutes(),
    };
};
