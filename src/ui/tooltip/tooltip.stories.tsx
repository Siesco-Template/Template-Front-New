import type { Meta, StoryObj } from '@storybook/react';

import S_Tooltip from './index';

const placements = [
    'top',
    'top-start',
    'top-end',
    'right',
    'right-start',
    'right-end',
    'bottom',
    'bottom-start',
    'bottom-end',
    'left',
    'left-start',
    'left-end',
] as const;

const meta: Meta<typeof S_Tooltip> = {
    title: 'UI/Tooltip',
    component: S_Tooltip,
    tags: ['autodocs'],
    args: {
        content: 'Tooltip content',
        position: 'top',
        openDelay: 300,
        closeDelay: 300,
    },
    argTypes: {
        position: { control: 'select', options: placements },
        openDelay: { control: { type: 'number', min: 0, step: 50 } },
        closeDelay: { control: { type: 'number', min: 0, step: 50 } },
        content: { control: 'text' },
        offset: { control: false },
    },
};

export default meta;
type Story = StoryObj<typeof S_Tooltip>;

export const Default: Story = {
    render: (args) => (
        <S_Tooltip {...args}>
            <button style={{ padding: '8px 12px' }}>Hover me</button>
        </S_Tooltip>
    ),
    args: {
        content: 'Tooltip 👋',
    },
};

export const AllPlacements: Story = {
    render: (args) => (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(160px, 1fr))',
                padding: 24,
                justifyItems: 'center',
                alignItems: 'center',
            }}
        >
            {placements.map((p) => (
                <S_Tooltip key={p} {...args} position={p} content={`Placement: ${p}`}>
                    <button style={{ padding: '8px 12px' }}>{p}</button>
                </S_Tooltip>
            ))}
        </div>
    ),
};

export const WithOffset: Story = {
    render: (args) => (
        <S_Tooltip {...args} offset={{ mainAxis: 16, crossAxis: 8 }} content="Tooltip with offset (16px, 8px)">
            <button style={{ padding: '8px 12px' }}>Offset tooltip</button>
        </S_Tooltip>
    ),
    args: {
        position: 'bottom',
    },
};

export const Delayed: Story = {
    render: (args) => (
        <S_Tooltip {...args}>
            <button style={{ padding: '8px 12px' }}>Hover me (delayed)</button>
        </S_Tooltip>
    ),
    args: {
        openDelay: 800,
        closeDelay: 400,
        content: 'Opens after 800ms, closes after 400ms',
    },
};

export const CustomStyled: Story = {
    render: (args) => (
        <S_Tooltip {...args} content={<span style={{ fontWeight: 600, color: 'gold' }}>✨ Custom styled tooltip</span>}>
            <button style={{ padding: '8px 12px' }}>Custom style</button>
        </S_Tooltip>
    ),
};
