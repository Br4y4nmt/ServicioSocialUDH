import React from "react";
import InfoTooltipIcon from '../../hooks/componentes/Icons/InfoTooltipIcon';

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
                    <InfoTooltipIcon className="icono-info" width={16} height={16} />
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
