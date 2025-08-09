import { AnimatePresence, motion } from 'framer-motion';

import { RemoveIcon } from '../../icons';
import styles from './style.module.css';

const modalVariants = {
    hidden: { y: '100%' },
    visible: { y: 0 },
    exit: { y: '100%' },
};

interface BottomModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
}

const BottomModal = ({ isOpen, onClose, children, title }: BottomModalProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className={styles.overlay} onClick={onClose}>
                    <motion.div
                        className={styles.modal}
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                        onClick={(e: any) => e.stopPropagation()}
                    >
                        <button className={styles.externalCloseBtn} onClick={onClose}>
                            <RemoveIcon width={16} height={16} color="#fff" />
                        </button>
                        <div className={styles.content}>{children}</div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default BottomModal;
