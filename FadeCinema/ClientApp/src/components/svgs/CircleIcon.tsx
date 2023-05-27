import React from "react";
const CircleIcon = ({ size = 40, color = "#61baf7", fill = false }) =>
(
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={fill ? color : "none"}
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
    </svg>
);
export default CircleIcon;