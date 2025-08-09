import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';

import { reportService } from '@/services/report/report.service';

import { RightArrowIcon, SearchIcon } from '@/shared/icons';

import { S_Input } from '@/ui';
import PageHeader from '@/ui/page-header';

import styles from '../style.module.css';

const data = [
    { label: 'Əlavə №1', slug: 'elave-1' },
    { label: 'Əlavə №2', slug: 'elave-2' },
    { label: 'Əlavə №3', slug: 'elave-3' },
];

const BudceHesabatlari = () => {
    const [hasPermission, setHasPermission] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkPermission = async () => {
            try {
                // await reportService.getAllReports();
                setHasPermission(true);
            } catch (error) {
                // @ts-expect-error
                if (error.status === 403) {
                    toast.error('Bu səhifəyə giriş icazəniz yoxdur.');
                    setHasPermission(false);
                    return;
                }
                setHasPermission(true);
                return;
            }
        };

        checkPermission();
    }, []);

    const renderLabel = (label: string) => {
        const [prefix, suffix] = label.split('№');
        return (
            <>
                {prefix}
                <span style={{ fontFamily: '"Segoe UI", "Noto Sans", Arial, sans-serif' }}>№</span>
                {suffix}
            </>
        );
    };

    if (!hasPermission) {
        return null;
    }

    return (
        <div className={styles.container}>
            <PageHeader
                title="Büdcə hesabatları"
                rightSide={
                    <div className={styles.inputForReports}>
                        <S_Input
                            type="text"
                            placeholder="Axtar"
                            icon={<SearchIcon color="hsl(var(--clr-grey-25))" />}
                            iconPosition="left"
                            inputSize="default"
                            className={styles.inputForReports}
                        />
                    </div>
                }
            />
            <div className={styles.cardGrid}>
                <div className={styles.cards}>
                    {data.map(({ label, slug }) => (
                        <div
                            key={slug}
                            className={styles.card}
                            onClick={() => navigate(`/hesabatlar/budce-hesabatlari/${slug}`)}
                        >
                            <span>{renderLabel(label)}</span>
                            <div className={styles.iconWrapper}>
                                <RightArrowIcon width={20} height={20} className={styles.icon} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BudceHesabatlari;
