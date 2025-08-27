import { Meta, StoryObj } from '@storybook/react';

import S_Avatar from '.';

const meta: Meta<typeof S_Avatar> = {
    title: 'UI/Avatar',
    component: S_Avatar,
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: 'select',
            options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
        },
        type: {
            control: 'radio',
            options: ['image', 'placeholder'],
        },
        online: {
            control: 'boolean',
        },
        name: {
            control: 'text',
        },
        imageUrl: {
            control: 'text',
        },
    },
};

export default meta;

type Story = StoryObj<typeof S_Avatar>;

const centerDecorator = (StoryFn: any) => (
    <div
        style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}
    >
        <StoryFn />
    </div>
);

// ==========================
// ✅ Avatar with image
// ==========================
export const ImageAvatar: Story = {
    args: {
        type: 'image',
        imageUrl: 'https://i.pravatar.cc/150?img=12',
        name: 'Elvin Sadigov',
        size: 'lg',
        online: true,
    },
    decorators: [centerDecorator],
};

// ==========================
// ✅ Avatar with placeholder
// ==========================
export const PlaceholderAvatar: Story = {
    args: {
        type: 'placeholder',
        name: 'Leyla Mammadova',
        size: 'lg',
        online: false,
    },
    decorators: [centerDecorator],
};

// ==========================
// ✅ Size Showcase
// ==========================
export const SizesShowcase: Story = {
    render: () => {
        const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;
        return (
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                {sizes.map((s) => (
                    <div key={s} style={{ textAlign: 'center' }}>
                        <S_Avatar
                            type="image"
                            imageUrl="https://i.pravatar.cc/150?img=12"
                            name="Samir Abbasov"
                            size={s}
                            online={false}
                        />
                        <div style={{ fontSize: 12, marginTop: 4 }}>{s}</div>
                    </div>
                ))}
            </div>
        );
    },
    decorators: [centerDecorator],
};
