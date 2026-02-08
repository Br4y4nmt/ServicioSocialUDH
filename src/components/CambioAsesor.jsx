import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import SearchInput from './SearchInput';
import { buscarSinTildes } from '../utils/textUtils';
import "./DashboardGestor.css";
import { alertError, alertWarning, toastSuccess } from "../hooks/alerts/alertas";
import { useUser } from "../UserContext";
import CambioAsesorModal from "../components/modals/CambioAsesorModal";
import PageSkeleton from "../components/loaders/PageSkeleton"; 

function CambioAsesor() {
  const { user } = useUser();
  const token = user?.token;
  const [trabajos, setTrabajos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [errorMensaje, setErrorMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [asesores, setAsesores] = useState([]);
  const [asesorSeleccionado, setAsesorSeleccionado] = useState("");
  const [trabajoSeleccionado, setTrabajoSeleccionado] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const fetchTrabajos = useCallback(async () => {
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
        error.response?.data?.message || "No se pudieron cargar los registros.";

      setErrorMensaje(mensaje);
      alertError("Error", mensaje);
    } finally {
      setCargando(false);
    }
  }, [token]);

  const fetchAsesores = async () => {
    try {
      const res = await axios.get(`/api/docentes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAsesores(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error al obtener asesores:", error);
      setAsesores([]);
    }
  };

  const abrirModal = (trabajo) => {
    setTrabajoSeleccionado(trabajo);
    setAsesorSeleccionado("");
    fetchAsesores();
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setAsesorSeleccionado("");
    setTrabajoSeleccionado(null);
  };

  const guardarCambioAsesor = async () => {
    if (!asesorSeleccionado) {
      alertWarning("Seleccione un asesor", "Debe elegir un asesor antes de guardar.");
      return;
    }

    try {
      setGuardando(true);

      const res = await axios.put(
        `/api/trabajo-social/cambio-asesor/${trabajoSeleccionado.id}`,
        { nuevo_docente_id: asesorSeleccionado },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        toastSuccess("Asesor actualizado correctamente");
        cerrarModal();
        fetchTrabajos();
      }
    } catch (error) {
      console.error("Error al actualizar asesor:", error);
      alertError("Error al actualizar", "No se pudo actualizar el asesor.");
    } finally {
      setGuardando(false);
    }
  };

  useEffect(() => {
    if (user && token) fetchTrabajos();
  }, [user, token, fetchTrabajos]);

  const trabajosFiltrados = trabajos.filter((t) =>
    buscarSinTildes(t.nombre_estudiante || '', filtro)
  );

  return (
    <div className="docentes-container">
      <div className="docentes-card">
        <div className="docentes-header">
          <div className="docentes-header-left flex items-center gap-4">
            <h2>Cambio de Asesor</h2>
          </div>

          <div className="docentes-header-right">
            <SearchInput
              value={filtro}
              onChange={setFiltro}
              placeholder="Nombre del estudiante"
              label="Buscar:"
              className="docentes-search-label"
            />
          </div>
        </div>

        <div className="docentes-table-wrapper">
          {cargando ? (
            <PageSkeleton topBlocks={["sm"]} xlRows={3} showChip lastXL />
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
                          className="facultades-btn editar"
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
                    <td colSpan="5" style={{ textAlign: "center", padding: "1rem" }}>
                      No se encontraron estudiantes aceptados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <CambioAsesorModal
        visible={modalVisible}
        onClose={cerrarModal}
        onSave={guardarCambioAsesor}
        guardando={guardando}
        trabajoSeleccionado={trabajoSeleccionado}
        asesores={asesores}
        asesorSeleccionado={asesorSeleccionado}
        setAsesorSeleccionado={setAsesorSeleccionado}
      />
    </div>
  );
}

export default CambioAsesor;
