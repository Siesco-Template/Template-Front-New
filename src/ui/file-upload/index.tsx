import React, { useState } from 'react';

import { NotesIcon, TrashIcon } from '@/shared/icons';

import styles from './style.module.css';

const File_Upload = ({ onChange, error }: any) => {
    const [images, setImages] = useState<File[]>([]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.length) {
            const newImages = Array.from(event.target.files);
            setImages((prev) => [...prev, ...newImages]);
            onChange([...images, ...newImages]);
        }
    };

    const removeImage = (index: number) => {
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);
        onChange(updatedImages);
    };

    return (
        <div className={styles.imageUpload}>
            <label className={styles.uploadBox}>
                <input type="file" accept="image/*" multiple onChange={handleFileChange} hidden />
                <div className={styles.uploadContent}>
                    <span className={styles.uploadIcon}>
                        <NotesIcon />
                    </span>
                    <div className={styles.uploadText}>
                        <p>Şəkil əlavə et *</p>
                        <small>Max 20 MB</small>
                    </div>
                </div>
            </label>
            {error && <p className={styles.errorText}>{error}</p>}
            <div className={styles.imagePreviewContainer}>
                {images.map((image, index) => (
                    <div key={index} className={styles.imagePreview}>
                        <div className={styles.image_info}>
                            <img src={URL.createObjectURL(image)} alt="preview" className={styles.previewImage} />
                            <div className={styles.image_size}>
                                <span className={styles.fileName}>{image.name}</span>
                                <h6 className={styles.fileSize}>{(image.size / 1024 / 1024).toFixed(2)} MB</h6>
                            </div>
                        </div>
                        <button type="button" className={styles.removeButton} onClick={() => removeImage(index)}>
                            <TrashIcon width={24} color="#123640" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default File_Upload;
