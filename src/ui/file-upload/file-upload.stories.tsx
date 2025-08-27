import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import File_Upload from '.';

const meta: Meta<typeof File_Upload> = {
    title: 'UI/Upload',
    component: File_Upload,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
};

export default meta;
type Story = StoryObj<typeof File_Upload>;

export const Default: Story = {
    render: (args) => {
        const [files, setFiles] = useState<File[]>([]);

        return (
            <div style={{ width: 400 }}>
                <File_Upload
                    {...args}
                    onChange={(newFiles: File[]) => {
                        console.log('Selected files:', newFiles);
                        setFiles(newFiles);
                    }}
                />
                <pre style={{ fontSize: 12, marginTop: 16 }}>
                    {files.length > 0 &&
                        files.map((file, i) => `${i + 1}. ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)\n`)}
                </pre>
            </div>
        );
    },
};

export const WithError: Story = {
    render: (args) => (
        <div style={{ width: 400 }}>
            <File_Upload
                {...args}
                error="Zəhmət olmasa bir şəkil seçin"
                onChange={(files: File[]) => console.log('Selected files:', files)}
            />
        </div>
    ),
};
