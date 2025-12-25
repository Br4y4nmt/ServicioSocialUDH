import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./DashboardGestor.css";
import VerBoton from "../hooks/componentes/VerBoton";
import { useUser } from "../UserContext";
import CambiosTiempoModal from "../components/modals/CambiosTiempoModal";
import PageSkeleton from "../components/loaders/PageSkeleton"; 

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
  const [cargando, setCargando] = useState(false);
  const { user } = useUser();
  const token = user?.token;

  const fetchEstudiantes = useCallback(async () => {
    try {
      if (!token) return;

      setCargando(true);
      setErrorMensaje("");

      const res = await axios.get(`/api/estudiantes`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEstudiantes(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error al obtener estudiantes:", error);
      setErrorMensaje("No se pudieron cargar los estudiantes.");
    } finally {
      setCargando(false);
    }
  }, [token]);

  const fetchProgramas = useCallback(async () => {
    try {
      if (!token) return;
      const res = await axios.get(`/api/programas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProgramas(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error al obtener programas:", error);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetchEstudiantes();
    fetchProgramas();
  }, [token, fetchEstudiantes, fetchProgramas]);

  const estudiantesFiltrados = estudiantes.filter((est) => {
    const texto = filtroEstudiantes.toLowerCase();
    const coincideTexto = est.nombre_estudiante?.toLowerCase().includes(texto);
    const coincidePrograma =
      programaSeleccionado === "" ||
      est.programa?.nombre_programa === programaSeleccionado;
    return coincideTexto && coincidePrograma;
  });

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
      console.error("Error al obtener fechas del cronograma:", error);
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
      iconColor: "#22c55e",
    });
  };

  const guardarFecha = async (id) => {
    try {
      const cronograma = cronogramas.find((item) => item.id === id);
      if (!cronograma) return;

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

        mostrarToast("Fecha actualizada correctamente");
      }
    } catch (error) {
      console.error("Error al actualizar la fecha:", error);
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
          {cargando ? (
            <PageSkeleton topBlocks={["sm", "md", "lg"]} xlRows={3} showChip lastXL />
          ) : errorMensaje ? (
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
                        <VerBoton
                          onClick={() =>
                            verDetalle(est.id_usuario, est.nombre_estudiante)
                          }
                          label="Ver"
                        />
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

      <CambiosTiempoModal
        visible={modalVisible}
        nombreEstudiante={nombreEstudiante}
        cronogramas={cronogramas}
        editando={editando}
        nuevaFecha={nuevaFecha}
        setNuevaFecha={setNuevaFecha}
        iniciarEdicion={iniciarEdicion}
        guardarFecha={guardarFecha}
        guardando={guardando}
        onClose={cerrarModal}
      />
    </div>
  );
}

export default CambiosTiempo;
