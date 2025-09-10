import React, { useState } from 'react';

import { MRT_RowData } from 'material-react-table';

import type { Meta, StoryObj } from '@storybook/react';

import Catalog from './index';

// Sample data types
interface User extends MRT_RowData {
    id: string;
    name: string;
    email: string;
    role: string;
    department: string;
    status: 'active' | 'inactive';
    createdAt: string;
}

interface Product extends MRT_RowData {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    supplier: string;
}

// Sample data
const sampleUsers: User[] = [
    {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Admin',
        department: 'IT',
        status: 'active',
        createdAt: '2024-01-15',
    },
    {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'Manager',
        department: 'HR',
        status: 'active',
        createdAt: '2024-02-20',
    },
    {
        id: '3',
        name: 'Bob Johnson',
        email: 'bob@example.com',
        role: 'Developer',
        department: 'IT',
        status: 'inactive',
        createdAt: '2024-03-10',
    },
    {
        id: '4',
        name: 'Alice Brown',
        email: 'alice@example.com',
        role: 'Analyst',
        department: 'Finance',
        status: 'active',
        createdAt: '2024-01-05',
    },
    {
        id: '5',
        name: 'Charlie Wilson',
        email: 'charlie@example.com',
        role: 'Designer',
        department: 'Marketing',
        status: 'active',
        createdAt: '2024-02-28',
    },
    {
        id: '6',
        name: 'David Chen',
        email: 'david@example.com',
        role: 'Developer',
        department: 'IT',
        status: 'active',
        createdAt: '2024-03-15',
    },
    {
        id: '7',
        name: 'Emma Davis',
        email: 'emma@example.com',
        role: 'Manager',
        department: 'Sales',
        status: 'active',
        createdAt: '2024-01-20',
    },
    {
        id: '8',
        name: 'Frank Miller',
        email: 'frank@example.com',
        role: 'Analyst',
        department: 'Finance',
        status: 'inactive',
        createdAt: '2024-02-10',
    },
    {
        id: '9',
        name: 'Grace Lee',
        email: 'grace@example.com',
        role: 'Designer',
        department: 'Marketing',
        status: 'active',
        createdAt: '2024-03-05',
    },
    {
        id: '10',
        name: 'Henry Taylor',
        email: 'henry@example.com',
        role: 'Admin',
        department: 'IT',
        status: 'active',
        createdAt: '2024-01-30',
    },
    {
        id: '11',
        name: 'Ivy Garcia',
        email: 'ivy@example.com',
        role: 'Manager',
        department: 'HR',
        status: 'active',
        createdAt: '2024-02-25',
    },
    {
        id: '12',
        name: 'Jack Thompson',
        email: 'jack@example.com',
        role: 'Developer',
        department: 'IT',
        status: 'inactive',
        createdAt: '2024-03-12',
    },
    {
        id: '13',
        name: 'Kate Martinez',
        email: 'kate@example.com',
        role: 'Analyst',
        department: 'Finance',
        status: 'active',
        createdAt: '2024-01-18',
    },
    {
        id: '14',
        name: 'Leo Rodriguez',
        email: 'leo@example.com',
        role: 'Designer',
        department: 'Marketing',
        status: 'active',
        createdAt: '2024-02-08',
    },
];

const sampleProducts: Product[] = [
    { id: '1', name: 'Laptop', category: 'Electronics', price: 999.99, stock: 50, supplier: 'TechCorp' },
    { id: '2', name: 'Mouse', category: 'Electronics', price: 29.99, stock: 200, supplier: 'TechCorp' },
    { id: '3', name: 'Desk Chair', category: 'Furniture', price: 199.99, stock: 25, supplier: 'OfficeMax' },
    { id: '4', name: 'Coffee Mug', category: 'Kitchen', price: 12.99, stock: 100, supplier: 'HomeGoods' },
    { id: '5', name: 'Notebook', category: 'Stationery', price: 5.99, stock: 500, supplier: 'PaperCo' },
    { id: '6', name: 'Monitor', category: 'Electronics', price: 299.99, stock: 30, supplier: 'TechCorp' },
    { id: '7', name: 'Desk Lamp', category: 'Furniture', price: 45.99, stock: 75, supplier: 'OfficeMax' },
    { id: '8', name: 'Water Bottle', category: 'Kitchen', price: 18.99, stock: 150, supplier: 'HomeGoods' },
];

type CatalogStoryArgs = {
    multiple: boolean;
    title?: string;
    label?: string;

    // story-only controls mapped into selectProps
    selectState?: 'default' | 'success' | 'error';
    selectSize?: '36' | '44' | '48' | '52';
    selectDisabled?: boolean;
    selectDescription?: string;
    selectPlaceholder?: string;
};

// 👇 type Meta with our custom args (not the component props)
const meta: Meta<CatalogStoryArgs> = {
    title: 'Shared/Catalog',
    component: Catalog,
    tags: ['autodocs'],
    parameters: {
        controls: {
            expanded: true,
            exclude: ['enableModal', 'sizePreset', 'showMoreColumns', 'onRefetch', 'onClickNew'],
        },
        layout: 'padded',
    },
    argTypes: {
        multiple: {
            control: 'boolean',
            description: 'Enable multiple selection',
            defaultValue: false,
        },
        title: {
            control: 'text',
            description: 'Default placeholder for the select (overridden by selectPlaceholder)',
            defaultValue: 'Select Item',
        },
        label: {
            control: 'text',
            description: 'Label above the select input',
            defaultValue: 'Label',
        },

        // ✅ story-only controls
        selectState: {
            control: { type: 'inline-radio' },
            options: ['default', 'success', 'error'],
            description: 'Visual state passed to inner CatalogSelect',
        },
        selectSize: {
            control: { type: 'select' },
            options: ['36', '44', '48', '52'],
            description: 'Size passed to inner CatalogSelect',
        },
        selectDisabled: {
            control: 'boolean',
            description: 'Disable the inner CatalogSelect',
        },
        selectDescription: {
            control: 'text',
            description: 'Description under the select',
        },
        selectPlaceholder: {
            control: 'text',
            description: 'Overrides title as placeholder',
        },

        // keep non-interactive props out of controls
        items: { control: false },
        value: { control: false },
        onChange: { control: false },
        getLabel: { control: false },
        getRowId: { control: false },
        totalItemCount: { control: false },
        selectProps: { control: false },
    },
    decorators: [
        (Story) => (
            <div style={{ padding: '20px', maxWidth: '600px' }}>
                <Story />
            </div>
        ),
    ],
};

export default meta;

type Story = StoryObj<typeof Catalog>;

// Helper
const onSelect =
    <T,>(setValue: React.Dispatch<React.SetStateAction<T[]>>) =>
    (selected: T | T[] | null) => {
        if (Array.isArray(selected)) setValue(selected);
        else if (selected) setValue([selected]);
        else setValue([]);
    };

// ------- USERS TEMPLATES --------
const UsersTemplate = (args: any) => {
    const [value, setValue] = useState<User[]>([]);
    return (
        <Catalog<User>
            items={sampleUsers}
            getLabel={(u) => u.name}
            getRowId={(u) => u.id}
            value={value}
            onChange={onSelect<User>(setValue)}
            totalItemCount={sampleUsers.length}
            enableModal={false}
            multiple={args.multiple}
            title={args.title}
            label={args.label}
            selectProps={{
                state: args.selectState ?? 'default',
                size: args.selectSize ?? '36',
                disabled: args.selectDisabled ?? false,
                description: args.selectDescription,
                placeholder: args.selectPlaceholder,
            }}
        />
    );
};

export const Default: Story = {
    args: {
        multiple: false,
        title: 'Select User',
        label: 'User',
        selectState: 'default',
        selectSize: '36',
        selectDisabled: false,
        selectDescription: 'Pick a single user',
        selectPlaceholder: undefined,
    },
    render: (args) => <UsersTemplate {...args} />,
};

export const MultipleSelection: Story = {
    args: {
        multiple: true,
        title: 'Select Users',
        label: 'Users',
        selectState: 'success',
        selectSize: '44',
        selectDisabled: false,
        selectDescription: 'Choose one or more users',
    },
    render: (args) => <UsersTemplate {...args} />,
};

export const WithPreselectedValues: Story = {
    args: {
        multiple: true,
        title: 'Select Users',
        label: 'Users (Pre-selected)',
        selectState: 'default',
        selectSize: '44',
    },
    render: (args) => {
        const [value, setValue] = useState<User[]>([sampleUsers[0], sampleUsers[2]]);
        return (
            <Catalog<User>
                items={sampleUsers}
                getLabel={(u) => u.name}
                getRowId={(u) => u.id}
                value={value}
                onChange={onSelect<User>(setValue)}
                totalItemCount={sampleUsers.length}
                enableModal={false}
                multiple={args.multiple}
                title={args.title}
                label={args.label}
                selectProps={{
                    state: args.selectState ?? 'default',
                    size: args.selectSize ?? '44',
                    description: 'Already selected 2 users',
                }}
            />
        );
    },
};

export const LongLabelHandling: Story = {
    args: {
        multiple: true,
        title: 'Select Items with Long Names',
        label: 'Long Names Test',
        selectState: 'default',
        selectSize: '48',
        selectDescription: 'Stress test long labels',
    },
    render: (args) => {
        const longNameUsers = sampleUsers.map((user) => ({
            ...user,
            name: `${user.name} - Senior ${user.role} Manager with Extended Department Responsibilities`,
        }));
        const [value, setValue] = useState<User[]>([]);
        return (
            <Catalog<User>
                items={longNameUsers}
                getLabel={(u) => u.name}
                getRowId={(u) => u.id}
                value={value}
                onChange={onSelect<User>(setValue)}
                totalItemCount={longNameUsers.length}
                enableModal={false}
                multiple={args.multiple}
                title={args.title}
                label={args.label}
                selectProps={{
                    state: args.selectState ?? 'default',
                    size: args.selectSize ?? '48',
                    description: args.selectDescription,
                }}
            />
        );
    },
};

export const EmptyState: Story = {
    args: {
        multiple: false,
        title: 'No items available',
        label: 'Empty Catalog',
        selectState: 'error',
        selectSize: '36',
        selectPlaceholder: 'Empty…',
        selectDescription: 'Nothing to select',
    },
    render: (args) => {
        const [value, setValue] = useState<User[]>([]);
        return (
            <Catalog<User>
                items={[]}
                getLabel={(u) => u.name}
                getRowId={(u) => u.id}
                value={value}
                onChange={onSelect<User>(setValue)}
                totalItemCount={0}
                enableModal={false}
                multiple={args.multiple}
                title={args.title}
                label={args.label}
                selectProps={{
                    state: args.selectState ?? 'error',
                    size: args.selectSize ?? '36',
                    placeholder: args.selectPlaceholder,
                    description: args.selectDescription,
                }}
            />
        );
    },
};

export const DisabledState: Story = {
    args: {
        multiple: false,
        title: 'Disabled Catalog',
        label: 'Disabled',
        selectState: 'default',
        selectSize: '36',
        selectDisabled: true,
        selectDescription: 'This control is disabled',
    },
    render: (args) => <UsersTemplate {...args} />,
};

// ------- PRODUCTS TEMPLATE --------
export const ProductCatalog: Story = {
    args: {
        multiple: true,
        title: 'Select Products',
        label: 'Products',
        selectState: 'default',
        selectSize: '36',
        selectDescription: 'Pick products to add',
    },
    render: (args) => {
        const [value, setValue] = useState<Product[]>([]);
        return (
            <Catalog<Product>
                items={sampleProducts}
                getLabel={(p) => `${p.name} - $${p.price}`}
                getRowId={(p) => p.id}
                value={value}
                onChange={onSelect<Product>(setValue)}
                totalItemCount={sampleProducts.length}
                enableModal={false}
                multiple={args.multiple}
                title={args.title}
                label={args.label}
                selectProps={{
                    state: args.selectState ?? 'default',
                    size: args.selectSize ?? '36',
                    description: args.selectDescription,
                }}
            />
        );
    },
};
