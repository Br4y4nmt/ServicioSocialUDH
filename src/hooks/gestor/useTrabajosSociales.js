import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import {
  alertconfirmacion,
  alertSuccess,
  alertError,
} from '../alerts/alertas';

export default function useTrabajosSociales(token) {

  const [trabajosSociales, setTrabajosSociales] =
    useState([]);

  const [
    cargandoTrabajosSociales,
    setCargandoTrabajosSociales,
  ] = useState(true);

  const [
    busquedaTrabajoSocial,
    setBusquedaTrabajoSocial,
  ] = useState('');

  const [
    filtroVencidosActivo,
    setFiltroVencidosActivo,
  ] = useState(false);

  const [
    procesoTrabajoSocial,
    setProcesoTrabajoSocial,
  ] = useState(null);

  const [
    cargandoProcesoTrabajoSocial,
    setCargandoProcesoTrabajoSocial,
  ] = useState(false);

  const [
    errorProcesoTrabajoSocial,
    setErrorProcesoTrabajoSocial,
  ] = useState(null);

  const fetchTrabajosSociales = useCallback(
    async () => {
      if (!token) {
        setTrabajosSociales([]);
        setFiltroVencidosActivo(false);
        setCargandoTrabajosSociales(false);

        return [];
      }
      setCargandoTrabajosSociales(true);
      try {
        const res = await axios.get(
          '/api/trabajo-social/trabajos-sociales',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = Array.isArray(res.data)
          ? res.data
          : [];
        setTrabajosSociales(data);
        setFiltroVencidosActivo(false);
        return data;
      } catch (error) {
        console.error(
          'Error al cargar trabajos sociales:',
          error
        );
        setTrabajosSociales([]);
        return [];
      } finally {
        setCargandoTrabajosSociales(false);
      }
    },
    [token]
  );

  const fetchTrabajosSocialesVencidos =
    useCallback(
      async () => {
        if (!token) {
          setTrabajosSociales([]);
          setFiltroVencidosActivo(false);
          setCargandoTrabajosSociales(false);

          return [];
        }
        setCargandoTrabajosSociales(true);
        try {
          const res = await axios.get(
            '/api/trabajo-social/vencidos-sin-evidencia',
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = Array.isArray(res.data)
            ? res.data
            : [];

          setTrabajosSociales(data);
          setFiltroVencidosActivo(true);

          return data;
        } catch (error) {
          console.error(
            'Error al cargar trabajos sociales vencidos:',
            error
          );

          const mensaje =
            error.response?.data?.message ||
            'No se pudieron obtener los trabajos sociales con actividades vencidas.';

          await alertError(
            'Error al cargar vencidos',
            mensaje
          );

          return null;
        } finally {
          setCargandoTrabajosSociales(false);
        }
      },
      [token]
    );

  const alternarFiltroVencidos =
    useCallback(async () => {
      if (filtroVencidosActivo) {
        return await fetchTrabajosSociales();
      }

      return await fetchTrabajosSocialesVencidos();
    }, [
      filtroVencidosActivo,
      fetchTrabajosSociales,
      fetchTrabajosSocialesVencidos,
    ]);


  const fetchProcesoTrabajoSocial = useCallback(
    async (trabajoId) => {
      if (!token || !trabajoId) {
        setProcesoTrabajoSocial(null);

        setErrorProcesoTrabajoSocial(
          'No se pudo identificar el trabajo social.'
        );

        return null;
      }

      setCargandoProcesoTrabajoSocial(true);
      setErrorProcesoTrabajoSocial(null);
      setProcesoTrabajoSocial(null);

      try {
        const res = await axios.get(
          `/api/cronograma/trabajo/${trabajoId}/proceso`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProcesoTrabajoSocial(res.data);

        return res.data;
      } catch (error) {
        console.error(
          'Error al cargar el proceso del trabajo social:',
          error
        );

        const mensaje =
          error.response?.data?.message ||
          'No se pudo obtener el proceso del trabajo social.';

        setProcesoTrabajoSocial(null);
        setErrorProcesoTrabajoSocial(mensaje);

        return null;
      } finally {
        setCargandoProcesoTrabajoSocial(false);
      }
    },
    [token]
  );

  const limpiarProcesoTrabajoSocial =
    useCallback(() => {
      setProcesoTrabajoSocial(null);
      setErrorProcesoTrabajoSocial(null);
      setCargandoProcesoTrabajoSocial(false);
    }, []);

  const eliminarTrabajoSocial = useCallback(
    async (trabajo) => {
      const trabajoId = trabajo?.id;

      if (!trabajoId) {
        await alertError(
          'Error',
          'No se pudo identificar el trabajo social.'
        );

        return false;
      }

      const nombreEstudiante =
        trabajo?.Estudiante?.nombre_estudiante ||
        'este estudiante';

      const tipoServicio =
        trabajo?.tipo_servicio_social ||
        'trabajo social';

      const confirmacion =
        await alertconfirmacion({
          title: '¿Eliminar trabajo social?',
          text: `Se eliminará completamente el trabajo social de ${nombreEstudiante}. También se eliminarán sus actividades, integrantes del grupo y cartas de aceptación asociadas. Esta acción no se puede deshacer.`,
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar',
        });

      if (!confirmacion.isConfirmed) {
        return false;
      }

      try {
        await axios.delete(
          `/api/trabajo-social/trabajos-sociales/${trabajoId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTrabajosSociales((prev) =>
          prev.filter(
            (trabajoActual) =>
              trabajoActual.id !== trabajoId
          )
        );

        setProcesoTrabajoSocial((prev) => {
          if (
            prev?.trabajo?.id === trabajoId
          ) {
            return null;
          }

          return prev;
        });

        await alertSuccess(
          'Trabajo social eliminado',
          `El trabajo social ${tipoServicio.toLowerCase()} de ${nombreEstudiante} fue eliminado correctamente.`
        );

        return true;
      } catch (error) {
        console.error(
          'Error al eliminar trabajo social:',
          error
        );

        const mensaje =
          error.response?.data?.message ||
          'No se pudo eliminar el trabajo social.';

        await alertError(
          'Error al eliminar trabajo social',
          mensaje
        );

        return false;
      }
    },
    [token]
  );

  const eliminarIntegrante = useCallback(
    async (integrante, trabajo) => {
      const integranteId =
        integrante?.id_integrante;

      const trabajoId =
        trabajo?.id;

      if (!integranteId || !trabajoId) {
        await alertError(
          'Error',
          'No se pudo identificar al integrante o al trabajo social.'
        );

        return false;
      }

      const nombreIntegrante =
        integrante?.nombre_completo ||
        'este integrante';

      const confirmacion =
        await alertconfirmacion({
          title: '¿Eliminar integrante?',
          text: `Se eliminará a ${nombreIntegrante} del grupo y también su carta de aceptación.`,
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar',
        });

      if (!confirmacion.isConfirmed) {
        return false;
      }

      try {
        await axios.delete(
          `/api/trabajo-social/${trabajoId}/integrantes/${integranteId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTrabajosSociales((prev) =>
          prev.map((trabajoActual) => {
            if (
              trabajoActual.id !== trabajoId
            ) {
              return trabajoActual;
            }

            return {
              ...trabajoActual,

              integrantes_grupo:
                Array.isArray(
                  trabajoActual.integrantes_grupo
                )
                  ? trabajoActual.integrantes_grupo.filter(
                      (item) =>
                        item.id_integrante !==
                        integranteId
                    )
                  : [],
            };
          })
        );

        await alertSuccess(
          'Integrante eliminado',
          'El integrante y su carta de aceptación fueron eliminados correctamente.'
        );

        return true;
      } catch (error) {
        console.error(
          'Error al eliminar integrante:',
          error
        );

        const mensaje =
          error.response?.data?.message ||
          'No se pudo eliminar el integrante.';

        await alertError(
          'Error al eliminar integrante',
          mensaje
        );

        return false;
      }
    },
    [token]
  );

  useEffect(() => {
    fetchTrabajosSociales();
  }, [fetchTrabajosSociales]);

  return {
    trabajosSociales,
    cargandoTrabajosSociales,
    busquedaTrabajoSocial,
    setBusquedaTrabajoSocial,
    filtroVencidosActivo,
    fetchTrabajosSocialesVencidos,
    alternarFiltroVencidos,
    procesoTrabajoSocial,
    cargandoProcesoTrabajoSocial,
    errorProcesoTrabajoSocial,
    fetchTrabajosSociales,
    fetchProcesoTrabajoSocial,
    limpiarProcesoTrabajoSocial,
    eliminarTrabajoSocial,
    eliminarIntegrante,
  };
}