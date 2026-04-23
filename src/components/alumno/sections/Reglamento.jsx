import React from 'react';
import './Reglamento.css';
import VerBoton from '../../../hooks/componentes/VerBoton';
import PdfIcon from '../../../hooks/componentes/PdfIcon';
import DownloadIcon from "../../../hooks/componentes/Icons/DownloadIcon";
import CheckCircleFilledIcon from '../../../hooks/componentes/Icons/CheckCircleFilledIcon';

function Reglamento() {
  const documentos = [
    {
      id: 1,
      titulo: 'REGLAMENTO OFICIAL DEL SERVICIO SOCIAL',
      tipo: 'PDF',
      cargado: '6/4/2026',
      estado: 'Vigente',
      url: 'https://drive.google.com/file/d/17gAI3ACdRPgheDtd1dhSvSA9szTmtsHT/view?usp=sharing',
    },
    {
      id: 2,
      titulo: 'PLAN DE TRABAJO SERVICIO SOCIAL',
      tipo: 'PDF',
      cargado: '6/4/2026',
      estado: 'Vigente',
      url: 'https://drive.google.com/file/d/13NCxoOYne46Wx46xydWWPR2tRf5HV8gq/view?usp=sharing',
    },
    {
      id: 3,
      titulo: 'REGLAMENTO GENERAL DE ESTUDIOS',
      tipo: 'PDF',
      cargado: '6/4/2026',
      estado: 'Vigente',
      url: 'https://drive.google.com/file/d/1vusDPWYiod_V3KslegCuMHFHuHPp3rew/view?usp=sharing',
    },
  ];

  const getGoogleDriveDownloadUrl = (url) => {
    const match = url.match(/\/d\/([^/]+)/);
    if (!match?.[1]) return url;
    return `https://drive.google.com/uc?export=download&id=${match[1]}`;
  };

  return (
    <section className="reglamento-card">
      <div className="reglamento-card-header">
        <span className="check-circle">
          <CheckCircleFilledIcon width={28} height={28} />
        </span>
        <div>
          <h2 style={{ color: '#ffffff', fontSize: '1.2rem', fontWeight: 600 }}>DOCUMENTOS OFICIALES SERVICIO SOCIAL</h2>
          <p style={{ color: '#cbd5e1', fontSize: '0.86rem', margin: '2px 0 0' }}>Consulta y descarga de documentos oficiales vigentes</p>
        </div>
      </div>

      <div className="reglamento-card-body">
        <div className="reglamento-list">
          {documentos.map((doc) => (
            <article className="reglamento-item" key={doc.id}>
              <div className="documento-info reglamento-documento-info">
                <PdfIcon />
                <div className="reglamento-item-content">
                  <span className="titulo-pdf">{doc.titulo}</span>
                <div className="reglamento-meta">
                  <span>Tipo: {doc.tipo}</span>
                  <span className="reglamento-meta-dot">•</span>
                  <span>Cargado: {doc.cargado}</span>
                </div>
              </div>
              </div>

              <span className="estado-tramitado">{doc.estado}</span>

              <div className="reglamento-actions">
                <VerBoton
                  onClick={() => window.open(doc.url, '_blank', 'noopener,noreferrer')}
                />

                <button
                  type="button"
                  className="reglamento-btn reglamento-btn-download"
                  onClick={() =>
                    window.open(
                      getGoogleDriveDownloadUrl(doc.url),
                      '_blank',
                      'noopener,noreferrer'
                    )
                  }
                  aria-label={`Descargar ${doc.titulo}`}
                >
                  <DownloadIcon width={18} height={18} />
                </button>
              </div>
            </article>
          ))}

        </div>
      </div>
    </section>
  );
}

export default Reglamento;
