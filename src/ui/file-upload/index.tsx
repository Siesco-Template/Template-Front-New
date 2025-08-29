import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';

import { UploadFileIcon, XIcon } from '@/shared/icons';

import S_Button from '../button';
import { SuccessIcon } from '../toast/icons';
import { FileIcon } from './icons';
import styles from './style.module.css';

type UploadFile = {
    file: File;
    status: 'uploading' | 'completed' | 'failed' | 'invalid';
    progress?: number;
    errorMessage?: string;
};

type Props = {
    onChange: (files: File[]) => void;
    error?: string;
    direction?: 'vertical' | 'horizontal';
    progressPosition?: 'bottom' | 'right';
    defaultFiles?: UploadFile[];
};

const File_Upload = ({
    onChange,
    error,
    direction = 'vertical',
    progressPosition = 'bottom',
    defaultFiles = [],
}: Props) => {
    const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (defaultFiles && defaultFiles.length > 0) {
            setUploadFiles(defaultFiles);
        }
    }, [defaultFiles]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.length) {
            const newFiles = Array.from(event.target.files).map((file) => ({
                file,
                status: 'uploading',
                progress: 0,
            }));
            const updated: any = [...uploadFiles, ...newFiles];
            setUploadFiles(updated);
            onChange(newFiles.map((f) => f.file));
            newFiles.forEach((f, i) => simulateUpload(f.file, uploadFiles.length + i));
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        const newFiles = Array.from(e.dataTransfer.files).map((file) => ({
            file,
            status: 'uploading',
            progress: 0,
        }));
        const updated: any = [...uploadFiles, ...newFiles];
        setUploadFiles(updated);
        onChange(newFiles.map((f) => f.file));
        newFiles.forEach((f, i) => simulateUpload(f.file, uploadFiles.length + i));
    };

    const simulateUpload = (file: File, index: number) => {
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            setUploadFiles((prev) => {
                const updated = [...prev];
                if (!updated[index]) return prev;
                updated[index] = {
                    ...updated[index],
                    progress,
                    status: progress >= 100 ? 'completed' : 'uploading',
                };
                return updated;
            });
            if (progress >= 100) clearInterval(interval);
        }, 300);
    };

    const removeFile = (index: number) => {
        const updated = [...uploadFiles];
        updated.splice(index, 1);
        setUploadFiles(updated);
        onChange(updated.map((f) => f.file));
    };

    return (
        <div
            className={clsx(styles.uploadWrapper, {
                [styles.horizontalProgress]: progressPosition === 'right',
                [styles.verticalProgress]: progressPosition === 'bottom',
            })}
        >
            <label
                className={styles.uploadBox}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={(e) => e.preventDefault()}
            >
                <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileChange} hidden />
                <div
                    className={clsx(styles.uploadContent, {
                        [styles.vertical]: direction === 'vertical',
                        [styles.horizontal]: direction === 'horizontal',
                    })}
                >
                    <span className={styles.uploadIcon}>
                        <UploadFileIcon width={60} height={60} />
                    </span>
                    <div className={styles.uploadText}>
                        <p>Drag & drop here</p>
                        <small>JPEG, PNG, PDF and MP4 format, up to 60MB</small>
                        <small>or</small>
                        <S_Button onClick={() => fileInputRef.current?.click()}>Select file</S_Button>
                    </div>
                </div>
            </label>

            {error && <p className={styles.errorText}>{error}</p>}

            {uploadFiles.length > 0 && (
                <div className={styles.uploadList}>
                    {uploadFiles.map((item, index) => (
                        <div
                            key={index}
                            className={clsx(styles.uploadItem, {
                                [styles.completed]: item.status === 'completed',
                                [styles.failed]: item.status === 'failed',
                                [styles.invalid]: item.status === 'invalid',
                            })}
                        >
                            <div className={styles.uploadItemLeft}>
                                <div className={styles.fileIcon}>
                                    <FileIcon />
                                </div>
                                <div className={styles.fileDetails}>
                                    <span className={styles.fileName}>{item.file.name}</span>
                                    <span className={styles.fileSize}>
                                        {(item.file.size / 1024 / 1024).toFixed(1)} MB of 12.8 MB
                                    </span>
                                    {item.status === 'uploading' && (
                                        <span className={styles.progressText}>{item.progress}%</span>
                                    )}
                                    {item.status === 'completed' && (
                                        <span className={styles.completedText}>Completed</span>
                                    )}
                                    {item.status === 'failed' && <span className={styles.failedText}>Failed</span>}
                                    {item.status === 'invalid' && (
                                        <span className={styles.errorMessage}>File format is not valid</span>
                                    )}
                                </div>
                            </div>
                            <button type="button" className={styles.removeButton} onClick={() => removeFile(index)}>
                                <XIcon />
                            </button>

                            {(item.status === 'uploading' || item.status === 'completed') && (
                                <div className={styles.progressBar}>
                                    <div
                                        className={styles.progress}
                                        style={{
                                            width: `${item.progress}%`,
                                            background: item.status === 'completed' ? '#12B76A' : '#1570EF',
                                        }}
                                    ></div>
                                </div>
                            )}
                            {item.status === 'failed' && (
                                <div className={styles.progressBar}>
                                    <div
                                        className={styles.progress}
                                        style={{ width: '100%', background: '#F04438' }}
                                    ></div>
                                </div>
                            )}
                            {item.status === 'invalid' && (
                                <div className={styles.progressBar}>
                                    <div
                                        className={styles.progress}
                                        style={{ width: '100%', background: '#FDB022' }}
                                    ></div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default File_Upload;
