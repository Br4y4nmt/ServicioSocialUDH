import React from 'react';

const CalendarEmptyIcon = ({
  width = 28,
  height = 28,
  style = {},
  className = '',
}) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{
      width:
        typeof width === 'number'
          ? `${width}px`
          : width,
      height:
        typeof height === 'number'
          ? `${height}px`
          : height,
      display: 'block',
      ...style,
    }}
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M8 3V5M16 3V5M4.5 9H19.5M7 5H17C18.657 5 20 6.343 20 8V18C20 19.657 18.657 21 17 21H7C5.343 21 4 19.657 4 18V8C4 6.343 5.343 5 7 5Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <path
      d="M9 14H15"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
);

export default CalendarEmptyIcon;