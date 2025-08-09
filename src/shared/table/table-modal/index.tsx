import { Modal } from 'antd';
import React from 'react';

import styles from './style.module.css';

interface DetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children?: React.ReactNode;
}

const DetailModal = ({ isOpen, onClose, title = 'Detallar', children }: DetailModalProps) => {
    return (
        <Modal open={isOpen} onCancel={onClose} footer={null} centered width={400} className={styles.customModal}>
            <h2 className={styles.modalTitle}>{title}</h2>
            <div className={styles.modalContent}>{children}</div>
        </Modal>
    );
};

export default DetailModal;
