import React from "react";
import { showTopWarningToast } from '../../hooks/alerts/useWelcomeToast';

function ProgramaEditarModal({
  isOpen,
  nombre,
  originalNombre,
  facultad,
  originalFacultad,
  onChangeNombre,
  onChangeFacultad,
  email,
  originalEmail,
  onChangeEmail,
  facultades,
  onClose,
  onGuardar
}) {
  if (!isOpen) return null;

  return (
    <div className="programas-modal show">
      <div className="programas-modal-content">
        <h3>Editar Programa Académico</h3>

        <input
          type="text"
          className="programas-modal-input"
          placeholder="Nombre del programa"
          value={nombre}
          onChange={(e) => onChangeNombre(e.target.value)}
          autoFocus
        />

        <select
          className="programas-modal-select"
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

        <input
          type="email"
          className="programas-modal-input"
          placeholder="Correo institucional"
          value={email}
          onChange={(e) => onChangeEmail(e.target.value)}
        />

        <div className="programas-modal-actions">
          <button className="docentes-btn cancelar" onClick={onClose}>
            Cancelar
          </button>
          <button className="docentes-btn guardar" onClick={() => {
            const nameSame = (originalNombre || '').trim() === (nombre || '').trim();
            const facultadSame = String(originalFacultad || '') === String(facultad || '');
            const emailSame = (originalEmail || '').trim() === (email || '').trim();

            if (nameSame && facultadSame && emailSame) {
              showTopWarningToast('Sin cambios', 'No se realizaron cambios.');
              return;
            }

            onGuardar();
          }}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProgramaEditarModal;
