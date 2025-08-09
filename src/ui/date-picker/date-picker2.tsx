import { ChevronLeftIcon, ChevronRight } from 'lucide-react';

import { DatePicker, Portal } from '@ark-ui/react';
import { DateValue, parseDate } from '@internationalized/date';

import { DatePickerIcon, RemoveIcon } from '@/shared/icons';
import { cls } from '@/shared/utils';
import { toIsoPreservingLocal3 } from '@/shared/utils/transformDate';

import styles from './date-picker.module.css';

const azWeekDays = ['B.e', 'Ç.a', 'Ç', 'C.a', 'C', 'Ş', 'B'];
const AZ_MONTHS = [
    'Yanvar',
    'Fevral',
    'Mart',
    'Aprel',
    'May',
    'Iyun',
    'Iyul',
    'Avqust',
    'Sentyabr',
    'Oktyabr',
    'Noyabr',
    'Dekabr',
];

interface CustomDatePickerProps {
    label?: string;
    placeholder?: string;
    onSelectedDate?: (date: string) => void;
    value?: string;
    readonly?: boolean;
}

export const CustomDatePicker2 = ({
    label = '',
    placeholder = 'Tarixi seçin',
    onSelectedDate,
    value = '',
    readonly = false,
    ...props
}: CustomDatePickerProps) => {
    const datePickerValue = value ? [parseDate(value)] : undefined;

    const handleDateChange = (dates: DateValue[] | undefined) => {
        if (dates && dates.length > 0 && dates[0]) {
            const date = dates[0];
            const nativeDate = new Date(date.year, date.month - 1, date.day);
            const formattedDate = toIsoPreservingLocal3(nativeDate);
            if (formattedDate) {
                onSelectedDate?.(formattedDate);
            } else {
                onSelectedDate?.('');
            }
        } else {
            onSelectedDate?.('');
        }
    };

    const handleClearDate = () => {
        onSelectedDate?.('');
    };

    const displayValue = value ? new Date(value).toLocaleDateString('en-GB') : '';

    return (
        <DatePicker.Root
            className={styles.datePickerRoot}
            locale="en-GB"
            readOnly={readonly}
            value={datePickerValue}
            onValueChange={(details) => handleDateChange(details.value)}
            selectionMode="single"
            {...props}
        >
            <DatePicker.Label className={styles.label}>{label}</DatePicker.Label>
            <DatePicker.Control className={styles.datePickerControl}>
                <DatePicker.Input
                    className={styles.datePickerInput}
                    placeholder={placeholder}
                    value={displayValue}
                    onChange={() => {}}
                />
                <DatePicker.Trigger className={styles.datePickerTrigger}>
                    <DatePickerIcon />
                </DatePicker.Trigger>
                {value && (
                    <DatePicker.ClearTrigger className={styles.datePickerClearTrigger} onClick={handleClearDate}>
                        <RemoveIcon />
                    </DatePicker.ClearTrigger>
                )}
            </DatePicker.Control>
            <Portal>
                <DatePicker.Positioner>
                    <DatePicker.Content className={styles.datePickerContent}>
                        <DatePicker.View view="day">
                            <DatePicker.Context>
                                {(datePicker) => (
                                    <>
                                        <DatePicker.ViewControl className={styles.datePickerViewControl}>
                                            <DatePicker.PrevTrigger className={styles.datePickerPrevTrigger}>
                                                <ChevronLeftIcon />
                                            </DatePicker.PrevTrigger>
                                            <DatePicker.ViewTrigger>
                                                <DatePicker.RangeText />
                                            </DatePicker.ViewTrigger>
                                            <DatePicker.NextTrigger className={styles.datePickerNextTrigger}>
                                                <ChevronRight />
                                            </DatePicker.NextTrigger>
                                        </DatePicker.ViewControl>
                                        <DatePicker.Table className={styles.datePickerTable}>
                                            <DatePicker.TableHead>
                                                <DatePicker.TableRow>
                                                    {azWeekDays.map((weekDay, id) => (
                                                        <DatePicker.TableHeader key={id}>
                                                            {weekDay}
                                                        </DatePicker.TableHeader>
                                                    ))}
                                                </DatePicker.TableRow>
                                            </DatePicker.TableHead>
                                            <DatePicker.TableBody>
                                                {datePicker.weeks.map((week, id) => (
                                                    <DatePicker.TableRow key={id}>
                                                        {week.map((day, id) => (
                                                            <DatePicker.TableCell
                                                                key={id}
                                                                value={day}
                                                                className={cls(
                                                                    styles.datePickerTableCell,
                                                                    datePickerValue &&
                                                                        datePickerValue[0] &&
                                                                        day.toString() === datePickerValue[0].toString()
                                                                        ? styles.selectedCell
                                                                        : ''
                                                                )}
                                                            >
                                                                <DatePicker.TableCellTrigger
                                                                    className={styles.datePickerTableCellTrigger}
                                                                >
                                                                    {day.day}
                                                                </DatePicker.TableCellTrigger>
                                                            </DatePicker.TableCell>
                                                        ))}
                                                    </DatePicker.TableRow>
                                                ))}
                                            </DatePicker.TableBody>
                                        </DatePicker.Table>
                                    </>
                                )}
                            </DatePicker.Context>
                        </DatePicker.View>
                        {/* Month and Year Views remain unchanged */}
                        <DatePicker.View view="month">
                            <DatePicker.Context>
                                {(datePicker) => (
                                    <>
                                        <DatePicker.ViewControl>
                                            <DatePicker.PrevTrigger>Prev</DatePicker.PrevTrigger>
                                            <DatePicker.ViewTrigger>
                                                <DatePicker.RangeText />
                                            </DatePicker.ViewTrigger>
                                            <DatePicker.NextTrigger>Next</DatePicker.NextTrigger>
                                        </DatePicker.ViewControl>
                                        <DatePicker.Table>
                                            <DatePicker.TableBody>
                                                {datePicker
                                                    .getMonthsGrid({ columns: 4, format: 'short' })
                                                    .map((months, id) => (
                                                        <DatePicker.TableRow key={id}>
                                                            {months.map((month, id) => (
                                                                <DatePicker.TableCell key={id} value={month.value}>
                                                                    <DatePicker.TableCellTrigger>
                                                                        {month.label}
                                                                    </DatePicker.TableCellTrigger>
                                                                </DatePicker.TableCell>
                                                            ))}
                                                        </DatePicker.TableRow>
                                                    ))}
                                            </DatePicker.TableBody>
                                        </DatePicker.Table>
                                    </>
                                )}
                            </DatePicker.Context>
                        </DatePicker.View>
                        <DatePicker.View view="year">
                            <DatePicker.Context>
                                {(datePicker) => (
                                    <>
                                        <DatePicker.ViewControl>
                                            <DatePicker.PrevTrigger>Prev</DatePicker.PrevTrigger>
                                            <DatePicker.ViewTrigger>
                                                <DatePicker.RangeText />
                                            </DatePicker.ViewTrigger>
                                            <DatePicker.NextTrigger>Next</DatePicker.NextTrigger>
                                        </DatePicker.ViewControl>
                                        <DatePicker.Table>
                                            <DatePicker.TableBody>
                                                {datePicker.getYearsGrid({ columns: 4 }).map((years, id) => (
                                                    <DatePicker.TableRow key={id}>
                                                        {years.map((year, id) => (
                                                            <DatePicker.TableCell key={id} value={year.value}>
                                                                <DatePicker.TableCellTrigger>
                                                                    {year.label}
                                                                </DatePicker.TableCellTrigger>
                                                            </DatePicker.TableCell>
                                                        ))}
                                                    </DatePicker.TableRow>
                                                ))}
                                            </DatePicker.TableBody>
                                        </DatePicker.Table>
                                    </>
                                )}
                            </DatePicker.Context>
                        </DatePicker.View>
                    </DatePicker.Content>
                </DatePicker.Positioner>
            </Portal>
        </DatePicker.Root>
    );
};
