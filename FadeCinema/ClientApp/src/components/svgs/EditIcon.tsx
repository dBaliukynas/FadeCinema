import React from "react";

type Props = {
    size?: number,
    color?: string,
    className: string
    onClick?: () => void
}

const EditIcon = ({ size = 40, color = "#8ea55d", className, onClick }: Props) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`edit-icon ${className}`}
        role="button"
        onClick={onClick}
    >
        <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path>
        <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon>
    </svg>
);
export default EditIcon;
