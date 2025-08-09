import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

import CatalogSimple from '@/shared/filter/filters/CatalogSimple';

import S_Select_Simple from '@/ui/select/select-simple';

import styles from './style.module.css';

interface ManualEditableTableProps {
    columns: string[];
    data: Record<string, string>[];
    onChange: (rowIdx: number, key: string, value: string) => void;
    headerOptions: { label: string; value: string }[];
    columnMappings?: Record<string, string>;
    setColumnMappings?: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    validationResults?: { records: Record<string, string>; isValid: boolean; errors: Record<string, string[]> }[];
    scrollToFirstError?: boolean;
}

const ManualEditableTable: React.FC<ManualEditableTableProps> = ({
    columns,
    data,
    onChange,
    headerOptions,
    columnMappings,
    setColumnMappings,
    validationResults,
    scrollToFirstError = false,
}) => {
    const headerRefs = useRef<HTMLSpanElement[]>([]);

    const wrapperRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const [wrapperWidths, setWrapperWidths] = useState<Record<string, number>>({});

    const selectedValues = Object.values(columnMappings || {});
    const isNumber = (value: any) => !isNaN(parseFloat(value)) && isFinite(value);

    const firstErrorRef = useRef<HTMLTableCellElement | null>(null);
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    const [focusedCell, setFocusedCell] = useState<{ rowIdx: number; col: string } | null>(null);

    useEffect(() => {
        if (scrollToFirstError && firstErrorRef.current && wrapperRef.current) {
            const errorEl = firstErrorRef.current;
            const wrapper = wrapperRef.current;

            const wrapperTop = wrapper.getBoundingClientRect().top;
            const elTop = errorEl.getBoundingClientRect().top;

            const scrollOffset = elTop - wrapperTop - 240; // 60px yuxarı boşluq saxla

            wrapper.scrollBy({
                top: scrollOffset,
                behavior: 'smooth',
            });
        }
    }, [scrollToFirstError]);

    useEffect(() => {
        if (scrollToFirstError) {
            firstErrorRef.current = null;
        }
    }, [scrollToFirstError]);

    useLayoutEffect(() => {
        const observers: ResizeObserver[] = [];
        const initialWidths: Record<string, number> = {};

        columns.forEach((col) => {
            const el = wrapperRefs.current[col];
            if (!el) return;

            // read initial width
            initialWidths[col] = el.getBoundingClientRect().width;

            // watch for resizes
            const ro = new ResizeObserver((entries) => {
                const w = entries[0].contentRect.width;
                setWrapperWidths((prev) => ({ ...prev, [col]: w }));
            });
            ro.observe(el);
            observers.push(ro);
        });

        // set all initial widths at once
        setWrapperWidths(initialWidths);

        return () => {
            observers.forEach((ro) => ro.disconnect());
        };
    }, [columns]);

    return (
        <div className={styles.tableWrapper} ref={wrapperRef}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        {columns.map((col, index) => (
                            <th key={col} style={{ width: index === 0 ? '280px' : '120px' }}>
                                <span
                                    title={col}
                                    className={styles.headerText}
                                    ref={(el) => {
                                        // collect span refs if you need them elsewhere
                                        headerRefs?.current?.push(el!);
                                    }}
                                    style={{
                                        display: 'inline-block',
                                        textAlign: index === 0 ? 'center' : 'left',
                                    }}
                                >
                                    {col}
                                </span>

                                {setColumnMappings && columnMappings && (
                                    <div
                                        className={styles.catalogWrapper}
                                        ref={(el) => {
                                            wrapperRefs.current[col] = el;
                                        }}
                                    >
                                        <S_Select_Simple
                                            items={headerOptions.map((item) => ({
                                                label: item.label,
                                                value: item.value,
                                                show: true,
                                                disabled:
                                                    selectedValues.includes(item.value) &&
                                                    item.value !== columnMappings[col],
                                            }))}
                                            value={[columnMappings[col]]}
                                            setSelectedItems={(items) => {
                                                setColumnMappings((prev) => ({
                                                    ...prev,
                                                    [col]: items[0]?.value || '',
                                                }));
                                            }}
                                            itemsContentMaxWidth={`${wrapperWidths[col] ?? 0}px`}
                                            clearButton={true}
                                        />
                                    </div>
                                )}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIdx) => (
                        <tr key={rowIdx}>
                            {columns.map((col) => {
                                const hasError =
                                    validationResults &&
                                    columnMappings &&
                                    columnMappings[col] &&
                                    validationResults[rowIdx]?.errors?.[columnMappings[col]];

                                return (
                                    <td
                                        key={col}
                                        ref={(el) => {
                                            if (hasError && scrollToFirstError && el) {
                                                firstErrorRef.current = el;
                                            }
                                        }}
                                        style={{
                                            width: col === columns[0] ? '280px' : '120px',
                                            textAlign: col !== columns[0] && col !== columns[1] ? 'right' : 'center',
                                            backgroundColor: hasError ? '#FFE4EE' : undefined,
                                        }}
                                    >
                                        <input
                                            className={styles.inputCell}
                                            onFocus={() => setFocusedCell({ rowIdx, col })}
                                            onBlur={() => setFocusedCell(null)}
                                            value={
                                                focusedCell?.rowIdx === rowIdx && focusedCell.col === col
                                                    ? row[col] || ''
                                                    : rowIdx !== 0 &&
                                                        col !== columns[1] &&
                                                        isNumber(row[col]) &&
                                                        row[col] !== ''
                                                      ? parseFloat(row[col]).toFixed(2)
                                                      : row[col] || ''
                                            }
                                            onChange={(e) => onChange(rowIdx, col, e.target.value)}
                                        />
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManualEditableTable;
