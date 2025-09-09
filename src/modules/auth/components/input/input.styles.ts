import { InputBorderRadius, InputSize, InputState } from "./input.types";

const inputSizeStyles: Record<InputSize, string> = {
  "40": "h-[40px]",
  "48": "h-[48px]",
  "52": "h-[52px]",
  "56": "h-[56px]",
};

const inputStateStyles: Record<InputState, string> = {
  default:
    "border border-[#B2BBC6] transition duration-300 outline outline-[transparent] focus-within:outline-[#0D3CAF]",
  error: "border-[#FF3B30]",
  success: "border-[#039728]",
};

export const inputDescriptionStyles: Record<InputState, string> = {
  default: "!text-[12px] text-neutral-500",
  error: "!text-[12px] text-[#FF3B30]",
  success: "!text-[12px] text-[#039728]",
};
const inputDisabledStyle = "bg-primary-50 border-primary-50";

const inputStyles = {
  inputSizeStyles,
  inputStateStyles,
  inputDescriptionStyles,
  inputDisabledStyle,
};

export default inputStyles;
