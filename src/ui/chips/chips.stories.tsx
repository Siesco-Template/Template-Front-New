import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { XIcon } from '@/shared/icons';

import S_Chips from '.';

const meta: Meta<typeof S_Chips> = {
    title: 'UI/Chips',
    component: S_Chips,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        type: {
            control: 'radio',
            options: ['outline', 'fill', 'outlined-fill'],
        },
        label: {
            control: 'text',
        },
        leftIcon: {
            control: false,
        },
        rightIcon: {
            control: false,
        },
        onClick: {
            action: 'clicked',
        },
    },
};

export default meta;
type Story = StoryObj<typeof S_Chips>;

export const Outline: Story = {
    args: {
        label: 'Outline Chip',
        type: 'outline',
    },
};

export const Fill: Story = {
    args: {
        label: 'Filled Chip',
        type: 'fill',
    },
};

export const OutlinedFill: Story = {
    args: {
        label: 'Outlined Fill Chip',
        type: 'outlined-fill',
    },
};

export const WithRightIcon: Story = {
    args: {
        label: 'Removable',
        type: 'outline',
        rightIcon: <XIcon />,
    },
};

export const WithLeftIcon: Story = {
    args: {
        label: 'With Icon',
        type: 'fill',
        leftIcon: <XIcon />,
    },
};

export const WithAvatar: Story = {
    args: {
        label: 'Jone',
        type: 'outlined-fill',
        photoUrl:
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
};

export const Clickable: Story = {
    args: {
        label: 'Clickable Chip',
        type: 'outline',
    },
};
