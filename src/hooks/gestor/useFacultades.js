import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import {
  alertconfirmacion,
  alertSuccess,
  alertError,
  toastSuccess,
  toastError,
} from '../alerts/alertas';

export default function useFacultades(token) {
  const [facultades, setFacultades] = useState([]);
  const [nuevaFacultad, setNuevaFacultad] = useState('');
  const [modalNuevaFacultadVisible, setModalNuevaFacultadVisible] = useState(false);
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [nombreEditado, setNombreEditado] = useState('');

  const fetchFacultades = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get('/api/facultades', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFacultades(res.data);
    } catch (error) {
      console.error('Error al cargar facultades:', error);
    }
  }, [token]);

  const crearFacultad = useCallback(async () => {
    if (!nuevaFacultad.trim()) {
      alertError('Campo vacío', 'El nombre de la facultad no puede estar vacío');
      return;
    }
    try {
      await axios.post('/api/facultades', {
        nombre_facultad: nuevaFacultad,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNuevaFacultad('');
      setModalNuevaFacultadVisible(false);
      fetchFacultades();
      alertSuccess('¡Éxito!', 'Facultad creada exitosamente');
    } catch (error) {
      console.error('Error al crear facultad:', error);
      alertError('Error', error.response?.data?.message || 'No se pudo crear la facultad');
    }
  }, [nuevaFacultad, token, fetchFacultades]);

  const guardarEdicionFacultad = useCallback(async (id) => {
    if (!nombreEditado.trim()) {
      toastError('El nombre de la facultad no puede estar vacío');
      return;
    }
    try {
      await axios.put(`/api/facultades/${id}`, {
        nombre_facultad: nombreEditado,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditandoId(null);
      setNombreEditado('');
      setModalEditarVisible(false);
      await fetchFacultades();
      toastSuccess('Facultad actualizada exitosamente');
    } catch (error) {
      console.error('Error al actualizar facultad:', error);
      toastError(error.response?.data?.message || 'Error al actualizar la facultad');
    }
  }, [nombreEditado, token, fetchFacultades]);

  const eliminarFacultad = useCallback(async (id) => {
    const confirmacion = await alertconfirmacion({ text: 'Esta acción eliminará la facultad de forma permanente.' });
    if (!confirmacion.isConfirmed) return;

    try {
      await axios.delete(`/api/facultades/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchFacultades();
      toastSuccess('La facultad fue eliminada correctamente');
    } catch (error) {
      console.error('Error al eliminar facultad:', error);
      alertError('Error al eliminar facultad', error.response?.data?.message || 'No se pudo eliminar la facultad');
    }
  }, [token, fetchFacultades]);

  const cancelarEdicion = useCallback(() => {
    setEditandoId(null);
    setNombreEditado('');
  }, []);

  useEffect(() => {
    fetchFacultades();
  }, [fetchFacultades]);

  return {
    facultades,
    nuevaFacultad,
    setNuevaFacultad,
    modalNuevaFacultadVisible,
    setModalNuevaFacultadVisible,
    modalEditarVisible,
    setModalEditarVisible,
    editandoId,
    setEditandoId,
    nombreEditado,
    setNombreEditado,
    fetchFacultades,
    crearFacultad,
    guardarEdicionFacultad,
    eliminarFacultad,
    cancelarEdicion,
  };
}
