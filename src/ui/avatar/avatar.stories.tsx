import type { Meta, StoryObj } from '@storybook/react';

import S_Avatar from '.';

const meta = {
    title: 'UI/Avatar',
    component: S_Avatar,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        size: {
            control: 'select',
            options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
        },
        type: {
            control: 'radio',
            options: ['image', 'placeholder', 'name'],
        },
        online: { control: 'boolean' },
        name: { control: 'text' },
        imageUrl: { control: 'text' },
    },
    args: {
        size: 'lg',
        online: false,
    },
} satisfies Meta<typeof S_Avatar>;

export default meta;
type Story = StoryObj<typeof S_Avatar>;

export const ImageAvatar: Story = {
    args: {
        type: 'image',
        imageUrl: 'https://i.pravatar.cc/150?img=12',
        name: 'Elvin Sadigov',
        online: true,
    },
};

export const PlaceholderAvatar: Story = {
    args: {
        type: 'placeholder',
        name: 'Leyla Mammadova',
        online: false,
    },
};

export const NameAvatar: Story = {
    args: {
        type: 'name',
        name: 'Sama Məmmədova',
        online: true,
    },
};

export const SizesShowcase: Story = {
    render: () => {
        const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;
        return (
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                {sizes.map((s) => (
                    <div key={s} style={{ textAlign: 'center' }}>
                        <S_Avatar type="name" name="Samir Abbasov" size={s} />
                        <div style={{ fontSize: 12, marginTop: 4 }}>{s}</div>
                    </div>
                ))}
            </div>
        );
    },
};
