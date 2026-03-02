import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { alertSuccess, toastError } from '../alerts/alertas';
import { showTopWarningToast } from '../alerts/useWelcomeToast';

export default function useEstudiantes(token) {
  const [estudiantes, setEstudiantes] = useState([]);
  const [filtroEstudiantes, setFiltroEstudiantes] = useState('');
  const [modalEstudianteVisible, setModalEstudianteVisible] = useState(false);
  const [codigoUniversitario, setCodigoUniversitario] = useState('');

  const fetchEstudiantes = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get('/api/estudiantes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEstudiantes(res.data);
    } catch (error) {
      console.error('Error al obtener estudiantes:', error);
    }
  }, [token]);

  const registrarEstudiante = useCallback(async (whatsapp) => {
    if (!codigoUniversitario.trim() || !whatsapp.trim()) {
      showTopWarningToast('Campos incompletos', 'Complete los campos antes de guardar');
      return false;
    }

    if (codigoUniversitario.length !== 10) {
      showTopWarningToast('Código inválido', 'El código universitario debe tener exactamente 10 dígitos.');
      return false;
    }

    if (whatsapp.length !== 9) {
      toastError('Número inválido', { text: 'El WhatsApp debe tener exactamente 9 dígitos.' });
      return false;
    }

    try {
      const res = await axios.post(
        '/api/auth/register-codigo',
        {
          codigo: codigoUniversitario,
          whatsapp: whatsapp,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alertSuccess('¡Éxito!', res.data.message || 'Estudiante registrado correctamente');

      await fetchEstudiantes();
      setModalEstudianteVisible(false);
      setCodigoUniversitario('');
      return true;
    } catch (error) {
      console.error('Error registrando estudiante:', error);
      toastError(error.response?.data?.message || 'No se pudo registrar el estudiante');
      return false;
    }
  }, [codigoUniversitario, token, fetchEstudiantes]);

  useEffect(() => {
    fetchEstudiantes();
  }, [fetchEstudiantes]);

  return {
    estudiantes,
    filtroEstudiantes,
    setFiltroEstudiantes,
    modalEstudianteVisible,
    setModalEstudianteVisible,
    codigoUniversitario,
    setCodigoUniversitario,
    fetchEstudiantes,
    registrarEstudiante,
  };
}
