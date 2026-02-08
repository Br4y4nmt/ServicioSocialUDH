import { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useUser } from '../UserContext';
import { mostrarAlertaEvidenciaSeleccionada } from './alerts/alertas';

/**
 * Hook que encapsula el cronograma de actividades, seguimiento,
 * evidencias y sus derivados (hayObservaciones, todasAprobadas).
 *
 * @param {Object}  params
 * @param {boolean} params.datosCargados - indica si los datos del trabajo social ya fueron cargados
 */
export function useActividadesCronograma({ datosCargados }) {
  const { user } = useUser();

  // ── Estado del cronograma (formulario) ──
  const [actividades, setActividades] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [nuevaActividad, setNuevaActividad] = useState('');
  const [nuevaFecha, setNuevaFecha] = useState('');
  const [nuevaFechaFin, setNuevaFechaFin] = useState('');
  const [nuevaJustificacion, setNuevaJustificacion] = useState('');
  const [nuevosResultados, setNuevosResultados] = useState('');
  const [modalActividadVisible, setModalActividadVisible] = useState(false);

  // ── Estado del seguimiento (desde API) ──
  const [actividadesSeguimiento, setActividadesSeguimiento] = useState([]);
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);

  // ── Valores derivados (memoizados) ──
  const hayObservaciones = useMemo(
    () => actividadesSeguimiento.some((a) => a.estado === 'observado' && a.observacion),
    [actividadesSeguimiento]
  );

  const todasAprobadas = useMemo(
    () =>
      actividadesSeguimiento.length > 0 &&
      actividadesSeguimiento.every((a) => a.estado === 'aprobado'),
    [actividadesSeguimiento]
  );

  // ── Handlers ──
  const abrirModalActividad = useCallback(() => {
    setNuevaActividad('');
    setNuevaJustificacion('');
    setNuevaFecha('');
    setNuevosResultados('');
    setEditIndex(null);
    setModalActividadVisible(true);
  }, []);

  const handleEvidencia = useCallback((actividadId, index) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';

    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setActividadesSeguimiento((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], archivoTemporalEvidencia: file };
        return updated;
      });

      mostrarAlertaEvidenciaSeleccionada();
    };

    input.click();
  }, []);

  const handleVolverASubir = useCallback(
    async (actividad) => {
      if (!actividad) {
        Swal.fire('Error', 'No hay actividad seleccionada para eliminar la evidencia.', 'error');
        return false;
      }

      try {
        await axios.delete(`/api/cronograma/evidencia/${actividad.id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        Swal.fire('Éxito', 'La evidencia fue eliminada. Puedes volver a subir una nueva.', 'success');

        setActividadesSeguimiento((prev) =>
          prev.map((a) =>
            a.id === actividad.id
              ? { ...a, evidencia: null, estado: 'pendiente', archivoTemporalEvidencia: null }
              : a
          )
        );

        return true;
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudo eliminar la evidencia.', 'error');
        return false;
      }
    },
    [user?.token]
  );

  // ── Fetch actividades desde la BD ──
  useEffect(() => {
    const usuario_id = user?.id;
    if (!usuario_id || !datosCargados || !user?.token) return;

    const obtenerActividades = async () => {
      try {
        const res = await axios.get(`/api/cronograma/${usuario_id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (Array.isArray(res.data)) {
          setActividadesSeguimiento(res.data);
        }
      } catch (error) {
        console.error('Error al obtener actividades desde la BD:', error);
      }
    };

    obtenerActividades();
  }, [datosCargados, user?.id, user?.token]);

  return {
    actividades, setActividades,
    actividadesSeguimiento, setActividadesSeguimiento,
    actividadSeleccionada, setActividadSeleccionada,
    editIndex, setEditIndex,
    nuevaActividad, setNuevaActividad,
    nuevaFecha, setNuevaFecha,
    nuevaFechaFin, setNuevaFechaFin,
    nuevaJustificacion, setNuevaJustificacion,
    nuevosResultados, setNuevosResultados,
    modalActividadVisible, setModalActividadVisible,
    hayObservaciones,
    todasAprobadas,
    abrirModalActividad,
    handleEvidencia,
    handleVolverASubir,
  };
}
