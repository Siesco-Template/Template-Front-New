import { Tooltip } from 'antd';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

type Props = {
    value: number | '' | undefined;
    min: number;
    max: number;
    step?: number;
    parseIntMode?: boolean;
    defaultValue?: number;
    className?: string;
    invalidClass?: string;
    shakeClass?: string;
    placeholder?: string;
    onValidChange: (next: number) => void;
    tooltipText?: string;
};

const ValidatedNumberInput: React.FC<Props> = ({
    value,
    min,
    max,
    step = 1,
    parseIntMode = true,
    defaultValue,
    className,
    invalidClass,
    shakeClass,
    placeholder,
    onValidChange,
    tooltipText,
}) => {
    const [internalValue, setInternalValue] = useState(value === undefined ? '' : String(value));
    const [invalid, setInvalid] = useState(false);
    const [shaking, setShaking] = useState(false);
    const [committedValue, setCommittedValue] = useState<number | null>(null); // prevent duplicate updates

    useEffect(() => {
        const val = value === undefined ? '' : String(value);
        if (val !== internalValue) {
            setInternalValue(val);
        }
    }, [value]);

    const errText = tooltipText ?? `Dəyər ${min}–${max} aralığında olmalıdır`;

    const bounce = () => {
        setInvalid(true);
        setShaking(false);
        requestAnimationFrame(() => setShaking(true));
    };

    const parse = (raw: string) => (parseIntMode ? parseInt(raw, 10) : Number(raw));

    const commitValue = (raw: string) => {
        if (raw === '') {
            const fallback = defaultValue ?? min;
            setInternalValue(String(fallback));
            setInvalid(false); 
            setShaking(false); 
            setCommittedValue(fallback);
            onValidChange(fallback);
            return;
        }

        const num = parse(raw);
        const out = Number.isNaN(num) || num < min || num > max;

        if (out) {
            bounce();
            return;
        }

        setInvalid(false);
        setShaking(false);
        setCommittedValue(num);
        onValidChange(num);
    };

    const tryCommitIfValid = (raw: string) => {
        const num = parse(raw);
        const isValid = !Number.isNaN(num) && num >= min && num <= max;

        if (isValid) {
            setInvalid(false);
            setShaking(false);

            if (num !== committedValue) {
                setCommittedValue(num);
                onValidChange(num);
            }
        } else {
            setInvalid(true);
        }
    };

    return (
        <Tooltip open={invalid} title={errText} placement="top">
            <input
                type="number"
                min={min}
                max={max}
                step={step}
                placeholder={placeholder}
                value={internalValue}
                className={clsx(className, invalid && invalidClass, shaking && shakeClass)}
                onChange={(e) => {
                    const raw = e.target.value;
                    setInternalValue(raw);

                    if (raw === '') {
                        setInvalid(false);
                        return;
                    }

                    tryCommitIfValid(raw);
                }}
                onBlur={() => {
                    commitValue(internalValue);
                    setShaking(false);
                }}
                onKeyDown={(e) => {
                    const key = e.key;
                    if (!['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown'].includes(key)) return;

                    e.preventDefault();

                    const cur = parse(internalValue || '0');
                    const stepN = Number(step) || 1;
                    const delta =
                        key === 'PageUp'
                            ? stepN * 10
                            : key === 'PageDown'
                              ? -stepN * 10
                              : key === 'ArrowUp'
                                ? stepN
                                : -stepN;

                    const next = cur + delta;

                    if (next > max || next < min) {
                        bounce();
                    } else {
                        const str = String(next);
                        setInternalValue(str);
                        tryCommitIfValid(str);
                    }
                }}
                onWheel={(e) => {
                    if (document.activeElement !== e.currentTarget) return;
                    const cur = parse(internalValue || '0');
                    const stepN = Number(step) || 1;
                    const delta = e.deltaY < 0 ? stepN : -stepN;
                    const next = cur + delta;

                    if (next > max || next < min) {
                        e.preventDefault();
                        bounce();
                    } else {
                        const str = String(next);
                        setInternalValue(str);
                        tryCommitIfValid(str);
                    }
                }}
                onAnimationEnd={() => setShaking(false)}
            />
        </Tooltip>
    );
};

export default ValidatedNumberInput;
