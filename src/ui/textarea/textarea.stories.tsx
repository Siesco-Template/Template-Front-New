import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import S_Textarea, { TextareaPixelSize, TextareaStatus } from '.';

const meta: Meta<typeof S_Textarea> = {
    title: 'UI/Textarea',
    component: S_Textarea,
    tags: ['autodocs'],
    args: {
        label: 'Label',
        placeholder: 'Placeholder',
        description: 'Description line',
        height: 200,
        resize: 'both',
        maxLength: 500,
        showCounter: true,
    },
    argTypes: {
        height: {
            options: [100, 120, 140, 160, 200] as TextareaPixelSize[],
            control: { type: 'inline-radio' },
        },
        status: {
            options: ['default', 'success', 'error'] as TextareaStatus[],
            control: { type: 'inline-radio' },
        },
        details: { control: 'text' },
        description: { control: 'text' },
        errorText: { control: 'text' },
        labelInfo: { control: 'text' },
        fieldInfo: { control: 'text' },
        maxLength: { control: { type: 'number', min: 10, max: 1000, step: 10 } },
        showCounter: { control: 'boolean' },
        rows: { control: { type: 'number', min: 1, max: 20, step: 1 } },
        resize: {
            options: ['both', 'horizontal', 'vertical', 'none'],
            control: { type: 'inline-radio' },
        },

        onChange: { action: 'onChange' },
        className: { control: false },
        rootProps: { control: false },
        labelProps: { control: false },
        detailsProps: { control: false },
        descriptionProps: { control: false },
    },
};

export default meta;
type Story = StoryObj<typeof S_Textarea>;

export const Empty: Story = {
    args: {
        details: 'Details',
    },
};

export const WithLabelInfo: Story = {
    args: {
        labelInfo: 'Bu sahə haqqında məlumat',
    },
};

export const Error: Story = {
    args: {
        status: 'error',
        errorText: 'Bu sahə boş qala bilməz.',
        description: undefined,
    },
};

export const Success: Story = {
    args: {
        status: 'success',
        description: 'Təsdiqləndi',
    },
};

export const Focus: Story = {
    args: {
        label: 'Focus state',
    },
    play: async ({ canvasElement }) => {
        const ta = canvasElement.querySelector('textarea');
        ta?.focus();
    },
};

export const AllInOne: Story = {
    args: {
        label: 'Etiket',
        labelInfo: 'Label haqqında izah',
        details: 'Ətraflı',
        placeholder: 'Yazmağa başlayın...',
        fieldInfo: 'Daxili ipucu',
        maxLength: 300,
        showCounter: true,
        description: 'Bu sahə vacibdir',
    },
};
