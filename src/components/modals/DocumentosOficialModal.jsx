import React, { useEffect, useRef, useState } from 'react';
import { showTopWarningToast } from '../../hooks/alerts/useWelcomeToast';
import UploadFileIcon from '../../hooks/componentes/Icons/UploadFileIcon';

function DocumentosOficialModal({
  isOpen,
  documento = null,
  subiendoDocumento = false,
  editandoDocumento = false,
  procesando: procesandoProp = false,
  onClose,
  onGuardar
}) {
  const fileInputRef = useRef(null);

  const [titulo, setTitulo] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [estado, setEstado] = useState('VIGENTE');
  const [publicado, setPublicado] = useState(true);
  const [orden, setOrden] = useState('0');

  const esEdicion = !!documento;
  const procesando =
    procesandoProp ||
    subiendoDocumento ||
    editandoDocumento;

  useEffect(() => {
    if (!isOpen) return;

    if (documento) {
      setTitulo(documento.titulo || '');
      setArchivo(null);
      setEstado(documento.estado || 'VIGENTE');
      setPublicado(
        documento.publicado === true ||
        documento.publicado === 1 ||
        documento.publicado === '1' ||
        documento.publicado === 'true'
      );
      setOrden(String(documento.orden ?? 0));
    } else {
      setTitulo('');
      setArchivo(null);
      setEstado('VIGENTE');
      setPublicado(true);
      setOrden('0');
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [isOpen, documento]);

  if (!isOpen) return null;

  const limpiarFormulario = () => {
    setTitulo('');
    setArchivo(null);
    setEstado('VIGENTE');
    setPublicado(true);
    setOrden('0');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validarArchivo = (file) => {
    if (!file) return false;

    const nombrePdf = file.name
      .toLowerCase()
      .endsWith('.pdf');

    const tipoPdf =
      file.type === 'application/pdf';

    if (!nombrePdf && !tipoPdf) {
      showTopWarningToast(
        'Archivo no válido',
        'Solo se permiten archivos PDF.'
      );
      return false;
    }

    const limite = 10 * 1024 * 1024;

    if (file.size > limite) {
      showTopWarningToast(
        'Archivo demasiado grande',
        'El PDF no puede superar los 10 MB.'
      );
      return false;
    }

    return true;
  };

  const seleccionarArchivo = (file) => {
    if (!file) return;

    if (!validarArchivo(file)) {
      setArchivo(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      return;
    }

    setArchivo(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();

    if (procesando) return;

    const file = e.dataTransfer.files?.[0];

    if (file) {
      seleccionarArchivo(file);
    }
  };

  const handleClose = () => {
    if (procesando) return;

    limpiarFormulario();
    onClose();
  };

  const handleGuardar = async () => {
    if (esEdicion) {
      const publicadoOriginal =
        documento.publicado === true ||
        documento.publicado === 1 ||
        documento.publicado === '1' ||
        documento.publicado === 'true';
      const sinCambios =
        titulo.trim() === (documento.titulo || '').trim() &&
        estado === (documento.estado || 'VIGENTE') &&
        publicado === publicadoOriginal &&
        String(orden) === String(documento.orden ?? 0) &&
        !archivo;

      if (sinCambios) {
        showTopWarningToast(
          'Sin cambios',
          'No se realizó ningún cambio en el documento.'
        );
        return;
      }
    }

    if (!titulo.trim()) {
      showTopWarningToast(
        'Faltan campos',
        'Ingresa el título del documento.'
      );
      return;
    }

    if (!esEdicion && !archivo) {
      showTopWarningToast(
        'Falta el documento',
        'Selecciona un archivo PDF.'
      );
      return;
    }

    const ordenNumero = Number(orden);

    if (
      !Number.isInteger(ordenNumero) ||
      ordenNumero < 0
    ) {
      showTopWarningToast(
        'Orden no válido',
        'El orden debe ser un número entero mayor o igual a 0.'
      );
      return;
    }

    const ok = await onGuardar({
      id_documento: documento?.id_documento,
      titulo: titulo.trim(),
      archivo,
      estado,
      publicado,
      orden: ordenNumero
    });

    if (ok) {
      limpiarFormulario();
    }
  };

  const formatearTamano = (bytes) => {
    if (!bytes) return '';

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const nombreArchivo =
    archivo?.name ||
    documento?.nombre_original ||
    null;

  return (
    <div className="programas-modal show">
      <div className="programas-modal-content documentos-modal-content">

        <h3>
          {esEdicion
            ? 'Editar Documento Oficial'
            : 'Nuevo Documento Oficial'}
        </h3>

        <div className="documentos-modal-field">
          <label>
            Título del documento
          </label>

          <input
            type="text"
            className="programas-modal-input"
            placeholder="Ej. Reglamento Oficial del Servicio Social"
            value={titulo}
            onChange={(e) =>
              setTitulo(e.target.value)
            }
            disabled={procesando}
          />
        </div>

        <div className="documentos-modal-field">
          <label>
            Archivo PDF
          </label>

          <label
            className={`custom-file-upload ${
              nombreArchivo ? 'has-file' : ''
            }`}
            htmlFor="documento-pdf"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <div className="custom-file-upload-icon">
              <UploadFileIcon
                size={64}
                color={
                  nombreArchivo
                    ? '#2e9e7f'
                    : '#4b5563'
                }
              />
            </div>

            <div className="custom-file-upload-text">
              {nombreArchivo ? (
                <>
                  <span className="custom-file-upload-name">
                    {nombreArchivo}
                  </span>

                  {archivo ? (
                    <>
                      <small>
                        {formatearTamano(archivo.size)}
                      </small>

                      <small>
                        Haz clic para cambiar el archivo
                      </small>
                    </>
                  ) : (
                    <small>
                      Haz clic para reemplazar el PDF
                    </small>
                  )}
                </>
              ) : (
                <>
                  <span>
                    Clic para subir PDF
                  </span>

                  <small>
                    Máximo 10 MB
                  </small>
                </>
              )}
            </div>

            <input
              ref={fileInputRef}
              id="documento-pdf"
              type="file"
              accept="application/pdf,.pdf"
              onChange={(e) =>
                seleccionarArchivo(
                  e.target.files?.[0]
                )
              }
              disabled={procesando}
            />
          </label>

          {esEdicion && !archivo && (
            <span className="documentos-modal-help">
              El PDF actual se conservará si no seleccionas uno nuevo.
            </span>
          )}
        </div>

        <div className="documentos-modal-row">

          <div className="documentos-modal-field">
            <label>
              Estado
            </label>

            <select
              className="programas-modal-select"
              value={estado}
              onChange={(e) =>
                setEstado(e.target.value)
              }
              disabled={procesando}
            >
              <option value="VIGENTE">
                Vigente
              </option>

              <option value="NO_VIGENTE">
                No vigente
              </option>
            </select>
          </div>

          <div className="documentos-modal-field">
            <label>
              Publicación
            </label>

            <select
              className="programas-modal-select"
              value={
                publicado ? 'true' : 'false'
              }
              onChange={(e) =>
                setPublicado(
                  e.target.value === 'true'
                )
              }
              disabled={procesando}
            >
              <option value="true">
                Publicado
              </option>

              <option value="false">
                Oculto
              </option>
            </select>
          </div>

        </div>

        <div className="documentos-modal-field">
          <label>
            Orden de visualización
          </label>

          <input
            type="number"
            min="0"
            step="1"
            className="programas-modal-input documentos-modal-orden"
            value={orden}
            onChange={(e) =>
              setOrden(e.target.value)
            }
            disabled={procesando}
          />

          <span className="documentos-modal-help">
            Los valores menores aparecerán primero.
          </span>
        </div>

        <div className="programas-modal-actions">

          <button
            type="button"
            className="grupo-alumno-btn grupo-alumno-btn-cancel"
            onClick={handleClose}
            disabled={procesando}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="grupo-alumno-btn grupo-alumno-btn-save"
            onClick={handleGuardar}
            disabled={procesando}
          >
            {procesando
              ? esEdicion
                ? 'Guardando...'
                : 'Publicando...'
              : esEdicion
                ? 'Guardar cambios'
                : 'Publicar'}
          </button>

        </div>

      </div>
    </div>
  );
}

export default DocumentosOficialModal;