import type { Meta, StoryObj } from '@storybook/react';

import S_Button from '.';

const variants = [
    'main-10',
    'main-20',
    'main-30',
    'outlined-10',
    'outlined-20',
    'outlined-30',
    'ghost-10',
    'ghost-20',
    'ghost-30',
    'none',
] as const;

const colors = ['primary', 'secondary', 'red', 'green', 'none'] as const;
const iconSizes = ['0', '5', '10', '15', '20', '30'] as const;

const meta: Meta<typeof S_Button> = {
    title: 'UI/Button',
    component: S_Button,
    args: {
        as: 'button',
        variant: 'main-20',
        color: 'primary',
        children: 'Click me',
        disabled: false,
        isIcon: false,
        iconBtnSize: '10',
        disableAnimation: false,
        active: false,
        isLaoding: false,
        notification: false,
    },
    argTypes: {
        as: { control: 'inline-radio', options: ['button', 'link'] },
        variant: { control: 'select', options: variants },
        color: { control: 'select', options: colors },
        isIcon: { control: 'boolean' },
        iconBtnSize: { control: 'select', options: iconSizes },
        disabled: { control: 'boolean' },
        disableAnimation: { control: 'boolean' },
        active: { control: 'boolean' },
        isLaoding: { control: 'boolean', name: 'isLoading' },
        notification: { control: 'boolean' },
        className: { control: false },
        onClick: { action: 'clicked' },
    },
    parameters: { layout: 'centered' },
};
export default meta;

type Story = StoryObj<typeof S_Button>;

export const Primary: Story = {
    args: {
        children: 'Primary',
        variant: 'main-20',
        color: 'primary',
    },
};

export const SecondaryOutlined: Story = {
    args: {
        children: 'Secondary outlined',
        variant: 'outlined-20',
        color: 'secondary',
    },
};

export const GhostIcon: Story = {
    args: {
        isIcon: true,
        'aria-label': 'Settings',
        children: '⚙️',
        variant: 'ghost-20',
        color: 'none',
        iconBtnSize: '15',
    },
};

export const WithNotification: Story = {
    args: {
        children: 'Inbox',
        notification: true,
        variant: 'main-20',
        color: 'primary',
    },
};

export const Loading: Story = {
    args: {
        children: 'Loading…',
        isLaoding: true,
        variant: 'main-20',
        color: 'primary',
    },
};

export const Disabled: Story = {
    args: {
        children: 'Disabled',
        disabled: true,
        variant: 'main-20',
        color: 'primary',
    },
};

export const ActiveState: Story = {
    args: {
        children: 'Active',
        active: true,
        variant: 'outlined-20',
        color: 'green',
    },
};

export const AsLink: Story = {
    args: {
        as: 'link',
        children: 'Go to Dashboard',
        variant: 'main-20',
        color: 'primary',
    },
};
