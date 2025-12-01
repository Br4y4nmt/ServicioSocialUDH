// src/components/modals/ActividadModalAlumno.jsx
import React from "react";
import Swal from "sweetalert2";

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

  const handleGuardar = async () => {
    if (nuevaActividad.trim() === "" || nuevaFecha.trim() === "") {
      await Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Completa todos los campos obligatorios antes de guardar.",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    const fechaInicio = new Date(nuevaFecha);
    const fechaFin = new Date(nuevaFechaFin);

    if (nuevaFechaFin.trim() !== "") {
      const diferenciaMs = fechaFin - fechaInicio;
      const diasDiferencia = diferenciaMs / (1000 * 60 * 60 * 24);

      if (diasDiferencia > 30) {
        await Swal.fire({
          icon: "error",
          title: "Duración excedida",
          text: "Cada actividad puede durar como máximo 30 días.",
          confirmButtonText: "Entendido",
        });
        return;
      }

      if (diasDiferencia < 0) {
        await Swal.fire({
          icon: "error",
          title: "Fechas inválidas",
          text: "La fecha fin no puede ser anterior a la fecha de inicio.",
          confirmButtonText: "Corregir",
        });
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

        <div className="form-group">
          <label className="bold-text">Actividad</label>
          <input
            type="text"
            className="input-estilo-select"
            style={{ width: "100%" }}
            value={nuevaActividad}
            onChange={(e) => setNuevaActividad(e.target.value)}
            placeholder="Ingrese nombre de la actividad"
          />
        </div>

        <div className="form-group">
          <label className="bold-text">Justificación</label>
          <textarea
            className="input-estilo-select"
            value={nuevaJustificacion}
            onChange={(e) => setNuevaJustificacion(e.target.value)}
            placeholder="Describa aquí..."
          />
        </div>

        <div className="form-group">
          <label className="bold-text">Fecha Estimada</label>
          <input
            type="date"
            className="input-estilo-select"
            value={nuevaFecha}
            onChange={(e) => setNuevaFecha(e.target.value)}
            min={hoyISO}
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

        <div className="modal-actions-alumno">
          <button onClick={handleGuardar}>Guardar</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default ActividadModalAlumno;
