import React, { useState, useEffect } from "react";
import { showTopWarningToast } from "../../hooks/alerts/useWelcomeToast";

function DocenteEditarModal({
  isOpen,
  nombre,
  onChangeNombre,
  email,
  onChangeEmail,
  facultad,
  onChangeFacultad,
  programa,
  onChangePrograma,
  facultades = [],
  programas = [],
  onClose,
  onGuardar,
}) {
  const [initialSnapshot, setInitialSnapshot] = useState({
    nombre: '',
    email: '',
    facultad: '',
    programa: ''
  });

  useEffect(() => {
    if (isOpen) {
      setInitialSnapshot({
        nombre: (nombre || '').trim(),
        email: (email || '').trim(),
        facultad: facultad || '',
        programa: programa || ''
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="docentes-modal show">
      <div className="docentes-modal-content">
        <h3>Editar Docente</h3>

        <input
          type="text"
          className="docentes-modal-input"
          placeholder="Nombre del docente"
          value={nombre}
          onChange={(e) => onChangeNombre(e.target.value)}
          autoFocus
        />

        <input
          type="email"
          className="docentes-modal-input"
          placeholder="Correo del docente"
          value={email}
          onChange={(e) => onChangeEmail(e.target.value)}
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
          <option value="">Selecciona un programa</option>
          {programas.map((prog) => (
            <option key={prog.id_programa} value={prog.id_programa}>
              {prog.nombre_programa}
            </option>
          ))}
        </select>

        <div className="docentes-modal-actions">
          <button
            className="docentes-btn cancelar"
            type="button"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="docentes-btn guardar"
            type="button"
            onClick={async () => {
              const nombreActual = (nombre || '').trim();
              const emailActual = (email || '').trim();
              const facultadActual = facultad || '';
              const programaActual = programa || '';

              const sinCambios = (
                nombreActual === (initialSnapshot.nombre || '') &&
                emailActual === (initialSnapshot.email || '') &&
                String(facultadActual) === String(initialSnapshot.facultad || '') &&
                String(programaActual) === String(initialSnapshot.programa || '')
              );

              if (sinCambios) {
                showTopWarningToast('Sin cambios', 'No se realizaron cambios.');
                return;
              }

              await onGuardar();
            }}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

export default DocenteEditarModal;
