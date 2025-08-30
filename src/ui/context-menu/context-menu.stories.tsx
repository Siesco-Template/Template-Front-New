import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import ContextMenu from '.';
import { MenuLineHorizontalIcon } from '../../shared/icons';

const meta: Meta<typeof ContextMenu> = {
    title: 'Shared/ContextMenu',
    component: ContextMenu,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
};

export default meta;
type Story = StoryObj<typeof ContextMenu>;

// 🔹 Helper to build demo items
function buildItems(count = 3) {
    return Array.from({ length: count }).map((_, i) => ({
        value: `item-${i + 1}`,
        label: `Menu Item ${i + 1}`,
        leftIcon: <MenuLineHorizontalIcon />,
        rightIcon: <MenuLineHorizontalIcon />,
        onClick: () => console.log(`Clicked item-${i + 1}`),
    }));
}

// --- Stories ---

// 1️⃣ Default usage
export const Default: Story = {
    args: {
        items: buildItems(3),
    },
};

// 2️⃣ Demonstrates active + disabled states
export const WithActiveAndDisabled: Story = {
    args: {
        items: [
            {
                value: 'edit',
                label: 'Edit',
                leftIcon: <MenuLineHorizontalIcon />,
                rightIcon: <MenuLineHorizontalIcon />,
                onClick: () => console.log('Edit clicked'),
            },
            {
                value: 'duplicate',
                label: 'Duplicate (active)',
                leftIcon: <MenuLineHorizontalIcon />,
                rightIcon: <MenuLineHorizontalIcon />,
                active: true,
                onClick: () => console.log('Duplicate clicked'),
            },
            {
                value: 'delete',
                label: 'Delete (disabled)',
                leftIcon: <MenuLineHorizontalIcon />,
                rightIcon: <MenuLineHorizontalIcon />,
                disabled: true,
            },
        ],
    },
};

// 3️⃣ Lots of items, scrollable container
export const ManyItemsScrollable: Story = {
    render: () => {
        const items = buildItems(12);
        return (
            <div style={{ padding: 12 }}>
                <ContextMenu
                    context={{ id: 'bulk' }}
                    items={items}
                    placement="bottom-end"
                    // Constrain height to force scroll
                    contentClassName="max-h-[360px] overflow-auto"
                />
            </div>
        );
    },
};

// 4️⃣ Show menu placement variations
export const PlacementVariants: Story = {
    render: () => (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 160px)',
                gap: 24,
                justifyItems: 'center',
                alignItems: 'center',
            }}
        >
            {[
                'top-start',
                'top',
                'top-end',
                'left-start',
                'left',
                'left-end',
                'right-start',
                'right',
                'right-end',
                'bottom-start',
                'bottom',
                'bottom-end',
            ].map((p) => (
                <div key={p} style={{ textAlign: 'center' }}>
                    <div style={{ marginBottom: 8, fontSize: 12, color: '#6b7280' }}>{p}</div>
                    <ContextMenu
                        context={{ id: p }}
                        items={buildItems(3)}
                        placement={p as any}
                        trigger={<MenuLineHorizontalIcon />}
                    />
                </div>
            ))}
        </div>
    ),
};

// 5️⃣ Using a custom trigger (e.g. a button)
export const CustomTrigger: Story = {
    args: {
        trigger: (
            <button
                style={{
                    padding: '6px 12px',
                    borderRadius: 6,
                    border: '1px solid #ccc',
                    background: 'white',
                    cursor: 'pointer',
                }}
            >
                Open Menu
            </button>
        ),
        items: buildItems(4),
    },
};
