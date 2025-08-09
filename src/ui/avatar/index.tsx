import { CSSProperties, FC, FunctionComponent } from 'react';


import { Avatar, AvatarRootProps, useAvatarContext } from '@ark-ui/react';

import { cls } from '@/shared/utils';

import styles from './avatar.module.css';
import { LazyLoadImage } from 'react-lazy-load-image-component';
type IAvatarSize = '100' | '200' | '300' | '400' | '500' | '600' | '700' | '750' | '800' | '850' | '900';
interface I_AvatarProps extends AvatarRootProps {
    name?: string;
    image: string;
    size?: IAvatarSize;
}

function getInitials(name: string = '') {
    if (typeof name !== 'string') return '';

    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
        return parts[0].charAt(0).toUpperCase();
    }

    const initials = parts
        .map((word) => word.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('');

    return initials;
}

const S_Avatar: FC<I_AvatarProps> = ({ image, name, className, size = '200', ...props }) => {
    const avatarSize: Record<IAvatarSize, number> = {
        '100': 20,
        '200': 24,
        '300': 28,
        '400': 36,
        '500': 42,
        '600': 50,
        '700': 58,
        '750': 60,
        '800': 64,
        '850': 68,
        '900': 72,
    };

    const nameFirstChars = getInitials(name);
    return (
        <Avatar.Root
            {...props}
            className={cls(styles.avatar, styles[`size-${size}`], className)}
            style={{ width: avatarSize[size], height: avatarSize[size] }}
        >
            {name && <Avatar.Fallback>{nameFirstChars}</Avatar.Fallback>}
            {image && (
                <AvatarNextImage
                    src={image || '...'}
                    width={avatarSize[size]}
                    height={avatarSize[size]}
                    alt={name || ''}
                    
                />
            )}
        </Avatar.Root>
    );
};

export default S_Avatar;

type ImageProps = {
    src: string;
    width?: string | number;
    height?: string | number;
    alt?: string;
    hidden?: boolean;
}
const AvatarNextImage = (props: ImageProps) => {
    const avatar = useAvatarContext();
    const { hidden, ...imageProps } = avatar.getImageProps() as ImageProps;
    return (
        <LazyLoadImage
            {...imageProps}
            {...props}
            style={{
                visibility: hidden ? 'hidden' : 'visible',
                objectFit: 'cover',
            }}
        />
    );
};
