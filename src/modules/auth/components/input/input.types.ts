import React from 'react';
import { InputHTMLAttributes } from 'react';

export type InputState = 'default' | 'success' | 'error';
export type InputVariants = 'default' | 'prefix';
export type InputColor = 'primary';

export type InputSize = 40 | 48 | 52 | 56;
export type InputBorderRadius = 4 | 12 | 16;

export default interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	borderRadius?: InputBorderRadius;
	gap?: number;
	variants?: InputVariants;
	state?: InputState;
	color?: InputColor;
	size?: InputSize;
	details?: string | React.ReactElement;
	description?: string;
	icon?: React.ReactElement;
	pref?: string | React.ReactElement;
	isPasswordInputWithEye?: boolean,
	forOTP?: boolean;
	labelClassName?: string;
}
  