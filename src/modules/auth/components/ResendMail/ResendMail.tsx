import { S_Button } from '@/ui';

import { useCountdownFromSeconds, useFormattedTimer } from '../../utils/hooks/Countdown';
import styles from './style.module.css';

const resendInterval = 120; // saniyə olaraq 120

interface ResendMailProps {
    onClick: () => void;
    loading?: boolean;
}

const ResendMail = ({ onClick, loading }: ResendMailProps) => {
    const timeLeft = useCountdownFromSeconds(resendInterval);
    const timer = useFormattedTimer(timeLeft);

    function handleClick() {
        if (timeLeft > 0) return;
        onClick();
    }

    return (
        <div className={styles.wrapper}>
            <h3 className={styles.title}>Şifrəni unutmusunuz?</h3>

            <p className={styles.description}>
                Şifrənizi yeniləmək üçün sizə <b>nameusername@gmail.com</b> ünvanından göndərilən təlimatdakı linkə
                daxil ola bilərsiniz.
            </p>

            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <p className={styles.question}>Linki əldə etdinizmi</p>
                    <span className={styles.timer}>{timer}</span>
                </div>

                <S_Button
                    type="button"
                    variant="primary"
                    color="primary"
                    onClick={handleClick}
                    disabled={timeLeft > 0 || loading}
                    style={{ width: '100%' }}
                >
                    Yenidən göndər
                </S_Button>
            </div>
        </div>
    );
};

export default ResendMail;
