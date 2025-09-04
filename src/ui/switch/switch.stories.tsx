import type { Meta, StoryObj } from '@storybook/react';

import S_Switch from '.';

const meta: Meta<typeof S_Switch> = {
    title: 'UI/Switch',
    tags: ['autodocs'],
    component: S_Switch,
    parameters: {
        layout: 'centered',
        docs: {},
    },
    argTypes: {
        label: {
            control: 'text',
            description: 'Switch-in yazısı (label)',
        },
        labelPosition: {
            control: { type: 'radio' },
            options: ['left', 'right'],
            description: 'Label-in switch-ə görə yerləşməsi (solda və ya sağda)',
        },
        disabled: {
            control: 'boolean',
            description: 'Switch-in aktiv və ya deaktiv olması',
        },
        checked: {
            control: 'boolean',
            description:
                'Kontrollü komponent olaraq switch-in vəziyyətini (true/false) təyin edir. onCheckedChange ilə birlikdə istifadə olunmalıdır.',
        },
        onCheckedChange: {
            action: 'checked changed',
            description: 'Switch dəyəri dəyişdikdə çağırılan funksiyadır. Yeni dəyəri qaytarır.',
        },
        className: {
            control: 'text',
            description: 'Switch-in əsas container-i üçün əlavə CSS class',
        },
        size: {
            control: { type: 'radio' },
            options: ['14', '16', '20'],
            description: 'Switch ölçüsü. 14, 16 və ya 20 dəyərləri qəbul edir.',
        },
        labelProps: {
            control: 'object',
            description:
                'Label (yazı) komponentinə aid əlavə atributlar. Məsələn: className, htmlFor, aria-label və s.',
        },
        controlProps: {
            control: 'object',
            description:
                'Control (track hissəsi) üçün əlavə atributlar. Stil, className, event handler-lar və s. ötürmək üçün.',
        },
        thumbProps: {
            control: 'object',
            description:
                'Thumb (daxili düymə) komponentinə aid əlavə atributlar. className, style və s. üçün istifadə olunur.',
        },
    },
    args: {
        label: '',
        disabled: false,
        size: '16',
        labelPosition: 'right',
    },
};

export default meta;

type Story = StoryObj<typeof S_Switch>;

export const Basic: Story = {
    name: 'Basic',
    args: {},
};
