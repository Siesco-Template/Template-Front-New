import CustomProvider from 'rsuite/CustomProvider';
import DatePicker, { DatePickerProps } from 'rsuite/DatePicker';
import 'rsuite/DatePicker/styles/index.css';

import formatPickerLang from './locales/az_AZ';
import styles from './style.module.css';

type CustomDatePickerProps = Omit<DatePickerProps, 'as'> & {
    error?: string;
};

export default function CustomDatePicker(props: CustomDatePickerProps) {
    const { error, label, style, ...rest } = props;
    return (
        <div className={styles.wrapper}>
            {label && <label className={styles.label}>{label}</label>}
            <CustomProvider locale={formatPickerLang()}>
                <DatePicker
                    {...rest}
                    menuClassName="z-[100]"
                    style={{
                        ...(style || {}),
                        ...(error ? { borderColor: 'var(--color-red-400)' } : {}),
                    }}
                />
            </CustomProvider>
            {error && <span className={styles.errorDescription}>{error}</span>}
        </div>
    );
}
