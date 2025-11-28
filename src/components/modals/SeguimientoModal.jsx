// src/.../modals/SeguimientoModal.jsx
import React from "react";

function SeguimientoModal({ isOpen, seguimiento, onClose }) {
  if (!isOpen || !seguimiento) return null;

  return (
    <div className="seguimiento-overlay">
      <div className="seguimiento-modal-box">
        <h3 className="seguimiento-title">
          Seguimiento de {seguimiento.estudiante}
        </h3>

        <div className="seguimiento-info">
          <p>
            <span>Email:</span> {seguimiento.email}
          </p>
          <p>
            <span>Programa:</span> {seguimiento.programa}
          </p>
        </div>

        <ul className="seguimiento-timeline-horizontal">
          {seguimiento.pasos.map((p, i) => (
            <li key={i} className={`timeline-h-item timeline-${p.estado}`}>
              <div className="timeline-h-marker"></div>
              <div className="timeline-h-content">
                <span className="timeline-h-title">
                  {p.paso}
                  <div className="tooltip-container">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icono-info"
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    <div className="tooltip-box">{p.tooltip}</div>
                  </div>
                </span>
                <span className="timeline-h-status">
                  {p.estado.toUpperCase()}
                </span>
              </div>
            </li>
          ))}
        </ul>

        <div className="seguimiento-actions">
          <button className="seguimiento-btn-cerrar" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default SeguimientoModal;
