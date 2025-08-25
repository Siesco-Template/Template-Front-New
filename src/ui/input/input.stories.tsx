import { ChangeEvent, useState } from 'react';

import { EyeIcon, SearchIcon } from 'lucide-react';

import type { Meta, StoryObj } from '@storybook/react';

import S_Input, { type I_InputProps, type InputSize } from './index';

const sizes: InputSize[] = ['36', '44', '48', '52'];

const meta: Meta<typeof S_Input> = {
    title: 'UI/Input',
    component: S_Input,
    tags: ['autodocs'],
    args: {
        inputSize: '36',
        placeholder: 'Type here...',
        label: '',
        description: '',
        details: '',
        icon: undefined,
        iconPosition: 'right',
        disabled: false,
        errorText: '',
        type: 'text',
        autoComplete: 'off',
    } as I_InputProps,
    argTypes: {
        inputSize: { control: 'inline-radio', options: sizes },
        iconPosition: { control: 'inline-radio', options: ['left', 'right'] },
        type: {
            control: 'select',
            options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'],
        },
        onChange: { action: 'changed' },
        onFocus: { action: 'focused' },
        onBlur: { action: 'blurred' },
        onClickIcon: { action: 'icon clicked' },
    },
    parameters: {
        controls: { expanded: true },
        layout: 'centered',
    },
};

export default meta;
type Story = StoryObj<typeof S_Input>;

/** Basic uncontrolled text input */
export const Basic: Story = {
    args: {
        placeholder: 'Your name',
    },
};

/** With label and optional right-side details text */
export const WithLabelAndDetails: Story = {
    args: {
        label: 'Full Name',
        details: 'Optional',
        placeholder: 'e.g., Kamran Khalilov',
    },
};

/** With helper description under the field (no error) */
export const WithDescription: Story = {
    args: {
        label: 'Email',
        description: 'We’ll never share your email.',
        type: 'email',
        placeholder: 'you@example.com',
    },
};

/** Error state (HelperText switches to errorText) */
export const ErrorState: Story = {
    args: {
        label: 'Username',
        errorText: 'Username is already taken',
        placeholder: 'choose-unique-name',
    },
};

/** With icon on the right (clickable) */
export const WithIconRight: Story = {
    args: {
        label: 'Search',
        placeholder: 'Search anything...',
        icon: <SearchIcon size={18} />,
        iconPosition: 'right',
    },
};

/** With icon on the left */
export const WithIconLeft: Story = {
    args: {
        label: 'Search',
        placeholder: 'Search anything...',
        icon: <SearchIcon size={18} />,
        iconPosition: 'left',
    },
};

/** Password input with eye icon (demo icon click handler) */
export const PasswordWithIcon: Story = {
    render: (args) => {
        // demo-only: toggles local password visibility
        const [visible, setVisible] = useState(false);
        return (
            <S_Input
                {...args}
                type={visible ? 'text' : 'password'}
                label="Password"
                placeholder="••••••••"
                icon={<EyeIcon size={18} />}
                onClickIcon={() => setVisible((v) => !v)}
            />
        );
    },
};

/** Number input blocking e/E/+/- and wheel (as implemented in the component) */
export const NumberType: Story = {
    args: {
        label: 'Age',
        type: 'number',
        placeholder: '18',
    },
};

/** Disabled state */
export const Disabled: Story = {
    args: {
        label: 'Disabled field',
        placeholder: 'You cannot edit this',
        disabled: true,
    },
};

/** Sizes showcase */
export const SizesShowcase: Story = {
    render: (args) => {
        return (
            <div style={{ display: 'grid', gap: 12, width: 360 }}>
                {sizes.map((sz) => (
                    <S_Input key={sz} {...args} label={`Size ${sz}`} inputSize={sz} placeholder={`inputSize="${sz}"`} />
                ))}
            </div>
        );
    },
};

/** Controlled example (for forms) */
export const Controlled: Story = {
    render: (args) => {
        const [value, setValue] = useState('');
        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
            setValue(e.target.value);
        };
        return (
            <div style={{ width: 360 }}>
                <S_Input
                    {...args}
                    label="Controlled"
                    placeholder="Type to update state"
                    value={value}
                    onChange={handleChange}
                />
                <div style={{ marginTop: 8, fontSize: 12, opacity: 0.7 }}>
                    Value: <code>{value || '(empty)'}</code>
                </div>
            </div>
        );
    },
};
