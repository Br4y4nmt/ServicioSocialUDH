import { useState } from 'react';
import axios from 'axios';
import { useUser } from '../../UserContext';

/**
 * Hook que encapsula la lógica del grupo de servicio social grupal:
 * integrantes, correos, estado de carga y el fetch de integrantes.
 */
export function useGrupoAlumno() {
  const { user } = useUser();

  const [correosGrupo, setCorreosGrupo] = useState(['']);
  const [loadingGrupo, setLoadingGrupo] = useState(false);
  const [mensajeGrupo, setMensajeGrupo] = useState('');
  const [integrantesGrupoAlumno, setIntegrantesGrupoAlumno] = useState([]);
  const [modalGrupoVisible, setModalGrupoVisible] = useState(false);

  const obtenerIntegrantesDelGrupo = async () => {
    const usuario_id = user?.id;
    const token = user?.token;

    if (!usuario_id || !token) {
      setIntegrantesGrupoAlumno([]);
      setMensajeGrupo('Sesión inválida.');
      return { integrantes: [], message: 'Sesión inválida.' };
    }

    setLoadingGrupo(true);
    setMensajeGrupo('');

    try {
      const response = await axios.get(
        `/api/integrantes/estudiante/actual?usuario_id=${usuario_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = response.data ?? { integrantes: [], message: null };
      const integrantes = Array.isArray(data.integrantes) ? data.integrantes : [];

      setIntegrantesGrupoAlumno(integrantes);
      setMensajeGrupo(
        data.message || (integrantes.length === 0 ? 'No hay integrantes registrados.' : '')
      );

      return { integrantes, message: data.message };
    } catch (error) {
      console.error('Error al obtener integrantes del grupo:', error);
      const msg =
        error?.response?.data?.message ||
        'No se pudo obtener la información del grupo.';

      setIntegrantesGrupoAlumno([]);
      setMensajeGrupo(msg);

      return { integrantes: [], message: msg };
    } finally {
      setLoadingGrupo(false);
    }
  };

  return {
    correosGrupo, setCorreosGrupo,
    loadingGrupo,
    mensajeGrupo,
    integrantesGrupoAlumno,
    modalGrupoVisible, setModalGrupoVisible,
    obtenerIntegrantesDelGrupo,
  };
}
