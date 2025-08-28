import type { Meta, StoryObj } from '@storybook/react';

import S_Banner from '.';
import S_Button from '../button';

const Btn = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button
        {...props}
        style={{
            padding: '8px 12px',
            borderRadius: 8,
            border: '1px solid #c9d1e6',
            background: '#fff',
            cursor: 'pointer',
        }}
    />
);

const meta: Meta<typeof S_Banner> = {
    title: 'UI/Banner',
    component: S_Banner,
    tags: ['autodocs'],
    argTypes: {
        type: {
            control: 'radio',
            options: ['success', 'info', 'warning', 'error'],
        },
        title: {
            control: 'text',
        },
        description: {
            control: 'text',
        },
        icon: {
            control: false,
        },
        action: {
            control: false,
        },
        closable: {
            control: 'boolean',
        },
        direction: {
            control: 'radio',
            options: ['horizontal', 'vertical'],
        },
        device: {
            control: 'radio',
            options: ['web', 'mobile'],
        },
        onClose: {
            action: 'onClose fired',
        },
    },
};

export default meta;
type Story = StoryObj<typeof S_Banner>;

export const Info: Story = {
    args: {
        type: 'info',
        title: "We've just released a new feature",
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
        closable: true,
        direction: 'horizontal',
        device: 'web',
    },
};

export const Success: Story = {
    args: {
        type: 'success',
        title: 'Your changes have been saved!',
        description: 'Everything went as expected.',
        closable: true,
        direction: 'vertical',
        device: 'web',
    },
};
export const Error: Story = {
    args: {
        type: 'error',
        title: 'Something went wrong!',
        description: 'Please try again later.',
        closable: true,
        direction: 'horizontal',
        device: 'web',
    },
};

export const Warning: Story = {
    args: {
        type: 'warning',
        title: 'This action may have consequences',
        description: 'Please double check your inputs on mobile.',
        closable: true,
        direction: 'horizontal',
        device: 'web',
        action: (
            <>
                <S_Button variant="primary" children="Button" />
            </>
        ),
    },
};

export const Mobile: Story = {
    args: {
        type: 'info',
        title: 'This action may have consequences',
        description: 'Please double check your inputs on mobile.',
        closable: true,
        direction: 'horizontal',
        device: 'mobile',
    },
};
