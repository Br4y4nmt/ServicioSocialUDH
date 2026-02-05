import React from "react";

const FacultadNuevoModal = ({
  isOpen,
  nombreFacultad,
  onChangeNombre,
  onClose,
  onGuardar,
}) => {
  if (!isOpen) return null;

  return (
    <div className="facultades-modal show">
      <div className="facultades-modal-content">
        <h3>Nueva Facultad</h3>

        <input
          type="text"
          className="facultades-modal-input"
          placeholder="Nombre de la facultad"
          value={nombreFacultad}
          onChange={(e) => onChangeNombre(e.target.value)}
        />

        <div className="facultades-modal-actions">
          <button
            className="docentes-btn cancelar"
            onClick={onClose}
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
};

export default FacultadNuevoModal;
