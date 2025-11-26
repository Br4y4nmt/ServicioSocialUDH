import React from "react";

function DocumentIcon({ size = 32, color = "#2e9e7f", className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={`transition-transform transform group-hover:translate-x-2 duration-300 ${className}`}
    >
      <path
        d="M5 8C5 5.17157 5 3.75736 5.87868 2.87868C6.75736 2 8.17157 2 11 2H13C15.8284 2 17.2426 2 18.1213 2.87868C19 3.75736 19 5.17157 19 8V16C19 18.8284 19 20.2426 18.1213 21.1213C17.2426 22 15.8284 22 13 22H11C8.17157 22 6.75736 22 5.87868 21.1213C5 20.2426 5 18.8284 5 16V8Z"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        opacity="0.7"
        d="M9 13H15"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M9 9H15"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        opacity="0.4"
        d="M9 17H12"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        opacity="0.5"
        d="M2 19V5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        opacity="0.5"
        d="M22 19V5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default DocumentIcon;
