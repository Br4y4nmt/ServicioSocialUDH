import { useState, useCallback } from 'react';
import axios from 'axios';
import {
  alertSuccess,
  alertError,
  alertconfirmacion
} from '../alerts/alertas';
import {
  showTopSuccessToast,
  showTopErrorToast
} from '../alerts/useWelcomeToast';

export default function useDocumentosOficiales(token) {
  const [documentos, setDocumentos] = useState([]);
  const [cargandoDocumentos, setCargandoDocumentos] = useState(false);
  const [subiendoDocumento, setSubiendoDocumento] = useState(false);
  const [editandoDocumento, setEditandoDocumento] = useState(false);
  const [eliminandoDocumento, setEliminandoDocumento] = useState(false);

  const fetchDocumentos = useCallback(async () => {
    if (!token) {
      setDocumentos([]);
      setCargandoDocumentos(false);
      return [];
    }

    setCargandoDocumentos(true);

    try {
      const res = await axios.get(
        '/api/documentos-oficiales/admin',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = Array.isArray(res.data)
        ? res.data
        : [];

      setDocumentos(data);

      return data;
    } catch (error) {
      console.error(
        'Error al cargar documentos oficiales:',
        error
      );

      setDocumentos([]);

      const mensaje =
        error.response?.data?.message ||
        'No se pudieron obtener los documentos oficiales.';

      await alertError(
        'Error al cargar documentos',
        mensaje
      );

      return [];
    } finally {
      setCargandoDocumentos(false);
    }
  }, [token]);

  const subirDocumento = useCallback(
    async ({
      titulo,
      archivo,
      estado = 'VIGENTE',
      publicado = true,
      orden = 0
    }) => {
      if (!token) {
        showTopErrorToast(
          'Error',
          'No se encontró una sesión válida.'
        );

        return false;
      }

      if (!titulo?.trim()) {
        await alertError(
          'Datos incompletos',
          'Debes ingresar el título del documento.'
        );

        return false;
      }

      if (!archivo) {
        await alertError(
          'Datos incompletos',
          'Debes seleccionar un archivo PDF.'
        );

        return false;
      }

      if (
        archivo.type !== 'application/pdf' &&
        !archivo.name?.toLowerCase().endsWith('.pdf')
      ) {
        await alertError(
          'Archivo no válido',
          'Solo se permiten archivos PDF.'
        );

        return false;
      }

      setSubiendoDocumento(true);

      try {
        const formData = new FormData();

        formData.append('titulo', titulo.trim());
        formData.append('archivo', archivo);
        formData.append('estado', estado);
        formData.append('publicado', String(publicado));
        formData.append('orden', String(orden));

        const res = await axios.post(
          '/api/documentos-oficiales',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        await fetchDocumentos();

        await alertSuccess(
          'Documento publicado',
          res.data?.message ||
            'El documento oficial fue publicado correctamente.'
        );

        return true;
      } catch (error) {
        console.error(
          'Error al subir documento oficial:',
          error
        );

        const mensaje =
          error.response?.data?.message ||
          'No se pudo publicar el documento oficial.';

        await alertError(
          'Error al publicar',
          mensaje
        );

        return false;
      } finally {
        setSubiendoDocumento(false);
      }
    },
    [token, fetchDocumentos]
  );

  const editarDocumento = useCallback(
    async ({
      id_documento,
      titulo,
      archivo = null,
      estado = 'VIGENTE',
      publicado = true,
      orden = 0
    }) => {
      if (!token) {
        await alertError(
          'Error',
          'No se encontró una sesión válida.'
        );

        return false;
      }

      if (!id_documento) {
        showTopErrorToast(
          'Error',
          'No se encontró el documento que deseas editar.'
        );

        return false;
      }

      if (!titulo?.trim()) {
        showTopErrorToast(
          'Datos incompletos',
          'Debes ingresar el título del documento.'
        );

        return false;
      }

      if (
        archivo &&
        archivo.type !== 'application/pdf' &&
        !archivo.name?.toLowerCase().endsWith('.pdf')
      ) {
        showTopErrorToast(
          'Archivo no válido',
          'Solo se permiten archivos PDF.'
        );

        return false;
      }

      const ordenNumero = Number(orden);

      if (
        !Number.isInteger(ordenNumero) ||
        ordenNumero < 0
      ) {
        showTopErrorToast(
          'Orden no válido',
          'El orden debe ser un número entero mayor o igual a 0.'
        );

        return false;
      }

      setEditandoDocumento(true);

      try {
        const formData = new FormData();

        formData.append('titulo', titulo.trim());
        formData.append('estado', estado);
        formData.append('publicado', String(publicado));
        formData.append('orden', String(ordenNumero));

        if (archivo) {
          formData.append('archivo', archivo);
        }

        const res = await axios.put(
          `/api/documentos-oficiales/${id_documento}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        await fetchDocumentos();

        showTopSuccessToast(
          'Documento actualizado',
          res.data?.message ||
            'El documento oficial fue actualizado correctamente.'
        );

        return true;
      } catch (error) {
        console.error(
          'Error al editar documento oficial:',
          error
        );

        const mensaje =
          error.response?.data?.message ||
          'No se pudo actualizar el documento oficial.';

        showTopErrorToast(
          'Error al actualizar',
          mensaje
        );

        return false;
      } finally {
        setEditandoDocumento(false);
      }
    },
    [token, fetchDocumentos]
  );

  const eliminarDocumento = useCallback(
  async (documento) => {
    if (!token) {
      await alertError(
        'Error',
        'No se encontró una sesión válida.'
      );
      return false;
    }

    if (!documento?.id_documento) {
      await alertError(
        'Error',
        'No se encontró el documento que deseas eliminar.'
      );
      return false;
    }

    if (documento.publicado) {
      await alertError(
        'Documento publicado',
        'Primero debes ocultar el documento antes de eliminarlo.'
      );
      return false;
    }

    const confirmacion = await alertconfirmacion({
      title: 'Eliminar documento',
      text: `¿Deseas eliminar "${documento.titulo}"? El archivo PDF también será eliminado permanentemente.`,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      icon: 'warning',
      confirmButtonColor: '#dc2626'
    });

    if (!confirmacion?.isConfirmed) {
      return false;
    }

    setEliminandoDocumento(true);

    try {
      const res = await axios.delete(
        `/api/documentos-oficiales/${documento.id_documento}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      await fetchDocumentos();

      await alertSuccess(
        'Documento eliminado',
        res.data?.message ||
          'El documento oficial fue eliminado correctamente.'
      );

      return true;
    } catch (error) {
      console.error(
        'Error al eliminar documento oficial:',
        error
      );

      const mensaje =
        error.response?.data?.message ||
        'No se pudo eliminar el documento oficial.';

      await alertError(
        'Error al eliminar',
        mensaje
      );

      return false;
    } finally {
      setEliminandoDocumento(false);
    }
  },
  [token, fetchDocumentos]
);

return {
  documentos,
  cargandoDocumentos,
  subiendoDocumento,
  editandoDocumento,
  eliminandoDocumento,
  fetchDocumentos,
  subirDocumento,
  editarDocumento,
  eliminarDocumento
};
}