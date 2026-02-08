import React from 'react';

const SpinnerIcon = () => {
  return (
    <svg className="spinner" width="16" height="16" viewBox="0 0 50 50">
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke="#4A5568"
        strokeWidth="5"
        strokeDasharray="90 150"
        strokeLinecap="round"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          dur="0.75s"
          from="0 25 25"
          to="360 25 25"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
};

export default SpinnerIcon;
