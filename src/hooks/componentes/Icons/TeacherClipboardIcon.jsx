import React from "react";

function TeacherClipboardIcon({ size = 28, color = "#2e9e7f", className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Persona (relleno) */}
      <circle cx="42" cy="16" r="7" fill={color} />
      <path
        d="M34 26h12c5 0 9 4 9 9v17c0 2.2-1.8 4-4 4h-9c-2.2 0-4-1.8-4-4V36h-4c-1.1 0-2-.9-2-2v-6c0-1.1.9-2 2-2z"
        fill={color}
      />

      {/* Clipboard / hoja */}
      <rect
        x="10"
        y="18"
        width="18"
        height="30"
        rx="2"
        ry="2"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
      />
      {/* Parte superior del clipboard */}
      <rect
        x="14"
        y="14"
        width="10"
        height="6"
        rx="2"
        ry="2"
        fill={color}
      />
      {/* Líneas de texto */}
      <line
        x1="14"
        y1="24"
        x2="24"
        y2="24"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="14"
        y1="29"
        x2="24"
        y2="29"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="14"
        y1="34"
        x2="24"
        y2="34"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="14"
        y1="39"
        x2="21"
        y2="39"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default TeacherClipboardIcon;
