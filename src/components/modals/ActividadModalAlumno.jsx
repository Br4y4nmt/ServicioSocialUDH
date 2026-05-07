import React from "react";
import { alertWarning, alertError } from "../../hooks/alerts/alertas";

function ActividadModalAlumno({
  visible,
  nuevaActividad,
  setNuevaActividad,
  nuevaJustificacion,
  setNuevaJustificacion,
  nuevaFecha,
  setNuevaFecha,
  nuevaFechaFin,
  setNuevaFechaFin,
  nuevosResultados,
  setNuevosResultados,
  editIndex,
  setEditIndex,
  actividades,
  setActividades,
  onClose,
}) {
  if (!visible) return null;

  const hoyISO = new Date().toISOString().split("T")[0];
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const parseISODate = (value) => {
    if (!value) return null;
    const parts = value.split("-").map((part) => Number(part));
    if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) return null;
    const [year, month, day] = parts;
    const date = new Date(year, month - 1, day);
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const contarPalabras = (texto) => {
    return texto.trim() === "" ? 0 : texto.trim().split(/\s+/).length;
  };

  const handleGuardar = async (event) => {
    event.preventDefault();

    if (contarPalabras(nuevaActividad) > 40) {
      await alertWarning(
        "Actividad demasiado larga",
        "El campo Actividad permite como máximo 40 palabras."
      );
      return;
    }

    if (contarPalabras(nuevaJustificacion) > 40) {
      await alertWarning(
        "Justificación demasiado larga",
        "El campo Justificación permite como máximo 40 palabras."
      );
      return;
    }

    const fechaInicio = parseISODate(nuevaFecha);
    const fechaFin = parseISODate(nuevaFechaFin);

    if (!fechaInicio || !fechaFin) {
      await alertWarning(
        "Fechas inválidas",
        "Ingresa fechas válidas para la actividad."
      );
      return;
    }

    if (fechaInicio < hoy || fechaFin < hoy) {
      await alertWarning(
        "Fechas inválidas",
        "No puedes registrar actividades con fechas anteriores a hoy."
      );
      return;
    }

    if (nuevaFechaFin.trim() !== "") {
      const diferenciaMs = fechaFin - fechaInicio;
      const diasDiferencia = diferenciaMs / (1000 * 60 * 60 * 24);

      if (diasDiferencia > 30) {
        await alertError(
          "Duración excedida",
          "Cada actividad puede durar como máximo 30 días."
        );
        return;
      }

      if (diasDiferencia < 0) {
        await alertError(
          "Fechas inválidas",
          "La fecha fin no puede ser anterior a la fecha de inicio."
        );
        return;
      }
    }

    const nuevaFila = {
      actividad: nuevaActividad,
      fecha: nuevaFecha,
      fechaFin: nuevaFechaFin,
      justificacion: nuevaJustificacion,
      resultados: nuevosResultados,
    };

    if (editIndex !== null) {
      const copia = [...actividades];
      copia[editIndex] = nuevaFila;
      setActividades(copia);
    } else {
      setActividades([...actividades, nuevaFila]);
    }

    setNuevaActividad("");
    setNuevaFecha("");
    setNuevaFechaFin("");
    setNuevosResultados("");
    setNuevaJustificacion("");
    setEditIndex(null);
    onClose();
  };

  return (
    <div className="modal-overlay-alumno">
      <div className="modal-content-alumno">
        <h3>Agregar Actividad</h3>

        <form onSubmit={handleGuardar}>
          <div className="form-group">
            <label className="bold-text">Actividad</label>
            <input
              type="text"
              className="input-estilo-select"
              style={{ width: "100%" }}
              value={nuevaActividad}
              onChange={(e) => setNuevaActividad(e.target.value)}
              placeholder="Ingrese nombre de la actividad"
              required
            />
          <small
            style={{
              color: contarPalabras(nuevaActividad) > 40 ? "red" : "#666",
            }}
          >
            {contarPalabras(nuevaActividad)} / 40 palabras
          </small>
          </div>

          <div className="form-group">
            <label className="bold-text">Justificación</label>
            <textarea
              className="input-estilo-select"
              value={nuevaJustificacion}
              onChange={(e) => setNuevaJustificacion(e.target.value)}
              placeholder="Describa aquí..."
              required
            />
          <small
            style={{
              color: contarPalabras(nuevaJustificacion) > 40 ? "red" : "#666",
            }}
          >
            {contarPalabras(nuevaJustificacion)} / 40 palabras
          </small>
          </div>

          <div className="form-group">
            <label className="bold-text">Fecha Estimada</label>
            <input
              type="date"
              className="input-estilo-select"
              value={nuevaFecha}
              onChange={(e) => setNuevaFecha(e.target.value)}
              min={hoyISO}
              required
            />
          </div>

          <div className="form-group">
            <label className="bold-text">Fecha Fin</label>
            <input
              type="date"
              className="input-estilo-select"
              value={nuevaFechaFin}
              onChange={(e) => setNuevaFechaFin(e.target.value)}
              min={hoyISO}
              required
            />
          </div>

          <div className="form-group">
            <label className="bold-text">Resultados Esperados</label>
            <textarea
              className="input-estilo-select"
              value={nuevosResultados}
              onChange={(e) => setNuevosResultados(e.target.value)}
              placeholder="Describa aquí los resultados..."
            />
          </div>

          <div className="grupo-alumno-modal-footer">
            <button className="grupo-alumno-btn grupo-alumno-btn-save" type="submit">Guardar</button>
            <button className="grupo-alumno-btn grupo-alumno-btn-cancel" type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ActividadModalAlumno;