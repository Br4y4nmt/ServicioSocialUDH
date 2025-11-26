import React from "react";

function ImpersonateIcon({ size = 22, color = "#2e9e7f", className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke={color}
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Puerta */}
      <path d="M30 10 H38 V38 L30 41 Z" />

      {/* Marco redondeado de la puerta */}
      <path d="M30 10 H16 C13 10 11 12 11 15 V33 C11 36 13 38 16 38 H30" />

      {/* Flecha hacia la derecha */}
      <path d="M6 24 H22 M22 24 L17 19 M22 24 L17 29" />
    </svg>
  );
}

export default ImpersonateIcon;
