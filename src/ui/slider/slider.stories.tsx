import { Meta, StoryObj } from '@storybook/react';

import S_Slider from '.';

const meta: Meta<typeof S_Slider> = {
    title: 'UI/Slider',
    component: S_Slider,
    tags: ['autodocs'],
    argTypes: {
        defaultValue: {
            // @ts-expect-error
            control: 'array',
            description: 'Slider-in ilkin dəyəri. Array formatında verilir (məs: [30])',
        },
        min: {
            control: 'number',
            description: 'Minimum dəyər (sliderin başlanğıcı)',
        },
        max: {
            control: 'number',
            description: 'Maksimum dəyər (sliderin sonu)',
        },
        step: {
            control: 'number',
            description: 'Slider-in artım mərhələsi (step)',
        },
        disabled: {
            control: 'boolean',
            description: 'Əgər true olarsa, slider deaktiv olur',
        },
        showLabel: {
            control: 'boolean',
            description: 'Label (başlıq) göstərilsinmi',
        },
        label: {
            control: 'text',
            description: 'Slider başlığı (label)',
        },
        showValue: {
            control: 'boolean',
            description: 'Aktiv dəyər göstərilsinmi',
        },
        valuePrefix: {
            control: 'text',
            description: 'Dəyərin önünə əlavə olunan mətn',
        },
        valueSuffix: {
            control: 'text',
            description: 'Dəyərin sonuna əlavə olunan mətn',
        },
        markers: {
            control: 'object',
            description: 'Slider üzərində görünən markerlər və etiketlər. [{ value: 25, label: "25%" }]',
        },
        thumbClassName: {
            control: 'text',
            description: 'Thumb (başlıq) üçün əlavə class adı',
        },
        trackClassName: {
            control: 'text',
            description: 'Track hissəsi üçün əlavə class adı',
        },
        rangeClassName: {
            control: 'text',
            description: 'Aktiv range üçün əlavə class adı',
        },
        markerClassName: {
            control: 'text',
            description: 'Marker etiketi üçün əlavə class adı',
        },
        onChange: {
            action: 'changed',
            description: 'Dəyər dəyişəndə trigger olunan callback (number[] qaytarır)',
        },
    },
    args: {
        defaultValue: [30],
        min: 0,
        max: 100,
        step: 1,
        showLabel: true,
        showValue: true,
        label: 'Label',
        disabled: false,
    },
};

export default meta;

type Story = StoryObj<typeof S_Slider>;

export const Default: Story = {};

export const WithMarkers: Story = {
    args: {
        markers: [
            { value: 0, label: '0%' },
            { value: 25, label: '25%' },
            { value: 50, label: '50%' },
            { value: 75, label: '75%' },
            { value: 100, label: '100%' },
        ],
    },
};
