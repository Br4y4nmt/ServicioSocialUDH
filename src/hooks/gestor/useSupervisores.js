import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import {
  alertconfirmacion,
  alertSuccess,
  alertError,
} from '../alerts/alertas';

export default function useSupervisores(token) {
  const [supervisores, setSupervisores] = useState([]);
  const [busquedaSupervisor, setBusquedaSupervisor] = useState('');
  const [programaSupervisor, setProgramaSupervisor] = useState('');

  const fetchSupervisores = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get('/api/trabajo-social/supervisores', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSupervisores(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error al cargar supervisores:', error);
    }
  }, [token]);

  const eliminarSupervisor = useCallback(async (id) => {
    const confirmacion = await alertconfirmacion({
      title: '¿Eliminar designación?',
      text: 'Se quitará la designación del docente supervisor.',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (!confirmacion.isConfirmed) return;

    try {
      await axios.delete(`/api/trabajo-social/seleccionado/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchSupervisores();
      await alertSuccess('Designación eliminada', 'La designación se eliminó correctamente.');
    } catch (error) {
      console.error('Error al eliminar designación:', error);
      const mensaje = error.response?.data?.message || 'No se pudo eliminar la designación.';
      await alertError('Error al eliminar designación', mensaje);
    }
  }, [token, fetchSupervisores]);

  useEffect(() => {
    fetchSupervisores();
  }, [fetchSupervisores]);

  return {
    supervisores,
    busquedaSupervisor,
    setBusquedaSupervisor,
    programaSupervisor,
    setProgramaSupervisor,
    fetchSupervisores,
    eliminarSupervisor,
  };
}
