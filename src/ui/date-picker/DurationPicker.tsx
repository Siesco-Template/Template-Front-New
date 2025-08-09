import { FC, useEffect, useRef, useState } from 'react';

import { DirectionDownIcon } from '@/shared/icons';
import { cls } from '@/shared/utils';

import styles from './DurationPicker.module.css';

export interface Duration {
    hours: number;
    minutes: number;
}

interface DurationPickerProps {
    label?: string;
    value: Duration;
    onChange: (newValue: Duration) => void;
    /** maximum hour (default 23) */
    maxHours?: number;
    direction?: 'down' | 'up';
}

export const DurationPicker: FC<DurationPickerProps> = ({
    label,
    value,
    onChange,
    maxHours = 23,
    direction = 'down',
}) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (open && ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', onClick);
        return () => document.removeEventListener('mousedown', onClick);
    }, [open]);

    // generate hours/minutes arrays
    const hours = Array.from({ length: maxHours + 1 }, (_, i) => i);
    const minutes = Array.from({ length: 60 }, (_, i) => i);

    return (
        <div className={styles.wrapper} ref={ref}>
            {label && <div className={styles.label}>{label}</div>}

            <div className={styles.trigger} onClick={() => setOpen((o) => !o)}>
                <div>
                    <span className={styles.timePart}>{String(value.hours).padStart(2, '0')}</span>
                    <span className={styles.colon}>:</span>
                    <span className={styles.timePart}>{String(value.minutes).padStart(2, '0')}</span>
                </div>
                <DirectionDownIcon className={styles.icon} />
            </div>

            {open && (
                <div className={cls(styles.dropdown, direction === 'up' ? styles.dropdownUp : styles.dropdownDown)}>
                    <div className={styles.list}>
                        {hours.map((h) => (
                            <div
                                key={h}
                                className={`${styles.item} ${h === value.hours ? styles.selected : ''}`}
                                onClick={() => onChange({ ...value, hours: h })}
                            >
                                {String(h).padStart(2, '0')}
                            </div>
                        ))}
                    </div>
                    <div className={styles.list}>
                        {minutes.map((m) => (
                            <div
                                key={m}
                                className={`${styles.item} ${m === value.minutes ? styles.selected : ''}`}
                                onClick={() => onChange({ ...value, minutes: m })}
                            >
                                {String(m).padStart(2, '0')}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
