import type { Meta, StoryObj } from '@storybook/react';

import S_Checkbox from '.';

const meta: Meta<typeof S_Checkbox> = {
    title: 'UI/Checkbox',
    component: S_Checkbox,
    tags: ['autodocs'],
    parameters: {
        controls: { expanded: true },
        layout: 'padded',
    },
    argTypes: {
        size: { options: ['14', '16', '20'], control: { type: 'inline-radio' } },
        checked: { control: 'boolean' },
        indeterminate: { control: 'boolean' },
        disabled: { control: 'boolean' },
        label: { control: 'text' },
    },
    args: {
        label: 'Label',
        size: '16',
        checked: false,
        indeterminate: false,
        disabled: false,
    },
};
export default meta;

type Story = StoryObj<typeof S_Checkbox>;

const CenterDecorator = (StoryFn: any) => (
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

export const Playground: Story = {};

export const Unchecked: Story = {
    args: { checked: false, indeterminate: false, disabled: false, label: 'Unchecked' },
    decorators: [CenterDecorator],
};

export const Checked: Story = {
    args: { checked: true, indeterminate: false, disabled: false, label: 'Checked' },
    decorators: [CenterDecorator],
};

export const Indeterminate: Story = {
    args: { indeterminate: true, checked: true, disabled: false, label: 'Indeterminate' },
    decorators: [CenterDecorator],
};

export const Disabled: Story = {
    args: { disabled: true, checked: false, indeterminate: false, label: 'Disabled' },
    decorators: [CenterDecorator],
};
