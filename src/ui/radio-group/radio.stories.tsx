import { Meta, StoryObj } from '@storybook/react';

import S_RadioGroup from '.';

type TComp = typeof S_RadioGroup;

const meta: Meta<TComp> = {
    title: 'UI/RadioGroup',
    component: S_RadioGroup,
    tags: ['autodocs'],
    parameters: { layout: 'centered' },
    argTypes: {
        label: {
            control: 'text',
            description: 'Qrupu təsvir edən başlıq (üst yazı).',
            table: { type: { summary: 'string' } },
        },
        orientation: {
            control: { type: 'inline-radio' },
            options: ['vertical', 'horizontal'],
            description: 'Radio elementlərin düzülüş istiqaməti.',
            table: { type: { summary: `'vertical' | 'horizontal'` }, defaultValue: { summary: 'vertical' } },
        },
        groupData: {
            control: 'object',
            description: 'Radio itemləri. `string[]` və ya obyekt: `{ id | value, label, disabled? }`.',
            table: { type: { summary: 'Array<string | {id|value,label,disabled?}>' } },
        },
        value: {
            control: 'text',
            description: 'Kontrollü dəyər. Verilərsə `onValueChange` ilə birlikdə istifadə olunmalıdır.',
            table: { type: { summary: 'string' } },
        },
        name: {
            control: 'text',
            description: 'Form inteqrasiyası üçün `name` atributu.',
            table: { type: { summary: 'string' } },
        },
        onValueChange: {
            action: 'onValueChange',
            description: 'Dəyər dəyişəndə çağırılır (`detail.value`).',
            table: { type: { summary: '(detail) => void' } },
        },
        className: { control: false },
    },
    args: {
        label: 'Seçim edin',
        orientation: 'vertical',
        groupData: ['Bir', 'İki', 'Üç'],
        name: 'rg-example',
    },
    render: (args) => <S_RadioGroup {...args} />,
};

export default meta;

type Story = StoryObj<TComp>;

export const VerticalDefault: Story = {};
