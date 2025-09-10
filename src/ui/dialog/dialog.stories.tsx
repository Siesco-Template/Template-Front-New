import { useState } from 'react';
import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import Modal from '.';
import S_Button from '../button';

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

const meta: Meta<typeof Modal> = {
    title: 'UI/Modal',
    component: Modal,
    tags: ['autodocs'],
    args: {
        open: false,
        title: 'Modal title',
        size: 'md',
        children: 'This is an example modal body. Put any content here.',
        footer: undefined,
        closeOnOutsideClick: true,
        closeOnEsc: true,
        onClickOutside: undefined,
    },
    argTypes: {
        open: { control: 'boolean' },
        title: { control: 'text' },
        size: { control: 'select', options: sizes },
        footer: { control: false },
        children: { control: 'text' },
        closeOnOutsideClick: { control: 'boolean' },
        closeOnEsc: { control: 'boolean' },
        onClickOutside: { action: 'onClickOutside' },
        onOpenChange: { action: 'onOpenChange' },
    },
    parameters: {
        controls: { expanded: true },
        layout: 'centered',
    },
};
export default meta;

type Story = StoryObj<typeof Modal>;

const TriggerRender: Story['render'] = (args) => {
    const [open, setOpen] = useState(!!args.open);
    const handleOpenChange = (next: boolean) => {
        setOpen(next);
        args.onOpenChange?.(next);
    };

    return (
        <div style={{ padding: 24 }}>
            <S_Button variant="primary" onClick={() => handleOpenChange(true)}>
                Open Modal
            </S_Button>

            <Modal {...args} open={open} onOpenChange={handleOpenChange} />
        </div>
    );
};

export const Playground: Story = { render: TriggerRender };

export const WithFooter: Story = {
    args: {
        footer: (
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <S_Button variant="outlined" type="button" tabIndex={1}>
                    Cancel
                </S_Button>
                <S_Button variant="primary" type="button" tabIndex={2}>
                    Confirm
                </S_Button>
            </div>
        ),
    },
    render: TriggerRender,
};

export const NoTitle: Story = {
    args: { title: undefined },
    render: TriggerRender,
};

export const LongContent: Story = {
    args: {
        children: (
            <div style={{ display: 'grid', gap: 8 }}>
                {Array.from({ length: 20 }).map((_, i) => (
                    <p key={i}>
                        Paragraph {i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio.
                        Praesent libero. Sed cursus ante dapibus diam.
                    </p>
                ))}
            </div>
        ),
    },
    render: TriggerRender,
};

export const XS: Story = { args: { size: 'xs', title: 'Modal (xs)' }, render: TriggerRender };
export const SM: Story = { args: { size: 'sm', title: 'Modal (sm)' }, render: TriggerRender };
export const MD: Story = { args: { size: 'md', title: 'Modal (md)' }, render: TriggerRender };
export const LG: Story = { args: { size: 'lg', title: 'Modal (lg)' }, render: TriggerRender };
export const XL: Story = { args: { size: 'xl', title: 'Modal (xl)' }, render: TriggerRender };

export const Closed: Story = { args: { open: false }, render: TriggerRender };

export const Locked: Story = {
    args: {
        title: 'Locked Modal',
        closeOnOutsideClick: false,
        closeOnEsc: false,
    },
    render: TriggerRender,
};

export const WithOutsideHandler: Story = {
    args: {
        title: 'Modal with Outside Click Handler',
        onClickOutside: () => alert('Clicked outside!'),
    },
    render: TriggerRender,
};
