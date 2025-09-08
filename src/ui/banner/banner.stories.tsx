import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { ArrowDown } from '@/shared/filter/shared/icons';

import S_Banner from '.';
import S_Button from '../button';

const meta: Meta<typeof S_Banner> = {
    title: 'UI/Banner',
    component: S_Banner,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
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
    args: {
        action: (
            <>
                <S_Button variant="outlined" size="32" children={<ArrowDown height={16} width={16} />} />
                <S_Button variant="primary" size="32">
                    <ArrowDown width="16" height="16" /> Hi, I’m Button
                </S_Button>
            </>
        ),
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
        direction: 'horizontal',
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
