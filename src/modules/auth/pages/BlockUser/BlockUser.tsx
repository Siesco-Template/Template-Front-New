import { useState } from 'react';

import { APP_URLS } from '@/services/config/url.config';

import { S_Button } from '@/ui';

import LockIcon from '../../shared/icons/lock.svg?react';
import WarningIcon from '../../shared/icons/warning-error.svg?react';
import { useCountdownToDate, useFormattedTimer } from '../../utils/hooks/Countdown';

const exampleDate = new Date(Date.now() + 8 * 60 * 60 * 1000);

enum BlockReason {
    MultipleFailedLogin = 1,
    UntilDate = 2,
    ViolationRules = 3,
    BySystem = 4,
    Deactive = 5,
}

const BlockUser = () => {
    const [reason] = useState<BlockReason>(BlockReason.UntilDate);

    const timeLeft = useCountdownToDate(exampleDate);
    const timer = useFormattedTimer(timeLeft);

    function getBlockNote() {
        switch (reason) {
            case BlockReason.MultipleFailedLogin:
                return 'İstifadəçi hesabınız çoxsaylı uğursuz giriş cəhdinə görə 1 saatlıq bloklanıb. Zəhmət olmasa, daha sonra yenidən cəhd edin.';

            case BlockReason.UntilDate:
                return (
                    <>
                        İstifadəçi hesabınız 10 uğursuz giriş cəhdinə görə təhlükəsizlik məqsədilə 24 saatlıq bloklanıb.
                        Girişə
                        <span className="font-semibold"> {timer} </span>
                        sonra yenidən icazə veriləcək.
                    </>
                );

            case BlockReason.ViolationRules:
                return 'Təhlükəsizlik qaydalarının pozulması səbəbilə hesabınıza müvəqqəti giriş məhdudiyyəti tətbiq olunub.';

            case BlockReason.BySystem:
                return 'Sistem  tərəfindən hesabınıza giriş məhdudiyyəti qoyulub.';

            case BlockReason.Deactive:
                return 'İstifadəçi hesabınız sistem qaydalarının pozulması səbəbilə daimi olaraq deaktiv edilib. Əlavə məlumat üçün dəstək komandası ilə əlaqə saxlayın.';
        }
    }

    return (
        <div className="w-full flex flex-col items-center gap-[32px] !mt-[80px]">
            <div className="flex flex-col gap-[8px] items-center">
                <div className="flex justify-center items-center w-[64px] aspect-square rounded-full bg-[rgba(0,77,221,0.06)]">
                    {reason == BlockReason.Deactive ? <WarningIcon /> : <LockIcon />}
                </div>

                <h3 className="text-center text-[#002C68] !text-[20px] font-medium">Giriş məhdudlaşdırılıb</h3>
            </div>

            <div className="w-full !p-[20px] bg-[#FFF] rounded-[16px] flex flex-col gap-[20px]">
                <p className="w-full text-center text-[#05194AB3] leading-[21px]">{getBlockNote()}</p>

                <S_Button type="button" variant="primary" color="secondary" as="link" to={APP_URLS.login()}>
                    Giriş səhifəsinə qayıt
                </S_Button>
            </div>
        </div>
    );
};

export default BlockUser;
