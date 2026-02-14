import { useState, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function useSeguimiento(token) {
  const [modalSeguimientoVisible, setModalSeguimientoVisible] = useState(false);
  const [seguimiento, setSeguimiento] = useState(null);

  const verSeguimiento = useCallback(async (usuario_id) => {
    try {
      const res = await axios.get(`/api/trabajo-social/seguimiento/${usuario_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSeguimiento(res.data);
      setModalSeguimientoVisible(true);
    } catch (error) {
      console.error('Error al obtener seguimiento:', error);
      Swal.fire('Error', 'No se pudo obtener el seguimiento del trámite', 'error');
    }
  }, [token]);

  const cerrarSeguimiento = useCallback(() => {
    setModalSeguimientoVisible(false);
  }, []);

  return {
    modalSeguimientoVisible,
    seguimiento,
    verSeguimiento,
    cerrarSeguimiento,
  };
}
