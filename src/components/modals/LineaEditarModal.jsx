import React from "react";

function LineaEditarModal({
  isOpen,
  nombreLinea,
  onChangeNombreLinea,
  onClose,
  onGuardar,
}) {
  if (!isOpen) return null;

  return (
    <div className="labores-modal show">
      <div className="labores-modal-content">
        <h3>Editar Línea de Acción</h3>

        <input
          type="text"
          className="labores-modal-input"
          placeholder="Nombre de la línea"
          value={nombreLinea}
          onChange={(e) => onChangeNombreLinea(e.target.value)}
        />

        <div className="labores-modal-actions">
          <button
            className="labores-btn cancelar"
            type="button"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="labores-btn guardar"
            type="button"
            onClick={onGuardar}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

export default LineaEditarModal;
