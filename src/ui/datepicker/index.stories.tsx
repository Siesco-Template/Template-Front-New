import type { Meta, StoryObj } from '@storybook/react';

import CustomDatePicker from './date-picker';
import CustomDateRangePicker from './date-range-picker';

// ========================
// Centered Decorator only for Canvas
// ========================
const CanvasCenterDecorator = (StoryFn: any) => (
    <div style={{width:400}}>
        <StoryFn />
    </div>
);

const meta: Meta = {
    title: 'UI/DatePicker',
    tags: ['autodocs'],
    parameters: {
        layout: 'padded', // Docs görünüşü üçün padding
    },
};

export default meta;

// ========================
// Shared Controls
// ========================
const commonArgTypes = {
    value: {
        control: 'date',
        description: 'Seçilmiş tarix',
    },
    error: {
        control: 'text',
        description: 'Error mesajı və ya false',
    },
    label: {
        control: 'text',
        description: 'Üst başlıq label',
    },
    appearance: {
        control: 'select',
        options: ['default', 'subtle'],
        description: 'Input görünüşü (bordered ya da flat)',
    },
    cleanable: {
        control: 'boolean',
        description: 'Seçilmiş dəyərin təmizlənə bilməsi',
    },
    block: {
        control: 'boolean',
        description: 'Tam genişlikdə göstərmək üçün',
    },
    size: {
        control: 'select',
        options: ['xs', 'sm', 'md', 'lg'],
        description: 'Input ölçüsü',
    },
    editable: {
        control: 'boolean',
        description: 'Tarixi inputa əl ilə daxil etmək olsunmu',
    },
    showMeridiem: {
        control: 'boolean',
        description: 'Saat seçimində AM/PM göstərilsin',
    },
    oneTap: {
        control: 'boolean',
        description: 'Bir kliklə tarix seçimi (OK button olmur)',
    },
    placement: {
        control: 'select',
        options: [
            'bottomStart',
            'bottomEnd',
            'topStart',
            'topEnd',
            'leftStart',
            'leftEnd',
            'rightStart',
            'rightEnd',
            'auto',
        ],
        description: 'Dropdown harada açılsın',
    },
};

// ========================
// 🟦 Single DatePicker
// ========================
export const SingleDatePicker: StoryObj<typeof CustomDatePicker> = {
    render: (args) => <CustomDatePicker {...args} />,
    args: {
        label: 'Doğum tarixi',
        placeholder: 'Tarix seçin',
        error: false,
        format: 'dd.MM.yyyy',
        oneTap: true,
        placement: 'auto',
        appearance: 'default',
        cleanable: true,
        block: false,
        size: 'md',
        editable: true,
        showMeridiem: false,
    },
    // @ts-expect-error
    argTypes: commonArgTypes,
    decorators: [CanvasCenterDecorator],
};

// ========================
// 🟩 DateRangePicker
// ========================
export const RangeDatePicker: StoryObj<typeof CustomDateRangePicker> = {
    render: (args) => <CustomDateRangePicker {...args} />,
    args: {
        label: 'Tarix intervalı',
        placeholder: 'Interval seçin',
        error: false,
        format: 'dd.MM.yyyy',
        oneTap: true,
        placement: 'auto',
        appearance: 'default',
        cleanable: true,
        block: false,
        size: 'md',
        editable: true,
        showMeridiem: false,
    },
    // @ts-expect-error
    argTypes: {
        ...commonArgTypes,
        value: {
            control: 'object',
            description: 'Seçilmiş tarix intervalı [start, end]',
        },
    },
    decorators: [CanvasCenterDecorator],
};
