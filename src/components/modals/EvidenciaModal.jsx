// src/components/modals/EvidenciaModal.jsx
import React from "react";

function EvidenciaModal({ visible, imagen, onClose }) {
  if (!visible) return null;

  return (
    <div className="modal-evidencia-overlay">
      <div className="modal-evidencia-content mejorado">
        <h3 className="modal-evidencia-title">Evidencia</h3>

        <div className="modal-evidencia-img-wrapper">
          <img
            src={imagen}
            alt="Evidencia"
            className="modal-evidencia-img"
          />
        </div>

        <div className="modal-evidencia-actions">
          <button
            onClick={onClose}
            className="modal-evidencia-btn-cerrar"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default EvidenciaModal;
