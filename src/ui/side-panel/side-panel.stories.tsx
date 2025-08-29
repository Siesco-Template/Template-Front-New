import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import S_SidePanel from '.';
import S_Button from '../button';

const meta: Meta<typeof S_SidePanel> = {
    title: 'UI/SidePanel',
    component: S_SidePanel,
    tags: ['autodocs'],
    args: {
        open: false, // start closed
        title: 'Side panel title',
        children:
            'This is an example side panel body. Put any content here. It can scroll independently if content overflows.',
        footer: undefined,
        maxWidth: '480px',
    },
    argTypes: {
        open: { control: 'boolean' },
        title: { control: 'text' },
        children: { control: 'text' },
        footer: { control: false },
        maxWidth: { control: 'text' },
        onOpenChange: { action: 'onOpenChange' },
    },
    parameters: {
        controls: { expanded: true },
        layout: 'fullscreen',
    },
};
export default meta;

type Story = StoryObj<typeof S_SidePanel>;

export const LocalState: Story = {
    render: (args) => {
        const [open, setOpen] = useState<boolean>(Boolean(args.open));

        return (
            <div style={{ padding: 16 }}>
                <S_Button variant="primary" onClick={() => setOpen(true)}>
                    Open panel
                </S_Button>

                <S_SidePanel
                    {...args}
                    open={open}
                    onOpenChange={(next) => {
                        setOpen(next);
                        args.onOpenChange?.(next);
                    }}
                />
            </div>
        );
    },
};

export const WithFooter: Story = {
    args: {
        footer: (
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <S_Button variant="secondary" type="button">
                    Cancel
                </S_Button>
                <S_Button variant="primary" type="button">
                    Save
                </S_Button>
            </div>
        ),
    },
    render: LocalState.render,
};

export const LongContent: Story = {
    args: {
        title: 'A lot of content',
        children: (
            <div style={{ display: 'grid', gap: 12 }}>
                {Array.from({ length: 20 }).map((_, i) => (
                    <p key={i}>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quasi, eligendi. Item #{i + 1}
                    </p>
                ))}
            </div>
        ),
    },
    render: LocalState.render,
};

export const CustomWidth: Story = {
    args: {
        maxWidth: '720px',
    },
    render: LocalState.render,
};
