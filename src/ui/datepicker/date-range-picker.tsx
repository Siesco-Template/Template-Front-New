import { CustomProvider, DateRangePicker } from 'rsuite';
import type { DateRangePickerProps } from 'rsuite';
import 'rsuite/DateRangePicker/styles/index.css';

import formatPickerLang from './locales/az_AZ';

type CustomDateRangePickerProps = Omit<DateRangePickerProps, 'as'>;

export default function CustomDateRangePicker(props: CustomDateRangePickerProps) {
    return (
        <CustomProvider locale={formatPickerLang()}>
            <DateRangePicker {...props} />
        </CustomProvider>
    );
}
