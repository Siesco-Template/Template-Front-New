import { DatePicker, DateValue, type DatePickerRootProps } from '@ark-ui/react';
import styles from './DateRangePicker.module.css';
import { DayView } from './day-view';

const AZ_MONTHS = [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun',
    'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr',
];

function formatAZ(year: number, month: number) {
    return `${AZ_MONTHS[month]}`;
}

interface Props extends Omit<DatePickerRootProps, 'value' | 'onValueChange' | 'onChange'> {
    value?: DateValue[];
    onChange: (value: DateValue[]) => void;
    // disabledDates?: Date[]; // specific dates to block
    // disablePastDates?: boolean; // block any date before today
    // readOnly?: boolean; // disable entire picker
    // visibleInputs?: boolean;
}

export const DateRangePicker = ({
    value,
    onChange,
    ...rest
}: Props) => {
    return (
        <DatePicker.Root
            className={styles.wrapper}
            open
            locale="en-GB"
            startOfWeek={1}
            selectionMode="range"
            numOfMonths={1}
            value={value}
            onValueChange={({ value: newRange }) => onChange(newRange)}
            {...rest}
        >
            <DatePicker.Content>
                <DatePicker.Context>
                    {({ visibleRange }) => {
                        const start = visibleRange?.start;

                        if (!start) {
                            return null;
                        }

                        return (
                            <>
                                <div className={styles.navGroup}>
                                    {/* <DatePicker.PrevTrigger className={styles.navButton}>
                                        <ChevronLeftIcon />
                                    </DatePicker.PrevTrigger> */}
                                    <span>{formatAZ(start.year, start.month - 1)}</span>
                                    {/* <DatePicker.NextTrigger className={styles.navButton}>
                                        <ChevronRightIcon />
                                    </DatePicker.NextTrigger> */}
                                </div>
                                <DayView
                                    monthOffset={0}
                                />
                            </>
                        );
                    }}
                </DatePicker.Context>
            </DatePicker.Content>
        </DatePicker.Root>
    );
};