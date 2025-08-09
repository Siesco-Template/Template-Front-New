// day-view.tsx
import { DatePicker, useDatePickerContext } from '@ark-ui/react';

import styles from './DateRangePicker.module.css';

interface Props {
    monthOffset: number;
    disabledDates?: Date[];
    disablePastDates?: boolean;
    readOnly?: boolean;
}

const azWeekDays = ['B.e', 'Ç.a', 'Ç', 'C.a', 'C', 'Ş', 'B'];

// compare native Date objects just by Y/M/D
function isSameDate(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export const DayView = ({ monthOffset, disabledDates = [], disablePastDates = false, readOnly = false }: Props) => {
    const datePicker = useDatePickerContext();
    const offset = datePicker.getOffset({ months: monthOffset });

    // get today as midnight
    const today = new Date();
    const todayMid = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    // pull out both start and end from the picker value
    const [startValue, endValue] = datePicker.value ?? [null, null];
    const startDate = startValue ? new Date(startValue.year, startValue.month - 1, startValue.day) : null;
    const endDate = endValue ? new Date(endValue.year, endValue.month - 1, endValue.day) : null;

    return (
        <DatePicker.Table className={styles.table}>
            <DatePicker.TableHead>
                <DatePicker.TableRow className={styles.weekRow}>
                    {azWeekDays.map((wd, i) => (
                        <DatePicker.TableHeader key={i} className={styles.weekday}>
                            {wd}
                        </DatePicker.TableHeader>
                    ))}
                </DatePicker.TableRow>
            </DatePicker.TableHead>

            <DatePicker.TableBody>
                {offset.weeks.map((week, id) => (
                    <DatePicker.TableRow key={id} className={styles.dayRow}>
                        {week.map((day, idx) => {
                            // this day as native Date
                            const thisDate = new Date(day.year, day.month - 1, day.day);

                            // (1) explicitly blocked
                            const isBlocked = disabledDates.some((d) => isSameDate(d, thisDate));

                            // (2) spans over a blocked day?
                            // only apply while selecting the end (i.e. endValue is null or undefined)
                            let spansBlocked = false;
                            if (startDate && endValue == null && !isBlocked) {
                                if (thisDate > startDate) {
                                    spansBlocked = disabledDates.some((d) => d > startDate && d < thisDate);
                                } else if (thisDate < startDate) {
                                    spansBlocked = disabledDates.some((d) => d < startDate && d > thisDate);
                                }
                            }

                            // (3) block any past days if requested
                            const isPast = disablePastDates && thisDate < todayMid;

                            // final disabled flag
                            const disabled = isPast || isBlocked || spansBlocked || readOnly;

                            return (
                                <DatePicker.TableCell
                                    key={idx}
                                    value={day}
                                    visibleRange={offset.visibleRange}
                                    className={styles.dayCell}
                                    disabled={disabled}
                                    aria-readonly={readOnly ? 'true' : 'false'}
                                    data-past={isPast ? 'true' : 'false'}
                                    data-blocked={isBlocked ? 'true' : 'false'}
                                >
                                    <DatePicker.TableCellTrigger className={styles.trigger}>
                                        {day.day}
                                    </DatePicker.TableCellTrigger>
                                </DatePicker.TableCell>
                            );
                        })}
                    </DatePicker.TableRow>
                ))}
            </DatePicker.TableBody>
        </DatePicker.Table>
    );
};
