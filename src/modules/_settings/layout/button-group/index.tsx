import React from 'react';
import { useNavigate } from 'react-router';

import { S_Button } from '@/ui';

import styles from './style.module.css';

const Button_group: React.FC<{ onSubmit: () => void; loading: any }> = ({ onSubmit, loading }) => {
    const navigate = useNavigate();

    return (
        <section className={styles.btn_group}>
            <S_Button onClick={() => navigate(-1)} children="Ləğv et" variant="outlined-20" className={styles.btn} />
            <S_Button
                children={loading ? 'Yüklənir...' : 'Təsdiq et'}
                className={styles.btn}
                onClick={() => !loading && onSubmit()}
                disabled={loading}
            />
        </section>
    );
};

export default Button_group;
