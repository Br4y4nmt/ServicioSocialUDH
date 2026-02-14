import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  toastWarning,
  alertSuccess,
  alertconfirmacion,
  alertError,
  toastSuccess,
} from '../alerts/alertas';

export default function useDocentes(token) {
  const [docentes, setDocentes] = useState([]);
  const [busquedaDocente, setBusquedaDocente] = useState('');
  const [modalDocenteVisible, setModalDocenteVisible] = useState(false);
  const [modalEditarDocenteVisible, setModalEditarDocenteVisible] = useState(false);
  const [editandoDocenteId, setEditandoDocenteId] = useState(null);
  const [nombreDocenteEditado, setNombreDocenteEditado] = useState('');
  const [emailDocenteEditado, setEmailDocenteEditado] = useState('');
  const [facultadDocenteEditada, setFacultadDocenteEditada] = useState('');
  const [programaDocenteEditado, setProgramaDocenteEditado] = useState('');
  const [nuevoDocenteEmail, setNuevoDocenteEmail] = useState('');
  const [nuevoDocenteWhatsapp, setNuevoDocenteWhatsapp] = useState('');
  const [nuevaFacultadDocente, setNuevaFacultadDocente] = useState('');
  const [nuevoProgramaDocente, setNuevoProgramaDocente] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [, setNuevoDocenteDni] = useState('');
  const [programasFiltrados, setProgramasFiltrados] = useState([]);

  const fetchDocentes = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get('/api/docentes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDocentes(res.data);
    } catch (error) {
      console.error('Error al cargar docentes:', error);
    }
  }, [token]);

  const crearDocente = useCallback(async () => {
    if (
      !nuevoDocenteEmail ||
      !nuevoDocenteWhatsapp ||
      !nuevaFacultadDocente ||
      !nuevoProgramaDocente
    ) {
      toastWarning('Campos incompletos', { text: 'Completa todos los campos requeridos.' });
      return false;
    }

    if (nuevoDocenteWhatsapp.length !== 9) {
      toastWarning('WhatsApp inválido', { text: 'El número de WhatsApp debe tener exactamente 9 dígitos.' });
      return false;
    }

    const correoValido = nuevoDocenteEmail.endsWith('@udh.edu.pe');
    if (!correoValido) {
      toastWarning('Correo inválido', { text: 'El correo del docente debe ser @udh.edu.pe' });
      return false;
    }

    try {
      await axios.post(
        '/api/auth/registrar-docente-completo',
        {
          email: nuevoDocenteEmail,
          whatsapp: nuevoDocenteWhatsapp,
          facultad_id: nuevaFacultadDocente,
          programa_academico_id: nuevoProgramaDocente,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setNuevoDocenteEmail('');
      setNuevoDocenteWhatsapp('');
      setNuevaFacultadDocente('');
      setNuevoProgramaDocente('');

      alertSuccess('¡Registro exitoso!', 'Docente registrado correctamente');
      await fetchDocentes();
      return true;
    } catch (error) {
      console.error('Error al registrar docente:', error);
      const mensaje = error.response?.data?.message;
      if (error.response?.status === 409) {
        await alertError('Correo duplicado', mensaje || 'El correo del docente ya está registrado.');
      } else {
        await alertError('Error al registrar docente', mensaje || 'No se pudo registrar el docente.');
      }
      return false;
    }
  }, [nuevoDocenteEmail, nuevoDocenteWhatsapp, nuevaFacultadDocente, nuevoProgramaDocente, token, fetchDocentes]);

  const guardarEdicionDocente = useCallback(async (id) => {
    if (!emailDocenteEditado) {
      toastWarning('Correo requerido', { text: 'El correo del docente es obligatorio.' });
      return false;
    }

    if (!emailDocenteEditado.endsWith('@udh.edu.pe')) {
      toastWarning('Correo inválido', { text: 'El correo del docente debe ser @udh.edu.pe' });
      return false;
    }

    if (!facultadDocenteEditada || !programaDocenteEditado) {
      toastWarning('Campos incompletos', { text: 'Completa la facultad y el programa.' });
      return false;
    }

    try {
      await axios.put(`/api/docentes/${id}`, {
        nombre_docente: nombreDocenteEditado,
        email: emailDocenteEditado,
        programa_academico_id: programaDocenteEditado,
        facultad_id: facultadDocenteEditada,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toastSuccess('Docente actualizado correctamente');
      setEditandoDocenteId(null);
      await fetchDocentes();
      return true;
    } catch (error) {
      console.error('Error al actualizar docente:', error);
      if (error.response?.status === 409) {
        await alertError('Correo duplicado', error.response?.data?.message || 'El correo del docente ya está registrado.');
      } else {
        alertError('Error al actualizar docente', error.response?.data?.message || 'No se pudo actualizar el docente');
      }
      return false;
    }
  }, [nombreDocenteEditado, emailDocenteEditado, programaDocenteEditado, facultadDocenteEditada, token, fetchDocentes]);

  const eliminarDocente = useCallback(async (id) => {
    const confirmacion = await alertconfirmacion({ text: 'Esta acción eliminará el docente de forma permanente.' });
    if (!confirmacion.isConfirmed) return;

    try {
      await axios.delete(`/api/docentes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchDocentes();
      toastSuccess('Docente eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar docente:', error);
      alertError('Error al eliminar docente', error.response?.data?.message || 'No se pudo eliminar el docente');
    }
  }, [token, fetchDocentes]);

  // Fetch programas filtrados por facultad seleccionada para nuevo docente
  useEffect(() => {
    const fetchProgramasPorFacultad = async () => {
      if (!nuevaFacultadDocente) {
        setProgramasFiltrados([]);
        return;
      }
      try {
        const res = await axios.get(`/api/programas/facultad/${nuevaFacultadDocente}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProgramasFiltrados(res.data);
      } catch (error) {
        console.error('Error al obtener programas filtrados:', error);
      }
    };
    fetchProgramasPorFacultad();
  }, [nuevaFacultadDocente, token]);

  useEffect(() => {
    fetchDocentes();
  }, [fetchDocentes]);

  return {
    docentes,
    busquedaDocente,
    setBusquedaDocente,
    modalDocenteVisible,
    setModalDocenteVisible,
    modalEditarDocenteVisible,
    setModalEditarDocenteVisible,
    editandoDocenteId,
    setEditandoDocenteId,
    nombreDocenteEditado,
    setNombreDocenteEditado,
    emailDocenteEditado,
    setEmailDocenteEditado,
    facultadDocenteEditada,
    setFacultadDocenteEditada,
    programaDocenteEditado,
    setProgramaDocenteEditado,
    nuevoDocenteEmail,
    setNuevoDocenteEmail,
    nuevoDocenteWhatsapp,
    setNuevoDocenteWhatsapp,
    nuevaFacultadDocente,
    setNuevaFacultadDocente,
    nuevoProgramaDocente,
    setNuevoProgramaDocente,
    setNuevoDocenteDni,
    programasFiltrados,
    fetchDocentes,
    crearDocente,
    guardarEdicionDocente,
    eliminarDocente,
  };
}
