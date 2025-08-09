type CursorProps = {
    background: string;
    border: string;
    size: number;
};
export const CursorIcon = ({ background, border, size }: CursorProps) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 18 18" fill="none">
            <path
                d="M11.0927 10.0471L13.8695 9.12143C15.3768 8.619 15.3768 6.48699 13.8695 5.98456L5.17895 3.0877C3.88649 2.65688 2.65688 3.88649 3.0877 5.17895L5.98456 13.8695C6.48699 15.3768 8.61901 15.3768 9.12144 13.8695L10.0471 11.0927C10.2116 10.599 10.599 10.2116 11.0927 10.0471Z"
                stroke={border}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill={background}
            />
        </svg>
    );
};
