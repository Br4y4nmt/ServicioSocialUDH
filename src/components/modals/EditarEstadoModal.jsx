// src/components/modals/EditarEstadoModal.jsx
import React from "react";

function EditarEstadoModal({
  visible,
  nuevoEstado,
  onChangeEstado,
  onSave,
  onClose,
}) {
  if (!visible) return null;

  return (
    <div className="revision-modal">
      <div className="revision-modal-content">
        <h3>Editar Estado</h3>

        <label htmlFor="estado">Estado:</label>
        <select
          id="estado"
          value={nuevoEstado}
          onChange={(e) => onChangeEstado(e.target.value)}
          className="revision-modal-select"
        >
          <option value="pendiente">Pendiente</option>
          <option value="aceptado">Aceptado</option>
          <option value="rechazado">Rechazado</option>
        </select>

        <div className="revision-modal-actions">
          <button className="revision-btn guardar" onClick={onSave}>
            Guardar
          </button>
          <button className="revision-btn cancelar" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditarEstadoModal;
