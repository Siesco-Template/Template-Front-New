import React, { useEffect, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import S_Checkbox from '.';

const meta: Meta<typeof S_Checkbox> = {
    title: 'UI/Checkbox',
    component: S_Checkbox,
    tags: ['autodocs'],
    parameters: { layout: 'padded' },
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

/** Controlled default checkbox that syncs with the controls panel */
export const Default: Story = {
    args: { checked: false, indeterminate: false, label: 'Checkbox' },
    render: (args, { updateArgs }) => {
        const [checkedState, setCheckedState] = useState(args.checked);
        const [indeterminate, setIndeterminate] = useState<boolean>(!!args.indeterminate);

        useEffect(() => setCheckedState(!!args.checked), [args.checked]);
        useEffect(() => setIndeterminate(!!args.indeterminate), [args.indeterminate]);

        return (
            <S_Checkbox
                {...args}
                checked={indeterminate ? false : checkedState}
                indeterminate={indeterminate}
                onCheckedChange={(e) => {
                    // Ark returns { checked: true | false | 'indeterminate' }
                    if (e.checked === 'indeterminate') {
                        setIndeterminate(true);
                        setCheckedState(false);
                        updateArgs({ indeterminate: true, checked: false });
                    } else {
                        setIndeterminate(false);
                        setCheckedState(!!e.checked);
                        updateArgs({ indeterminate: false, checked: !!e.checked });
                    }
                }}
            />
        );
    },
};

/** Starts in indeterminate state; first click -> checked, then toggles as normal */
export const Indeterminate: Story = {
    args: { label: 'Indeterminate', indeterminate: true, checked: false },
    render: (args, { updateArgs }) => {
        const [checked, setChecked] = useState<boolean>(!!args.checked);
        const [indeterminate, setIndeterminate] = useState<boolean>(true);

        return (
            <S_Checkbox
                {...args}
                checked={checked}
                indeterminate={indeterminate}
                onCheckedChange={(e) => {
                    if (e.checked === 'indeterminate') {
                        setIndeterminate(true);
                        setChecked(false);
                        updateArgs({ indeterminate: true, checked: false });
                    } else {
                        // leave indeterminate mode after first click
                        setIndeterminate(false);
                        setChecked(!!e.checked);
                        updateArgs({ indeterminate: false, checked: !!e.checked });
                    }
                }}
            />
        );
    },
};

/** Show all supported sizes */
export const Sizes: Story = {
    render: (args) => (
        <div style={{ display: 'grid', gap: 12 }}>
            <S_Checkbox {...args} size="14" label="Size 14" />
            <S_Checkbox {...args} size="16" label="Size 16" />
            <S_Checkbox {...args} size="20" label="Size 20" />
        </div>
    ),
};

/** Disabled examples (checked & unchecked) */
export const Disabled: Story = {
    render: (args) => (
        <div style={{ display: 'grid', gap: 12 }}>
            <S_Checkbox {...args} disabled label="Disabled (unchecked)" checked={false} />
            <S_Checkbox {...args} disabled label="Disabled (checked)" checked />
        </div>
    ),
};

/** No label (icon-only) */
export const NoLabel: Story = {
    args: { label: '' },
    render: (args) => <S_Checkbox {...args} />,
};

/** Tri-state cycle demo: indeterminate -> checked -> unchecked -> repeat */
export const TriStateCycle: Story = {
    args: { label: 'Tri-state (click to cycle)', indeterminate: true, checked: false },
    render: (args) => {
        const [mode, setMode] = useState<'indeterminate' | 'checked' | 'unchecked'>('indeterminate');

        const toProps = () => {
            if (mode === 'indeterminate') return { indeterminate: true, checked: true };
            if (mode === 'checked') return { indeterminate: false, checked: true };
            return { indeterminate: false, checked: false };
        };

        return (
            <S_Checkbox
                {...args}
                {...toProps()}
                onCheckedChange={() => {
                    setMode((m) =>
                        m === 'indeterminate' ? 'checked' : m === 'checked' ? 'unchecked' : 'indeterminate'
                    );
                }}
            />
        );
    },
};
