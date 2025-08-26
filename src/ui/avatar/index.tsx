import { FC } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { Avatar, AvatarRootProps, useAvatarContext } from '@ark-ui/react/avatar';

import { UserIcon3 } from '@/shared/icons';
import { cls } from '@/shared/utils';

import styles from './avatar.module.css';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type AvatarType = 'image' | 'placeholder';

interface I_AvatarProps extends AvatarRootProps {
    name?: string;
    imageUrl?: string;
    size?: AvatarSize;
    type?: AvatarType;
    online?: boolean;
}

const sizeMap: Record<AvatarSize, number> = {
    xs: 20,
    sm: 28,
    md: 36,
    lg: 48,
    xl: 56,
    '2xl': 64,
};

const S_Avatar: FC<I_AvatarProps> = ({
    imageUrl,
    name,
    size = 'md',
    type = 'placeholder',
    online = false,
    className,
    ...props
}) => {
    const pixelSize = sizeMap[size];

    return (
        <Avatar.Root
            {...props}
            className={cls(styles.avatar, styles[size], online && styles.online, className)}
            style={{ width: pixelSize, height: pixelSize }}
            data-size={size}
        >
            {type === 'placeholder' && (
                <Avatar.Fallback aria-label={name || 'User'}>
                    <UserIcon3 className={styles.icon} color="var(--content-tertiary)" aria-hidden="true" />
                </Avatar.Fallback>
            )}

            {type === 'image' && imageUrl && (
                <AvatarImage src={imageUrl} alt={name || ''} width={pixelSize} height={pixelSize} />
            )}
        </Avatar.Root>
    );
};

export default S_Avatar;

const AvatarImage = (props: { src: string; width: number; height: number; alt?: string }) => {
    const avatar = useAvatarContext();
    const { hidden, ...imageProps } = avatar.getImageProps();

    return (
        <LazyLoadImage
            {...imageProps}
            {...props}
            style={{
                visibility: hidden ? 'hidden' : 'visible',
                objectFit: 'cover',
                width: props.width,
                height: props.height,
                borderRadius: '200px',
            }}
        />
    );
};
