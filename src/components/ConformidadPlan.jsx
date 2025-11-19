import React from 'react';
import Swal from 'sweetalert2';
import './DashboardAlumno.css';

function ConformidadPlan({
  estadoConformidad,
  nombreDocente,
  nombreLaborSocial,
  abrirModalProyecto,       
  activeSection,
  handleFileChange,        
  proyectoFile,
  handleSolicitarRevision,
  archivoYaEnviado
}) {
  const [enviandoRevision, setEnviandoRevision] = React.useState(false);
  const subirBloqueado = archivoYaEnviado || Boolean(proyectoFile);
  const base =
    (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL) ||
    process.env.PUBLIC_URL ||
    '';
  const pdfPlantillaUrl = `${base}plantillas/PLAN.pdf`;
  const [downloading, setDownloading] = React.useState(false);

  const handleDownloadClick = () => {
    if (downloading) return;       // evita múltiples clics
    setDownloading(true);
    // Tras un breve tiempo volvemos a habilitar el botón
    setTimeout(() => setDownloading(false), 1500);
  };
  const validarYAsignar = (file) => {
  if (!file) return;
  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

  if (!isPdf) {
    Swal.fire({ icon: 'warning', title: 'Formato no permitido', text: 'Selecciona un PDF.' });
    return;
  }

  // sin validación de tamaño
  handleFileChange({ target: { files: [file] } }, 'proyectoPdf');
};

  return (
    <>
      {activeSection === 'conformidad' && (
        <div className="plan-info">
          <div className="plan-icon-img">
            <img src="/images/persona.png" alt="Persona" className="persona-img" />
          </div>

          <div className="plan-details">
            <div className="plan-info-box">
              <div className="plan-icon">
                <i className="fas fa-user-tie text-azul text-4xl mb-3"></i>
              </div>
              <h4>Docente Supervisor</h4>
              <p>{nombreDocente}</p>
            </div>

            <div className="plan-info-box">
              <div className="plan-icon">
                <i className="fas fa-file-alt text-azul text-4xl mb-2"></i>
              </div>
              <h4>Título de Plan De Servicio Social</h4>
              <p>{nombreLaborSocial}</p>
            </div>

            {estadoConformidad !== 'aceptado' && (
              <button
                className="subir-proyecto-btn oculto"
                onClick={abrirModalProyecto}
              >
                <i className="fas fa-upload"></i> Subir Proyecto
              </button>
            )}
          </div>
          
        </div>
      )}

      {activeSection === 'conformidad' && (
        <div className="solicitar-revision-card">
          <h2
            style={{
              textAlign: 'center',
              marginTop: '10px',
              marginBottom: '20px',
              color: '#2D3748',
              fontSize: '24px',
              fontWeight: '700',
              letterSpacing: '1px'
            }}
          >
            FORMATO DEL PLAN SERVICIO SOCIAL
          </h2>

          <div
            className="fila-descarga-subida"
            style={{
              display: 'flex',
              gap: 16,
              alignItems: 'stretch',
              justifyContent: 'space-between',
              flexWrap: 'wrap'
            }}
          >
<div className="col-descargar">
  <div className="solicitar-revision-header header-descargar">
    <h3 className="titulo-descargar">
      <i className="fas fa-download" /> Descargar plantilla
    </h3>
  </div>

  <div className="form-group descargar-wrapper">
    <div className="download-box">
      <i className="fas fa-file-pdf download-icon" />
      <p className="download-text">
        <strong>Descargue la plantilla oficial</strong>, complétela cuidadosamente y súbala en formato PDF.
      </p>

     <a
  className={`btn-descargar ${downloading ? 'loading' : ''}`}
  href={pdfPlantillaUrl}
  download="PLAN_SERVICIO_SOCIAL.pdf"
  target="_blank"
  rel="noopener noreferrer"
  onClick={(e) => { if (downloading) { e.preventDefault(); return; } handleDownloadClick(); }}
  aria-disabled={downloading}
>
  {downloading ? (
    <>
      <span
        className="spinner-border-conformidad"
        style={{ width: 14, height: 14, marginRight: 6, borderWidth: 2 }}
        aria-hidden="true"
      />
      Descargando...
    </>
  ) : (
    <>
      <i className="fas fa-arrow-down" /> Descargar PDF
    </>
  )}
</a>
    </div>
  </div>
</div>

<div
  className="col-subir"
  style={{
    flex: 1,
    minWidth: 280,
    border: '1px solid #E2E8F0',
    borderRadius: 10,
    padding: 16,
    background: '#FFFFFF'
  }}
>
  <div className="solicitar-revision-header" style={{ marginBottom: 10 }}>
    <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
      <i className="fas fa-file-upload" /> Subir tu PDF completado
    </h3>
  </div>

  <div className="form-group">
   <label
  htmlFor="input-pdf-proyecto"
  className={`upload-dropzone ${subirBloqueado ? 'is-disabled' : ''}`}
  role="button"
  tabIndex={subirBloqueado ? -1 : 0}
  onClick={(e) => { if (subirBloqueado) e.preventDefault(); }}
  onKeyDown={(e) => {
    if (subirBloqueado) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      document.getElementById('input-pdf-proyecto')?.click();
    }
  }}
  onDragOver={(e) => e.preventDefault()}
  onDrop={(e) => {
    e.preventDefault();
    if (subirBloqueado) return;
    const file = e.dataTransfer.files?.[0];
    validarYAsignar(file);
  }}
  style={{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    border: '2px dashed #CBD5E0',
    borderRadius: 12,
    padding: 20,
    cursor: subirBloqueado ? 'not-allowed' : 'pointer',
    background: '#FAFAFA',
    transition: 'border-color .2s ease, background .2s ease',
    opacity: subirBloqueado ? 0.6 : 1,
    pointerEvents: subirBloqueado ? 'none' : 'auto' 
  }}
  aria-disabled={subirBloqueado}
>
  <i className="fas fa-cloud-upload-alt" style={{ fontSize: 28 }} />
  <div style={{ textAlign: 'center' }}>
    <strong>{subirBloqueado ? 'Archivo seleccionado' : 'Haz clic para seleccionar'}</strong>
    {!subirBloqueado && ' o arrastra tu archivo aquí'}
  </div>
  <div className="upload-hint" style={{ fontSize: 12, color: '#718096' }}>
    Formato admitido: PDF • Tamaño recomendado ≤ 20&nbsp;MB
  </div>

  <span
    className="btn-upload-soft"
    style={{
      marginTop: 4,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '8px 12px',
      borderRadius: 8,
      border: '1px solid #E2E8F0',
      boxShadow: '0 1px 2px rgba(0,0,0,.04)',
      pointerEvents: subirBloqueado ? 'none' : 'auto'
    }}
  >
    <i className="fas fa-folder-open" />
    Elegir archivo
  </span>
</label>


    <input
      id="input-pdf-proyecto"
      type="file"
      accept="application/pdf"
      style={{ display: 'none' }}
      disabled={archivoYaEnviado}
      onChange={(e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  if (!isPdf) {
    Swal.fire({
      icon: 'warning',
      title: 'Formato no permitido',
      text: 'Por favor selecciona un archivo en formato PDF.',
      confirmButtonText: 'Aceptar'
    });
    e.target.value = '';
    return;
  }

  // sin validación de tamaño
  handleFileChange(e, 'proyectoPdf');
}}

    />

    {proyectoFile && !archivoYaEnviado && (
      <div
        className="archivo-meta"
        style={{
          marginTop: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          padding: 12,
          border: '1px solid #E2E8F0',
          borderRadius: 10,
          background: '#FFFFFF'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <i className="far fa-file-pdf" style={{ fontSize: 20 }} />
          <div style={{ minWidth: 0 }}>
            <div
              className="archivo-nombre"
              title={proyectoFile.name}
              style={{
                fontWeight: 600,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: 340
              }}
            >
              {proyectoFile.name}
            </div>
            <div style={{ fontSize: 12, color: '#718096' }}>
              {(proyectoFile.size / (1024 * 1024)).toFixed(2)} MB
            </div>
          </div>
        </div>
        <button
          type="button"
          className="btn-cambiar-archivo"
          onClick={() => {
             const input = document.getElementById('input-pdf-proyecto');
             if (input) input.value = '';
            document.getElementById('input-pdf-proyecto')?.click();
          }}
          style={{
            padding: '8px 12px',
            borderRadius: 8,
            border: '1px solid #E2E8F0',
            background: '#F7FAFC',
            cursor: 'pointer'
          }}
        >
          Cambiar
        </button>
      </div>
    )}
    <div style={{ marginTop: 10, fontSize: 12, color: '#718096' }}>
      Asegúrate de que el documento esté completo y legible antes de enviarlo para revisión.
    </div>
  </div>
</div>
          </div>
          <div className="alerta-importantes bounce">
          <strong>¡Importante!</strong> 
          Recuerde planificar adecuadamente el tiempo destinado al servicio social. 
          El informe debe reflejar el cumplimiento de las <strong>96 horas de trabajo</strong> establecidas, 
          indicando de manera detallada las <strong>actividades realizadas</strong>, junto con sus 
          respectivas <strong>fechas y horas de ejecución</strong>.  
          Esta información permitirá facilitar la revisión y validación del documento por parte del supervisor académico.
        </div>
        </div>
      )}
      {activeSection === 'conformidad' && (
        <div className="solicitar-revision-card">
          <div className="solicitar-revision-header">
            <div className="solicitar-revision-titulo">
              <i className="fas fa-info-circle icono-azul" />
              <h3>Solicitar revisión al supervisor:</h3>
            </div>

            {archivoYaEnviado && (
              <button className={`respuesta-asesor-btn ${estadoConformidad}`}>
                {estadoConformidad
                  ? estadoConformidad.charAt(0).toUpperCase() + estadoConformidad.slice(1)
                  : 'Pendiente'}
              </button>
            )}
          </div>

          {estadoConformidad === 'aceptado' ? (
            <>
              <div
                style={{
                  color: '#319795',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  marginLeft: 0,
                  marginTop: 4,
                  fontSize: 14
                }}
              >
                El docente supervisor ha aceptado tu solicitud, continúa al siguiente paso para poder
                confirmar tu plan de trabajo.
              </div>

              <div className="aviso-importante">
                <strong>¡Importante!</strong> Si el tiempo establecido en el plan del servicio
                social es excedido, este se reiniciará automáticamente y tendrá que iniciar
                nuevamente su servicio social.
              </div>
            </>
          ) : (
            <div className="texto-revision-supervisor">
              <>
                {estadoConformidad === 'pendiente' ? (
                  <p style={{ fontStyle: 'italic', color: '#3d7f6f', fontWeight: 400 }}>
  Su solicitud de revisión ha sido enviada correctamente. El documento será evaluado por el docente supervisor en breve.
</p>



                ) : (
                  <>
                    <p>
                      Asegúrate de haber <strong>descargado</strong> y{' '}
                      <strong>subido</strong> tu PDF antes de solicitar revisión.
                    </p>
                  </>
                )}
              </>
            </div>
          )}

          <button
            className={`btn-revision ${estadoConformidad === 'aceptado' ? 'oculto' : ''}`}
            onClick={async () => {
              if (archivoYaEnviado) {
                Swal.fire({
                  icon: 'info',
                  title: 'Solicitud ya enviada',
                  text: 'Ya has enviado un archivo. No puedes volver a enviar otro.',
                  confirmButtonText: 'Aceptar'
                });
                return;
              }
              if (!proyectoFile) {
                Swal.fire({
                  icon: 'warning',
                  title: 'Falta el PDF',
                  text: 'Debes subir tu PDF completado antes de solicitar revisión.',
                  confirmButtonText: 'Aceptar'
                });
                return;
              }

              setEnviandoRevision(true);
              try {
                await Promise.resolve(handleSolicitarRevision());
              } finally {
                setTimeout(() => setEnviandoRevision(false), 800);
              }
            }}
            disabled={archivoYaEnviado || enviandoRevision}
            style={{
              opacity: archivoYaEnviado || enviandoRevision ? 0.6 : 1,
              cursor: archivoYaEnviado || enviandoRevision ? 'not-allowed' : 'pointer'
            }}
          >
            {archivoYaEnviado ? (
              'Documento enviado al supervisor'
            ) : enviandoRevision ? (
              <>
                <span
                  className="spinner-border-conformidad"
                  role="status"
                  aria-hidden="true"
                  style={{ marginRight: 6, verticalAlign: 'middle' }}
                ></span>
                Enviando...
              </>
            ) : (
              <>
                Solicitar revisión <i className="fas fa-edit"></i>
              </>
            )}
          </button>
        </div>
      )}
    </>
  );
}

export default ConformidadPlan;
