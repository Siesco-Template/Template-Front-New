import { useNavigate } from 'react-router';

import notFoundImage from '@/shared/images/not-found.png';

import { S_Button } from '@/ui';

import styles from './style.module.css';

const NotFoundPage = () => {
    const navigate = useNavigate();
    return (
        <section className={styles.not_found}>
            <h1>Deyəsən, bu səhifə işləmir</h1>
            <S_Button children="Əsas səhifəyə qayıt" className={styles.btn} onClick={() => navigate('/')} />
            <img src={notFoundImage} alt="" />
        </section>
    );
};

export default NotFoundPage;
