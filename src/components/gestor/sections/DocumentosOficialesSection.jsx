import React, { useEffect, useState } from 'react';
import VerBoton from '../../../hooks/componentes/VerBoton';
import EditIcon from '../../../hooks/componentes/Icons/EditIcon';
import DeleteIcon from '../../../hooks/componentes/Icons/DeleteIcon';
import PageSkeleton from '../../loaders/PageSkeleton';
import TablePagination from '../../ui/TablePagination';
import DocumentosOficialModal from '../../modals/DocumentosOficialModal';
import { showTopWarningToast } from '../../../hooks/alerts/useWelcomeToast';

function DocumentosOficialesSection({
  documentos = [],
  cargandoDocumentos = false,
  subiendoDocumento = false,
  editandoDocumento = false,
  eliminandoDocumento = false,
  subirDocumento,
  editarDocumento,
  eliminarDocumento
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [documentoEditando, setDocumentoEditando] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 30;

  const totalPages = Math.max(1, Math.ceil(documentos.length / ITEMS_PER_PAGE));
  const inicio = (currentPage - 1) * ITEMS_PER_PAGE;
  const documentosPagina = documentos.slice(inicio, inicio + ITEMS_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const formatearFecha = (fecha) => {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const verDocumento = (rutaArchivo) => {
    if (!rutaArchivo) return;
    window.open(
      `${process.env.REACT_APP_API_URL}${rutaArchivo}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const abrirModalNuevo = () => {
    setDocumentoEditando(null);
    setModalVisible(true);
  };

  const cerrarModal = () => {
    if (subiendoDocumento || editandoDocumento) return;
    setModalVisible(false);
    setDocumentoEditando(null);
  };

  const handleEditar = (documento) => {
    if (!editarDocumento) {
      showTopWarningToast(
        'Función no disponible',
        'La edición del documento aún no está habilitada.'
      );
      return;
    }

    setDocumentoEditando(documento);
    setModalVisible(true);
  };

  const guardarDocumento = async (datos) => {
    if (documentoEditando) {
      if (!editarDocumento) return false;

      const ok = await editarDocumento(datos);
      if (!ok) return false;

      setModalVisible(false);
      setDocumentoEditando(null);
      return true;
    }

    if (!subirDocumento) return false;

    const ok = await subirDocumento(datos);
    if (!ok) return false;

    setModalVisible(false);
    setDocumentoEditando(null);
    setCurrentPage(1);
    return true;
  };

const handleEliminar = async (documento) => {
  if (eliminandoDocumento) return;

  if (documento.publicado) {
    showTopWarningToast(
      'Documento publicado',
      'Primero debes ocultar el documento antes de eliminarlo.'
    );
    return;
  }

  if (!eliminarDocumento) {
    showTopWarningToast(
      'Función no disponible',
      'La eliminación del documento aún no está habilitada.'
    );
    return;
  }

  await eliminarDocumento(documento);
};

  return (
    <div className="docentes-container">
      <div className="docentes-card">
        <div className="docentes-header">
          <div className="docentes-header-left">
            <h2>Documentos Oficiales</h2>
            <button
              type="button"
              className="docentes-btn-agregar"
              onClick={abrirModalNuevo}
            >
              Agregar
            </button>
          </div>
        </div>

        <div className="docentes-table-wrapper">
          {cargandoDocumentos ? (
            <PageSkeleton topBlocks={['sm']} xlRows={3} showChip lastXL />
          ) : (
            <>
              <table className="docentes-table">
                <thead className="docentes-table-thead">
                  <tr>
                    <th>Nº</th>
                    <th>Título</th>
                    <th>Archivo</th>
                    <th>Fecha de carga</th>
                    <th>Estado</th>
                    <th>Publicación</th>
                    <th>Orden</th>
                    <th>Documento</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {documentosPagina.length > 0 ? (
                    documentosPagina.map((doc, index) => (
                      <tr key={doc.id_documento}>
                        <td>{inicio + index + 1}</td>
                        <td>{(doc.titulo || '').toUpperCase()}</td>
                        <td>{doc.nombre_original || '-'}</td>
                        <td>{formatearFecha(doc.fecha_carga)}</td>

                        <td style={{ textAlign: 'center' }}>
                          <span
                            className={`badge-estado ${
                              doc.estado === 'VIGENTE'
                                ? 'aprobado'
                                : 'rechazado'
                            }`}
                          >
                            {doc.estado === 'VIGENTE'
                              ? 'VIGENTE'
                              : 'NO VIGENTE'}
                          </span>
                        </td>

                        <td style={{ textAlign: 'center' }}>
                          <span
                            className={`badge-estado ${
                              doc.publicado
                                ? 'aprobado'
                                : 'pendiente'
                            }`}
                          >
                            {doc.publicado ? 'PUBLICADO' : 'OCULTO'}
                          </span>
                        </td>

                        <td style={{ textAlign: 'center' }}>{doc.orden}</td>

                        <td style={{ textAlign: 'center' }}>
                          <VerBoton
                            label="Ver"
                            onClick={() => verDocumento(doc.ruta_archivo)}
                          />
                        </td>

                        <td>
                          <div className="documentos-acciones">
                            <button
                              type="button"
                              className="facultades-btn editar"
                              onClick={() => handleEditar(doc)}
                              title="Editar documento"
                              aria-label={`Editar ${doc.titulo}`}
                            >
                              <EditIcon />
                            </button>

                            <button
                            type="button"
                            className={`facultades-btn eliminar ${
                                doc.publicado || eliminandoDocumento
                                ? 'documentos-btn-disabled'
                                : ''
                            }`}
                            onClick={() => handleEliminar(doc)}
                            disabled={eliminandoDocumento}
                            title={
                                eliminandoDocumento
                                ? 'Eliminando documento...'
                                : doc.publicado
                                    ? 'Primero debes ocultar el documento'
                                    : 'Eliminar documento'
                            }
                            aria-label={`Eliminar ${doc.titulo}`}
                            >
                            <DeleteIcon />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="9"
                        style={{ textAlign: 'center', padding: '1rem' }}
                      >
                        No hay documentos oficiales registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <TablePagination
                totalItems={documentos.length}
                itemsPerPage={ITEMS_PER_PAGE}
                currentPage={currentPage}
                onPageChange={(page) => {
                  if (page >= 1 && page <= totalPages) {
                    setCurrentPage(page);
                  }
                }}
              />
            </>
          )}
        </div>
      </div>

      <DocumentosOficialModal
        isOpen={modalVisible}
        documento={documentoEditando}
        procesando={documentoEditando ? editandoDocumento : subiendoDocumento}
        onClose={cerrarModal}
        onGuardar={guardarDocumento}
      />
    </div>
  );
}

export default React.memo(DocumentosOficialesSection);