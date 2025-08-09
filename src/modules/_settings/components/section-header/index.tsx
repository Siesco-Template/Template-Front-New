import { CSSProperties, FC, ReactNode } from 'react';

import { useViewAndContentStore } from '../../view-and-content/view-and-content.store';
import styles from './section-header.module.css';

interface SectionHeaderProps {
    Icon?: ReactNode | string | null;
    title: ReactNode | string;
    rightSide: ReactNode | null;
    withIcon: boolean;
    style?: CSSProperties;
    titleAs: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'span' | 'p';
}
const SectionHeader: FC<SectionHeaderProps> = ({ withIcon = false, Icon, title, titleAs = 'h2', rightSide, style }) => {
    const TitleTag = titleAs;
    return (
        <div className={styles.sectionHeader} style={style}>
            {!withIcon ? (
                typeof title === 'string' ? (
                    <TitleTag className={styles.title}>{title}</TitleTag>
                ) : (
                    title
                )
            ) : (
                <div className={styles.titleContainer}>
                    {Icon}
                    <TitleTag className={styles.title}>{title}</TitleTag>
                </div>
            )}
            {rightSide}
        </div>
    );
};

export default SectionHeader;
