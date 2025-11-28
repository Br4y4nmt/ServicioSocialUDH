import React from "react";

function EstudianteNuevoModal({
  isOpen,
  codigo,
  onChangeCodigo,
  whatsapp,
  onChangeWhatsapp,
  onClose,
  onGuardar,
}) {
  if (!isOpen) return null;

  return (
    <div className="docentes-modal show">
      <div className="docentes-modal-content">
        <h3>Agregar Estudiante</h3>

        <input
          type="text"
          className="docentes-modal-input"
          placeholder="Código Universitario (10 dígitos)"
          value={codigo}
          maxLength={10}
          onChange={(e) => onChangeCodigo(e.target.value)}
        />

        <input
          type="text"
          className="docentes-modal-input"
          placeholder="WhatsApp del estudiante (9 dígitos)"
          value={whatsapp}
          maxLength={9}
          onChange={(e) => onChangeWhatsapp(e.target.value)}
        />

        <div className="docentes-modal-actions">
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
}

export default EstudianteNuevoModal;
