import { CustomProvider, DatePicker } from 'rsuite';
import { DatePickerProps } from 'rsuite';
import 'rsuite/DatePicker/styles/index.css';

import formatPickerLang from './locales/az_AZ';

type CustomDatePickerProps = Omit<DatePickerProps, 'as'>;

export default function CustomDatePicker(props: CustomDatePickerProps) {
    return (
        <CustomProvider locale={formatPickerLang()}>
            <DatePicker {...props} />
        </CustomProvider>
    );
}
