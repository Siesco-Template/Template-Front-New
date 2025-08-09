import { FC, ReactNode, useEffect, useState } from 'react';

import { Slider as ArkSlider, useSlider, type UseSliderProps } from '@ark-ui/react';

import { cls } from '@/shared/utils';

import styles from './slider.module.css';

interface SliderProps extends Omit<UseSliderProps, 'children'> {
    defaultValue?: number[];
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    thumbClassName?: string;
    trackClassName?: string;
    rangeClassName?: string;
    size?: '10' | '15' | '20' | '30';
    color?: 'primary' | 'secondary' | 'red' | 'green';
    onChange?: (value: number[]) => void;
    'aria-label'?: string[];
    showLabel?: boolean;
    label?: ReactNode;
    showValue?: boolean;
    valuePrefix?: string;
    valueSuffix?: string;
    markers?: Array<{ value: number; label: string }>;
    markerClassName?: string;
}
const initialValue = [50];

const S_Slider: FC<SliderProps> = ({
    defaultValue,
    min = 0,
    max = 100,
    step = 1,
    disabled = false,
    thumbClassName = '',
    trackClassName = '',
    rangeClassName = '',
    size = '20',
    color = 'primary',
    onChange,
    'aria-label': ariaLabel,
    showLabel = false,
    label,
    showValue = false,
    valuePrefix = '',
    valueSuffix = '',
    markers = [],
    markerClassName = '',
    ...props
}) => {
    const slider = useSlider({
        defaultValue: defaultValue || initialValue,
        min, max,
        step,
        disabled,
        "aria-label": ariaLabel,
        onValueChange(details) {
            onChange?.(details.value);
        },
        ...props
    })

    useEffect(() => {
        if (defaultValue) {
            slider.setValue(defaultValue)
        }
    }, []);

    // Format the value for display
    const formatValue = (val: number[]) => {
        if (val.length === 1) {
            return `${valuePrefix}${val[0]}${valueSuffix}`;
        }
        return val.map((v) => `${valuePrefix}${v}${valueSuffix}`).join(' - ');
    };

    return (
        <ArkSlider.RootProvider
            className={cls(styles.slider, styles[`size-${size}`])}
            value={slider}
        >
            {showLabel && (
                <div className={styles.labelContainer}>
                    <ArkSlider.Label className={styles.label}>{label}</ArkSlider.Label>
                    {showValue && (
                        <ArkSlider.ValueText className={styles.valueText}>{formatValue(slider.value)}</ArkSlider.ValueText>
                    )}
                </div>
            )}

            <ArkSlider.Control className={styles.control}>
                <ArkSlider.Track className={cls(styles.track, styles[`track-${color}`], trackClassName)}>
                    <ArkSlider.Range className={cls(styles.range, styles[`range-${color}`], rangeClassName)} />
                </ArkSlider.Track>
                {slider.value.map((_, index) => (
                    <ArkSlider.Thumb
                        key={index}
                        index={index}
                        className={cls(
                            styles.thumb,
                            styles[`thumb-${color}`],
                            disabled && styles['thumb-disabled'],
                            thumbClassName
                        )}
                    >
                        <ArkSlider.HiddenInput />
                    </ArkSlider.Thumb>
                ))}
            </ArkSlider.Control>

            {markers.length > 0 && (
                <ArkSlider.MarkerGroup radioGroup="marker-group">
                    {markers.map((marker, index) => (
                        <ArkSlider.Marker
                            key={index}
                            value={marker.value}
                            className={cls(styles.marker, markerClassName)}
                        >
                            {marker.label}
                        </ArkSlider.Marker>
                    ))}
                </ArkSlider.MarkerGroup>
            )}
        </ArkSlider.RootProvider>
    );
};

export default S_Slider;
