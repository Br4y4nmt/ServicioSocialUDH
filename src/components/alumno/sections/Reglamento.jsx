import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Reglamento.css';
import { useUser } from '../../../UserContext';
import VerBoton from '../../../hooks/componentes/VerBoton';
import PdfIcon from '../../../hooks/componentes/PdfIcon';
import DownloadIcon from '../../../hooks/componentes/Icons/DownloadIcon';
import CheckCircleFilledIcon from '../../../hooks/componentes/Icons/CheckCircleFilledIcon';

function Reglamento() {
  const { user } = useUser();
  const token = user?.token;
  const [documentos, setDocumentos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerDocumentos = async () => {
      if (!token) {
        setDocumentos([]);
        setCargando(false);
        return;
      }

      try {
        setCargando(true);

        const res = await axios.get('/api/documentos-oficiales', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setDocumentos(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error('Error al obtener documentos oficiales:', error);
        setDocumentos([]);
      } finally {
        setCargando(false);
      }
    };

    obtenerDocumentos();
  }, [token]);

  const obtenerUrlDocumento = (rutaArchivo) => {
    return `${process.env.REACT_APP_API_URL}${rutaArchivo}`;
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '-';

    return new Date(fecha).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const descargarDocumento = async (doc) => {
    try {
      const url = obtenerUrlDocumento(doc.ruta_archivo);
      const response = await axios.get(url, {
        responseType: 'blob'
      });

      const blobUrl = window.URL.createObjectURL(response.data);
      const enlace = document.createElement('a');

      enlace.href = blobUrl;
      enlace.download = doc.nombre_original || `${doc.titulo}.pdf`;
      document.body.appendChild(enlace);
      enlace.click();
      enlace.remove();

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error al descargar documento:', error);
    }
  };

  return (
    <section className="reglamento-card">
      <div className="reglamento-card-header">
        <span className="check-circle">
          <CheckCircleFilledIcon width={28} height={28} />
        </span>

        <div>
          <h2
            style={{
              color: '#ffffff',
              fontSize: '1.2rem',
              fontWeight: 600
            }}
          >
            DOCUMENTOS OFICIALES SERVICIO SOCIAL
          </h2>

          <p
            style={{
              color: '#cbd5e1',
              fontSize: '0.86rem',
              margin: '2px 0 0'
            }}
          >
            Consulta y descarga de documentos oficiales vigentes
          </p>
        </div>
      </div>

      <div className="reglamento-card-body">
        <div className="reglamento-list">
          {cargando ? (
            <div className="reglamento-empty">
              Cargando documentos oficiales...
            </div>
          ) : documentos.length > 0 ? (
            documentos.map((doc) => (
              <article className="reglamento-item" key={doc.id_documento}>
                <div className="documento-info reglamento-documento-info">
                  <PdfIcon />

                  <div className="reglamento-item-content">
                    <span className="titulo-pdf">
                      {doc.titulo}
                    </span>

                    <div className="reglamento-meta">
                      <span>Tipo: {doc.tipo || 'PDF'}</span>
                      <span className="reglamento-meta-dot">•</span>
                      <span>
                        Cargado: {formatearFecha(doc.fecha_carga)}
                      </span>
                    </div>
                  </div>
                </div>

                <span className="estado-tramitado">
                  Vigente
                </span>

                <div className="reglamento-actions">
                  <VerBoton
                    onClick={() =>
                      window.open(
                        obtenerUrlDocumento(doc.ruta_archivo),
                        '_blank',
                        'noopener,noreferrer'
                      )
                    }
                  />

                  <button
                    type="button"
                    className="reglamento-btn reglamento-btn-download"
                    onClick={() => descargarDocumento(doc)}
                    aria-label={`Descargar ${doc.titulo}`}
                  >
                    <DownloadIcon width={18} height={18} />
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="reglamento-empty">
              No hay documentos oficiales disponibles actualmente.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Reglamento;