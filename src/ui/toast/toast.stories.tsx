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
        visibleToasts: {
            control: { type: 'number' },
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: 3 },
                category: 'Toaster Props',
                description: 'Eyni anda maksimum neçə toast görünə bilər. Yeni toast gəldikcə köhnələr sıradan silinir.',
            },
        },
        position: {
            control: { type: 'select' },
            options: ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'],
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'top-right' },
                category: 'Toaster Props',
                description: 'Toast-ların ekranda harada çıxacağını təyin edir.',
            },
        },
        expand: {
            control: 'boolean',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: false },
                category: 'Toaster Props',
                description: 'Eyni tip toast-lar birləşdirilərək genişləndirilmiş şəkildə göstərilsinmi.',
            },
        },
        duration: {
            control: { type: 'number' },
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: 3000 },
                category: 'Toaster Props',
                description: 'Toast-un neçə millisekund ekranda qalacağını təyin edir.',
            },
        },
        label: {
            control: 'text',
            table: {
                type: { summary: 'string' },
                category: 'Toast Content',
                description: 'Toast içində əsas başlıq/mesaj.',
            },
        },
        description: {
            control: 'text',
            table: {
                type: { summary: 'string' },
                category: 'Toast Content',
                description: 'Başlığın altında əlavə məlumat olaraq görünən alt yazı.',
            },
        },
        type: {
            control: 'select',
            options: ['success', 'error', 'warning', 'info'],
            table: {
                type: { summary: 'success | error | warning | info' },
                category: 'Toast Content',
                description: 'Toast-un tipi. Rəng və ikon buna görə dəyişir.',
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof S_Toast>;

export const Default: Story = {
    args: {
        label: 'This is a toast message',
        description: 'Extra description',
        type: 'info',
        duration: 3000,
        visibleToasts: 3,
        position: 'top-right',
        expand: false,
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
                <S_Toast
                    position={args.position}
                    closeButton={args.closeButton}
                    expand={args.expand}
                    duration={args.duration}
                    visibleToasts={args.visibleToasts}
                />

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
