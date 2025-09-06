import { S_Button } from '@/ui';

import { useCountdownFromSeconds, useFormattedTimer } from '../../utils/hooks/Countdown';

const resendInterval = 360000;

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
        <div className="w-full flex flex-col items-center gap-[32px]">
            <h3 className="text-center text-[#002C68] !text-[20px] font-medium">Şifrəni unutmusunuz?</h3>

            <p className="w-[74%] text-center text-[#05194AB3] leading-[21px]">
                Şifrənizi yeniləmək üçün sizə
                {''} {'nameusername@gmail.com'} {''}
                ünvanından göndərilən təlimatdakı linkə daxil ola bilərsiniz.
            </p>

            <div className="w-full !p-[20px] bg-[#FFF] rounded-[16px]">
                <div className="w-full flex justify-between items-center gap-[16px]">
                    <p className="!text-[18px] text-[#003988] font-normal font-lato !mb-0">Linki əldə etdinizmi</p>
                    <span className="!text-[14px] text-[#0068F7] font-medium">{timer}</span>
                </div>

                <S_Button
                    type="button"
                    variant="primary"
                    color="primary"
                    onClick={handleClick}
                    disabled={timeLeft > 0 || loading}
                >
                    Yenidən göndər
                </S_Button>
            </div>
        </div>
    );
};

export default ResendMail;
