import { FC, ReactNode } from 'react';
import { Link, LinkProps } from 'react-router';


export interface I_Link extends LinkProps {
    children?: ReactNode;
    className?: string;
}

const S_Link: FC<I_Link> = ({ children, ...props }) => {
    return <Link {...props}>{children}</Link>;
};

export default S_Link;
