import { FC, ReactNode, useEffect } from 'react';

import { Slider as ArkSlider, type UseSliderProps, useSlider } from '@ark-ui/react/slider';

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
        min,
        max,
        step,
        disabled,
        'aria-label': ariaLabel,
        onValueChange(details) {
            onChange?.(details.value);
        },
        ...props,
    });

    useEffect(() => {
        if (defaultValue) {
            slider.setValue(defaultValue);
        }
    }, []);

    const formatValue = (val: number[]) => {
        if (val.length === 1) {
            return `${valuePrefix}${val[0]}${valueSuffix}`;
        }
        return val.map((v) => `${valuePrefix}${v}${valueSuffix}`).join(' - ');
    };

    return (
        <ArkSlider.RootProvider className={cls(styles.slider)} value={slider}>
            {showLabel && (
                <div className={styles.labelContainer}>
                    <ArkSlider.Label className={styles.label}>{label}</ArkSlider.Label>
                </div>
            )}

            <ArkSlider.Control className={styles.control}>
                <ArkSlider.Track className={cls(styles.track, trackClassName)}>
                    <ArkSlider.Range className={cls(styles.range, rangeClassName)} />
                </ArkSlider.Track>
                {slider.value.map((_, index) => (
                    <ArkSlider.Thumb key={index} index={index} className={cls(styles.thumb, thumbClassName)}>
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
