import { ForwardedRef, forwardRef, useState } from "react";
import Input from "./input";
import InputProps from "./input.types";
import EyeIcon from "../../shared/icons/eye.svg?react";
import EyeSlashIcon from "../../shared/icons/eye-slash.svg?react";

const InputPassword = forwardRef<HTMLInputElement, InputProps>(
  (allProps, ref: ForwardedRef<HTMLInputElement>) => {
    const { isPasswordInputWithEye, ...props } = allProps;
    const [passwordType, setPasswordType] = useState(true);

    const passwordIcon = () => (
      <div
        onClick={() => setPasswordType((prev) => !prev)}
        className="cursor-pointer"
      >
        {!passwordType ? <EyeSlashIcon width="14" height={"14px"}/> : <EyeIcon  width="14" height={"14px"}/>}
      </div>
    );

    return (
      <Input
        ref={ref}
        type={passwordType ? "password" : "text"}
        icon={isPasswordInputWithEye ? passwordIcon() : undefined}
        {...props}
      />
    );
  }
);

export default InputPassword;
