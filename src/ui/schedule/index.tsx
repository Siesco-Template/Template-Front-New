import { JSX, useCallback, useMemo, useRef, useState } from 'react';
import Timeline from 'react-calendar-timeline';
import { ItemRendererProps } from 'react-calendar-timeline/dist/lib/items/Item';
import 'react-calendar-timeline/dist/style.css';
import { LoaderIcon } from 'react-hot-toast';
import { useNavigate } from 'react-router';

import moment from 'moment';

import { APP_URLS } from '@/services/config/url.config';

import { MenuBedIcon } from '@/shared/icons';

import styles from './style.module.css';

interface TimelineRoomGroup {
    id: string;
    title: string;
}

interface TimelineItem {
    id: string;
    group: string;
    title: string;
    start_time: number;
    end_time: number;
    status: number;
}

interface RoomSchedulerProps {
    roomData: any[];
    loading: boolean;
    error: string | null;
    selectedYear: number;
    selectedMonth: number;
}

const RoomScheduler = ({ roomData, loading, error, selectedYear, selectedMonth }: RoomSchedulerProps) => {
    const navigate = useNavigate();
    const timelineRef = useRef<HTMLDivElement>(null);

    // 1) Build groups/items + compute visibleTimeStart/visibleTimeEnd
    const { timelineGroups, timelineItems, visibleTimeStart, visibleTimeEnd, lineHeightPx } = useMemo(() => {
        const groups: TimelineRoomGroup[] = [];
        const items: TimelineItem[] = [];

        if (Array.isArray(roomData)) {
            roomData.forEach((room) => {
                groups.push({
                    id: room.roomId,
                    title: `Otaq ${room.number}`,
                });

                if (Array.isArray(room.reservations)) {
                    room.reservations.forEach((reservation: any) => {
                        // bump endDate by 2 days as before
                        const endDate = new Date(reservation.endDate);
                        endDate.setDate(endDate.getDate() + 2);

                        items.push({
                            id: reservation.reservationId,
                            group: room.roomId,
                            title: reservation.clientFullName,
                            start_time: moment(reservation.startDate).valueOf(),
                            end_time: moment(endDate.toISOString().slice(0, 10) + 'T00:00:00').valueOf(),
                            status: reservation.status,
                        });
                    });
                }
            });
        }

        groups.sort((a, b) => {
            const numA = parseInt(a.title.replace('Otaq ', ''), 10);
            const numB = parseInt(b.title.replace('Otaq ', ''), 10);
            return numA - numB;
        });

        // Compute start/end of selected month
        const startOfMonth = moment()
            .year(selectedYear)
            .month(selectedMonth - 1)
            .startOf('month')
            .valueOf();
        const endOfMonth = moment()
            .year(selectedYear)
            .month(selectedMonth - 1)
            .endOf('month')
            .valueOf();

        // We passed lineHeight={50} below, so “row height” is 50px:
        const lineHeightPx = 50;

        return {
            timelineGroups: groups,
            timelineItems: items,
            visibleTimeStart: startOfMonth,
            visibleTimeEnd: endOfMonth,
            lineHeightPx,
        };
    }, [roomData, selectedYear, selectedMonth]);

    // 2) drag-select state
    const [isSelecting, setIsSelecting] = useState(false);
    const [selectionStart, setSelectionStart] = useState<number | null>(null);
    const [selectionEnd, setSelectionEnd] = useState<number | null>(null);

    const [selectionGroupId, setSelectionGroupId] = useState<string | null>(null);
    const [selectionRowTop, setSelectionRowTop] = useState<number | null>(null);

    // 3) Convert clientX → timestamp (ms)
    const sidebarPx = 200;

    const getTimeFromClientX = (clientX: number) => {
        if (!timelineRef.current) return NaN;
        const rect = timelineRef.current.getBoundingClientRect();
        const x = clientX - rect.left;

        // 1) If you click inside the sidebar (x < sidebarPx), bail out:
        if (x <= sidebarPx) {
            return NaN;
        }

        // 2) Map x from [sidebarPx .. rect.width] → [0 .. (rect.width - sidebarPx)]
        const timeX = x - sidebarPx;
        const timelineWidth = rect.width - sidebarPx;
        const clampedTimeX = Math.max(0, Math.min(timeX, timelineWidth));

        // 3) Now do a standard ratio over the *timeline* portion only:
        const ratio = clampedTimeX / timelineWidth;
        return visibleTimeStart + ratio * (visibleTimeEnd - visibleTimeStart);
    };

    // 4) On mouse down: record time, row index, and groupId—but only if that cell is free
    const onMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
        if (e.button !== 0) return; // only left-click
        // @ts-expect-error
        if (!e.target?.className?.trim()) return;
        if (!timelineRef.current) return;

        const wrapperRect = timelineRef.current.getBoundingClientRect();
        const clickX = e.clientX;
        const clickY = e.clientY - 50;

        // 4a) Compute the timestamp under cursor
        const timeAtPointer = getTimeFromClientX(clickX);

        // 4b) Find out which row = index into timelineGroups
        let headerHeight = 50;

        const relativeY = clickY - wrapperRect.top;
        const idx = Math.floor(relativeY / lineHeightPx);
        if (idx < 0 || idx >= timelineGroups.length) {
            // clicked outside of any data-row, so do nothing
            return;
        }

        // Which groupId corresponds to that row index?
        const clickedGroup = timelineGroups[idx].id;

        // 4c) Check if “timeAtPointer” falls inside any existing item for that group.
        const groupItems = timelineItems.filter((it) => it.group === clickedGroup);
        const isOverItem = groupItems.some((it) => timeAtPointer >= it.start_time && timeAtPointer < it.end_time);
        if (isOverItem || clickX <= sidebarPx) {
            // If clicking on an occupied slot, do nothing (no selection)
            return;
        }

        // 4d) Otherwise, begin selection:
        setSelectionGroupId(clickedGroup);
        setSelectionStart(timeAtPointer);
        setSelectionEnd(timeAtPointer);
        setIsSelecting(true);

        // 4e) Store that row’s top-offset (in px from wrapper’s top)
        const rowTop = headerHeight + idx * lineHeightPx;
        setSelectionRowTop(rowTop);
    };

    // 5) On mouse move: update selectionEnd (time only)
    const onMouseMove: React.MouseEventHandler<HTMLDivElement> = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        // @ts-expect-error
        const className = e.target?.className?.trim() as string;
        if (!className) {
            setIsSelecting(false);
            return;
        }
        if (!isSelecting) return;
        const timeAtPointer = getTimeFromClientX(e.clientX);
        setSelectionEnd(timeAtPointer);
    };

    // 6) On mouse up: finalize the date-range
    const onMouseUp: React.MouseEventHandler<HTMLDivElement> = (e) => {
        if (!isSelecting) return;

        if (selectionStart !== null && selectionEnd !== null && selectionGroupId !== null) {
            const start = Math.min(selectionStart, selectionEnd);
            const end = Math.max(selectionStart, selectionEnd);

            // If the final dragged range overlaps any existing item for this group, do nothing:
            const groupItems = timelineItems.filter((it) => it.group === selectionGroupId);
            const overlaps = groupItems.some((it) => it.start_time < end && it.end_time > start);
            if (!overlaps) {
                navigate(
                    APP_URLS.qonaqlarinQebulu('', {
                        startDate: moment(start).format('YYYY-MM-DD'),
                        endDate: moment(end).format('YYYY-MM-DD'),
                        roomId: selectionGroupId,
                    })
                );
            }
        }

        // Clear everything
        setIsSelecting(false);
        setSelectionStart(null);
        setSelectionEnd(null);
        setSelectionRowTop(null);
        setSelectionGroupId(null);
    };

    // 7) Custom item- and group-renderers (unchanged)
    const customItemRenderer = useCallback(
        ({ item, timelineContext, itemContext, getItemProps }: ItemRendererProps<TimelineItem>) => {
            const { key, ...defaultProps } = getItemProps(itemContext.itemProps);

            const colorSchemes = [
                { border: '#283593', background: 'rgba(40, 53, 147, 0.10)' },
                { border: '#FEC007', background: 'rgba(254, 192, 7, 0.10)' },
                { border: '#039728', background: 'rgba(3, 151, 40, 0.10)' },
                { border: '#F8005B', background: 'rgba(248, 0, 91, 0.10)' },
            ];

            const roomReservations = roomData.find((r) => r.roomId === item.group)?.reservations || [];
            const sortedReservations = [...roomReservations].sort(
                (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
            );

            const reservationIndex = sortedReservations.findIndex((r) => r.reservationId === item.id);

            if (reservationIndex === -1) {
                return (
                    <div
                        key={item.id}
                        {...defaultProps}
                        style={{
                            ...defaultProps.style,
                            backgroundColor: 'lightgray',
                        }}
                    >
                        {itemContext.title}
                    </div>
                );
            }

            const colorIndex = reservationIndex % colorSchemes.length;
            const colors = colorSchemes[colorIndex];

            return (
                <div
                    key={item.id}
                    {...defaultProps}
                    style={{
                        ...defaultProps.style,
                        background: colors.background,
                        borderLeft: `3px solid ${colors.border}`,
                        borderRadius: '4px',
                        textAlign: 'center',
                        color: '#333',
                        fontSize: '0.9em',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                    }}
                >
                    {itemContext.useResizeHandle && (
                        <div {...itemContext.getResizeProps().left} className={styles.resizeHandleLeft} />
                    )}
                    <div
                        style={{
                            flexGrow: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {itemContext.title}
                    </div>
                    {itemContext.useResizeHandle && (
                        <div {...itemContext.getResizeProps().right} className={styles.resizeHandleRight} />
                    )}
                </div>
            );
        },
        [roomData]
    );

    const customGroupRenderer = useCallback(({ group }: { group: TimelineRoomGroup }) => {
        return (
            <div
                style={{
                    borderBottom: '1px solid #eee',
                    textAlign: 'left',
                    padding: '0 20px',
                    color: '#303131',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    gap: '10px',
                }}
            >
                <MenuBedIcon width={16} height={16} fill="#303131" /> {group.title}
            </div>
        );
    }, []);

    if (loading) {
        return (
            <div className={styles.loading}>
                <LoaderIcon style={{ width: '70px', height: '70px' }} />
            </div>
        );
    }

    if (error) {
        return <div className={styles.error}>Xəta: {error}</div>;
    }

    // 8) Draw a “row-only” selection overlay if isSelecting && no overlap && we know selectionRowTop
    let selectionOverlay: JSX.Element | null = null;
    if (
        isSelecting &&
        selectionStart !== null &&
        selectionEnd !== null &&
        selectionRowTop !== null &&
        selectionGroupId !== null &&
        timelineRef.current
    ) {
        const start = Math.min(selectionStart, selectionEnd);
        const end = Math.max(selectionStart, selectionEnd);

        // Before drawing, check: does [start,end] overlap any existing item in this group?
        const groupItems = timelineItems.filter((it) => it.group === selectionGroupId);
        const overlaps = groupItems.some((it) => it.start_time < end && it.end_time > start);

        if (!overlaps) {
            const wrapperRect = timelineRef.current.getBoundingClientRect();
            const wrapperWidth = wrapperRect.width;
            const totalSpan = visibleTimeEnd - visibleTimeStart;

            // Compute the pixel coordinates of the timeline area
            const timelineLeftPx = sidebarPx;
            const timelineWidthPx = wrapperWidth - sidebarPx;

            // Compute fractional positions within the timeline portion
            const leftWithinTimelinePx = ((start - visibleTimeStart) / totalSpan) * timelineWidthPx;
            const widthWithinTimelinePx = ((end - start) / totalSpan) * timelineWidthPx;

            // Actual overlay left from the wrapper’s left edge
            const overlayLeftPx = timelineLeftPx + leftWithinTimelinePx;

            selectionOverlay = (
                <div
                    style={{
                        position: 'absolute',
                        top: `${selectionRowTop + 1}px`,
                        left: `${overlayLeftPx}px`,
                        height: `${lineHeightPx}px`,
                        width: `${widthWithinTimelinePx}px`,
                        backgroundColor: 'rgba(33, 150, 243, 0.2)',
                        pointerEvents: 'none',
                    }}
                />
            );
        }
        // If there is overlap, no overlay is rendered.
    }

    return (
        <div className={styles.timelineWrapper}>
            <div className={styles.timelineContentContainer}>
                {roomData.length > 0 ? (
                    <div
                        ref={timelineRef}
                        style={{ position: 'relative' }}
                        onMouseDown={onMouseDown}
                        onMouseMove={onMouseMove}
                        onMouseUp={onMouseUp}
                        onMouseLeave={onMouseUp}
                    >
                        {selectionOverlay}

                        <Timeline
                            groups={timelineGroups}
                            items={timelineItems}
                            groupRenderer={customGroupRenderer}
                            itemRenderer={customItemRenderer}
                            sidebarWidth={sidebarPx}
                            lineHeight={lineHeightPx}
                            visibleTimeStart={visibleTimeStart}
                            visibleTimeEnd={visibleTimeEnd}
                            canMove={false}
                            canResize={false}
                            canSelect={false}
                            onCanvasClick={(e, time) => {
                                // console.log(e);
                                // navigate(
                                //     APP_URLS.qonaqlarinQebulu('', {
                                //         roomId: e,
                                //         startDate: moment(time).format('YYYY-MM-DD'),
                                //     })
                                // );
                            }}
                        />
                    </div>
                ) : (
                    !loading && <div className={styles.noData}>Məlumat tapılmadı.</div>
                )}
            </div>
        </div>
    );
};

export default RoomScheduler;
