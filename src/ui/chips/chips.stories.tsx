import type { Meta, StoryObj } from '@storybook/react';

import S_Chips from '.';

const meta: Meta<typeof S_Chips> = {
    title: 'UI/Chips',
    component: S_Chips,
    tags: ['autodocs'],
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
        label: 'Chips',
        type: 'outline',
    },
};
