import React, { lazy, Suspense, memo } from 'react';

const ModalObservacionConformidad = lazy(() =>
  import('../modals/ModalObservacionConformidad')
);

const GrupoDocenteModal = lazy(() =>
  import('../modals/GrupoDocenteModal')
);

const DocenteModals = memo(function DocenteModals({
  modalDeclinarVisible,
  observacionDeclinar,
  setObservacionDeclinar,
  cerrarModalDeclinar,
  handleDeclinar,
  accionModalDeclinar,
  handleRechazarConObservacion,
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
        onEnviar={
          accionModalDeclinar === 'rechazar'
            ? handleRechazarConObservacion
            : handleDeclinar
        }
      />
    </Suspense>
  );
});

export default DocenteModals;