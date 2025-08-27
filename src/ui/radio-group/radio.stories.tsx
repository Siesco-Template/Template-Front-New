import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import S_RadioGroup from '.';

const meta: Meta<typeof S_RadioGroup> = {
    title: 'UI/Radio',
    component: S_RadioGroup,
    tags: ['autodocs'],
    args: {
        groupData: ['Option A', 'Option B', 'Option C'],
        color: 'secondary',
        variant: 'default',
    },
    argTypes: {
        color: {
            control: { type: 'inline-radio' },
            options: ['primary', 'secondary'],
        },
        variant: {
            control: { type: 'inline-radio' },
            options: ['default', 'primary'],
        },
        label: { control: 'text' },
        groupData: { control: 'object' },
        orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    },
};

export default meta;
type Story = StoryObj<typeof S_RadioGroup>;

export const Basic: Story = {};
