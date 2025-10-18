import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // ✅ Importa SweetAlert2
import "./DashboardGestor.css";
import { useUser } from "../UserContext";

function CambiosTiempo() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [filtroEstudiantes, setFiltroEstudiantes] = useState("");
  const [programas, setProgramas] = useState([]);
  const [programaSeleccionado, setProgramaSeleccionado] = useState("");
  const [errorMensaje, setErrorMensaje] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [cronogramas, setCronogramas] = useState([]);
  const [nombreEstudiante, setNombreEstudiante] = useState("");
  const [editando, setEditando] = useState(null);
  const [nuevaFecha, setNuevaFecha] = useState("");
  const [guardando, setGuardando] = useState(false);

  const { user } = useUser();
  const token = user?.token;

  // --- API: Estudiantes ---
  const fetchEstudiantes = async () => {
    try {
      if (!token) return;
      const res = await axios.get(`/api/estudiantes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEstudiantes(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("❌ Error al obtener estudiantes:", error);
      setErrorMensaje("No se pudieron cargar los estudiantes.");
    }
  };

  // --- API: Programas ---
  const fetchProgramas = async () => {
    try {
      if (!token) return;
      const res = await axios.get(`/api/programas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProgramas(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("❌ Error al obtener programas:", error);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchEstudiantes();
    fetchProgramas();
  }, [token]);

  // --- Filtrado de estudiantes ---
  const estudiantesFiltrados = estudiantes.filter((est) => {
    const texto = filtroEstudiantes.toLowerCase();
    const coincideTexto = est.nombre_estudiante?.toLowerCase().includes(texto);
    const coincidePrograma =
      programaSeleccionado === "" ||
      est.programa?.nombre_programa === programaSeleccionado;
    return coincideTexto && coincidePrograma;
  });

  // --- Abrir modal con fechas de cronograma ---
  const verDetalle = async (id_estudiante, nombre) => {
    try {
      setNombreEstudiante(nombre);
      setModalVisible(true);
      setCronogramas([]);
      setEditando(null);

      const res = await axios.get(
        `/api/trabajo-social/fecha-fin-primero/${id_estudiante}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data && Array.isArray(res.data.cronogramas)) {
        setCronogramas(res.data.cronogramas);
      } else {
        setCronogramas([]);
      }
    } catch (error) {
      console.error("❌ Error al obtener fechas del cronograma:", error);
      setCronogramas([]);
    }
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setCronogramas([]);
    setEditando(null);
  };

  const iniciarEdicion = (id, fechaActual) => {
    setEditando(id);
    setNuevaFecha(fechaActual ? fechaActual.split("T")[0] : "");
  };

  // ✅ Toast con estilo claro y elegante
  const mostrarToast = (mensaje) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: mensaje,
      showConfirmButton: false,
      timer: 2200,
      timerProgressBar: true,
      background: "#ffffff",
      color: "#4b5563",
      customClass: {
        popup: "swal2-toast-custom",
      },
      iconColor: "#22c55e", // Verde suave
    });
  };

  // --- Guardar cambios ---
  const guardarFecha = async (id) => {
  try {
    const cronograma = cronogramas.find((item) => item.id === id);
    if (!cronograma) return;

    // 🧠 Si no hay cambios en la fecha, no hacemos la llamada ni mostramos éxito
    const fechaOriginal = new Date(cronograma.fecha_fin_primero)
      .toISOString()
      .split("T")[0];

    if (fechaOriginal === nuevaFecha) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "info",
        title: "No se realizaron cambios en la fecha",
        showConfirmButton: false,
        timer: 1800,
        background: "#ffffff",
        color: "#4b5563",
        iconColor: "#22c55e",
      });
      setEditando(null);
      return;
    }

    setGuardando(true);

    const res = await axios.put(
      `/api/trabajo-social/actualizar-fecha/${id}`,
      { fecha_fin_primero: nuevaFecha },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (res.status === 200) {
      setCronogramas((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, fecha_fin_primero: nuevaFecha } : item
        )
      );
      setEditando(null);

      // ✅ Mostrar el toast de éxito
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Fecha actualizada correctamente",
        showConfirmButton: false,
        timer: 2200,
        background: "#ffffff",
        color: "#4b5563",
        iconColor: "#22c55e",
      });
    }
  } catch (error) {
    console.error("❌ Error al actualizar la fecha:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo actualizar la fecha.",
      confirmButtonColor: "#dc2626",
    });
  } finally {
    setGuardando(false);
  }
};

  return (
    <div className="docentes-container">
      <div className="docentes-card">
        <div className="docentes-header">
          <div className="docentes-header-left flex items-center gap-4">
            <h2>Cambios Tiempo</h2>
          </div>

          <div className="docentes-header-right">
            <label className="docentes-search-label">
              Buscar:
              <input
                type="text"
                className="docentes-search-input-es"
                placeholder="Nombre del estudiante"
                value={filtroEstudiantes}
                onChange={(e) => setFiltroEstudiantes(e.target.value)}
              />
            </label>
          </div>

          <label className="docentes-search-label">
            Programa Académico:
            <select
              className="select-profesional"
              value={programaSeleccionado}
              onChange={(e) => setProgramaSeleccionado(e.target.value)}
            >
              <option value="">Todos</option>
              {programas.map((prog) => (
                <option key={prog.id_programa} value={prog.nombre_programa}>
                  {prog.nombre_programa}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="docentes-table-wrapper">
          {errorMensaje ? (
            <div style={{ padding: "1rem", color: "red", textAlign: "center" }}>
              {errorMensaje}
            </div>
          ) : (
            <table className="docentes-table">
              <thead className="docentes-table-thead">
                <tr>
                  <th>Nº</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Celular</th>
                  <th>Programa Académico</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {estudiantesFiltrados.length > 0 ? (
                  estudiantesFiltrados.map((est, index) => (
                    <tr key={est.id_estudiante}>
                      <td>{index + 1}</td>
                      <td>{est.nombre_estudiante || "SIN NOMBRE"}</td>
                      <td>{est.email || "SIN CORREO"}</td>
                      <td>{est.celular || "—"}</td>
                      <td>
                        {est.programa?.nombre_programa?.toUpperCase() ||
                          "SIN PROGRAMA"}
                      </td>
                      <td>
                        <button
                          className="btn-ver-pdf"
                          onClick={() =>
                            verDetalle(est.id_usuario, est.nombre_estudiante)
                          }
                          title="Ver detalle"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            fill="#2e2e2e"
                            viewBox="0 0 24 24"
                            className="icono-ojo"
                          >
                            <path d="M12 4.5C7 4.5 2.73 8.11 1 12c1.73 3.89 6 7.5 11 7.5s9.27-3.61 11-7.5c-1.73-3.89-6-7.5-11-7.5zm0 13c-3.03 0-5.5-2.47-5.5-5.5S8.97 6.5 12 6.5s5.5 2.47 5.5 5.5S15.03 17.5 12 17.5zm0-9c-1.93 0-3.5 1.57-3.5 3.5S10.07 15.5 12 15.5s3.5-1.57 3.5-3.5S13.93 8.5 12 8.5z" />
                          </svg>
                          <span>Ver</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", padding: "1rem" }}>
                      No se encontraron estudiantes.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* MODAL DE DETALLE */}
      {modalVisible && (
        <div className="modal-tiempo-overlay">
          <div className="modal-tiempo-content">
            <h3>Fechas de {nombreEstudiante}</h3>

            {cronogramas.length > 0 ? (
              <table className="modal-tiempo-table">
                <thead>
                  <tr>
                    <th>Nº</th>
                    <th>Resultado</th>
                    <th>Fecha Fin</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {cronogramas.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.resultados || "—"}</td>
                      <td>
                        {editando === item.id ? (
                          <input
                            type="date"
                            className="modal-tiempo-input-fecha"
                            value={
                              nuevaFecha ||
                              new Date(item.fecha_fin_primero)
                                .toISOString()
                                .split("T")[0]
                            }
                            onChange={(e) => setNuevaFecha(e.target.value)}
                          />
                        ) : (
                          (() => {
                            const fechaISO = new Date(item.fecha_fin_primero)
                              .toISOString()
                              .split("T")[0];
                            const [yyyy, mm, dd] = fechaISO.split("-");
                            return `${dd}/${mm}/${yyyy}`;
                          })()
                        )}
                      </td>
                      <td className="modal-tiempo-acciones">
                        {editando === item.id ? (
                          <button
                            className="btn-guardar-fecha"
                            onClick={() => guardarFecha(item.id)}
                            disabled={guardando}
                          >
                            💾
                          </button>
                        ) : (
                          <button
                            className="btn-editar-icono"
                            onClick={() =>
                              iniciarEdicion(item.id, item.fecha_fin_primero)
                            }
                            title="Editar fecha"
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
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="modal-tiempo-empty">No hay fechas registradas.</p>
            )}

            <div className="modal-tiempo-footer">
              <button className="modal-tiempo-btn-cerrar" onClick={cerrarModal}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CambiosTiempo;
