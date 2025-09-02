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
            description: 'Textarea-nın piksel ilə hündürlüyü',
        },
        status: {
            options: ['default', 'success', 'error'] as TextareaStatus[],
            control: { type: 'inline-radio' },
            description: 'Status vəziyyəti: default, success və ya error göstərə bilər',
        },
        details: {
            control: 'text',
            description: 'Label altında əlavə detal məlumatı (ən çox köməkçi mətn)',
        },
        description: {
            control: 'text',
            description: 'Textarea-nın alt hissəsində göstərilən izahlayıcı mətn',
        },
        errorText: {
            control: 'text',
            description: 'Error vəziyyətində görünən mesaj',
        },
        labelInfo: {
            control: 'text',
            description: 'Label yanında görünən əlavə məlumat (tooltip və ya info üçün)',
        },
        fieldInfo: {
            control: 'text',
            description: 'Textarea-nın daxilində göstərilən ipucu mətn (tooltip kimi)',
        },
        maxLength: {
            control: { type: 'number', min: 10, max: 1000, step: 10 },
            description: 'Mətn üçün maksimum simvol sayı',
        },
        showCounter: {
            control: 'boolean',
            description: 'Simvol sayğacının görünməsi üçün aktivləşdirilir',
        },
        rows: {
            control: { type: 'number', min: 1, max: 20, step: 1 },
            description: 'Textarea üçün başlanğıc sətir sayı',
        },
        resize: {
            options: ['both', 'horizontal', 'vertical', 'none'],
            control: { type: 'inline-radio' },
            description: 'Textarea-nın sürüklənəbilən olma istiqamətləri',
        },
        onChange: {
            action: 'onChange',
            description: 'Daxildəki mətn dəyişdikdə çağırılan callback funksiyası',
        },
        className: {
            control: false,
            description: 'Əsas konteyner üçün əlavə CSS class (daxili istifadə)',
        },
        rootProps: {
            control: false,
            description: 'Kök konteyner üçün əlavə prop-lar (forwarded props)',
        },
        labelProps: {
            control: false,
            description: 'Label elementinə aid əlavə atributlar',
        },
        detailsProps: {
            control: false,
            description: 'Details sahəsinə aid əlavə atributlar',
        },
        descriptionProps: {
            control: false,
            description: 'Description sahəsinə aid əlavə atributlar',
        },
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
