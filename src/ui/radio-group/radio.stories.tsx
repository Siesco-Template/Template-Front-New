import React from 'react';
import { useState } from 'react';

import { Meta, StoryObj } from '@storybook/react';

import S_RadioGroup, { type RadioGroupSize } from '.';

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
        size: {
            control: { type: 'inline-radio' },
            options: ['14', '16', '20'] as RadioGroupSize[],
            description: 'Komponentin ölçüsü (css modulunda `size-<size>` klası ilə).',
            table: { type: { summary: `'14' | '16' | '20'` }, defaultValue: { summary: '-' } },
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
        size: '16',
    },
    render: (args) => <S_RadioGroup {...args} />,
};

export default meta;

type Story = StoryObj<TComp>;

export const VerticalDefault: Story = {};

export const Horizontal: Story = {
    args: {
        orientation: 'horizontal',
    },
};

export const WithObjects: Story = {
    args: {
        label: 'ID ilə obyektlər',
        groupData: [
            { id: 1, label: 'Bir' },
            { id: 2, label: 'İki' },
            { id: 3, label: 'Üç' },
        ],
    },
};

export const WithValueKey: Story = {
    args: {
        label: '`value` açarı ilə obyektlər',
        groupData: [
            { value: 'a', label: 'Alpha' },
            { value: 'b', label: 'Beta' },
            { value: 'g', label: 'Gamma' },
        ],
    },
};

export const DisabledItems: Story = {
    args: {
        label: 'Bəzi seçimlər deaktivdir',
        groupData: [
            { value: '1', label: 'Aktiv 1' },
            { value: '2', label: 'Deaktiv', disabled: true },
            { value: '3', label: 'Deaktiv', disabled: true },
            { value: '4', label: 'Aktiv 2' },
        ],
        value: '2',
    },
};

export const Sizes: Story = {
    render: (args) => (
        <div style={{ display: 'grid', gap: 16 }}>
            <S_RadioGroup {...args} size="14" label="Ölçü 14" name="rg-size-14" groupData={['A', 'B']} />
            <S_RadioGroup {...args} size="16" label="Ölçü 16" name="rg-size-16" groupData={['A', 'B']} />
            <S_RadioGroup {...args} size="20" label="Ölçü 20" name="rg-size-20" groupData={['A', 'B']} />
        </div>
    ),
};

export const Controlled: Story = {
    render: (args) => {
        const [val, setVal] = useState('2');
        return (
            <S_RadioGroup
                {...args}
                label="Kontrollü nümunə"
                name="rg-controlled"
                value={val}
                onValueChange={(detail) => setVal(detail.value)}
                groupData={[
                    { id: '1', label: 'Bir' },
                    { id: '2', label: 'İki' },
                    { id: '3', label: 'Üç' },
                ]}
            />
        );
    },
};
