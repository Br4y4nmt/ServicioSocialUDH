import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import {
  alertError,
  alertSuccess,
  alertWarning,
  toastWarning,
  alertconfirmacion,
  toastSuccess,
  toastError,
} from '../alerts/alertas';

export default function useProgramas(token) {
  const [programas, setProgramas] = useState([]);
  const [nuevoPrograma, setNuevoPrograma] = useState('');
  const [modalProgramaVisible, setModalProgramaVisible] = useState(false);
  const [modalEditarProgramaVisible, setModalEditarProgramaVisible] = useState(false);
  const [idEditandoPrograma, setIdEditandoPrograma] = useState(null);
  const [programaEditado, setProgramaEditado] = useState('');
  const [facultadEditada, setFacultadEditada] = useState('');
  const [emailEditado, setEmailEditado] = useState('');
  const [facultadPrograma, setFacultadPrograma] = useState('');
  const [emailPrograma, setEmailPrograma] = useState('');
  const [whatsappPrograma, setWhatsappPrograma] = useState('');
  const [programaSeleccionado, setProgramaSeleccionado] = useState('');

  const fetchProgramas = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get('/api/programas', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProgramas(res.data);
    } catch (error) {
      console.error('Error al cargar programas:', error);
    }
  }, [token]);

  const crearPrograma = useCallback(async () => {
    if (!nuevoPrograma.trim() || !facultadPrograma || !emailPrograma || !whatsappPrograma) {
      alertWarning('Campos incompletos', 'Por favor completa todos los campos.');
      return;
    }

    const emailValido = /@(gmail\.com|udh\.edu\.pe)$/.test(emailPrograma);
    if (!emailValido) {
      alertError('Correo inválido', 'Solo se permiten correos @gmail.com o @udh.edu.pe');
      return;
    }

    if (whatsappPrograma.length !== 9) {
      toastWarning('Número inválido', { text: 'El número de WhatsApp debe tener exactamente 9 dígitos.' });
      return;
    }

    try {
      await axios.post('/api/programas', {
        nombre_programa: nuevoPrograma,
        id_facultad: facultadPrograma,
        email: emailPrograma,
        whatsapp: whatsappPrograma,
        rol_id: 4,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alertSuccess('¡Éxito!', 'Programa creado exitosamente');
      setNuevoPrograma('');
      setFacultadPrograma('');
      setEmailPrograma('');
      setWhatsappPrograma('');
      setModalProgramaVisible(false);
      fetchProgramas();
    } catch (error) {
      console.error('Error al crear programa:', error);
      if (error.response?.status === 409) {
        alertError('Correo duplicado', 'Ya existe un usuario con ese correo.');
      } else if (error.response?.status === 400) {
        alertError('Error', error.response.data.message || 'Ocurrió un error de validación.');
      } else {
        alertError('Error desconocido', 'Ocurrió un error inesperado.');
      }
    }
  }, [nuevoPrograma, facultadPrograma, emailPrograma, whatsappPrograma, token, fetchProgramas]);

  const guardarEdicionPrograma = useCallback(async () => {
    if (!programaEditado.trim() || !facultadEditada || !emailEditado.trim()) {
      toastWarning('Campos incompletos', { text: 'Completa todos los campos requeridos.' });
      return;
    }

    const correoValido =
      emailEditado.endsWith('@gmail.com') || emailEditado.endsWith('@udh.edu.pe');

    if (!correoValido) {
      toastWarning('Correo inválido', { text: 'El correo debe ser @gmail.com o @udh.edu.pe.' });
      return;
    }

    try {
      await axios.put(`/api/programas/${idEditandoPrograma}`, {
        nombre_programa: programaEditado,
        id_facultad: facultadEditada,
        email: emailEditado,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toastSuccess('Programa actualizado correctamente');
      setModalEditarProgramaVisible(false);
      setIdEditandoPrograma(null);
      setProgramaEditado('');
      setFacultadEditada('');
      setEmailEditado('');
      fetchProgramas();
    } catch (error) {
      console.error('Error al actualizar el programa académico:', error);
      toastError(error.response?.data?.message || 'No se pudo actualizar el programa.');
    }
  }, [programaEditado, facultadEditada, emailEditado, idEditandoPrograma, token, fetchProgramas]);

  const eliminarPrograma = useCallback(async (id) => {
    const confirmacion = await alertconfirmacion();
    if (!confirmacion.isConfirmed) return;

    try {
      await axios.delete(`/api/programas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchProgramas();
      toastSuccess('Programa eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar programa:', error);
      toastError('Ocurrió un error al eliminar el programa.');
    }
  }, [token, fetchProgramas]);

  useEffect(() => {
    fetchProgramas();
  }, [fetchProgramas]);

  return {
    programas,
    setProgramas,
    nuevoPrograma,
    setNuevoPrograma,
    modalProgramaVisible,
    setModalProgramaVisible,
    modalEditarProgramaVisible,
    setModalEditarProgramaVisible,
    idEditandoPrograma,
    setIdEditandoPrograma,
    programaEditado,
    setProgramaEditado,
    facultadEditada,
    setFacultadEditada,
    emailEditado,
    setEmailEditado,
    facultadPrograma,
    setFacultadPrograma,
    emailPrograma,
    setEmailPrograma,
    whatsappPrograma,
    setWhatsappPrograma,
    programaSeleccionado,
    setProgramaSeleccionado,
    fetchProgramas,
    crearPrograma,
    guardarEdicionPrograma,
    eliminarPrograma,
  };
}
