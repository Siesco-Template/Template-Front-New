import React, { CSSProperties, ReactNode } from 'react';

interface GridProps {
    children?: ReactNode;
    count?: number;
    columns?: number;
    rows?: number;
    spacing?: number;
    style?: CSSProperties;
    className?: string;
}

const Grid: React.FC<GridProps> = ({ children, count, columns = 1, rows, spacing = 0, style, className }) => {
    const items =
        count && !children
            ? Array.from({ length: count }, (_, i) => (
                  <div
                      key={i}
                      style={{
                          background: '#e0e0e0',
                          padding: '20px',
                          borderRadius: '6px',
                          textAlign: 'center',
                          fontWeight: 'bold',
                      }}
                  >
                      {i + 1}
                  </div>
              ))
            : children;

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
            {items}
        </div>
    );
};

export default Grid;
