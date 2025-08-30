import { useEffect, useState } from 'react';

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

export const Default: Story = {
    args: { checked: false, label: 'Checked' },
    render: (args, { updateArgs }) => {
        const [checkedState, setCheckedState] = useState(args.checked);
        useEffect(() => setCheckedState(args.checked ?? false), [args.checked]);

        return (
            <S_Checkbox
                {...args}
                checked={checkedState}
                onCheckedChange={(e) => {
                    if (e.checked !== 'indeterminate') {
                        setCheckedState(e.checked === true);
                        updateArgs({ checked: e.checked === true, indeterminate: false });
                    }
                }}
            />
        );
    },
};
