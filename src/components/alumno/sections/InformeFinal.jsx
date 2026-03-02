import { useRef, useState, useEffect } from "react";
import axios from "axios";
import {
  alertSuccess,
  toastError,
  alertError,
  alertWarning,
  alertconfirmacion,
} from "../../../hooks/alerts/alertas";
import { showTopSuccessToast } from "../../../hooks/alerts/useWelcomeToast";
import { useUser } from "../../../UserContext";
import "./InformeFinal.css";
import "../DashboardAlumno.css";
import UploadIcon from "../../../hooks/componentes/Icons/UploadIcon";
import DownloadIcon from "../../../hooks/componentes/Icons/DownloadIcon";
import PdfIcon from "../../../hooks/componentes/PdfIcon";
import CheckCircleBig from "../../../hooks/componentes/Icons/CheckCircleBig";
import InfoIcon from "../../../hooks/componentes/Icons/InfoIcon";
import { VerBotonInline } from "../../../hooks/componentes/VerBoton";
import Spinner from 'components/ui/Spinner';

export default function InformeFinal({
  trabajoId,
  planSeleccionado,
  setPlanSeleccionado,
}) {
  const fileRef = useRef(null);
  const { user } = useUser();
  const token = user?.token;
  const estadoInforme = planSeleccionado?.estado_informe_final || "";
  const yaEnviado = !!planSeleccionado?.informe_final_pdf;
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const estaAprobado = estadoInforme === "aprobado";
  const tieneCertificado = !!planSeleccionado?.certificado_final;
  const estadoCertificado = planSeleccionado?.certificado_final ? 'tramitado' : 'pendiente';
  const estaRechazado = estadoInforme === "rechazado";
  const estaPendienteEnviado = estadoInforme === "pendiente" && yaEnviado;
  const bloqueado = yaEnviado && !estaRechazado;
  const [certificadosGrupo, setCertificadosGrupo] = useState([]);
  const [nombresMiembros, setNombresMiembros] = useState([]);
  const esGrupal = planSeleccionado?.tipo_servicio_social === "grupal";
  const pickFile = () => fileRef.current?.click();
  const onChange = (e) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const onDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) setFile(f);
  };

  const clearFile = () => {
    setFile(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const formatBytes = (bytes) => {
    if (!bytes && bytes !== 0) return "";
    if (bytes === 0) return "0 B";
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 2)} ${sizes[i]}`;
  };

  const resolveTrabajoId = () => {
    if (trabajoId) return trabajoId;

    const candidates = ["planSeleccionado", "planSeleccionadoId", "trabajoId"];
    for (const key of candidates) {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      if (/^\d+$/.test(raw)) return raw;
      try {
        const parsed = JSON.parse(raw);
        if (parsed?.id) return parsed.id;
        if (parsed?.planSeleccionado?.id) return parsed.planSeleccionado.id;
      } catch {
      }
    }

    return null;
  };

  const validatePdf = async (f) => {
    if (!f) return { ok: false, msg: "Selecciona un archivo." };
    if (f.type !== "application/pdf")
      return { ok: false, msg: "Solo se permiten archivos PDF." };
    const maxBytes = 10 * 1024 * 1024; 
    if (f.size > maxBytes)
      return {
        ok: false,
        msg: "El archivo supera el máximo permitido (10MB).",
      };
    return { ok: true };
  };

  const handleEnviarDocumento = async () => {
    const check = await validatePdf(file);
    if (!check.ok) {
      return alertWarning("Archivo inválido", check.msg, {
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true,
      });
    }

    const confirmacion = await alertconfirmacion({
      title: '¿Enviar informe final?',
      text: '¿Deseas enviar el informe final para revisión? Una vez enviado no podrás modificarlo hasta que sea revisado.',
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
      icon: 'question',
      confirmButtonColor: '#2E9E7F',
    });

    if (!confirmacion || !confirmacion.isConfirmed) return;

    const trabajo_id = resolveTrabajoId();
    if (!trabajo_id) {
      return alertError(
        "Falta trabajo_id",
        "No se encontró el ID del trabajo social. Pásalo como prop (trabajoId) desde el dashboard.",
        { timer: 2000, showConfirmButton: false, timerProgressBar: true }
      );
    }

    if (!token) {
      return alertError(
        "Sesión inválida",
        "No se encontró el token. Vuelve a iniciar sesión.",
        { timer: 2000, showConfirmButton: false, timerProgressBar: true }
      );
    }

    setUploading(true);

    try {
      const form = new FormData();
      form.append("archivo", file, file.name || "informe_final.pdf");
      form.append("trabajo_id", trabajo_id);

      await axios.post("/api/trabajo-social/guardar-informe-final", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alertSuccess("Enviado", "Tu informe fue enviado exitosamente para revisión.");
      setPlanSeleccionado?.((prev) => ({
        ...prev,
        estado_informe_final: "pendiente",
        informe_final_pdf: true,
      }));
      clearFile();
    } catch (err) {
      console.error(err);
      toastError("No se pudo enviar el documento. Intenta nuevamente.");
    } finally {
      setUploading(false);
    }
  };
useEffect(() => {
  const fetchCertificadosGrupo = async () => {
    if (!estaAprobado || !esGrupal || !planSeleccionado?.id) return;

    try {
      const { data } = await axios.get(
        `/api/certificados-final/grupo/${planSeleccionado.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCertificadosGrupo(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al obtener certificados del grupo:", error);
      setCertificadosGrupo([]);
    }
  };

  fetchCertificadosGrupo();
}, [estaAprobado, esGrupal, planSeleccionado?.id, token]);
useEffect(() => {
  const fetchNombres = async () => {
    if (!estaAprobado || !esGrupal || certificadosGrupo.length === 0) return;

    const correos = certificadosGrupo.map(
      (c) => `${String(c.codigo_universitario).trim()}@udh.edu.pe`
    );

    try {
      const { data } = await axios.post("/api/estudiantes/grupo-nombres", {
        correos,
      });
      setNombresMiembros(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al obtener nombres del grupo:", error);
      setNombresMiembros([]);
    }
  };

  fetchNombres();
}, [estaAprobado, esGrupal, certificadosGrupo]);

  return (
    <>
      <div className="seguimiento-container">
        <div className="if-layout">
          <main className="if-left">
            <section className="if-card">
              <header className="if-card-header">
                <div className="if-title-row">
                  <span className="if-icon" aria-hidden="true">
                    <DownloadIcon className="icon-inner" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="if-title">Paso 1: Descargar Plantilla</h2>
                    <p className="if-subtitle">
                      Descarga el formato oficial para completar tu documentación
                    </p>
                  </div>
                </div>
                <div className="if-divider" aria-hidden="true" />
              </header>

              <div className="if-card-body">
                <div className="if-box">
                  <p className="if-box-title">La plantilla incluye:</p>
                  <ul className="if-checklist">
                    <li>
                      <CheckCircleBig className="if-check-icon" />
                      Información personal
                    </li>
                    <li>
                      <CheckCircleBig className="if-check-icon" />
                      Guía de llenado
                    </li>
                    <li>
                      <CheckCircleBig className="if-check-icon" />
                      Secciones estructuradas
                    </li>
                    <li>
                      <CheckCircleBig className="if-check-icon" />
                      Formato institucional
                    </li>
                  </ul>
                </div>

                <a
                  className="if-btn-primary"
                  href="/plantillas/SERVICIO SOCIAL - UNIVERSIDAD DE HUANUCO.pdf"
                  download
                  onClick={() => showTopSuccessToast('Descarga iniciada', 'Se descargó correctamente')}
                >
                  <DownloadIcon className="if-btn-icon" aria-hidden="true" />
                  Descargar Plantilla PDF
                </a>
              </div>
            </section>

            {estaAprobado ? (
              <section className="if-card">
                <header className="if-card-header">
                  <div className="if-title-row">
                    <span className="if-icon if-icon-green" aria-hidden="true">
                      <CheckCircleBig className="icon-inner" aria-hidden="true" />
                    </span>
                    <div>
                      <h2 className="if-title">Certificados</h2>
                      <p className="if-subtitle">
                      {tieneCertificado
                        ? "Tu certificado ya está disponible."
                        : "Tu informe fue aprobado. El certificado está en proceso de emisión."}
                    </p>
                    </div>
                  </div>
                  <div className="if-divider" aria-hidden="true" />
                </header>

                <div className="if-card-body">
                  <div className="if-doc-item">
                    <div className="documento-info-nu">
                      <PdfIcon/>
                      <span className="if-doc-name">
                        CERTIFICADO FINAL SERVICIO SOCIAL
                      </span>
                    </div>

                    <div className="if-doc-right">
                      {planSeleccionado?.certificado_final ? (
                        <VerBotonInline
                          onClick={() =>
                            window.open(
                              `${process.env.REACT_APP_API_URL}/uploads/certificados_finales/${planSeleccionado.certificado_final}`,
                              "_blank"
                            )
                          }
                        />
                      ) : (
                        <span className="if-doc-empty">No disponible</span>
                      )}

                      <span className={estadoCertificado === 'tramitado' ? 'estado-tramitado' : 'btn-estado-pendiente'}>
                        {estadoCertificado === 'tramitado' ? 'Tramitado' : 'Pendiente'}
                      </span>
                    </div>
                  </div>

                  {esGrupal && certificadosGrupo.length > 0 && (
                    <section className="if-card" style={{ marginTop: 16 }}>
                      <header className="if-card-header">
                        <div className="if-title-row">
                          <span className="if-icon if-icon-green" aria-hidden="true">
                            <CheckCircleBig className="icon-inner" aria-hidden="true" />
                          </span>
                          <div>
                            <h2 className="if-title">Certificados del grupo</h2>
                            <p className="if-subtitle">
                              Descarga los certificados de los integrantes del equipo.
                            </p>
                          </div>
                        </div>
                        <div className="if-divider" aria-hidden="true" />
                      </header>

                      <div className="if-card-body">
                        {certificadosGrupo.map((cert, index) => {
                          const correo = `${String(cert.codigo_universitario).trim().toLowerCase()}@udh.edu.pe`;
                          const miembro = nombresMiembros.find(
                            (n) => String(n.correo || "").trim().toLowerCase() === correo
                          );

                          const nombreMostrado =
                            miembro?.nombre && miembro.nombre !== "NO ENCONTRADO"
                              ? miembro.nombre
                              : "NOMBRE NO DISPONIBLE";

                          return (
                            <div key={index} className="if-doc-item">
                              <div className="documento-info-nu">
                                <PdfIcon />
                                <span className="if-doc-name">CERTIFICADO - {nombreMostrado}</span>
                              </div>

                              <div className="if-doc-right">
                                <VerBotonInline
                                  onClick={() =>
                                    window.open(
                                      `${process.env.REACT_APP_API_URL}/uploads/certificados_finales_miembros/${cert.nombre_archivo_pdf}`,
                                      "_blank"
                                    )
                                  }
                                />
                                <span className={cert.nombre_archivo_pdf ? 'estado-tramitado' : 'btn-estado-pendiente'}>
                                  {cert.nombre_archivo_pdf ? 'Tramitado' : 'Pendiente'}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  )}
                </div>
              </section>
            ) : estaPendienteEnviado ? (
  <section className="if-card">
    <header className="if-card-header">
      <div className="if-title-row" style={{ justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span className="if-icon if-icon-green" aria-hidden="true">
            <UploadIcon className="icon-inner" aria-hidden="true" strokeWidth={2} />
          </span>
          <div>
            <h2 className="if-title">Paso 2: Subir Documento</h2>
            <p className="if-subtitle">
              Tu informe ya fue enviado y está en revisión.
            </p>
          </div>
        </div>

        <span className="if-review-chip">Pendiente</span>
      </div>

      <div className="if-divider" aria-hidden="true" />
    </header>

    <div className="if-card-body">
      <div className="if-dropzone is-disabled" style={{ cursor: "not-allowed" }}>
        <div className="if-dropzone-empty">
          <CheckCircleBig className="if-upload-icon " aria-hidden="true" />
          <p className="if-dropzone-title">Documento enviado</p>
          <p className="if-dropzone-or">Tu supervisor está revisando el informe</p>
          <p className="if-dropzone-sub">Cuando sea aprobado, podrás descargar tus certificados.</p>
        </div>
      </div>

      <button className="if-btn-primary-green" type="button" disabled>
        Su documento ya fue enviado
      </button>
    </div>
  </section>
) : (
              <section className="if-card">
                <header className="if-card-header">
                  <div className="if-title-row">
                    <span className="if-icon if-icon-green" aria-hidden="true">
                      <UploadIcon
                        className="icon-inner"
                        aria-hidden="true"
                        strokeWidth={2}
                      />
                    </span>
                    <div>
                      <h2 className="if-title">Paso 2: Subir Documento</h2>
                      <p className="if-subtitle">
                        Carga el PDF completado para revisión y aprobación
                      </p>
                    </div>
                  </div>
                  <div className="if-divider" aria-hidden="true" />
                </header>

                <div className="if-card-body">
                  <div
                    className={`if-dropzone ${bloqueado ? "is-disabled" : ""}`}
                    onClick={() => !bloqueado && pickFile()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => !bloqueado && onDrop(e)}
                    role="button"
                    tabIndex={0}
                  >
                    <input
                      ref={fileRef}
                      type="file"
                      accept="application/pdf"
                      onChange={onChange}
                      hidden
                      disabled={bloqueado}
                    />

                    {file ? (
                      <div className="if-file-selected" onClick={(e)=>e.stopPropagation()}>
                        <div className="if-file-meta">
                          <PdfIcon className="if-file-icon" aria-hidden="true" />
                          <div className="if-file-info">
                            <p className="if-file-name" title={file.name}>{file.name}</p>
                            <p className="if-file-meta-small">{formatBytes(file.size)} • PDF</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="if-btn-secondary if-remove-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            clearFile();
                          }}
                          disabled={uploading}
                        >
                          Quitar
                        </button>
                      </div>
                    ) : (
                    <div className="if-dropzone-empty">
                      <UploadIcon className="if-upload-icon" aria-hidden="true" />

                      <p className="if-dropzone-title">
                        Arrastra tu PDF aquí
                      </p>

                      <p className="if-dropzone-or">
                        o haz clic para seleccionar un archivo
                      </p>

                      <p className="if-dropzone-sub">
                        Solo archivos PDF • Tamaño máximo: 10MB
                      </p>
                    </div>
                    )}
                  </div>

                  <button
                    className="if-btn-primary-green"
                    type="button"
                    onClick={handleEnviarDocumento}
                    disabled={!file || uploading || bloqueado}
                  >
                    {uploading ? (
                      <>
                        <Spinner size={18} />
                        <span style={{ marginLeft: 8 }}>Enviando...</span>
                      </>
                    ) : (
                      <>
                        <UploadIcon className="if-btn-icon" aria-hidden="true" strokeWidth={2} />
                        Enviar Documento
                      </>
                    )}
                  </button>
                </div>
              </section>
            )}
          </main>

          <aside className="if-right">
            <section className="if-card">
              <header className="if-card-header">
                <h3 className="if-side-title">Instrucciones</h3>
              </header>

              <div className="if-card-body">
                <ol className="if-steps">
                  <li>
                    <span>1</span>Descarga la plantilla
                  </li>

                  <li>
                    <span>2</span>
                    {estaAprobado ? "Descarga tus certificados" : "Completa el PDF"}
                  </li>

                  <li>
                    <span>3</span>Verifica la información
                  </li>

                  <li>
                    <span>4</span>
                    {estaAprobado ? "Archivo aprobado" : "Sube el documento"}
                  </li>

                  <li>
                    <span>5</span>Espera confirmación
                  </li>
                </ol>
              </div>
            </section>

            <section className="if-card if-note">
              <header className="if-note-header">
                <InfoIcon className="if-note-icon" aria-hidden="true" />
                <h3 className="if-note-title">Nota Importante</h3>
              </header>
              <p className="if-note-text">
                El documento debe estar correctamente llenado, firmado y con información
                actualizada antes de enviarlo.
              </p>
            </section>

            <section className="if-card">
              <header className="if-card-header">
                <h3 className="if-side-title">Requisitos del Documento</h3>
              </header>

              <div className="if-card-body">
                <ul className="if-req">
                  <li>Formato PDF</li>
                  <li>Tamaño máximo 10 MB</li>
                  <li>Campos completos</li>
                  <li>Firma digital o escaneada</li>
                </ul>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </>
  );
}
