import React, { CSSProperties, ReactNode } from 'react';

interface GridProps {
    children: ReactNode;
    columns?: number;
    rows?: number;
    spacing?: number;
    style?: CSSProperties;
    className?: string;
}

const Grid: React.FC<GridProps> = ({ children, columns = 1, rows, spacing = 0, style, className }) => {
    return (
        <div
            className={className}
            style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gridTemplateRows: rows ? `repeat(${rows}, auto)` : undefined,
                gap: `${spacing * 4}px`,
                ...style,
            }}
        >
            {children}
        </div>
    );
};

export default Grid;
