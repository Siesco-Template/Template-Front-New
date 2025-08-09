import React, { useEffect, useState } from 'react'
import { Button } from '../../components/Button'
import OTPInput from '../../components/OtpInput/OtpInput'
import { useLocation, useNavigate } from 'react-router'
import { APP_URLS } from '@/services/config/url.config'

const otpLength = 4

const Otp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const phoneNumber = location?.state?.phoneNumber;  

  useEffect(() => {
    if (!phoneNumber) {
      navigate(APP_URLS.forgot_password())
    }
  }, [phoneNumber])
  
  const [ otpCode, setOtpCode ] = useState<string>("");
  const [ validationError, setValidationError ] = useState<boolean>(false)

  async function handleSubmit(otp?: string) {
    const code = otp || otpCode;

    if (code.length == otpLength) {
      setValidationError(false)

      //  fetch

      // navigate(APP_URLS.set_password(), {        //   after success fetch
      //   state: {phoneNumber}
      // })

    } else {
      setValidationError(true)
    }
  }

  async function reSend() {
    //  fetch: send otp to phone number 
  }
  

  return (
    <div className='w-full flex flex-col items-center gap-[32px]'>
      <h3 className='text-center text-[#002C68] !text-[20px] font-medium'>
        Şifrəni unutmusunuz?
      </h3>

      <p className='w-[74%] text-center text-[#05194AB3] leading-[21px]'>
        Narahat olmayın! Aşağıdakı sahəyə əlaqə nömrənizi daxil edin və sizə şifrəni sıfırlamaq üçün OTP kod göndərək.
      </p>

      <form 
        className='w-full !p-[20px] bg-[#FFF] rounded-[16px]'
        onSubmit={e => {
          e.preventDefault();
          handleSubmit()
        }}
      >
        <div className='flex justify-center'>
          <OTPInput
            length={otpLength}
            // onSubmit={(code) => handleSubmit(code)}      // yazan kimi submit olmaq ucun
            onChange={(code) => setOtpCode(code)}
            error={validationError}
          />
        </div>

        <Button
          type='submit'
          variant="primary"
          className='w-full !mt-[20px]'
        >
          Təsdiqlə
        </Button>
        
        <div className='flex justify-end items-center gap-[4px] !mt-[4px]'>
          <p className='!text-[#546881] !text-[14px] font-normal font-plus-jakarta'>
            {otpLength}-rəqəmli kod əldə etdinizmi?
          </p>
          <Button
            type='button'
            variant="ghost"
            className='!p-[2px_3px]'
            onClick={() => reSend()}
          >
            Yenidən göndər
          </Button>
        </div>
      </form>

    </div>
  )
}

export default Otp