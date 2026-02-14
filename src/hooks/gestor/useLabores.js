import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import {
  alertconfirmacion,
  alertSuccess,
  toastSuccess,
  toastError,
} from '../alerts/alertas';

export default function useLabores(token) {
  const [labores, setLabores] = useState([]);
  const [busquedaLabor, setBusquedaLabor] = useState('');
  const [modalLaborVisible, setModalLaborVisible] = useState(false);
  const [modalEditarLaborVisible, setModalEditarLaborVisible] = useState(false);
  const [editandoLaborId, setEditandoLaborId] = useState(null);
  const [idLaborEditando, setIdLaborEditando] = useState(null);
  const [nombreLaborEditado, setNombreLaborEditado] = useState('');
  const [nuevaLabor, setNuevaLabor] = useState('');
  const [lineaLabor, setLineaLabor] = useState('');

  const fetchLabores = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get('/api/labores', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLabores(res.data);
    } catch (error) {
      console.error('Error al cargar labores sociales:', error);
    }
  }, [token]);

  const crearLabor = useCallback(async () => {
    if (!nuevaLabor.trim()) {
      toastError('Campo vacío', { text: 'El nombre del servicio social no puede estar vacío' });
      return false;
    }
    if (!lineaLabor) {
      toastError('Línea de acción requerida', { text: 'Debes seleccionar una línea de acción' });
      return false;
    }
    try {
      await axios.post('/api/labores', {
        nombre_labores: nuevaLabor,
        linea_id: lineaLabor,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNuevaLabor('');
      setLineaLabor('');
      fetchLabores();
      alertSuccess('¡Éxito!', 'Servicio social creado exitosamente');
      return true;
    } catch (error) {
      console.error('Error al crear labor social:', error);
      toastError(error.response?.data?.message || 'No se pudo crear el servicio social');
      return false;
    }
  }, [nuevaLabor, lineaLabor, token, fetchLabores]);

  const guardarEdicionLabor = useCallback(async (id) => {
    if (!nombreLaborEditado.trim()) {
      toastError('El nombre del servicio social no puede estar vacío');
      return false;
    }
    if (!lineaLabor) {
      toastError('Debes seleccionar una línea de acción');
      return false;
    }
    try {
      await axios.put(`/api/labores/${id}`, {
        nombre_labores: nombreLaborEditado,
        linea_id: lineaLabor,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditandoLaborId(null);
      setNombreLaborEditado('');
      fetchLabores();
      toastSuccess('Servicio social actualizado correctamente');
      return true;
    } catch (error) {
      console.error('Error al actualizar labor social:', error);
      toastError(error.response?.data?.message || 'Error al actualizar el servicio social');
      return false;
    }
  }, [nombreLaborEditado, lineaLabor, token, fetchLabores]);

  const eliminarLabor = useCallback(async (id) => {
    const confirmacion = await alertconfirmacion({ text: 'Esta acción eliminará el servicio social de forma permanente.' });
    if (!confirmacion.isConfirmed) return;

    try {
      await axios.delete(`/api/labores/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchLabores();
      toastSuccess('Servicio social eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar labor social:', error);
      toastError(error.response?.data?.message || 'Error al eliminar el servicio social');
    }
  }, [token, fetchLabores]);

  useEffect(() => {
    fetchLabores();
  }, [fetchLabores]);

  return {
    labores,
    busquedaLabor,
    setBusquedaLabor,
    modalLaborVisible,
    setModalLaborVisible,
    modalEditarLaborVisible,
    setModalEditarLaborVisible,
    editandoLaborId,
    setEditandoLaborId,
    idLaborEditando,
    setIdLaborEditando,
    nombreLaborEditado,
    setNombreLaborEditado,
    nuevaLabor,
    setNuevaLabor,
    lineaLabor,
    setLineaLabor,
    fetchLabores,
    crearLabor,
    guardarEdicionLabor,
    eliminarLabor,
  };
}
