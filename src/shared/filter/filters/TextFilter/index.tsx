import React from 'react';

import { SearhchIcon } from '../../shared/icons';
import BaseInput from './Input/Input';

interface TextFilterProps {
    label?: string | any;
    value?: string | any;
    onChange?: (value: string) => void;
    placeholder: string | any;
    readOnly?: boolean;
    compact?: boolean;
}

const TextFilter: React.FC<TextFilterProps> = ({ label, value, onChange, placeholder, readOnly = false, compact }) => {
    return (
        <BaseInput
            label={label}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            readOnly={readOnly}
            compact={compact}
            rightIcon={<SearhchIcon color="#9E9E9E" width={16} height={16} />}
        />
    );
};

export default TextFilter;
