import React, { lazy, Suspense } from 'react';

const ProyectoModal = lazy(() => import('../modals/ProyectoModal'));
const ObservacionEstudianteModal = lazy(() => import('../modals/ObservacionEstudianteModal'));
const GrupoModalAlumno = lazy(() => import('../modals/GrupoModalAlumno'));
const EvidenciaModal = lazy(() => import('../modals/EvidenciaModal'));
const ActividadModalAlumno = lazy(() => import('../modals/ActividadModalAlumno'));

function AlumnoModals({ hook, ac, ga }) {
  return (
    <Suspense fallback={null}>
      {/* Modal de actividad (conformidad) */}
      <ActividadModalAlumno
        visible={ac.modalActividadVisible}
        nuevaActividad={ac.nuevaActividad}
        setNuevaActividad={ac.setNuevaActividad}
        nuevaJustificacion={ac.nuevaJustificacion}
        setNuevaJustificacion={ac.setNuevaJustificacion}
        nuevaFecha={ac.nuevaFecha}
        setNuevaFecha={ac.setNuevaFecha}
        nuevaFechaFin={ac.nuevaFechaFin}
        setNuevaFechaFin={ac.setNuevaFechaFin}
        nuevosResultados={ac.nuevosResultados}
        setNuevosResultados={ac.setNuevosResultados}
        editIndex={ac.editIndex}
        setEditIndex={ac.setEditIndex}
        actividades={ac.actividades}
        setActividades={ac.setActividades}
        onClose={() => ac.setModalActividadVisible(false)}
      />

      {/* Modal de proyecto (conformidad) */}
      <ProyectoModal
        visible={hook.modalProyectoVisible}
        proyectoFile={hook.proyectoFile}
        pdfGenerado={hook.pdfGenerado}
        onFileChange={hook.handleProyectoFileChange}
        onClose={() => hook.setModalProyectoVisible(false)}
        onCancel={() => {
          hook.setProyectoFile(null);
          hook.cerrarModalProyecto();
        }}
      />

      {/* Modal de observación (seguimiento) */}
      <ObservacionEstudianteModal
        visible={hook.modalObservacionEstudianteVisible}
        observacionSeleccionada={hook.observacionSeleccionada}
        actividadSeleccionada={ac.actividadSeleccionada}
        onVolverASubir={hook.handleVolverASubir}
        onClose={() => hook.setModalObservacionEstudianteVisible(false)}
      />

      {/* Modal de grupo (designación) */}
      <GrupoModalAlumno
        visible={ga.modalGrupoVisible}
        solicitudEnviada={hook.solicitudEnviada}
        integrantesGrupoAlumno={ga.integrantesGrupoAlumno}
        correosGrupo={ga.correosGrupo}
        setCorreosGrupo={ga.setCorreosGrupo}
        loadingGrupo={ga.loadingGrupo}
        mensajeGrupo={ga.mensajeGrupo}
        onClose={() => ga.setModalGrupoVisible(false)}
      />

      {/* Modal de evidencia (global) */}
      <EvidenciaModal
        visible={hook.modalVisible}
        imagen={hook.imagenModal}
        onClose={() => hook.setModalVisible(false)}
      />
    </Suspense>
  );
}

export default AlumnoModals;
