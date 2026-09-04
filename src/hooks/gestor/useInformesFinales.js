import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { alertError } from '../alerts/alertas';

export default function useInformesFinales(token) {
  const [informesFinales, setInformesFinales] = useState([]);
  const [aprobandoId, setAprobandoId] = useState(null);
  const [cargandoInformes, setCargandoInformes] = useState(false);

  const fetchInformesFinales = useCallback(async () => {
    if (!token) return;

    try {
      setCargandoInformes(true);
      const res = await axios.get(
        '/api/trabajo-social/informes-finales-nuevo',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setInformesFinales(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error al cargar informes finales:', error);
    } finally {
      setCargandoInformes(false);
    }
  }, [token]);

  const generarInforme = useCallback(
    async (id) => {
      if (!token || aprobandoId === id) return;

      setAprobandoId(id);

      try {
        await axios.post(
          `/api/trabajo-social/informe/${id}/certificado-final`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        await fetchInformesFinales();
      } catch (error) {
        console.error('Error al generar certificado final:', error);

        await alertError(
          'Error al generar certificado',
          error.response?.data?.message ||
            'No se pudo generar el certificado final.'
        );
      } finally {
        setAprobandoId(null);
      }
    },
    [token, aprobandoId, fetchInformesFinales]
  );

  useEffect(() => {
    fetchInformesFinales();
  }, [fetchInformesFinales]);

  return {
    informesFinales,
    aprobandoId,
    cargandoInformes,
    fetchInformesFinales,
    generarInforme,
  };
}