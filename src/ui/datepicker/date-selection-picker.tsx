import { InputGroup } from 'rsuite';
import CustomProvider from 'rsuite/CustomProvider';
import DatePicker, { DatePickerProps } from 'rsuite/DatePicker';
import 'rsuite/DatePicker/styles/index.css';

import formatPickerLang from './locales/az_AZ';
import styles from './style.module.css';

type CustomDateSelectionProps = {
    label?: string;
    value?: [Date | null, Date | null];
    onChange?: (val: [Date | null, Date | null]) => void;
    error?: string | false;
    placement: string;
    format: string;
    oneTap: boolean;
};

export default function CustomDateSelection({
    label,
    value,
    onChange,
    error,
    placement,
    format,
    oneTap = false,
}: CustomDateSelectionProps) {
    const [from, to] = value || [null, null];

    const handleFromChange = (val: Date | null) => {
        onChange?.([val, to]);
    };

    const handleToChange = (val: Date | null) => {
        onChange?.([from, val]);
    };

    return (
        <div className={styles.wrapper}>
            {label && <label className={styles.label}>{label}</label>}
            <CustomProvider locale={formatPickerLang()}>
                <InputGroup style={{ width: '100%' }}>
                    <DatePicker
                        format={format}
                        appearance="subtle"
                        style={{
                            flex: 1,
                            ...(error && typeof error === 'string' ? { borderColor: 'var(--color-red-400)' } : {}),
                        }}
                        value={from}
                        onChange={handleFromChange}
                        menuClassName={styles.customMenu}
                        // @ts-expect-error
                        placement={placement}
                        placeholder="Başlanğıc"
                        oneTap={oneTap}
                    />
                    <InputGroup.Addon style={{ padding: '0 2px', backgroundColor: 'var(--background-primary, #fff)' }}>
                        →
                    </InputGroup.Addon>
                    <DatePicker
                        format={format}
                        appearance="subtle"
                        style={{
                            flex: 1,
                            ...(error && typeof error === 'string' ? { borderColor: 'var(--color-red-400)' } : {}),
                        }}
                        value={to}
                        onChange={handleToChange}
                        menuClassName={styles.customMenu}
                        // @ts-expect-error
                        placement={placement}
                        placeholder="Son"
                        oneTap={oneTap}
                    />
                </InputGroup>
            </CustomProvider>
            {error && <span className={styles.errorDescription}>{error}</span>}
        </div>
    );
}
