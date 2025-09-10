import type { Meta, StoryObj } from '@storybook/react';

import CustomDatePicker from './date-picker';
import CustomDateRangePicker from './date-range-picker';

const CanvasCenterDecorator = (StoryFn: any) => (
    <div style={{ width: 400 }}>
        <StoryFn />
    </div>
);

const meta: Meta = {
    title: 'UI/DatePicker',
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
    },
};

export default meta;

const commonArgTypes = {
    value: {
        control: 'date',
    },
    error: {
        control: 'text',
    },
    label: {
        control: 'text',
    },
    appearance: {
        control: 'select',
        options: ['default', 'subtle'],
    },
    cleanable: {
        control: 'boolean',
    },
    block: {
        control: 'boolean',
    },
    size: {
        control: 'select',
        options: ['xs', 'sm', 'md', 'lg'],
    },
    editable: {
        control: 'boolean',
    },
    showMeridiem: {
        control: 'boolean',
    },
    oneTap: {
        control: 'boolean',
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
    },
    format: {
        control: 'select',
        options: ['dd/MM/yyyy', 'MM/yy/yyyy', 'dd.MM.yyyy', 'MM.dd.yyyy', 'dd-MM-yyyy', 'MM-dd-yyyy'],
    },
};

export const SingleDatePicker: StoryObj<typeof CustomDatePicker> = {
    render: (args) => <CustomDatePicker {...args} />,
    args: {
        label: 'Doğum tarixi',
        placeholder: 'Tarix seçin',
        error: false,
        // format: 'dd.MM.yyyy',
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

export const RangeDatePicker: StoryObj<typeof CustomDateRangePicker> = {
    render: (args) => <CustomDateRangePicker {...args} />,
    args: {
        label: 'Tarix intervalı',
        placeholder: 'Interval seçin',
        error: false,
        // format: 'dd.MM.yyyy',
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
        },
    },
    decorators: [CanvasCenterDecorator],
};
