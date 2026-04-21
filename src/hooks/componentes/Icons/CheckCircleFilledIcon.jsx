import React from 'react';

const CheckCircleFilledIcon = ({
  width = 28,
  height = 28,
  style = {},
  className = ''
}) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height,
      display: 'block',
      ...style
    }}
    aria-hidden="true"
    focusable="false"
  > 
    <path d="M7 12.5l3 3 7-7" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

export default CheckCircleFilledIcon;
