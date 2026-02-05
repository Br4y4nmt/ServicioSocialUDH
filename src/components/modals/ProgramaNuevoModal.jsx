import React from "react";

function ProgramaNuevoModal({
  isOpen,
  nombrePrograma,
  onChangeNombrePrograma,
  facultadPrograma,
  onChangeFacultadPrograma,
  emailPrograma,
  onChangeEmailPrograma,
  whatsappPrograma,
  onChangeWhatsappPrograma,
  facultades,
  onClose,
  onGuardar,
}) {
  if (!isOpen) return null;

  return (
    <div className="programas-modal show">
      <div className="programas-modal-content">
        <h3>Nuevo Programa Académico</h3>

        <input
          type="text"
          className="programas-modal-input"
          placeholder="Nombre del programa"
          value={nombrePrograma}
          onChange={(e) => onChangeNombrePrograma(e.target.value)}
        />

        <select
          className="programas-modal-select"
          value={facultadPrograma}
          onChange={(e) => onChangeFacultadPrograma(e.target.value)}
        >
          <option value="">Selecciona una facultad</option>
          {facultades.map((fac) => (
            <option key={fac.id_facultad} value={fac.id_facultad}>
              {fac.nombre_facultad}
            </option>
          ))}
        </select>

        <input
          type="email"
          className="programas-modal-input"
          placeholder="Correo institucional del programa"
          value={emailPrograma}
          onChange={(e) => onChangeEmailPrograma(e.target.value)}
        />

        <input
          type="text"
          className="programas-modal-input"
          placeholder="WhatsApp del programa"
          value={whatsappPrograma}
          onChange={(e) => onChangeWhatsappPrograma(e.target.value)}
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
            onClick={onGuardar}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProgramaNuevoModal;
