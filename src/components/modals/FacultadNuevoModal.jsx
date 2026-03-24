import React from "react";
import { showTopWarningToast } from '../../hooks/alerts/useWelcomeToast';

const FacultadNuevoModal = ({
  isOpen,
  nombreFacultad,
  onChangeNombre,
  onClose,
  onGuardar,
}) => {
  if (!isOpen) return null;

  return (
    <div className="programas-modal show">
      <div className="programas-modal-content">
        <h3>Nueva Facultad</h3>

        <input
          type="text"
          className="programas-modal-input"
          placeholder="Nombre de la facultad"
          value={nombreFacultad}
          onChange={(e) => onChangeNombre(e.target.value)}
        />

        <div className="programas-modal-actions">
          <button
            className="docentes-btn cancelar"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            className="docentes-btn guardar"
            onClick={() => {
              if (!nombreFacultad || nombreFacultad.trim() === '') {
                showTopWarningToast('Campo vacío', 'Ingrese el nombre de la facultad.');
                return;
              }

              onGuardar();
            }}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacultadNuevoModal;
