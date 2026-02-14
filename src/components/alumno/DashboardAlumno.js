import React, { lazy, Suspense } from 'react';
import SidebarAlumno from '../layout/Sidebar/SidebarAlumno';
import Header from '../layout/Header/Header';
import './DashboardAlumno.css';
import '../ModalGlobal.css';
import TituloDashboardAlumno from './TituloDashboardAlumno';
import NavegacionAlumno from './NavegacionAlumno';
import AlumnoModals from './AlumnoModals';
import { useDashboardAlumno } from '../../hooks/alumno/useDashboardAlumno';

const DesignacionDocente = lazy(() => import('./sections/DesignacionDocente'));
const ConformidadPlan = lazy(() => import('./sections/ConformidadPlan'));
const SeguimientoActividades = lazy(() => import('./sections/SeguimientoActividades'));
const InformeFinal = lazy(() => import('./sections/InformeFinal'));
const Reglamento = lazy(() => import('./sections/Reglamento'));
const PlanTrabajo = lazy(() => import('./sections/PlanTrabajo'));

function DashboardAlumno() {
  const hook = useDashboardAlumno();
  const fp = hook.formularioPlan;
  const ga = hook.grupoAlumno;
  const ac = hook.actividadesCronograma;

  return (
    <>
      <Header onToggleSidebar={hook.toggleSidebar} />
      <SidebarAlumno
        collapsed={hook.collapsed}
        nombre={hook.nombre}
        onToggleSidebar={hook.toggleSidebar}
        activeSection={hook.activeSection}
        setActiveSection={hook.setActiveSection}
        estadoPlan={hook.estadoPlan}
        estadoConformidad={hook.estadoConformidad}
        estadoSolicitudTermino={hook.estadoSolicitudTermino}
      />
      {!hook.collapsed && hook.isMobile && (
        <div className="sidebar-overlay" onClick={hook.toggleSidebar}></div>
      )}

      <main className={`main-content ${hook.collapsed ? 'collapsed' : ''}`}>
        <TituloDashboardAlumno activeSection={hook.activeSection} />

        <Suspense fallback={<div className="loading-section">Cargando...</div>}>

          {hook.activeSection === 'reglamento' && (
            <div className="dashboard-container">
              <Reglamento />
            </div>
          )}

          {hook.activeSection === 'plan-trabajo' && (
            <div className="dashboard-container">
              <PlanTrabajo />
            </div>
          )}

          {hook.activeSection === 'informe-final' && (
            <div className="card-section">
              <InformeFinal
                nombreFacultad={hook.nombreFacultad}
                trabajoId={hook.planSeleccionado?.id}
                nombrePrograma={hook.nombrePrograma}
                nombreCompleto={hook.nombreCompleto}
                codigoUniversitario={hook.codigoUniversitario}
                nombreLaborSocial={hook.nombreLaborSocial}
                nombreInstitucion={fp.nombreInstitucion}
                setNombreInstitucion={fp.setNombreInstitucion}
                nombreResponsable={fp.nombreResponsable}
                setNombreResponsable={fp.setNombreResponsable}
                lineaAccion={fp.lineaAccion}
                setPlanSeleccionado={hook.setPlanSeleccionado}
                setLineaAccion={fp.setLineaAccion}
                fechaPresentacion={fp.fechaPresentacion}
                setFechaPresentacion={fp.setFechaPresentacion}
                periodoEstimado={fp.periodoEstimado}
                setPeriodoEstimado={fp.setPeriodoEstimado}
                antecedentes={fp.antecedentes}
                planSeleccionado={hook.planSeleccionado}
                setAntecedentes={fp.setAntecedentes}
                setModalVisible={hook.setModalVisible}
                setImagenModal={hook.setImagenModal}
                objetivoGeneralInforme={fp.objetivoGeneralInforme}
                setObjetivoGeneralInforme={fp.setObjetivoGeneralInforme}
                objetivosEspecificosInforme={fp.objetivosEspecificosInforme}
                setObjetivosEspecificosInforme={fp.setObjetivosEspecificosInforme}
                actividadesSeguimiento={ac.actividadesSeguimiento}
                areaInfluenciaInforme={fp.areaInfluenciaInforme}
                setAreaInfluenciaInforme={fp.setAreaInfluenciaInforme}
                recursosUtilizadosInforme={fp.recursosUtilizadosInforme}
                setRecursosUtilizadosInforme={fp.setRecursosUtilizadosInforme}
                metodologiaInforme={fp.metodologiaInforme}
                setMetodologiaInforme={fp.setMetodologiaInforme}
                conclusionesInforme={fp.conclusionesInforme}
                handleFileChange={hook.handleFileChange}
                setConclusionesInforme={fp.setConclusionesInforme}
                recomendacionesInforme={fp.recomendacionesInforme}
                setRecomendacionesInforme={fp.setRecomendacionesInforme}
                anexosInforme={fp.anexosInforme}
                setAnexosInforme={fp.setAnexosInforme}
              />
            </div>
          )}

          {hook.activeSection === 'conformidad' && (
            <ConformidadPlan
                activeSection={hook.activeSection}
                estadoConformidad={hook.estadoConformidad}
                nombreDocente={hook.nombreDocente}
                nombreLaborSocial={hook.nombreLaborSocial}
                abrirModalProyecto={hook.abrirModalProyecto}
                cartaAceptacionPdf={hook.cartaAceptacionPdf}
                setCartaAceptacionPdf={hook.setCartaAceptacionPdf}
                introduccion={fp.introduccion}
                setIntroduccion={fp.setIntroduccion}
                justificacion={fp.justificacion}
                setJustificacion={fp.setJustificacion}
                objetivoGeneral={fp.objetivoGeneral}
                setObjetivoGeneral={fp.setObjetivoGeneral}
                objetivosEspecificos={fp.objetivosEspecificos}
                setObjetivosEspecificos={fp.setObjetivosEspecificos}
                nombreEntidad={fp.nombreEntidad}
                setNombreEntidad={fp.setNombreEntidad}
                misionVision={fp.misionVision}
                setMisionVision={fp.setMisionVision}
                areasIntervencion={fp.areasIntervencion}
                setAreasIntervencion={fp.setAreasIntervencion}
                ubicacionPoblacion={fp.ubicacionPoblacion}
                setUbicacionPoblacion={fp.setUbicacionPoblacion}
                areaInfluencia={fp.areaInfluencia}
                setAreaInfluencia={fp.setAreaInfluencia}
                metodologiaIntervencion={fp.metodologiaIntervencion}
                setMetodologiaIntervencion={fp.setMetodologiaIntervencion}
                recursosRequeridos={fp.recursosRequeridos}
                setRecursosRequeridos={fp.setRecursosRequeridos}
                resultadosEsperados={fp.resultadosEsperados}
                setResultadosEsperados={fp.setResultadosEsperados}
                actividades={ac.actividades}
                setActividades={ac.setActividades}
                abrirModalActividad={ac.abrirModalActividad}
                setNuevaActividad={ac.setNuevaActividad}
                setNuevaFecha={ac.setNuevaFecha}
                setNuevaJustificacion={ac.setNuevaJustificacion}
                setNuevosResultados={ac.setNuevosResultados}
                setEditIndex={ac.setEditIndex}
                setModalActividadVisible={ac.setModalActividadVisible}
                nombreFacultad={hook.nombreFacultad}
                nombrePrograma={hook.nombrePrograma}
                nombreCompleto={hook.nombreCompleto}
                codigoUniversitario={hook.codigoUniversitario}
                fechaPresentacion={fp.fechaPresentacion}
                setFechaPresentacion={fp.setFechaPresentacion}
                periodoEstimado={fp.periodoEstimado}
                setPeriodoEstimado={fp.setPeriodoEstimado}
                nombreInstitucion={fp.nombreInstitucion}
                setNombreInstitucion={fp.setNombreInstitucion}
                nombreResponsable={fp.nombreResponsable}
                setNombreResponsable={fp.setNombreResponsable}
                lineaAccion={fp.lineaAccion}
                setLineaAccion={fp.setLineaAccion}
                handleFileChange={hook.handleFileChange}
                archivoYaEnviado={hook.archivoYaEnviado}
                handleGenerarPDF={hook.handleGenerarPDF}
                nuevaFechaFin={ac.nuevaFechaFin}
                setNuevaFechaFin={ac.setNuevaFechaFin}
                pdfDescargado={hook.pdfDescargado}
                proyectoFile={hook.proyectoFile}
                handleSolicitarRevision={hook.handleSolicitarRevision}
              />
          )}

          {(hook.activeSection === 'seguimiento' || hook.activeSection === 'designacion') && (
            <div className="card-section">
              {hook.activeSection === 'seguimiento' && (
                <SeguimientoActividades
                    actividadesSeguimiento={ac.actividadesSeguimiento}
                    hayObservaciones={ac.hayObservaciones}
                    handleEvidencia={ac.handleEvidencia}
                    setImagenModal={hook.setImagenModal}
                    setModalVisible={hook.setModalVisible}
                    solicitarCartaTermino={hook.solicitarCartaTermino}
                    todasAprobadas={ac.todasAprobadas}
                    estadoSolicitudTermino={hook.estadoSolicitudTermino}
                    planSeleccionado={hook.planSeleccionado}
                    setObservacionSeleccionada={hook.setObservacionSeleccionada}
                    setModalObservacionEstudianteVisible={hook.setModalObservacionEstudianteVisible}
                    setActividadesSeguimiento={ac.setActividadesSeguimiento}
                    actividadSeleccionada={ac.actividadSeleccionada}
                    setActividadSeleccionada={ac.setActividadSeleccionada}
                    handleVolverASubir={hook.handleVolverASubir}
                  />
              )}

              {hook.activeSection === 'designacion' && (
                <DesignacionDocente
                    tipoServicio={hook.tipoServicio}
                    obtenerIntegrantesDelGrupo={ga.obtenerIntegrantesDelGrupo}
                    setTipoServicio={hook.setTipoServicio}
                    solicitudEnviada={hook.solicitudEnviada}
                  setSolicitudEnviada={hook.setSolicitudEnviada}
                  setModalGrupoVisible={ga.setModalGrupoVisible}
                    facultadSeleccionada={hook.facultadSeleccionada}
                    programaSeleccionado={hook.programaSeleccionado}
                    nombreFacultad={hook.nombreFacultad}
                    nombrePrograma={hook.nombrePrograma}
                    docentes={hook.docentes}
                    correosGrupo={ga.correosGrupo}
                    setCorreosGrupo={ga.setCorreosGrupo}
                    trabajoId={hook.planSeleccionado?.id}
                    docenteSeleccionado={hook.docenteSeleccionado}
                    setDocenteSeleccionado={hook.setDocenteSeleccionado}
                    setNombreDocente={hook.setNombreDocente}
                    labores={hook.labores}
                    laborSeleccionada={hook.laborSeleccionada}
                    setLaborSeleccionada={hook.setLaborSeleccionada}
                    setNombreLaborSocial={hook.setNombreLaborSocial}
                    handleSolicitarAprobacion={hook.handleSolicitarAprobacion}
                    estadoPlan={hook.estadoPlan}
                    setLineaSeleccionada={hook.setLineaSeleccionada}
                    lineas={hook.lineas}
                    cartaAceptacionPdf={hook.cartaAceptacionPdf}
                    lineaSeleccionada={hook.lineaSeleccionada}
                  />
              )}
            </div>
          )}

        </Suspense>

        <NavegacionAlumno
          activeSection={hook.activeSection}
          setActiveSection={hook.setActiveSection}
          handleGoToNextSection={hook.handleGoToNextSection}
        />
      </main>

      <Suspense fallback={null}>
        <AlumnoModals hook={hook} ac={ac} ga={ga} />
      </Suspense>
    </>
  );
}

export default DashboardAlumno;
