import React from "react";

function DocenteNuevoModal({
  isOpen,
  email,
  onChangeEmail,
  whatsapp,
  onChangeWhatsapp,
  facultad,
  onChangeFacultad,
  programa,
  onChangePrograma,
  facultades,
  programas,
  onClose,
  onGuardar,
}) {
  if (!isOpen) return null;

  return (
    <div className="docentes-modal show">
      <div className="docentes-modal-content">
        <h3>Registrar Docente</h3>

        <input
          type="email"
          className="docentes-modal-input"
          placeholder="Email del docente"
          value={email}
          onChange={(e) => onChangeEmail(e.target.value)}
        />

        <input
          type="text"
          className="docentes-modal-input"
          placeholder="WhatsApp del docente"
          value={whatsapp}
          onChange={(e) => onChangeWhatsapp(e.target.value)}
        />

        <select
          className="docentes-modal-select"
          value={facultad}
          onChange={(e) => onChangeFacultad(e.target.value)}
        >
          <option value="">Selecciona una facultad</option>
          {facultades.map((fac) => (
            <option key={fac.id_facultad} value={fac.id_facultad}>
              {fac.nombre_facultad}
            </option>
          ))}
        </select>

        <select
          className="docentes-modal-select"
          value={programa}
          onChange={(e) => onChangePrograma(e.target.value)}
        >
          <option value="">Selecciona un programa académico</option>
          {programas.map((prog) => (
            <option key={prog.id_programa} value={prog.id_programa}>
              {prog.nombre_programa}
            </option>
          ))}
        </select>

        <div className="docentes-modal-actions">
          <button className="docentes-btn cancelar" onClick={onClose}>
            Cancelar
          </button>
          <button className="docentes-btn guardar" onClick={onGuardar}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

export default DocenteNuevoModal;
