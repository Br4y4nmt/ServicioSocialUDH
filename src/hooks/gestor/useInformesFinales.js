import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { pdf } from '@react-pdf/renderer';
import QRCode from 'qrcode';
import InformePDF from '../../components/InformefinalProgramaPDF';
import {
  alertWarning,
  alertError,
} from '../alerts/alertas';

export default function useInformesFinales(token) {
  const [informesFinales, setInformesFinales] = useState([]);
  const [aprobandoId, setAprobandoId] = useState(null);

  const fetchInformesFinales = useCallback(async () => {
    if (!token) return;

    try {
      const res = await axios.get(
        '/api/trabajo-social/informes-finales-nuevo',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setInformesFinales(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error al cargar informes finales:', error);
    }
  }, [token]);

  const generarInforme = useCallback(
    async (id) => {
      if (!token || aprobandoId === id) return;

      setAprobandoId(id);

      try {
        const informe = informesFinales.find((i) => i.id === id);
        if (!informe) {
          console.warn('Informe no encontrado:', id);
          return;
        }

        const tipoServicio =
          informe.trabajo_social?.tipo_servicio_social ||
          informe.tipo_servicio_social ||
          null;

        const trabajoId = informe.trabajo_social_id || informe.id;
        
        if (tipoServicio === 'grupal') {
          let estudiantes = [];

          try {
            const response = await axios.get(
              `/api/integrantes/${trabajoId}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            estudiantes = response.data;

            if (!Array.isArray(estudiantes) || estudiantes.length === 0) {
              await alertWarning(
                'Integrantes no disponibles',
                'No se encontraron integrantes para este trabajo grupal.'
              );
              return;
            }
          } catch (error) {
            console.error('Error al obtener integrantes:', error);
            await alertError(
              'Error al obtener integrantes',
              'No se pudieron obtener los datos del grupo.'
            );
            return;
          }

          for (const estudiante of estudiantes) {
            try {
              const nombreEstudiante = estudiante.nombre_completo || estudiante.nombre;
              const codigo =
                estudiante.codigo ||
                estudiante.codigo_universitario ||
                estudiante.correo_institucional?.split('@')[0] ||
                estudiante.correo?.split('@')[0];
              const correoEstudiante =
                estudiante.correo_institucional ||
                estudiante.correo ||
                '';
              const correoPrincipal =
                informe.trabajo_social?.correo_institucional ||
                informe.correo_institucional ||
                '';

              if (correoEstudiante === correoPrincipal) {
                continue;
              }

              if (!nombreEstudiante || !codigo) {
                continue;
              }

              const informePersonalizado = {
                ...informe,
                Estudiante: { nombre_estudiante: nombreEstudiante },
                ProgramasAcademico: {
                  ...informe.ProgramasAcademico,
                  nombre_programa:
                    estudiante.programa_academico ||
                    estudiante.programa ||
                    informe.ProgramasAcademico?.nombre_programa ||
                    'Programa',
                  Facultade: {
                    nombre_facultad:
                      estudiante.facultad ||
                      informe.ProgramasAcademico?.Facultade?.nombre_facultad ||
                      'Facultad',
                  },
                },
              };

              const verificationUrlMiembro =
                `${process.env.REACT_APP_API_URL}/api/certificados-final/${trabajoId}/${codigo}`;

              const qrMiembro = await QRCode.toDataURL(
                verificationUrlMiembro
              );

              const blob = await pdf(
                <InformePDF
                  informe={informePersonalizado}
                  qrImage={qrMiembro}
                  verificationUrl={verificationUrlMiembro}
                />
              ).toBlob();

              const formData = new FormData();
              formData.append(
                'archivo',
                blob,
                `certificado_final_${codigo}.pdf`
              );
              formData.append('trabajo_id', trabajoId);
              formData.append('codigo_universitario', codigo);

              await axios.post('/api/certificados-final', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  Authorization: `Bearer ${token}`,
                },
              });
            } catch (err) {
              console.error(
                'Error generando certificado de integrante:',
                err.response?.status,
                err.response?.data,
                err
              );
            }
          }
        }
        const nombreEstudiantePrincipal =
          informe.Estudiante?.nombre_estudiante ||
          'Estudiante';

        const nombreFacultad =
          informe.ProgramasAcademico?.Facultade?.nombre_facultad ||
          'Facultad';

        const verificationUrl =
          `${process.env.REACT_APP_API_URL}/api/trabajo-social/certificado-final/${id}`;

        const qrDataUrl = await QRCode.toDataURL(verificationUrl);

        const informePrincipal = {
          ...informe,
          Estudiante: {
            nombre_estudiante: nombreEstudiantePrincipal,
          },
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
        formDataPrincipal.append(
          'archivo',
          blobPrincipal,
          `certificado_final_${id}.pdf`
        );
        formDataPrincipal.append('trabajo_id', id);

        await axios.post(
          '/api/trabajo-social/guardar-certificado-final',
          formDataPrincipal,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        fetchInformesFinales();
      } catch (error) {
        console.error('Error general al generar certificados:', error);
        await alertError(
          'Error al generar certificados',
          'No se pudieron generar los certificados.'
        );
      } finally {
        setAprobandoId(null);
      }
    },
    [token, aprobandoId, informesFinales, fetchInformesFinales]
  );

  useEffect(() => {
    fetchInformesFinales();
  }, [fetchInformesFinales]);

  return {
    informesFinales,
    aprobandoId,
    fetchInformesFinales,
    generarInforme,
  };
}