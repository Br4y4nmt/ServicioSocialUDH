import { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useUser } from '../../UserContext';
import { alertSuccess } from '../alerts/alertas';

/**
 * Hook que encapsula el cronograma de actividades, seguimiento,
 * evidencias y sus derivados (hayObservaciones, todasAprobadas).
 *
 * @param {Object}  params
 * @param {boolean} params.datosCargados - indica si los datos del trabajo social ya fueron cargados
 */
export function useActividadesCronograma({ datosCargados, activeSection }) {
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
  const [actividadesSeguimiento, setActividadesSeguimiento] = useState([]);
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);
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

      alertSuccess('Evidencia seleccionada', 'Se ha seleccionado la evidencia correctamente.');
    };

    input.click();
  }, []);

const handleVolverASubir = useCallback(
  async (actividad) => {
    if (!actividad) {
      Swal.fire(
        'Error',
        'No hay actividad seleccionada.',
        'error'
      );

      return false;
    }

    // Verificar que siga observada
    if (actividad.estado !== 'observado') {
      Swal.fire(
        'No disponible',
        'Esta actividad no se encuentra observada.',
        'warning'
      );

      return false;
    }

    // Si ya habilitó la corrección, no volver a hacerlo
    if (actividad.correccion_habilitada) {
      Swal.fire(
        'Corrección ya habilitada',
        'Ya puedes seleccionar y enviar una nueva evidencia.',
        'info'
      );

      return true;
    }

    // Debe existir fecha límite
    if (!actividad.fecha_limite_reenvio) {
      Swal.fire(
        'Sin plazo de corrección',
        'No se encontró una fecha límite para volver a subir la evidencia.',
        'warning'
      );

      return false;
    }

    const ahora = new Date();

    const fechaLimiteReenvio = new Date(
      actividad.fecha_limite_reenvio
    );

    // Validar que los 2 días no hayan vencido
    if (ahora > fechaLimiteReenvio) {
      Swal.fire(
        'Plazo vencido',
        'El plazo adicional para corregir esta evidencia ya finalizó.',
        'error'
      );

      return false;
    }

    try {
      // ==========================================
      // GUARDAR EN LA BASE DE DATOS
      // ==========================================

      const res = await axios.patch(
        `/api/cronograma/${actividad.id}/habilitar-correccion`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      // ==========================================
      // ACTUALIZAR LISTA DEL FRONTEND
      // ==========================================

      setActividadesSeguimiento((prev) =>
        prev.map((a) =>
          a.id === actividad.id
            ? {
                ...a,
                correccion_habilitada: true,
                archivoTemporalEvidencia: null
              }
            : a
        )
      );

      // ==========================================
      // ACTUALIZAR ACTIVIDAD DEL MODAL
      // ==========================================

      setActividadSeleccionada((prev) =>
        prev && prev.id === actividad.id
          ? {
              ...prev,
              correccion_habilitada: true,
              archivoTemporalEvidencia: null
            }
          : prev
      );

      alertSuccess(
        'Corrección habilitada',
        res.data?.message ||
          'Selecciona una nueva evidencia y envíala antes de que venza el plazo.'
      );

      return true;

    } catch (error) {
      console.error(
        'Error al habilitar corrección:',
        error
      );

      Swal.fire(
        'Error',
        error.response?.data?.message ||
          'No se pudo habilitar la corrección de la evidencia.',
        'error'
      );

      return false;
    }
  },
  [user?.token]
);

  // ── Fetch actividades desde la BD ──
  useEffect(() => {
    const usuario_id = user?.id;
    // Only fetch cronograma when the dashboard is in the 'seguimiento' section
    if (!usuario_id || !datosCargados || !user?.token || activeSection !== 'seguimiento') return;

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
  }, [datosCargados, user?.id, user?.token, activeSection]);

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
