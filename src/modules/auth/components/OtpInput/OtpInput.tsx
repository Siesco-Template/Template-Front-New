import React, { useRef } from "react";
import Input from "../input/input";

interface OTPInputProps {
  length?: number; 
  onSubmit?: (code: string) => void
  error?: boolean;
  onChange: (otpCode: string) => void;
}

const OTPInput = ({
  length = 4, 
  onSubmit,
  error,
  onChange,
}: OTPInputProps) => {
  const inputsRef = useRef<HTMLInputElement[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // yalnız rəqəm

    inputsRef.current[index].value = value;

    if (value && index < length - 1) {
      inputsRef.current[index + 1].focus();
    }

    const code = inputsRef.current.map((input) => input.value).join("");
    onChange(code)
    if (code.length === length) onSubmit?.(code);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !inputsRef.current[index].value && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  return (
    <div>
      <div className="w-min flex gap-[12px] justify-center">
        {Array(length).fill(0).map((_, i) => (
          <Input
            key={i}
            ref={(el) => {
              if (el) inputsRef.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            forOTP
            className="text-center"
          />
        ))}
      </div>
      {
        error &&
        <p className="!text-[12px] text-[#FF3B30] !mt-[4px]">
          OTP kodunu daxil edin
        </p>
      }
    </div>
  );
};

export default OTPInput;
