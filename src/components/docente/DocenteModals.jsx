import React, { lazy, Suspense, memo } from 'react';


const EditarEstadoModal = lazy(() => import('../modals/EditarEstadoModal'));
const ModalDeclinar = lazy(() => import('../modals/ModalDeclinar'));
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

      <ModalDeclinar
        visible={modalDeclinarVisible}
        observacion={observacionDeclinar}
        setObservacion={setObservacionDeclinar}
        onCancel={cerrarModalDeclinar}
        onSubmit={handleDeclinar}
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
