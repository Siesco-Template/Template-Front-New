import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import File_Upload from '.';

const mockFile = (name: string, sizeMB: number): File =>
    new File([''], name, { type: 'image/png', lastModified: Date.now() });

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
            </div>
        );
    },
};

export const AllStates: Story = {
    args: {
        defaultFiles: [
            {
                file: new File([''], 'uploading_file.png', { type: 'image/png' }),
                status: 'uploading',
                progress: 50,
            },
            {
                file: new File([''], 'completed_file.pdf', { type: 'application/pdf' }),
                status: 'completed',
                progress: 100,
            },
            {
                file: new File([''], 'failed_file.png', { type: 'image/png' }),
                status: 'failed',
                progress: 100,
            },
            {
                file: new File([''], 'invalid_file.exe', { type: 'application/x-msdownload' }),
                status: 'invalid',
                progress: 100,
                errorMessage: 'File format is not valid',
            },
        ],
    },
    render: (args) => (
        <div style={{ width: 400 }}>
            <File_Upload {...args} onChange={() => {}} />
        </div>
    ),
};
