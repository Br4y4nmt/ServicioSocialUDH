import React, { lazy, Suspense, memo } from 'react';


const EditarEstadoModal = lazy(() => import('../modals/EditarEstadoModal'));
const ModalObservacionConformidad = lazy(() => import('../modals/ModalObservacionConformidad'));
const GrupoDocenteModal = lazy(() => import('../modals/GrupoDocenteModal'));
const DocenteModals = memo(function DocenteModals({

  modalVisible,
  nuevoEstado,
  setNuevoEstado,
  handleSave,
  handleCloseModal,
  modalDeclinarVisible,
  observacionDeclinar,
  setObservacionDeclinar,
  cerrarModalDeclinar,
  handleDeclinar,
  modalGrupoVisible,
  integrantesGrupo,
  cerrarModalGrupo
}) {
  return (
    <Suspense fallback={null}>
      <GrupoDocenteModal
        visible={modalGrupoVisible}
        integrantesGrupo={integrantesGrupo}
        onClose={cerrarModalGrupo}
      />

      <ModalObservacionConformidad
        visible={modalDeclinarVisible}
        observacion={observacionDeclinar}
        onObservacionChange={setObservacionDeclinar}
        onCancelar={cerrarModalDeclinar}
        onEnviar={handleDeclinar}
      />

      <EditarEstadoModal
        visible={modalVisible}
        nuevoEstado={nuevoEstado}
        onChangeEstado={setNuevoEstado}
        onSave={handleSave}
        onClose={handleCloseModal}
      />
    </Suspense>
  );
});

export default DocenteModals;
