import React, { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import S_Switch from '.';

const meta: Meta<typeof S_Switch> = {
    title: 'UI/Switch',
    tags: ['autodocs'],
    component: S_Switch,
    parameters: {
        layout: 'centered',
        docs: {},
    },
    argTypes: {
        label: {
            control: 'text',
            description: 'Switch yanındakı mətn',
        },
        disabled: {
            control: 'boolean',
            description: 'Deaktiv vəziyyət',
        },
        checked: {
            control: 'boolean',
            description: 'Kontrollu istifadə üçün seçili vəziyyət',
        },
        defaultChecked: {
            control: 'boolean',
            description: 'Uncontrolled başlanğıc dəyəri',
        },
        onCheckedChange: {
            action: 'checked changed',
            description: 'Switch dəyəri dəyişəndə çağrılır',
        },
        className: { control: 'text' },
    },
    args: {
        label: '',
        disabled: false,
        defaultChecked: false,
    },
};
export default meta;

type Story = StoryObj<typeof S_Switch>;

export const Basic: Story = {
    name: 'Basic',
    args: {},
};

export const Disabled: Story = {
    name: 'Disabled',
    args: {
        disabled: true,
        defaultChecked: true,
    },
};
