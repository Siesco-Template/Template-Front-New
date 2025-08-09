import { useState } from 'react';
import { useNavigate } from 'react-router';

import { PlusIcon, TaskIcon } from '@/shared/icons';

import { S_Button } from '@/ui';
import Modal from '@/ui/modal';

import styles from './style.module.css';

const Header_content_other = ({
    text,
    modalContent,
    modal_heading,
    modal_paragraph,
    icon,
    redirectTo,
    onClose,
    onSubmit,
}: any) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleClose = () => {
        setIsModalOpen(false);
        onClose?.(); // reset çağırırıq
    };
    const navigate = useNavigate();

    const handleClick = () => {
        if (redirectTo) {
            navigate(redirectTo);
        } else {
            setIsModalOpen(true);
        }
    };

    const currentRoute = location.hash.replace('#', '');
    const hiddenButtonRoutes = ['/bildirisler'];
    const shouldShowButton = !hiddenButtonRoutes.includes(currentRoute);

    return (
        <>
            <section className={styles.header_content}>
                <h1>{text}</h1>
                {shouldShowButton && (
                    <S_Button onClick={handleClick} className={styles.btn}>
                        <PlusIcon /> Yarat
                    </S_Button>
                )}
            </section>

            <Modal open={isModalOpen} onOpenChange={handleClose} title={icon} className={styles.modal}>
                <h2>{modal_heading}</h2>
                <p>{modal_paragraph}</p>
                <div className={styles.modal_content}>
                    {isModalOpen && <div key={Number(isModalOpen)}>{modalContent}</div>}
                    <section className={styles.btn_group}>
                        <S_Button
                            onClick={handleClose}
                            children="Ləğv et"
                            variant="outlined-20"
                            className={styles.custombtn}
                        />
                        <S_Button
                            children="Təsdiq et"
                            className={styles.custombtn}
                            onClick={async () => {
                                const success = await onSubmit();
                                if (success) handleClose();
                            }}
                        />
                    </section>
                </div>
            </Modal>
        </>
    );
};

export default Header_content_other;
