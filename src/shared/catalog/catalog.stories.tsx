import React, { useState } from 'react';

import { MRT_RowData } from 'material-react-table';

import type { Meta, StoryObj } from '@storybook/react';

import Catalog, { PresetSize } from '.';
import { CustomMRTColumn } from '../table';

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
        name: 'Charlie Wilson',
        email: 'charlie@example.com',
        role: 'Designer',
        department: 'Marketing',
        status: 'active',
        createdAt: '2024-02-28',
    },
    {
        id: '7',
        name: 'Charlie Wilson',
        email: 'charlie@example.com',
        role: 'Designer',
        department: 'Marketing',
        status: 'active',
        createdAt: '2024-02-28',
    },
    {
        id: '8',
        name: 'Charlie Wilson',
        email: 'charlie@example.com',
        role: 'Designer',
        department: 'Marketing',
        status: 'active',
        createdAt: '2024-02-28',
    },
    {
        id: '9',
        name: 'Charlie Wilson',
        email: 'charlie@example.com',
        role: 'Designer',
        department: 'Marketing',
        status: 'active',
        createdAt: '2024-02-28',
    },
    {
        id: '10',
        name: 'Charlie Wilson',
        email: 'charlie@example.com',
        role: 'Designer',
        department: 'Marketing',
        status: 'active',
        createdAt: '2024-02-28',
    },
    {
        id: '11',
        name: 'Charlie Wilson',
        email: 'charlie@example.com',
        role: 'Designer',
        department: 'Marketing',
        status: 'active',
        createdAt: '2024-02-28',
    },
    {
        id: '12',
        name: 'Charlie Wilson',
        email: 'charlie@example.com',
        role: 'Designer',
        department: 'Marketing',
        status: 'active',
        createdAt: '2024-02-28',
    },
    {
        id: '13',
        name: 'Charlie Wilson',
        email: 'charlie@example.com',
        role: 'Designer',
        department: 'Marketing',
        status: 'active',
        createdAt: '2024-02-28',
    },
    {
        id: '14',
        name: 'Charlie Wilson',
        email: 'charlie@example.com',
        role: 'Designer',
        department: 'Marketing',
        status: 'active',
        createdAt: '2024-02-28',
    },
];

const sampleProducts: Product[] = [
    { id: '1', name: 'Laptop', category: 'Electronics', price: 999.99, stock: 50, supplier: 'TechCorp' },
    { id: '2', name: 'Mouse', category: 'Electronics', price: 29.99, stock: 200, supplier: 'TechCorp' },
    { id: '3', name: 'Desk Chair', category: 'Furniture', price: 199.99, stock: 25, supplier: 'OfficeMax' },
    { id: '4', name: 'Coffee Mug', category: 'Kitchen', price: 12.99, stock: 100, supplier: 'HomeGoods' },
    { id: '5', name: 'Notebook', category: 'Stationery', price: 5.99, stock: 500, supplier: 'PaperCo' },
];

// Column definitions for modal tables
const userColumns: CustomMRTColumn<User>[] = [
    { accessorKey: 'name', header: 'Name', filterVariant: 'text' },
    { accessorKey: 'email', header: 'Email', filterVariant: 'text' },
    {
        accessorKey: 'role',
        header: 'Role',
        filterVariant: 'select',
        filterSelectOptions: [
            { label: 'Admin', value: 'Admin' },
            { label: 'Manager', value: 'Manager' },
            { label: 'Developer', value: 'Developer' },
            { label: 'Analyst', value: 'Analyst' },
            { label: 'Designer', value: 'Designer' },
        ],
    },
    {
        accessorKey: 'department',
        header: 'Department',
        filterVariant: 'select',
        filterSelectOptions: [
            { label: 'IT', value: 'IT' },
            { label: 'HR', value: 'HR' },
            { label: 'Finance', value: 'Finance' },
            { label: 'Marketing', value: 'Marketing' },
        ],
    },
    {
        accessorKey: 'status',
        header: 'Status',
        filterVariant: 'select',
        filterSelectOptions: [
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' },
        ],
    },
];

const productColumns: CustomMRTColumn<Product>[] = [
    { accessorKey: 'name', header: 'Product Name', filterVariant: 'text' },
    {
        accessorKey: 'category',
        header: 'Category',
        filterVariant: 'select',
        filterSelectOptions: [
            { label: 'Electronics', value: 'Electronics' },
            { label: 'Furniture', value: 'Furniture' },
            { label: 'Kitchen', value: 'Kitchen' },
            { label: 'Stationery', value: 'Stationery' },
        ],
    },
    { accessorKey: 'price', header: 'Price', filterVariant: 'range' },
    { accessorKey: 'stock', header: 'Stock', filterVariant: 'range' },
    { accessorKey: 'supplier', header: 'Supplier', filterVariant: 'text' },
];

const sizePresets: PresetSize[] = ['md-lg', 'lg', 'xl', 'xxl'];

const meta: Meta<typeof Catalog> = {
    title: 'Shared/Catalog',
    component: Catalog,
    tags: ['autodocs'],
    parameters: {
        controls: { expanded: true },
        layout: 'padded',
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

// Base story with users data
export const SingleSelect: Story = {
    render: () => {
        const [value, setValue] = useState<User[]>([]);
        return (
            <Catalog<User>
                items={sampleUsers}
                getLabel={(user: User) => user.name}
                getRowId={(user: User) => user.id}
                value={value}
                onChange={(selected) => {
                    if (Array.isArray(selected)) {
                        setValue(selected);
                    } else if (selected) {
                        setValue([selected]);
                    } else {
                        setValue([]);
                    }
                }}
                multiple={false}
                enableModal={true}
                sizePreset="md-lg"
                showMoreColumns={userColumns}
                totalItemCount={sampleUsers.length}
                title="Select User"
                label="User"
            />
        );
    },
};

export const MultiSelect: Story = {
    render: () => {
        const [value, setValue] = useState<User[]>([]);
        return (
            <Catalog<User>
                items={sampleUsers}
                getLabel={(user: User) => user.name}
                getRowId={(user: User) => user.id}
                value={value}
                onChange={(selected) => {
                    if (Array.isArray(selected)) {
                        setValue(selected);
                    } else if (selected) {
                        setValue([selected]);
                    } else {
                        setValue([]);
                    }
                }}
                multiple={true}
                enableModal={true}
                sizePreset="md-lg"
                showMoreColumns={userColumns}
                totalItemCount={sampleUsers.length}
                title="Select Users"
                label="Users"
            />
        );
    },
};

export const ProductsCatalog: Story = {
    render: () => {
        const [value, setValue] = useState<Product[]>([]);
        return (
            <Catalog<Product>
                items={sampleProducts}
                getLabel={(product: Product) => product.name}
                getRowId={(product: Product) => product.id}
                value={value}
                onChange={(selected) => {
                    if (Array.isArray(selected)) {
                        setValue(selected);
                    } else if (selected) {
                        setValue([selected]);
                    } else {
                        setValue([]);
                    }
                }}
                multiple={true}
                enableModal={true}
                sizePreset="xl"
                showMoreColumns={productColumns}
                totalItemCount={sampleProducts.length}
                title="Select Products"
                label="Products"
            />
        );
    },
};

export const WithoutModal: Story = {
    render: () => {
        const [value, setValue] = useState<User[]>([]);
        return (
            <Catalog<User>
                items={sampleUsers}
                getLabel={(user: User) => user.name}
                getRowId={(user: User) => user.id}
                value={value}
                onChange={(selected) => {
                    if (Array.isArray(selected)) {
                        setValue(selected);
                    } else if (selected) {
                        setValue([selected]);
                    } else {
                        setValue([]);
                    }
                }}
                multiple={false}
                enableModal={false}
                totalItemCount={sampleUsers.length}
                title="Select User"
                label="User (No Modal)"
            />
        );
    },
};

export const LoadingState: Story = {
    render: () => {
        const [value, setValue] = useState<User[]>([]);
        return (
            <Catalog<User>
                items={[]}
                getLabel={(user: User) => user.name}
                getRowId={(user: User) => user.id}
                value={value}
                onChange={(selected) => {
                    if (Array.isArray(selected)) {
                        setValue(selected);
                    } else if (selected) {
                        setValue([selected]);
                    } else {
                        setValue([]);
                    }
                }}
                multiple={false}
                enableModal={true}
                sizePreset="md-lg"
                showMoreColumns={userColumns}
                totalItemCount={0}
                isLoading={true}
                title="Loading Users"
                label="Users"
            />
        );
    },
};

export const LargeDataset: Story = {
    render: () => {
        const [value, setValue] = useState<User[]>([]);
        const largeDataset = Array.from({ length: 100 }, (_, i) => ({
            id: String(i + 1),
            name: `User ${i + 1}`,
            email: `user${i + 1}@example.com`,
            role: ['Admin', 'Manager', 'Developer', 'Analyst', 'Designer'][i % 5],
            department: ['IT', 'HR', 'Finance', 'Marketing', 'Sales'][i % 5],
            status: i % 3 === 0 ? 'inactive' : ('active' as const),
            createdAt: new Date(2024, 0, i + 1).toISOString().split('T')[0],
        })) as User[];

        return (
            <Catalog<User>
                items={largeDataset}
                getLabel={(user: User) => user.name}
                getRowId={(user: User) => user.id}
                value={value}
                onChange={(selected) => {
                    if (Array.isArray(selected)) {
                        setValue(selected);
                    } else if (selected) {
                        setValue([selected]);
                    } else {
                        setValue([]);
                    }
                }}
                multiple={true}
                enableModal={true}
                sizePreset="xxl"
                showMoreColumns={userColumns}
                totalItemCount={100}
                title="Select from Large Dataset"
                label="Large Dataset"
            />
        );
    },
};

export const WithCallbacks: Story = {
    render: () => {
        const [value, setValue] = useState<User[]>([]);
        return (
            <Catalog<User>
                items={sampleUsers}
                getLabel={(user: User) => user.name}
                getRowId={(user: User) => user.id}
                value={value}
                onChange={(selected) => {
                    console.log('Selection changed:', selected);
                    if (Array.isArray(selected)) {
                        setValue(selected);
                    } else if (selected) {
                        setValue([selected]);
                    } else {
                        setValue([]);
                    }
                }}
                multiple={true}
                enableModal={true}
                sizePreset="lg"
                showMoreColumns={userColumns}
                totalItemCount={sampleUsers.length}
                title="With Callbacks"
                label="Users"
                onRefetch={() => console.log('Refetching data...')}
                onClickNew={() => console.log('Adding new user...')}
            />
        );
    },
};

// Size preset variations
export const SizePresets: Story = {
    render: () => {
        const [selectedSize, setSelectedSize] = useState<PresetSize>('md-lg');
        const [value, setValue] = useState<User[]>([]);

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    {sizePresets.map((size) => (
                        <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            style={{
                                padding: '8px 16px',
                                border: selectedSize === size ? '2px solid #007bff' : '1px solid #ccc',
                                borderRadius: '4px',
                                background: selectedSize === size ? '#e3f2fd' : 'white',
                                cursor: 'pointer',
                            }}
                        >
                            {size}
                        </button>
                    ))}
                </div>

                <Catalog<User>
                    items={sampleUsers}
                    getLabel={(user: User) => user.name}
                    getRowId={(user: User) => user.id}
                    value={value}
                    onChange={(selected) => {
                        if (Array.isArray(selected)) {
                            setValue(selected);
                        } else if (selected) {
                            setValue([selected]);
                        } else {
                            setValue([]);
                        }
                    }}
                    multiple={true}
                    enableModal={true}
                    sizePreset={selectedSize}
                    showMoreColumns={userColumns}
                    totalItemCount={sampleUsers.length}
                    title={`Size: ${selectedSize}`}
                    label="Size Preset Demo"
                />
            </div>
        );
    },
};
