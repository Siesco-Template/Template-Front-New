import CustomProvider from 'rsuite/CustomProvider';
import DateRangePicker, { DateRangePickerProps } from 'rsuite/DateRangePicker';
import 'rsuite/DateRangePicker/styles/index.css';

import formatPickerLang from './locales/az_AZ';
import styles from './style.module.css';

type CustomDateRangePickerProps = Omit<DateRangePickerProps, 'as'> & {
    error?: string | false;
};
export default function CustomDateRangePicker(props: CustomDateRangePickerProps) {
    const { error, label, style, ...rest } = props;

    return (
        <div className={styles.wrapper}>
            {label && <label className={styles.label}>{label}</label>}
            <CustomProvider locale={formatPickerLang()}>
                <DateRangePicker
                    {...rest}
                    menuClassName={styles.customMenu}
                    style={{
                        ...(style || {}),
                        ...(error && typeof error === 'string' ? { borderColor: 'var(--color-red-400)' } : {}),
                    }}
                />
            </CustomProvider>
            {error && <span className={styles.errorDescription}>{error}</span>}
        </div>
    );
}
