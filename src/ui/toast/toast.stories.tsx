import { Check } from 'lucide-react';

import type { Meta, StoryObj } from '@storybook/react';

import S_Button from '../button';
import S_Toast from './S_Toast';
import { showToast } from './showToast';

const meta: Meta<typeof S_Toast> = {
    title: 'UI/Toast',
    component: S_Toast,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        label: {
            control: 'text',
            description: 'Toast başlığı',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '-' },
            },
        },
        description: {
            control: 'text',
            description: 'İzah (optional)',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '-' },
            },
        },
        type: {
            control: 'radio',
            options: ['success', 'error', 'warning', 'info'],
            description: 'Toast tipi — rəng və ikon dəyişir',
            table: {
                type: { summary: `'success' | 'error' | 'warning' | 'info'` },
                defaultValue: { summary: 'info' },
            },
        },
        icon: {
            control: false,
            description: 'Custom sol ikon (optional). Verilməzsə `type`-a uyğun default ikon göstərilir.',
            table: {
                type: { summary: 'ReactNode' },
                defaultValue: { summary: 'default icon' },
            },
        },
        duration: {
            control: 'number',
            description: 'Toast görünmə müddəti (ms)',
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: 3000 },
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof S_Toast>;

export const Default: Story = {
    args: {
        label: 'This is a toast message',
        type: 'info',
        duration: 3000,
    },
    render: (args: any) => {
        return (
            <div
                style={{
                    width: 600,
                    height: 300,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    gap: 16,
                }}
            >
                <S_Toast />
                <S_Button
                    children="Show Toast"
                    onClick={() =>
                        showToast({
                            label: args.label,
                            description: args.description,
                            type: args.type,
                            duration: args.duration,
                        })
                    }
                />
            </div>
        );
    },
};

export const Success: Story = {
    args: {
        label: 'Success!',
        type: 'success',
        duration: 3000,
    },
    render: (args: any) => (
        <div style={{ width: 600, height: 300 }}>
            <S_Toast />
            <S_Button
                onClick={() =>
                    showToast({
                        label: args.label,
                        type: 'success',
                        duration: args.duration,
                    })
                }
            >
                Show Success Toast
            </S_Button>
        </div>
    ),
};

export const Warning: Story = {
    args: {
        label: 'Warning!',
        type: 'warning',
        duration: 3000,
    },
    render: (args: any) => (
        <div style={{ width: 600, height: 300 }}>
            <S_Toast />
            <S_Button
                onClick={() =>
                    showToast({
                        label: args.label,
                        type: 'warning',
                        duration: args.duration,
                    })
                }
            >
                Show Warning Toast
            </S_Button>
        </div>
    ),
};

export const Error: Story = {
    args: {
        label: 'Error!',
        type: 'error',
        duration: 3000,
    },
    render: (args: any) => (
        <div style={{ width: 600, height: 300 }}>
            <S_Toast />
            <S_Button
                onClick={() =>
                    showToast({
                        label: args.label,
                        type: 'error',
                        duration: args.duration,
                    })
                }
            >
                Show Error Toast
            </S_Button>
        </div>
    ),
};
