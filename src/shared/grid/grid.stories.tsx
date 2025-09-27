import type { Meta, StoryObj } from '@storybook/react';

import Grid from '.';

const meta: Meta<typeof Grid> = {
    title: 'Shared/Grid',
    component: Grid,
    tags: ['autodocs'],
    argTypes: {
        columns: { control: { type: 'number' } },
        rows: { control: { type: 'number' } },
        spacing: { control: { type: 'number' } },
        count: { control: { type: 'number' } },
    },
};

export default meta;
type Story = StoryObj<typeof Grid>;

export const WithChildren: Story = {
    args: {
        columns: 3,
        spacing: 2,
        count: 6,
        children: (
            <>
                <div style={{ background: '#e57373', padding: '20px' }}>1</div>
                <div style={{ background: '#81c784', padding: '20px' }}>2</div>
                <div style={{ background: '#64b5f6', padding: '20px' }}>3</div>
                <div style={{ background: '#ffd54f', padding: '20px' }}>4</div>
                <div style={{ background: '#ba68c8', padding: '20px' }}>5</div>
                <div style={{ background: '#4db6ac', padding: '20px' }}>6</div>
            </>
        ),
    },
};

export const WithCount: Story = {
    args: {
        columns: 3,
        spacing: 3,
        count: 10,
    },
};
