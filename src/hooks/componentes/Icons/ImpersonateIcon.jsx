import React from "react";

function ImpersonateIcon({ size = 24, color = "currentColor", className = "", ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="m10 17 5-5-5-5"></path>
      <path d="M15 12H3"></path>
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
    </svg>
  );
}

export default ImpersonateIcon;
