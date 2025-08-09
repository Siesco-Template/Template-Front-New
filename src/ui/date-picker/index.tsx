import { useEffect, useState } from 'react';

import { ChevronLeftIcon, ChevronRight } from 'lucide-react';

import { DatePicker, Portal } from '@ark-ui/react';

import { DatePickerIcon, RemoveIcon } from '@/shared/icons';
import { cls, toIsoPreservingLocal } from '@/shared/utils';
import { toIsoPreservingLocal1, toIsoPreservingLocal3 } from '@/shared/utils/transformDate';

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

function formatAZ(year: number, month: number) {
    return `${AZ_MONTHS[month]} ${year}`;
}

interface CustomDatePickerProps {
    label?: string;
    placeholder?: string;
    onSelectedDate?: (date: string) => void;
    value?: string;
    readonly?: boolean;
    errorText?: string;
}

export const CustomDatePicker = ({
    label = '',
    placeholder = 'Tarixi seçin',
    onSelectedDate,
    value = '',
    readonly = false,
    errorText,
    ...props
}: CustomDatePickerProps) => {
    const [selectedDate, setSelectedDate] = useState<string>(value);

    useEffect(() => {
        setSelectedDate(value);
    }, [value]);

    const handleDateChange = (date: Date) => {
        const formattedDate = toIsoPreservingLocal1(date);
        setSelectedDate(formattedDate);
        onSelectedDate?.(formattedDate);
    };

    const handleClearDate = () => {
        setSelectedDate('');
        onSelectedDate?.('');
    };

    return (
        <DatePicker.Root className={styles.datePickerRoot} locale="en-GB" readOnly={readonly} {...props}>
            <DatePicker.Label className={styles.label}>{label}</DatePicker.Label>
            <DatePicker.Control className={cls(styles.datePickerControl, errorText && styles.errorControl)}>
                <DatePicker.Input
                    className={styles.datePickerInput}
                    placeholder={placeholder}
                    defaultValue={selectedDate ? new Date(selectedDate).toLocaleDateString('en-GB') : ''}
                    onChange={(e) => {
                        const [day, month, year] = e.target.value.split('/').map(Number);
                        const parsed = new Date(year, month - 1, day);
                        handleDateChange(parsed);
                    }}
                />
                <DatePicker.Trigger className={styles.datePickerTrigger}>
                    <DatePickerIcon />
                </DatePicker.Trigger>
                {selectedDate && (
                    <DatePicker.ClearTrigger className={styles.datePickerClearTrigger} onClick={handleClearDate}>
                        <RemoveIcon />
                    </DatePicker.ClearTrigger>
                )}
            </DatePicker.Control>
            {errorText && <div className={styles.errorText}>{errorText}</div>}
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
                                            {/* <span>
                                                {formatAZ(
                                                    datePicker.visibleRange.start.year,
                                                    datePicker.visibleRange.start.month - 1
                                                )}
                                            </span> */}
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
                                                        {week.map((day, id) => {
                                                            const selectedDateObj = new Date(selectedDate);
                                                            const selected =
                                                                day.year === selectedDateObj.getFullYear() &&
                                                                day.month === selectedDateObj.getMonth() + 1 &&
                                                                day.day === selectedDateObj.getDate();

                                                            return (
                                                                <DatePicker.TableCell
                                                                    key={id}
                                                                    value={day}
                                                                    className={cls(
                                                                        styles.datePickerTableCell,
                                                                        styles.selectedCell
                                                                    )}
                                                                    aria-selected={selected}
                                                                >
                                                                    <DatePicker.TableCellTrigger
                                                                        className={styles.datePickerTableCellTrigger}
                                                                        onClick={() =>
                                                                            handleDateChange(
                                                                                new Date(
                                                                                    day.year,
                                                                                    day.month - 1,
                                                                                    day.day
                                                                                )
                                                                            )
                                                                        }
                                                                    >
                                                                        {day.day}
                                                                    </DatePicker.TableCellTrigger>
                                                                </DatePicker.TableCell>
                                                            );
                                                        })}
                                                    </DatePicker.TableRow>
                                                ))}
                                            </DatePicker.TableBody>
                                        </DatePicker.Table>
                                    </>
                                )}
                            </DatePicker.Context>
                        </DatePicker.View>
                        <DatePicker.View view="month">
                            <DatePicker.Context>
                                {(datePicker) => (
                                    <>
                                        <DatePicker.ViewControl className={styles.datePickerViewControl}>
                                            <DatePicker.PrevTrigger className={styles.datePickerPrevTrigger}>
                                                Prev
                                            </DatePicker.PrevTrigger>
                                            <DatePicker.ViewTrigger>
                                                <DatePicker.RangeText />
                                            </DatePicker.ViewTrigger>
                                            <DatePicker.NextTrigger className={styles.datePickerNextTrigger}>
                                                Next
                                            </DatePicker.NextTrigger>
                                        </DatePicker.ViewControl>
                                        <DatePicker.Table className={styles.datePickerTable}>
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
                                        <DatePicker.ViewControl className={styles.datePickerViewControl}>
                                            <DatePicker.PrevTrigger className={styles.datePickerPrevTrigger}>
                                                Prev
                                            </DatePicker.PrevTrigger>
                                            <DatePicker.ViewTrigger>
                                                <DatePicker.RangeText />
                                            </DatePicker.ViewTrigger>
                                            <DatePicker.NextTrigger className={styles.datePickerNextTrigger}>
                                                Next
                                            </DatePicker.NextTrigger>
                                        </DatePicker.ViewControl>
                                        <DatePicker.Table className={styles.datePickerTable}>
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
