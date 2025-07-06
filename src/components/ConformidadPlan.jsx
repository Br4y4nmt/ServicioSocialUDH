import React from 'react';
import Swal from 'sweetalert2';
import './DashboardAlumno.css';

function ConformidadPlan({
  estadoConformidad,
  nombreDocente,
  nombreLaborSocial,
  abrirModalProyecto,
  cartaAceptacionPdf,
  introduccion,
  setIntroduccion,
  justificacion,
  setJustificacion,
  objetivoGeneral,
  setObjetivoGeneral,
  objetivosEspecificos,
  setObjetivosEspecificos,
  nombreEntidad,
  setNombreEntidad,
  misionVision,
  setMisionVision,
  areasIntervencion,
  setAreasIntervencion,
  ubicacionPoblacion,
  setUbicacionPoblacion,
  areaInfluencia,
  setAreaInfluencia,
  metodologiaIntervencion,
  setMetodologiaIntervencion,
  recursosRequeridos,
  setRecursosRequeridos,
  resultadosEsperados,
  setResultadosEsperados,
  actividades,
  setActividades,
  nuevaFechaFin,
  setNuevaFechaFin,
  abrirModalActividad,
  setNuevaActividad,
  setNuevaFecha,
  setNuevaJustificacion,
  setNuevosResultados,
  setEditIndex,
  setModalActividadVisible,
  nombreFacultad,
  nombrePrograma,
  nombreCompleto,
  codigoUniversitario,
  nombreInstitucion,
  setNombreInstitucion,
  nombreResponsable,
  setNombreResponsable,
  lineaAccion,
  setLineaAccion,
  fechaPresentacion,
  setFechaPresentacion,
  periodoEstimado,
  setPeriodoEstimado,
  handleFileChange,
  archivoYaEnviado,
  handleGenerarPDF,
  pdfDescargado,
  proyectoFile,
  handleSolicitarRevision,
  activeSection
}) {
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
     

   {activeSection === 'conformidad' && !['pendiente', 'aceptado'].includes(estadoConformidad) && (
     <div id="esquema-plan-pdf">
     <div className="solicitar-revision-card">

       <h2 style={{
         textAlign: 'center',
         marginTop: '10px',
         marginBottom: '20px',
         color: '#2D3748',
         fontSize: '24px',
         fontWeight: '700',
         letterSpacing: '1px'
       }}>
         ESQUEMA PLAN
       </h2>
   
       <div className="solicitar-revision-header">
         <h3>PORTADA</h3>
       </div>
   
       <div className="form-group">
     <label className="bold-text">Universidad</label>
     <textarea
     className="input-estilo-select universidad-readonly"
     value="UNIVERSIDAD DE HUÁNUCO"
     readOnly
     rows={1}
   />
   </div>
   
   
   <div className="form-group">
     <label className="bold-text">Facultad</label>
     <textarea
       className="input-estilo-select universidad-readonly"
       value={nombreFacultad}
       readOnly
       rows={1}
   />
   </div>
   
   <div className="form-group">
     <label className="bold-text">Programa academico</label>
     <textarea
       className="input-estilo-select universidad-readonly"
       value={nombrePrograma}
       readOnly
       rows={1}
   />
   </div>
   
   <div className="form-group">
     <label className="bold-text">Nombre Completo</label>
     <textarea
       className="input-estilo-select universidad-readonly"
       value={nombreCompleto}
       readOnly
       rows={1}
   />
   </div>
   
   <div className="form-group">
     <label className="bold-text">Codigo Universitario</label>
     <textarea
       className="input-estilo-select universidad-readonly"
       value={codigoUniversitario}
       readOnly
       rows={1}
   />
   </div>
   <div className="form-group">
     <label className="bold-text">Nombre del Servicio Social</label>
     <textarea
       className="input-estilo-select universidad-readonly"
       value={nombreLaborSocial}
       readOnly
       rows={1}
     />
   </div>
   
   <div className="form-group">
     <label className="bold-text">Nombre de la institución o comunidad receptora</label>
     <textarea
       className="input-estilo-select"
       value={nombreInstitucion}
       onChange={(e) => setNombreInstitucion(e.target.value)}
       placeholder="Describa aquí..."
     />
   </div>
   
   
   <div className="form-group">
     <label className="bold-text">Nombre del responsable institucional o beneficiario</label>
     <textarea
       className="input-estilo-select"
       value={nombreResponsable}
       onChange={(e) => setNombreResponsable(e.target.value)}
       placeholder="Describa aquí..."
     />
   </div>
   
   <div className="form-group">
  <label className="bold-text">Línea de Acción</label>
  <textarea
    className="input-estilo-select universidad-readonly"
    value={lineaAccion}
    readOnly
    rows={1}
  />
</div>
   <div className="form-group">
      <label className="bold-text">Periodo estimado del servicio social</label>
      <select
        className="input-estilo-select texto-mayuscula"
        value={periodoEstimado}
        onChange={(e) => setPeriodoEstimado(e.target.value)}
      >
        <option value="">Seleccione una opción</option>
        <option value="4 MESES">4 MESES</option>
        <option value="5 MESES">5 MESES</option>
        <option value="6 MESES">6 MESES</option>
      </select>
    </div>
   
       <div className="form-group">
         <label className="bold-text">Fecha de presentación</label>
         <input
           type="date"
           className="input-estilo-select"
           value={fechaPresentacion}
           onChange={(e) => setFechaPresentacion(e.target.value)}
         />
       </div>  
     </div>
     </div>
   )}
   
   {activeSection === 'conformidad' && !['pendiente', 'aceptado'].includes(estadoConformidad) && (
     <div className="solicitar-revision-card">  
       <div className="solicitar-revision-header">
         <h3>INTRODUCCION</h3>
       </div>
       <div className="form-group">
       <textarea
     className="input-estilo-select"
     value={introduccion}
     onChange={(e) => setIntroduccion(e.target.value)}
     placeholder="Breve contextualización sobre la importancia del servicio social en la formación profesional, el rol del estudiante en su ejecución y cómo se vincula con las políticas públicas o necesidades sociales."
   />
       </div>
   
     </div>
   )}

   {activeSection === 'conformidad' && !['pendiente', 'aceptado'].includes(estadoConformidad) && (
     <div className="solicitar-revision-card">
       <div className="solicitar-revision-header">
         <h3>JUSTIFICACION</h3>
       </div>  
       <div className="form-group">
       <textarea
     className="input-estilo-select"
     value={justificacion}
     onChange={(e) => setJustificacion(e.target.value)}
     placeholder="Explica por qué es importante realizar el servicio social en la institución elegida, resaltando la contribución que se espera hacer y cómo se articula con la especialidad profesional del estudiante."
   />
       </div>  
     </div>
   )}
   
   {activeSection === 'conformidad' && !['pendiente', 'aceptado'].includes(estadoConformidad) && (

     <div className="solicitar-revision-card">
   
       <div className="solicitar-revision-header">
         <h3>OBJETIVOS</h3>
       </div>
   
       <div className="form-group">
     <label className="bold-text">Objetivo General</label>
     <textarea
       className="input-estilo-select"
       value={objetivoGeneral}
       onChange={(e) => setObjetivoGeneral(e.target.value)}
       placeholder="Describir en términos amplios el propósito central del servicio social."
     />
   </div>
   
   <div className="form-group">
     <label className="bold-text">Objetivos Específicos</label>
     <textarea
       className="input-estilo-select"
       value={objetivosEspecificos}
       onChange={(e) => setObjetivosEspecificos(e.target.value)}
       placeholder="Enumerar metas concretas que se quieren alcanzar (mínimo 3), alineadas a la solución de problemáticas específicas de la institución o comunidad."
     />
   </div>
   
   
     </div>
   )}
   
   {activeSection === 'conformidad' && !['pendiente', 'aceptado'].includes(estadoConformidad) && (
     <div className="solicitar-revision-card">
       <div className="solicitar-revision-header">
         <h3>MARCO INSTITUCIONAL</h3>
       </div>
       <div className="form-group">
     <label className="bold-text">Nombre de la entidad receptora</label>
     <textarea
       className="input-estilo-select"
       value={nombreEntidad}
       onChange={(e) => setNombreEntidad(e.target.value)}
       placeholder="Describir..."
     />
   </div>
   
   <div className="form-group">
     <label className="bold-text">Misión y visión institucional</label>
     <textarea
       className="input-estilo-select"
       value={misionVision}
       onChange={(e) => setMisionVision(e.target.value)}
       placeholder="Describir..."
     />
   </div>
   
   <div className="form-group">
     <label className="bold-text">Áreas de intervención o servicios que ofrece</label>
     <textarea
       className="input-estilo-select"
       value={areasIntervencion}
       onChange={(e) => setAreasIntervencion(e.target.value)}
       placeholder="Describir..."
     />
   </div>
   
   <div className="form-group">
     <label className="bold-text">Ubicación geográfica y población beneficiaria</label>
     <textarea
       className="input-estilo-select"
       value={ubicacionPoblacion}
       onChange={(e) => setUbicacionPoblacion(e.target.value)}
       placeholder="Describir..."
     />
   </div>
   
     </div>
   )}
   
   {activeSection === 'conformidad' && !['pendiente', 'aceptado'].includes(estadoConformidad) && (
     <div className="solicitar-revision-card">
       <div className="solicitar-revision-header">
         <h3>Cronograma de Actividades</h3>
       </div>
       <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
       <button className="btn-agregar-alumno" onClick={abrirModalActividad}>
         Agregar <i className="fas fa-plus"></i>
       </button>
       </div>
       <table className="tabla-cronograma">
         <thead>
           <tr>
             <th>N</th>
             <th>Actividad</th>
             <th>Justificación</th>
             <th>Fecha Estimada</th>
             <th>Fecha Fin</th>
             <th>Resultados Esperados</th>
             <th>Acción</th>
           </tr>
         </thead>
         <tbody>
         {actividades.map((item, index) => (
       <tr key={index}>
         <td>{index + 1}</td>
         <td>{item.actividad.length > 15 ? item.actividad.substring(0, 15) + '...' : item.actividad}</td>
         <td>{item.justificacion.length > 15 ? item.justificacion.substring(0, 15) + '...' : item.justificacion}</td> 
         <td>{item.fecha}</td>
         <td>{item.fechaFin}</td>
         <td>{item.resultados.length > 15 ? item.resultados.substring(0, 15) + '...' : item.resultados}</td>
         <td style={{ display: 'flex', gap: '8px' }}>
     <button
        onClick={() => {
         setNuevaActividad(item.actividad);
         setNuevaFecha(item.fecha);
         setNuevaFechaFin(item.fechaFin); 
         setNuevaJustificacion(item.justificacion);
         setNuevosResultados(item.resultados); 
         setEditIndex(index);
         setModalActividadVisible(true);
       }}
       style={{
         background: 'transparent',
         border: 'none',
         cursor: 'pointer'
       }}
       title="Editar"
     >
       <svg
         xmlns="http://www.w3.org/2000/svg"
         height="20"
         viewBox="0 0 24 24"
         width="20"
         fill="#f0ad4e"
       >
         <path d="M0 0h24v24H0z" fill="none" />
         <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 
         7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 
         0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
       </svg>
     </button>
     <button
       onClick={() => {
         const nuevaLista = actividades.filter((_, i) => i !== index);
         setActividades(nuevaLista);
       }}
       style={{
         background: 'transparent',
         border: 'none',
         cursor: 'pointer'
       }}
       title="Eliminar"
     >
       <svg
         xmlns="http://www.w3.org/2000/svg"
         height="20"
         viewBox="0 0 24 24"
         width="20"
         fill="#dc3545"
       >
         <path d="M0 0h24v24H0V0z" fill="none" />
         <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-4.5l-1-1zM18 
         7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 
         2-2V7z" />
       </svg>
     </button>
   </td>
       </tr>
     ))}
   </tbody>
       </table>
      
     </div>
   )}
   
   {activeSection === 'conformidad' && !['pendiente', 'aceptado'].includes(estadoConformidad) && (

     <div className="solicitar-revision-card">
   
       <div className="solicitar-revision-header">
         <h3>AREA DE INFLUENCIA</h3>
       </div>
   
       <div className="form-group">
       <textarea
     className="input-estilo-select"
     value={areaInfluencia}
     onChange={(e) => setAreaInfluencia(e.target.value)}
     placeholder="Descripción precisa del grupo o comunidad beneficiaria directa del servicio, especificando características sociales, económicas o demográficas."
   />
       </div>
   
   
     </div>
   )}
   
   {activeSection === 'conformidad' && !['pendiente', 'aceptado'].includes(estadoConformidad) && (

     <div className="solicitar-revision-card">
   
       <div className="solicitar-revision-header">
         <h3>METODOLOGIA DE INTERVENCION</h3>
       </div>
   
       <div className="form-group">
       <textarea
           className="input-estilo-select"
           value={metodologiaIntervencion}
           onChange={(e) => setMetodologiaIntervencion(e.target.value)}
           placeholder="Explicación del enfoque o estrategias que se aplicarán para el desarrollo de las actividades: observación, entrevistas, asistencia técnica, intervención comunitaria, entre otras."
         />
       </div>
     </div>
   )}
   
   {activeSection === 'conformidad' && !['pendiente', 'aceptado'].includes(estadoConformidad) && (
     <div className="solicitar-revision-card">
       <div className="solicitar-revision-header">
         <h3>RECURSOS REQUERIDOS</h3>
       </div>
   
       <div className="form-group">
         <textarea
           className="input-estilo-select"
           value={recursosRequeridos}
           onChange={(e) => setRecursosRequeridos(e.target.value)}
           placeholder="Descripción de los recursos necesarios para el desarrollo del servicio social."
         />
       </div>
     </div>
   )}
   
   
   {activeSection === 'conformidad' && !['pendiente', 'aceptado'].includes(estadoConformidad) && (

     <div className="solicitar-revision-card">
       <div className="solicitar-revision-header">
         <h3>RESULTADOS ESPERADOS</h3>
       </div>
   
       <div className="form-group">
         <textarea
           className="input-estilo-select"
           value={resultadosEsperados}
           onChange={(e) => setResultadosEsperados(e.target.value)}
           placeholder="Descripción de los resultados esperados del servicio social."
         />
       </div>
     </div>
   )}
   
   {activeSection === 'conformidad' && !['pendiente', 'aceptado'].includes(estadoConformidad) && (

     <div className="solicitar-revision-card">
       <div className="solicitar-revision-header">
         <h3>ANEXOS</h3>
       </div>
   
       <div className="form-group">
         <label className="bold-text">Convenio de Cooperación Institucional</label>
         <input 
           type="file" 
           accept="application/pdf"
           onChange={(e) => handleFileChange(e, 'cartaAceptacion')}
         />
       </div>
   
       <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
        <button
          className="boton-ver-pdf-conf"
          onClick={() => {
            if (!cartaAceptacionPdf) {
              Swal.fire({
                icon: 'warning',
                title: 'Falta el archivo anexo',
                text: 'Debes adjuntar el archivo de Convenio de Cooperación Institucional antes de poder generar el PDF.',
                confirmButtonText: 'Aceptar'
              });
              return;
            }
            handleGenerarPDF();
          }}
          disabled={archivoYaEnviado}
        >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{
            marginRight: '6px',
            position: 'relative',
            top: '-2px', 
            verticalAlign: 'middle'
          }}
        >
          <path d="M6 2h9l5 5v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm8 1.5V9h5.5L14 3.5zM8 13h8v-2H8v2zm0 4h8v-2H8v2z" />
        </svg>
        Ver PDF
      </button>


       </div>
       
     </div>
     
   )}

   
   {activeSection === 'conformidad' && (pdfDescargado || archivoYaEnviado) && (
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

    {estadoConformidad === 'aceptado' && (
  <>
    <div
      style={{
        color: '#319795',
        fontStyle: 'italic',
        fontWeight: 400,
        marginLeft: '0px',
        marginTop: '4px',
        fontSize: '14px'
      }}
    >
      El docente supervisor ha aceptado tu solicitud, continúa al siguiente paso para poder confirmar tu plan de trabajo.
    </div>

   
    <div className="aviso-importante">
      <strong>¡Importante!</strong> Si el tiempo establecido en el plan del servicio social es excedido, este se reiniciará automáticamente y tendra que iniciar nuevamente su servicio social
    </div>
  </>
)}


    {estadoConformidad !== 'aceptado' && (
      <div className="texto-revision-supervisor">
  <>
    {estadoConformidad === 'pendiente' ? (
      <p style={{ fontStyle: 'italic', color: '#3d7f6f', fontWeight: 400 }}>
         Su solicitud de revisión se ha enviado exitosamente. Ahora el docente revisará su documento.
      </p>
    ) : (
      <>
        <p>
          Revisar su documento detalladamente antes de enviar, lo puede descargar en <strong className="enlace-revision">"Ver PDF"</strong>.
        </p>
        <p>
          Luego, haz clic en <strong className="enlace-revision">"Solicitar revisión"</strong> para recibir sugerencias de corrección por parte del supervisor.
        </p>
      </>
    )}
  </>
  </div>
)}


    {proyectoFile && !archivoYaEnviado && (
      <p className="archivo-seleccionado">
        Archivo listo para enviar: <strong>{proyectoFile.name}</strong>
      </p>
    )}

    <button
  className={`btn-revision ${estadoConformidad === 'aceptado' ? 'oculto' : ''}`}
  onClick={() => {
    if (archivoYaEnviado) {
      Swal.fire({
        icon: 'info',
        title: 'Solicitud ya enviada',
        text: 'Ya has enviado un archivo. No puedes volver a enviar otro.',
        confirmButtonText: 'Aceptar'
      });
      return;
    }
    handleSolicitarRevision();
  }}
  disabled={archivoYaEnviado}
  style={{
    opacity: archivoYaEnviado ? 0.6 : 1,
    cursor: archivoYaEnviado ? 'not-allowed' : 'pointer'
  }}
>
  {archivoYaEnviado ? 'Ya enviado' : 'Solicitar revisión'} <i className="fas fa-edit"></i>
</button>
  </div>
)}

   </>
  );
};

export default ConformidadPlan;
