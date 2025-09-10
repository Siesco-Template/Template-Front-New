import * as React from 'react';

import { X } from 'lucide-react';

import * as DialogPrimitive from '@radix-ui/react-dialog';

import { cls } from '@/shared/utils';

import { S_Button } from '@/ui';

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
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

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
            <DialogPrimitive.Close className={styles.close} tabIndex={-1}>
                <button aria-label="close" tabIndex={1}>
                    <X width={24} height={24} color="#fff" />
                </button>
                <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
        </DialogPrimitive.Content>
    </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cls(styles.header, className)} {...props} />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cls(styles.footer, className)} {...props} />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Title ref={ref} className={cls(styles.title, className)} {...props} />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Description ref={ref} className={cls(styles.description, className)} {...props} />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

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
