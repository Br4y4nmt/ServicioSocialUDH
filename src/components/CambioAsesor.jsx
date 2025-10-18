import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./DashboardGestor.css";
import { useUser } from "../UserContext";

function CambioAsesor() {
  const { user } = useUser();
  const token = user?.token;

  const [trabajos, setTrabajos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [errorMensaje, setErrorMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  // Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [asesores, setAsesores] = useState([]);
  const [asesorSeleccionado, setAsesorSeleccionado] = useState("");
  const [trabajoSeleccionado, setTrabajoSeleccionado] = useState(null);
  const [guardando, setGuardando] = useState(false);

  // --- API: Obtener trabajos sociales aceptados ---
  const fetchTrabajos = async () => {
    try {
      if (!token) return;
      setCargando(true);
      setErrorMensaje("");

      const res = await axios.get(`/api/trabajo-social/cambio-asesor/detalle`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data =
        Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];

      setTrabajos(data);
    } catch (error) {
      const mensaje =
        error.response?.data?.message ||
        "No se pudieron cargar los registros.";
      setErrorMensaje(mensaje);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: mensaje,
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setCargando(false);
    }
  };

  // --- API: Obtener asesores disponibles ---
  const fetchAsesores = async () => {
    try {
      const res = await axios.get(`/api/docentes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAsesores(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("❌ Error al obtener asesores:", error);
      setAsesores([]);
    }
  };

  // --- Abrir modal ---
  const abrirModal = (trabajo) => {
    setTrabajoSeleccionado(trabajo);
    setAsesorSeleccionado("");
    fetchAsesores();
    setModalVisible(true);
  };

  // --- Cerrar modal ---
  const cerrarModal = () => {
    setModalVisible(false);
    setAsesorSeleccionado("");
    setTrabajoSeleccionado(null);
  };

  // --- Guardar cambio de asesor ---
  const guardarCambioAsesor = async () => {
    if (!asesorSeleccionado) {
      Swal.fire({
        icon: "warning",
        title: "Seleccione un asesor",
        text: "Debe elegir un asesor antes de guardar.",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    try {
      setGuardando(true);
      // Aquí iría tu endpoint PUT real (lo crearás luego)
      const res = await axios.put(
        `/api/trabajo-social/cambio-asesor/${trabajoSeleccionado.id}`,
        { nuevo_docente_id: asesorSeleccionado },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 200) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Asesor actualizado correctamente",
          showConfirmButton: false,
          timer: 2200,
          background: "#ffffff",
          color: "#4b5563",
          iconColor: "#22c55e",
        });

        cerrarModal();
        fetchTrabajos();
      }
    } catch (error) {
      console.error("❌ Error al actualizar asesor:", error);
      Swal.fire({
        icon: "error",
        title: "Error al actualizar",
        text: "No se pudo actualizar el asesor.",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setGuardando(false);
    }
  };

  useEffect(() => {
    if (user && token) fetchTrabajos();
  }, [user, token]);

  const trabajosFiltrados = trabajos.filter((t) =>
    t.nombre_estudiante?.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="docentes-container">
      <div className="docentes-card">
        <div className="docentes-header">
          <div className="docentes-header-left flex items-center gap-4">
            <h2>Cambio de Asesor</h2>
          </div>

          <div className="docentes-header-right">
            <label className="docentes-search-label">
              Buscar:
              <input
                type="text"
                className="docentes-search-input-es"
                placeholder="Nombre del estudiante"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
            </label>
          </div>
        </div>

        <div className="docentes-table-wrapper">
          {cargando ? (
            <div style={{ textAlign: "center", padding: "1rem" }}>
              🔄 Cargando registros...
            </div>
          ) : errorMensaje ? (
            <div style={{ padding: "1rem", color: "red", textAlign: "center" }}>
              {errorMensaje}
            </div>
          ) : (
            <table className="docentes-table">
              <thead className="docentes-table-thead">
                <tr>
                  <th>Nº</th>
                  <th>Nombre del Estudiante</th>
                  <th>Asesor Actual</th>
                  <th>Programa Académico</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {trabajosFiltrados.length > 0 ? (
                  trabajosFiltrados.map((t, index) => (
                    <tr key={t.id}>
                      <td>{index + 1}</td>
                      <td>{t.nombre_estudiante || "—"}</td>
                      <td>{t.asesor || "Sin asignar"}</td>
                      <td>
                        {t.programa_academico
                          ? t.programa_academico.toUpperCase()
                          : "SIN PROGRAMA"}
                      </td>
                      <td>
                        <button
                          className="btn-editar-icono"
                          onClick={() => abrirModal(t)}
                          title="Cambiar asesor"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            fill="white"
                            viewBox="0 0 24 24"
                          >
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM21.41 6.34a1.25 1.25 0 0 0 0-1.77l-2.34-2.34a1.25 1.25 0 0 0-1.77 0l-1.83 1.83 3.75 3.75 1.19-1.19z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      style={{ textAlign: "center", padding: "1rem" }}
                    >
                      No se encontraron estudiantes aceptados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* MODAL ELEGANTE */}
      {modalVisible && (
        <div className="modal-tiempo-overlay">
          <div className="modal-tiempo-content">
            <h3>
              Cambiar asesor de{" "}
              <span style={{ color: "#2e9e7f" }}>
                {trabajoSeleccionado?.nombre_estudiante}
              </span>
            </h3>

            <label className="docentes-search-label" style={{ marginTop: "1rem" }}>
              Asesores disponibles:
              <select
                className="select-profesional"
                value={asesorSeleccionado}
                onChange={(e) => setAsesorSeleccionado(e.target.value)}
              >
                <option value="">Seleccione un asesor</option>
                {asesores.map((a) => (
                  <option key={a.id_docente} value={a.id_docente}>
                    {a.nombre_docente}
                  </option>
                ))}
              </select>
            </label>

            <div className="modal-tiempo-footer">
                <button
                    className="btn-cancelar-cambio-asesor"
                    onClick={cerrarModal}
                    disabled={guardando}
                >
                    Cancelar
                </button>

                <button
                    className="btn-guardar-cambio-asesor"
                    onClick={guardarCambioAsesor}
                    disabled={guardando}
                >
                    {guardando ? "Guardando..." : "Guardar cambio"}
                </button>
                </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CambioAsesor;
