import type { Meta, StoryObj } from '@storybook/react';

import S_Badge from '.';

const meta: Meta<typeof S_Badge> = {
    title: 'UI/Badge',
    component: S_Badge,
    args: {
        text: 'Status',
    },
    argTypes: {
        status: {
            control: 'select',
            options: ['default', 'success', 'error', 'processing', 'warning'],
        },
        variant: {
            control: 'select',
            options: ['default', 'primary'],
        },
    },
};
export default meta;

type Story = StoryObj<typeof S_Badge>;

export const Default: Story = {
    args: {
        status: 'processing',
        variant: 'default',
        text: 'Default badge',
    },
};

export const Success: Story = {
    args: {
        status: 'success',
        variant: 'default',
        text: 'Success badge',
    },
};

export const Error: Story = {
    args: {
        status: 'error',
        variant: 'default',
        text: 'Error badge',
    },
};

export const Processing: Story = {
    args: {
        status: 'processing',
        variant: 'default',
        text: 'Processing badge',
    },
};

export const Warning: Story = {
    args: {
        status: 'warning',
        variant: 'default',
        text: 'Warning badge',
    },
};

export const Primary: Story = {
    args: {
        status: 'success',
        variant: 'primary',
        text: 'Primary badge',
    },
};
