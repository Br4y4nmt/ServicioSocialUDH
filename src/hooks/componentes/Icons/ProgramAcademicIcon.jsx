import React from "react";

function ProgramAcademicIcon({ size = 28, color = "#2e9e7f", className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Edificio central */}
      <rect x="24" y="26" width="16" height="28" rx="1" />
      <line x1="28" y1="34" x2="36" y2="34" />
      <line x1="28" y1="40" x2="36" y2="40" />
      <line x1="28" y1="46" x2="36" y2="46" />

      {/* Edificio izquierdo */}
      <rect x="10" y="32" width="12" height="20" rx="1" />
      <line x1="14" y1="38" x2="18" y2="38" />
      <line x1="14" y1="44" x2="18" y2="44" />

      {/* Edificio derecho */}
      <rect x="42" y="32" width="12" height="20" rx="1" />
      <line x1="46" y1="38" x2="50" y2="38" />
      <line x1="46" y1="44" x2="50" y2="44" />

      {/* Birrete */}
      <polygon points="32 12 8 20 32 28 56 20 32 12" />
      <line x1="32" y1="28" x2="32" y2="34" />
      <line x1="48" y1="20" x2="48" y2="30" />
      <circle cx="48" cy="34" r="3" />
    </svg>
  );
}

export default ProgramAcademicIcon;
