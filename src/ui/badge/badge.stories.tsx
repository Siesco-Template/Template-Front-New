import type { Meta, StoryObj } from '@storybook/react';

import S_Badge from '.';

const meta: Meta<typeof S_Badge> = {
    title: 'UI/Badge',
    component: S_Badge,
    tags: ['autodocs'],
    argTypes: {
        status: {
            control: 'select',
            options: ['default', 'success', 'error', 'processing', 'warning'],
        },
        type: {
            control: 'radio',
            options: [1, 2, 3],
        },
    },
};
export default meta;
type Story = StoryObj<typeof S_Badge>;

export const Default: Story = {
    args: {
        text: 'Badge',
        status: 'default',
        type: 1,
    },
};

export const Showcase: Story = {
    render: () => {
        const statuses: Array<'default' | 'success' | 'error' | 'processing' | 'warning'> = [
            'default',
            'success',
            'error',
            'processing',
            'warning',
        ];

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {statuses.map((status) => (
                    <div key={status} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <S_Badge text="Badge" status={status} type={1} />
                        <S_Badge text="Badge" status={status} type={2} />
                        <S_Badge text="Badge" status={status} type={3} />
                    </div>
                ))}
            </div>
        );
    },
};
