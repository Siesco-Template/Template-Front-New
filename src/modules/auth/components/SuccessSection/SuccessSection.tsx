import { Link } from 'react-router';

import { APP_URLS } from '@/services/config/url.config';

import { S_Button } from '@/ui';

import CheckIcon from '../../shared/icons/check.svg?react';

interface SuccessSectionProps {
    title?: string;
    description?: string;
}

const SuccessSection = ({ title, description }: SuccessSectionProps) => {
    return (
        <div className="w-full flex flex-col items-center gap-[32px] !mt-[80px]">
            <div className="flex justify-center items-center w-[64px] aspect-square rounded-full bg-[rgba(0,77,221,0.06)]">
                <CheckIcon />
            </div>

            <h3 className="text-center text-[#002C68] !text-[20px] font-medium">{title || 'Təbriklər!'}</h3>

            <p className="w-[74%] text-center text-[#05194AB3] leading-[21px]">{description}</p>

            <div className="w-full !p-[20px] bg-[#FFF] rounded-[16px]">
                <Link to={APP_URLS.login()} className="w-full">
                    <S_Button type="button" variant="primary" className="w-full">
                        Daxil ol
                    </S_Button>
                </Link>
            </div>
        </div>
    );
};

export default SuccessSection;
