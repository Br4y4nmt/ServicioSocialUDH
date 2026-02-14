import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { pdf } from '@react-pdf/renderer';
import QRCode from 'qrcode';
import InformePDF from '../../components/InformefinalProgramaPDF';
import {
  alertWarning,
  alertError,
  alertSuccess,
} from '../alerts/alertas';

export default function useInformesFinales(token) {
  const [informesFinales, setInformesFinales] = useState([]);
  const [aprobandoId, setAprobandoId] = useState(null);

  const fetchInformesFinales = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get('/api/trabajo-social/informes-finales', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInformesFinales(res.data);
    } catch (error) {
      console.error('Error al cargar informes finales:', error);
    }
  }, [token]);

  const aceptarInforme = useCallback(async (id) => {
    if (aprobandoId === id) return;

    setAprobandoId(id);
    try {
      const informe = informesFinales.find((i) => i.id === id);
      if (!informe) {
        console.warn('Informe no encontrado para el ID:', id);
        return;
      }

      const tipoServicio = (
        informe.trabajo_social?.tipo_servicio_social ||
        informe.tipo_servicio_social ||
        null
      );

      const trabajoId = informe.trabajo_social_id || informe.id;

      if (tipoServicio === 'grupal') {
        let estudiantes = [];

        try {
          const response = await axios.get(`/api/integrantes/${trabajoId}/enriquecido`, {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 7000,
          });

          estudiantes = response.data;

          if (!Array.isArray(estudiantes) || estudiantes.length === 0) {
            await alertWarning(
              'Integrantes no disponibles',
              'No se encontraron integrantes para este trabajo grupal. Intenta nuevamente más tarde.'
            );
            return;
          }
        } catch (error) {
          console.error('Error al conectar con API UDH:', error);
          await alertError('Error H. de conexión', 'No se pudo conectar al servidor UDH Intenta de nuevo más tarde.');
          return;
        }

        for (const estudiante of estudiantes) {
          try {
            const nombreEstudiante = estudiante.nombre_completo;
            const codigo = estudiante.codigo_universitario;
            const correoPrincipal = informe.trabajo_social?.correo_institucional || informe.correo_institucional;

            if (estudiante.correo_institucional === correoPrincipal) {
              console.log(`⏩ Saltando estudiante principal: ${correoPrincipal}`);
              continue;
            }

            const informePersonalizado = {
              ...informe,
              Estudiante: { nombre_estudiante: nombreEstudiante },
              ProgramasAcademico: {
                ...informe.ProgramasAcademico,
                Facultade: {
                  nombre_facultad: estudiante.facultad,
                },
              },
            };

            const verificationUrlMiembro =
              `${process.env.REACT_APP_API_URL}/api/certificados-final/${trabajoId}/${codigo}`;
            const qrMiembro = await QRCode.toDataURL(verificationUrlMiembro);

            const blob = await pdf(
              <InformePDF
                informe={informePersonalizado}
                qrImage={qrMiembro}
                verificationUrl={verificationUrlMiembro}
              />
            ).toBlob();

            const formData = new FormData();
            formData.append('archivo', blob, `certificado_final_${codigo}.pdf`);
            formData.append('trabajo_id', trabajoId);
            formData.append('codigo_universitario', codigo);

            await axios.post('/api/certificados-final', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
              },
            });

            console.log(`Certificado generado para integrante: ${codigo}`);
          } catch (err) {
            console.error(`Error generando certificado para integrante:`, err);
          }
        }
      }

      const nombreEstudiantePrincipal = informe.Estudiante?.nombre_estudiante || 'Estudiante';
      const nombreFacultad = informe.ProgramasAcademico?.Facultade?.nombre_facultad || 'Facultad';
      const verificationUrl =
        `${process.env.REACT_APP_API_URL}/api/trabajo-social/certificado-final/${id}`;
      const qrDataUrl = await QRCode.toDataURL(verificationUrl);

      const informePrincipal = {
        ...informe,
        Estudiante: { nombre_estudiante: nombreEstudiantePrincipal },
        ProgramasAcademico: {
          ...informe.ProgramasAcademico,
          Facultade: {
            nombre_facultad: nombreFacultad,
          },
        },
      };

      const blobPrincipal = await pdf(
        <InformePDF
          informe={informePrincipal}
          qrImage={qrDataUrl}
          verificationUrl={verificationUrl}
        />
      ).toBlob();

      const formDataPrincipal = new FormData();
      formDataPrincipal.append('archivo', blobPrincipal, `certificado_final_${id}.pdf`);
      formDataPrincipal.append('trabajo_id', id);

      await axios.post('/api/trabajo-social/guardar-certificado-final', formDataPrincipal, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      await axios.patch(`/api/trabajo-social/estado/${id}`, {
        nuevo_estado: 'aprobado',
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchInformesFinales();
      await alertSuccess('Informe aprobado', 'El informe fue aprobado y los certificados se generaron correctamente.');
    } catch (error) {
      console.error('Error general al aceptar informe:', error);
      const mensaje = error?.response?.data?.message;
      await alertError('Error al procesar informe', mensaje || 'No se pudo procesar el informe. Intenta de nuevo más tarde.');
    }
  }, [aprobandoId, informesFinales, token, fetchInformesFinales]);

  const rechazarInforme = useCallback(async (id) => {
    try {
      await axios.patch(`/api/trabajo-social/estado/${id}`, {
        nuevo_estado: 'rechazado',
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchInformesFinales();
    } catch (error) {
      console.error('Error al rechazar informe:', error);
    }
  }, [token, fetchInformesFinales]);

  useEffect(() => {
    fetchInformesFinales();
  }, [fetchInformesFinales]);

  return {
    informesFinales,
    aprobandoId,
    fetchInformesFinales,
    aceptarInforme,
    rechazarInforme,
  };
}
