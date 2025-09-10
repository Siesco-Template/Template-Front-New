import { useState } from 'react';
import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import S_SidePanel from '.';
import S_Button from '../button';

const meta: Meta<typeof S_SidePanel> = {
    title: 'UI/SidePanel',
    component: S_SidePanel,
    tags: ['autodocs'],
    args: {
        open: false,
        title: 'Side panel title',
        children:
            'This is an example side panel body. Put any content here. It can scroll independently if content overflows.',
        footer: undefined,
        maxWidth: '480px',
        fullWidth: false,
        closeOnOutsideClick: true,
        closeOnEsc: true,
        onClickOutside: undefined,
    },
    argTypes: {
        open: { control: 'boolean' },
        title: { control: 'text' },
        children: { control: 'text' },
        footer: { control: false },
        maxWidth: { control: 'text' },
        fullWidth: { control: 'boolean' },
        closeOnOutsideClick: { control: 'boolean' },
        closeOnEsc: { control: 'boolean' },
        onClickOutside: { action: 'onClickOutside' },
        onOpenChange: { action: 'onOpenChange' },
    },
    parameters: {
        controls: { expanded: true },
        layout: 'fullscreen',
    },
};
export default meta;

type Story = StoryObj<typeof S_SidePanel>;

const LocalStateRender: Story['render'] = (args) => {
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
};

export const Playground: Story = { render: LocalStateRender };

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
    render: LocalStateRender,
};

export const LongContent: Story = {
    args: {
        title: 'A lot of content',
        children: (
            <div style={{ display: 'grid', gap: 12 }}>
                {Array.from({ length: 30 }).map((_, i) => (
                    <p key={i}>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quasi, eligendi. Item #{i + 1}
                    </p>
                ))}
            </div>
        ),
    },
    render: LocalStateRender,
};

export const CustomWidth: Story = {
    args: { maxWidth: '720px' },
    render: LocalStateRender,
};

export const FullWidth: Story = {
    args: { fullWidth: true, title: 'Full width panel' },
    render: LocalStateRender,
};

export const Locked: Story = {
    args: {
        title: 'Locked panel',
        closeOnOutsideClick: false,
        closeOnEsc: false,
    },
    render: LocalStateRender,
};

export const WithOutsideHandler: Story = {
    args: {
        title: 'Panel with outside click handler',
        onClickOutside: () => alert('Clicked outside the panel'),
    },
    render: LocalStateRender,
};
