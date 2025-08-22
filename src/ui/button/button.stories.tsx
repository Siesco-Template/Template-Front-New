import type { Meta, StoryObj } from '@storybook/react';

import S_Button from '.';

const variants = ['primary', 'secondary', 'ghost'] as const;
const colors = ['primary', 'secondary', 'red', 'green'] as const;
const sizes = ['32', '36', '44', '48', '52'] as const;

const meta: Meta<typeof S_Button> = {
    title: 'UI/Button',
    component: S_Button,
    tags: ['autodocs'],
    args: {
        as: 'button',
        variant: 'primary',
        color: 'primary',
        size: '36',
        children: 'Click me',
        disabled: false,
        disableAnimation: false,
        isLaoding: false,
        notification: false,
        showTooltip: false,
    },
    argTypes: {
        as: { control: 'inline-radio', options: ['button', 'link'] },
        variant: { control: 'select', options: variants },
        color: { control: 'select', options: colors },
        size: { control: 'select', options: sizes },
        disabled: { control: 'boolean' },
        disableAnimation: { control: 'boolean' },
        isLaoding: { control: 'boolean', name: 'isLoading' },
        notification: { control: 'boolean' },
        showTooltip: { control: 'boolean' },
        className: { control: false },
        onClick: { action: 'clicked' },
    },
    parameters: {
        backgrounds: {
            options: {
                black: { name: 'Black', value: '#333' },
                white: { name: 'White', value: '#F5F5F5' },
            },
        },
    },
};
export default meta;

type Story = StoryObj<typeof S_Button>;

export const Primary: Story = {
    args: {
        children: 'Primary',
        variant: 'primary',
        color: 'primary',
    },
};

export const Secondary: Story = {
    args: {
        children: 'Secondary',
        variant: 'secondary',
        color: 'secondary',
    },
};

export const GhostIcon: Story = {
    args: {
        'aria-label': 'Settings',
        children: '⚙️',
        variant: 'ghost',
        color: 'primary',
    },
};

export const WithNotification: Story = {
    args: {
        children: 'Inbox',
        notification: true,
        variant: 'primary',
        color: 'primary',
    },
};

export const Loading: Story = {
    args: {
        children: 'Loading…',
        isLaoding: true,
        variant: 'primary',
        color: 'primary',
    },
};

export const Disabled: Story = {
    args: {
        children: 'Disabled',
        disabled: true,
        variant: 'primary',
        color: 'primary',
    },
};

export const ActiveState: Story = {
    args: {
        children: 'Active',
        variant: 'secondary',
        color: 'green',
    },
};

export const AsLink: Story = {
    args: {
        as: 'link',
        to: '/dashboard',
        children: 'Go to Dashboard',
        variant: 'primary',
        color: 'primary',
    },
};
