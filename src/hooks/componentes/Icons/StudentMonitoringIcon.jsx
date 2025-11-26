import React from "react";

function StudentMonitoringIcon({
  size = 32,
  color = "#2e9e7f",
  className = "",
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* --- Personas (3 estudiantes) --- */}
      {/* Cabezas */}
      <circle cx="16" cy="14" r="4" />
      <circle cx="32" cy="12" r="4" />
      <circle cx="48" cy="14" r="4" />

      {/* Cuerpos (semicírculos) */}
      <path d="M10 22c1.5-3 4-5 6-5s4.5 2 6 5" />
      <path d="M26 20c1.5-3 4-5 6-5s4.5 2 6 5" />
      <path d="M42 22c1.5-3 4-5 6-5s4.5 2 6 5" />

      {/* --- Barra / mesa debajo de los alumnos --- */}
      <rect x="10" y="26" width="44" height="6" rx="3" />

      {/* --- Engrane simplificado --- */}
      <circle cx="30" cy="44" r="10" />  {/* círculo exterior */}
      {/* pequeñas muescas como dientes */}
      <path d="M30 32v3" />
      <path d="M30 53v3" />
      <path d="M18 44h3" />
      <path d="M39 44h3" />
      <path d="M22 36l2 2" />
      <path d="M36 50l2 2" />
      <path d="M22 52l2-2" />
      <path d="M36 38l2-2" />

      {/* --- Ojo dentro del engrane --- */}
      <ellipse cx="30" cy="44" rx="5" ry="3.2" />
      <circle cx="30" cy="44" r="1.6" fill={color} />

      {/* --- Mango de la lupa --- */}
      <line x1="37" y1="51" x2="44" y2="58" />
      <rect
        x="43"
        y="56"
        width="6"
        height="4"
        rx="1"
        transform="rotate(45 43 56)"
      />
    </svg>
  );
}

export default StudentMonitoringIcon;
