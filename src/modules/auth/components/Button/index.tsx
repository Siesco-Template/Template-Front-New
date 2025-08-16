import * as React from 'react';

import { Loader2 } from 'lucide-react';

import { Slot } from '@radix-ui/react-slot';

import { cls } from '@/shared/utils';

type ButtonVariant = 'primary' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

// Define the CSS classes for each variant and size
const getVariantClasses = (variant: ButtonVariant = 'primary'): string => {
    switch (variant) {
        case 'primary':
            return '!bg-[hsl(var(--clr-primary-500))] border-[hsl(var(--clr-primary-200))] text-white hover:bg-[hsl(var(--clr-primary-700))] duration-300 focus:outline-ring';

        case 'secondary':
            return '!bg-[#F5F7F9] !border-white !text-[#002C68] hover:!bg-white hover:!text-[#0068F7] duration-300 focus:!outline-ring';
        case 'outline':
            return '!bg-transparent !border-[#0068F7] !text-[#0068F7] hover:!text-[#004AAF] hover:!border-[#004AAF] focus:!outline-ring';
        case 'ghost':
            return '!border-white !text-[hsl(var(--clr-primary-500))] hover:!bg-white hover:!text-[hsl(var(--clr-primary-500))] hover:!border-[hsl(var(--clr-primary-500))] duration-300 focus:!outline-ring';
        default:
            return '';
    }
};

const getSizeClasses = (size: ButtonSize = 'default'): string => {
    switch (size) {
        case 'default':
            return '!px-3 !py-2 rounded-[12px] !border-1';
        default:
            return '';
    }
};

const baseClasses =
    'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all disabled:pointer-events-none disabled:opacity-50';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    asChild?: boolean;
    loading?: boolean;
}

function Button({
    className,
    variant = 'primary',
    size = 'default',
    asChild = false,
    loading = false,
    disabled,
    children,
    ...props
}: ButtonProps) {
    const Comp = asChild ? Slot : 'button';

    return (
        <Comp
            data-slot="button"
            className={cls(
                baseClasses,
                getVariantClasses(variant),
                getSizeClasses(size),
                className,
                'focus:!outline',
                loading && 'cursor-wait'
            )}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {children}
        </Comp>
    );
}

export { Button, type ButtonProps, type ButtonVariant, type ButtonSize };
