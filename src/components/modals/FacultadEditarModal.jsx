import React from "react";

function FacultadEditarModal({
  isOpen,
  nombre,
  onChangeNombre,
  onCancelar,
  onGuardar,
}) {
  if (!isOpen) return null;

  return (
    <div className="facultades-modal show">
      <div className="facultades-modal-content">
        <h3>Editar Facultad</h3>
        <input
          type="text"
          className="facultades-modal-input"
          placeholder="Nuevo nombre de la facultad"
          value={nombre}
          onChange={(e) => onChangeNombre(e.target.value)}
        />
        <div className="facultades-modal-actions">
          <button
            className="docentes-btn cancelar"
            onClick={onCancelar}
          >
            Cancelar
          </button>
          <button
            className="docentes-btn guardar"
            onClick={onGuardar}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

export default FacultadEditarModal;
