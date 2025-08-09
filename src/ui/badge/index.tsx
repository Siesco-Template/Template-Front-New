'use client'
import { cls } from '@/shared/utils';
import { DetailedHTMLProps, FC, HTMLAttributes, ReactNode } from 'react'
import styles from './badge.module.css'
import { Tick } from '@/shared/icons';
type I_BadgeStatus = 'default' | 'success' | 'error' | 'processing' | 'warning';
type I_BadgeVariant = 'default' | 'primary';
interface I_BadgeProps extends DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>  {
	status?: I_BadgeStatus;
	variant?: I_BadgeVariant;
	text: string;
}
const S_Badge: FC<I_BadgeProps> = ({ status = 'default', variant = 'default', text, className, ...props}) => {
	
	const renderIcon: Record<I_BadgeVariant, () => ReactNode> = {
		'default': () => (
			<span className={styles.dot}/>
		),
		'primary': () => (
			<span className={styles.checkIcon}>
				<Tick width="10" height="10"/>
			</span>
		)
	}

	return (
		<span 
			data-status={status}
			className={cls(
				styles.badge, 
				styles[`variant-${variant}`],
				className
			)}
			{...props}
		>
			{renderIcon[variant]()}
			{text}
		</span>
	)
}

export default S_Badge