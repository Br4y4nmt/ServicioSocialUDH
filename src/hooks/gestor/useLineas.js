import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import {
  alertconfirmacion,
  alertSuccess,
  alertError,
  toastSuccess,
  toastError,
} from '../alerts/alertas';

export default function useLineas(token) {
  const [lineas, setLineas] = useState([]);
  const [busquedaLinea, setBusquedaLinea] = useState('');
  const [modalLineaVisible, setModalLineaVisible] = useState(false);
  const [modalEditarLineaVisible, setModalEditarLineaVisible] = useState(false);
  const [idEditandoLinea, setIdEditandoLinea] = useState(null);
  const [nombreLineaEditado, setNombreLineaEditado] = useState('');
  const [nuevaLinea, setNuevaLinea] = useState('');

  const fetchLineas = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get('/api/lineas', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLineas(res.data);
    } catch (error) {
      console.error('Error al cargar líneas de acción:', error);
    }
  }, [token]);

  const crearLinea = useCallback(async () => {
    if (!nuevaLinea.trim()) {
      alertError('Campo vacío', 'El nombre de la línea de acción no puede estar vacío');
      return;
    }
    try {
      await axios.post('/api/lineas', {
        nombre_linea: nuevaLinea,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNuevaLinea('');
      setModalLineaVisible(false);
      fetchLineas();
      alertSuccess('¡Éxito!', 'Línea de acción creada exitosamente');
    } catch (error) {
      console.error('Error al crear línea de acción:', error);
      alertError('Error', error.response?.data?.message || 'No se pudo crear la línea de acción');
    }
  }, [nuevaLinea, token, fetchLineas]);

  const guardarEdicionLinea = useCallback(async (id) => {
    if (!nombreLineaEditado.trim()) {
      toastError('El nombre de la línea de acción no puede estar vacío');
      return;
    }
    try {
      await axios.put(`/api/lineas/${id}`, {
        nombre_linea: nombreLineaEditado,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIdEditandoLinea(null);
      setNombreLineaEditado('');
      setModalEditarLineaVisible(false);
      fetchLineas();
      toastSuccess('Línea de acción actualizada exitosamente');
    } catch (error) {
      console.error('Error al actualizar línea de acción:', error);
      toastError(error.response?.data?.message || 'Error al actualizar la línea de acción');
    }
  }, [nombreLineaEditado, token, fetchLineas]);

  const eliminarLinea = useCallback(async (id) => {
    const resultado = await alertconfirmacion({ text: 'Esta acción eliminará la línea de acción de forma permanente.' });
    if (!resultado.isConfirmed) return;

    try {
      await axios.delete(`/api/lineas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toastSuccess('Línea de acción eliminada correctamente');
      fetchLineas();
    } catch (error) {
      console.error('Error al eliminar línea de acción:', error);
      alertError('Error al eliminar línea de acción', error.response?.data?.message || 'No se pudo eliminar la línea de acción');
    }
  }, [token, fetchLineas]);

  useEffect(() => {
    fetchLineas();
  }, [fetchLineas]);

  return {
    lineas,
    busquedaLinea,
    setBusquedaLinea,
    modalLineaVisible,
    setModalLineaVisible,
    modalEditarLineaVisible,
    setModalEditarLineaVisible,
    idEditandoLinea,
    setIdEditandoLinea,
    nombreLineaEditado,
    setNombreLineaEditado,
    nuevaLinea,
    setNuevaLinea,
    fetchLineas,
    crearLinea,
    guardarEdicionLinea,
    eliminarLinea,
  };
}
