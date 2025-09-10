import * as React from 'react';

import { X } from 'lucide-react';

import * as DialogPrimitive from '@radix-ui/react-dialog';

import { cls } from '@/shared/utils';

import S_Button from '../../button';
import styles from './style.module.css';

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay ref={ref} className={cls(styles.overlay, className)} {...props} />
));

type ContentExtraProps = {
    /** Close when clicking outside? default: true */
    closeOnOutsideClick?: boolean;
    /** Close when pressing Escape? default: true */
    closeOnEsc?: boolean;
    /** Fires when a true outside click happens (overlay or page) */
    onClickOutside?: (event: Event) => void;
};
const DialogContent = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & ContentExtraProps
>(({ className, children, closeOnOutsideClick = true, closeOnEsc = true, onClickOutside, ...props }, ref) => (
    <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
            ref={ref}
            className={cls(styles.content, className)}
            onEscapeKeyDown={(e) => {
                if (!closeOnEsc) e.preventDefault();
                props.onEscapeKeyDown?.(e);
            }}
            /* pointer (mouse/touch) outside */
            onPointerDownOutside={(e) => {
                onClickOutside?.(e.detail.originalEvent ?? e);
                if (!closeOnOutsideClick) e.preventDefault();
                props.onPointerDownOutside?.(e);
            }}
            /* keyboard focus outside (e.g., Tab out) */
            onInteractOutside={(e) => {
                if (!closeOnOutsideClick) e.preventDefault();
                props.onInteractOutside?.(e);
            }}
            {...props}
        >
            {children}
        </DialogPrimitive.Content>
    </DialogPortal>
));

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cls(styles.header, className)} {...props}>
        {props.children}
        <DialogPrimitive.Close className={styles.close} tabIndex={-1}>
            <S_Button variant="ghost" size="32" aria-label="close" tabIndex={1}>
                <X width={20} height={20} />
            </S_Button>
            <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
    </div>
);

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cls(styles.footer, className)} {...props} />
);

const DialogTitle = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Title ref={ref} className={cls(styles.title, className)} {...props} />
));

const DialogDescription = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Description ref={ref} className={cls(styles.description, className)} {...props} />
));

export {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
    DialogTrigger,
};
