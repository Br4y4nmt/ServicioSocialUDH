import React from "react";

function CambioAsesorIcon({ size = 22, color = "#2e9e7f", className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      {/* Persona superior izquierda */}
      <circle cx="14" cy="12" r="5" fill={color} />
      <path
        d="M8 20c0-2.5 2-4.5 4.5-4.5h3c2.5 0 4.5 2 4.5 4.5v2c0 1.9-1.6 3.5-3.5 3.5h-5c-1.9 0-3.5-1.6-3.5-3.5v-2z"
        fill={color}
      />

      {/* Persona inferior derecha */}
      <circle cx="34" cy="32" r="5" fill={color} />
      <path
        d="M28 40c0-2.5 2-4.5 4.5-4.5h3c2.5 0 4.5 2 4.5 4.5v2c0 1.9-1.6 3.5-3.5 3.5h-5c-1.9 0-3.5-1.6-3.5-3.5v-2z"
        fill={color}
      />

      {/* Flecha curva: persona de arriba → persona de abajo (lado derecho) */}
      <path
        d="M20 14C28 14 34 18 36 24"
        stroke={color}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M31 20l5 4-5 4"
        stroke={color}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Flecha curva: persona de abajo → persona de arriba (lado izquierdo) */}
      <path
        d="M28 34C20 34 14 30 12 24"
        stroke={color}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 28l-5-4 5-4"
        stroke={color}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default CambioAsesorIcon;
