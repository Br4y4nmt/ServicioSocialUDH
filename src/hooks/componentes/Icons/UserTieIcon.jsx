import React from "react";

function UserTieIcon({ width = 38, height = 38, style }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 344 344"
      width={width}
      height={height}
      style={style}
      fill="none"
    >

      <circle cx="172" cy="92" r="55" fill="#002060" />
      {/* Hombro izquierdo */}
      <path d="M34 290 C34 235 66 205 118 188 C123 186 127 188 128 194 L154 290 Z" fill="#002060" />
      {/* Hombro derecho */}
      <path d="M310 290 C310 235 278 205 226 188 C221 186 217 188 216 194 L190 290 Z" fill="#002060" />
      {/* Cuerpo y corbata */}
      <path d="M148 184 H196 Q202 184 198 192 L184 212 H160 L146 192 Q142 184 148 184 Z" fill="#002060" />
      {/* Corbata parte inferior */}
      <path d="M160 212 L150 290 H194 L184 212 Z" fill="#002060" />
    </svg>
  );
}

export default UserTieIcon;
