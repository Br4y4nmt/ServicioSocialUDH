import React from "react";

function JusticeIcon({ size = 24, color = "currentColor", ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <line x1="120" y1="120" x2="392" y2="120" />
      <path d="M120 120 q-20 -20 -40 0" />
      <path d="M392 120 q20 -20 40 0" />
      <line x1="120" y1="120" x2="100" y2="200" />
      <line x1="392" y1="120" x2="412" y2="200" />
      <path d="M60 200 h80 a40 40 0 0 1 -80 0 z" />
      <path d="M372 200 h80 a40 40 0 0 1 -80 0 z" />
      <path d="M200 120 v-40 q0 -20 20 -20 q20 0 20 20 v40" />
      <path d="M240 120 v-50 q0 -20 20 -20 q20 0 20 20 v50" />
      <path d="M280 120 v-40 q0 -20 20 -20 q20 0 20 20 v40" />
      <path d="M200 120 h120 v40 q0 30 -30 30 h-60 q-30 0 -30 -30 z" />
      <rect x="210" y="190" width="92" height="200" rx="20" />
      <path d="M256 250 q-40 40 0 100" />
    </svg>
  );
}

export default JusticeIcon;
