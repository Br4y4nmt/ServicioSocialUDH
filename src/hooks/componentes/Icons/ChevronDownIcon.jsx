import React from "react";

const ChevronDownIcon = ({
  width = 16,
  height = 16,
  style = {},
  className = "",
  strokeWidth = 2,
  strokeLinecap = "round",
  strokeLinejoin = "round"
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height,
      minWidth: typeof width === 'number' ? `${width}px` : width,
      minHeight: typeof height === 'number' ? `${height}px` : height,
      display: "block",
      ...style
    }}
  >
    <path
      d="M6 9l6 6 6-6"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap={strokeLinecap}
      strokeLinejoin={strokeLinejoin}
      fill="none"
    />
  </svg>
);

export default ChevronDownIcon;