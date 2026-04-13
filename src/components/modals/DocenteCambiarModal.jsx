import React, { useState, useEffect } from "react";
import { showTopWarningToast } from "../../hooks/alerts/useWelcomeToast";

function DocenteCambiarModal({
  isOpen,
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
    email: "",
    facultad: "",
    programa: "",
  });

  useEffect(() => {
    if (isOpen) {
      setInitialSnapshot({
        email: (email || "").trim(),
        facultad: facultad || "",
        programa: programa || "",
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="programas-modal show">
      <div className="programas-modal-content">
        <h3>Cambiar Docente</h3>

        <input
          type="email"
          className="programas-modal-input"
          placeholder="Correo del docente"
          value={email}
          onChange={(e) => onChangeEmail(e.target.value)}
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

        <select
          className="programas-modal-select"
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

        <div className="programas-modal-actions">
          <button className="docentes-btn cancelar" type="button" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="docentes-btn guardar"
            type="button"
            onClick={async () => {
              const emailActual = (email || "").trim();
              const facultadActual = facultad || "";
              const programaActual = programa || "";

              const sinCambios =
                emailActual === (initialSnapshot.email || "") &&
                String(facultadActual) === String(initialSnapshot.facultad || "") &&
                String(programaActual) === String(initialSnapshot.programa || "");

              if (sinCambios) {
                showTopWarningToast("Sin cambios", "No se realizaron cambios.");
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

export default DocenteCambiarModal;
