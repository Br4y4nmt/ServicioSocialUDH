import React from 'react';

export default function PerfilIcon({ className = '' }) {
  return (
    <svg
      className={className}
      fill="none"
      height="24"
      width="24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor"></path>
      <circle cx="12" cy="7" r="4" stroke="currentColor"></circle>
    </svg>
  );
}
