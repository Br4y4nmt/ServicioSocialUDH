import Swal from "sweetalert2";

export const mostrarRecomendacionEvidencia = () => {
  return Swal.fire({
    icon: "info",
    title: "Recomendación para la evidencia",
    text: "La evidencia fotográfica debe mostrar claramente al estudiante realizando la actividad correspondiente. Asegúrate de que la imagen sea nítida y representativa de la tarea realizada.",
    confirmButtonText: "Entendido",
  });
};

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2200,
  timerProgressBar: true,
  background: "#ffffff",
  color: "#4b5563",
});

export const toastSuccess = (title, opts = {}) =>
  Toast.fire({
    icon: "success",
    title: title || "Operación exitosa",
    iconColor: "#22c55e",
    ...opts,
  });

export const toastError = (title, opts = {}) =>
  Toast.fire({
    icon: "error",
    title: title || "Ocurrió un error",
    iconColor: "#dc2626",
    ...opts,
  });

/**
 * Alertas normales (modal)
 */
export const alertError = (title, text, opts = {}) =>
  Swal.fire({
    icon: "error",
    title: title || "Error",
    text: text || "Ocurrió un error",
    confirmButtonColor: "#dc2626",
    ...opts,
  });

export const alertWarning = (title, text, opts = {}) =>
  Swal.fire({
    icon: "warning",
    title: title || "Atención",
    text: text || "",
    confirmButtonColor: "#f59e0b",
    ...opts,
  });

export const alertSuccess = (title, text, opts = {}) =>
  Swal.fire({
    icon: "success",
    title: title || "Listo",
    text: text || "",
    confirmButtonColor: "#22c55e",
    ...opts,
  });

/**
 * Si luego quieres confirmaciones reutilizables:
 */
export const confirmDialog = async ({
  title = "¿Estás seguro?",
  text = "Esta acción no se puede deshacer.",
  confirmButtonText = "Sí, continuar",
  cancelButtonText = "Cancelar",
  icon = "question",
} = {}) => {
  const result = await Swal.fire({
    icon,
    title,
    text,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    confirmButtonColor: "#2563eb",
    cancelButtonColor: "#6b7280",
  });
  return result.isConfirmed;
};

export const mostrarAlertaDemasiadoPronto = (fechaPermitida) => {
  return Swal.fire({
    icon: "warning",
    title: "Demasiado pronto",
    text: `Solo puedes subir la evidencia desde 5 días antes de la fecha permitida (${fechaPermitida}).`,
    confirmButtonText: "Entendido",
  });
};
export const mostrarAlertaRolNoValido = () => {
  return Swal.fire({
    icon: 'error',
    title: 'Rol no válido',
    confirmButtonColor: '#d33',
    timer: 2500,
  });
};

export const mostrarAlertaUsuarioNoRegistrado = (mensaje) => {
  return Swal.fire({
    icon: 'error',
    title: 'Usuario no registrado',
    text: mensaje || 'Tu cuenta no está registrada.',
    confirmButtonColor: '#d33',
    confirmButtonText: 'Cerrar',
    allowOutsideClick: false,
    allowEscapeKey: false
  });
};

export const mostrarAlertaFechaVencida = (fechaPermitida) => {
  return Swal.fire({
    icon: "error",
    title: "Fecha vencida",
    text: `La fecha máxima para subir la evidencia era hasta 10 días después de la fecha permitida (${fechaPermitida}).`,
    confirmButtonText: "Aceptar",
  });
};
/**
 * Alerta: falta seleccionar archivo de evidencia
 */
export const mostrarAlertaFaltaEvidencia = () => {
  return Swal.fire({
    icon: "warning",
    title: "Falta evidencia",
    text: "Selecciona una evidencia antes de confirmar.",
    confirmButtonText: "Aceptar",
  });
};
/**
 * Alerta: evidencia subida con éxito
 */
export const mostrarAlertaEvidenciaSubida = () => {
  return Swal.fire({
    icon: "success",
    title: "Evidencia subida",
    text: "Actividad marcada como pendiente de revisión.",
    timer: 1500,
    showConfirmButton: false,
  });
};
/**
 * Alerta: error al subir evidencia
 */
export const mostrarAlertaErrorEvidencia = () => {
  return Swal.fire({
    icon: "error",
    title: "Error",
    text: "No se pudo subir la evidencia.",
    confirmButtonText: "Aceptar",
  });
};
/**
 * Confirmación antes de aprobar una actividad
 */
export const confirmarAprobacionActividad = () => {
  return Swal.fire({
    title: "¿Estás seguro?",
    text: "Una vez aprobado, no podrás modificar esta actividad.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, aprobar",
    cancelButtonText: "Cancelar",
  });
};
/**
 * Error genérico al aprobar actividad
 */
export const mostrarErrorAprobacionActividad = () => {
  return Swal.fire("Error", "No se pudo aprobar la actividad.", "error");
};
/**
 * Alerta: observación registrada exitosamente
 */
export const mostrarAlertaObservacionRegistrada = () => {
  return Swal.fire(
    "Observado",
    "La observación fue registrada correctamente.",
    "success"
  );
};

/**
 * Alerta: error al guardar observación
 */
export const mostrarErrorGuardarObservacion = () => {
  return Swal.fire(
    "Error",
    "No se pudo guardar la observación.",
    "error"
  );
};
/**
 * Confirmación para aceptar solicitud de término
 */
export const confirmarAceptarSolicitudTermino = () => {
  return Swal.fire({
    title: "¿Estás seguro?",
    text: "¿Deseas aceptar esta solicitud de término? Esta acción no se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, aceptar",
    cancelButtonText: "Cancelar",
  });
};
/**
 * Confirmación para rechazar solicitud de término
 */
export const confirmarRechazoSolicitudTermino = () => {
  return Swal.fire({
    title: "¿Estás seguro?",
    text: "¿Deseas rechazar esta solicitud de término? Esta acción no se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, rechazar",
    cancelButtonText: "Cancelar",
  });
};

export const mostrarAlertaCodigoNoPermitido = () => {
  return Swal.fire({
    icon: "warning",
    title: "Código no permitido",
    text: "Solo se permiten el registro a estudiantes ingresados del 2021-1 en adelante.",
    confirmButtonColor: "#f27474",
  });
};

/** Número de WhatsApp inválido */
export const mostrarAlertaWhatsappInvalido = () => {
  return Swal.fire({
    icon: "error",
    title: "Número de WhatsApp inválido",
    text: "El número debe comenzar con 9 y tener exactamente 9 dígitos.",
    confirmButtonColor: "#d33",
  });
};

/** Registro exitoso */
export const mostrarAlertaRegistroExitoso = () => {
  return Swal.fire({
    icon: "success",
    title: "¡Registro Exitoso!",
    text: "Serás redirigido al inicio de sesión...",
    confirmButtonColor: "#28a745",
    timer: 2500,
    showConfirmButton: false,
  });
};

/** Servicio UDH no disponible al registrar */
export const mostrarAlertaServicioUDHNoDisponible = () => {
  return Swal.fire({
    icon: "warning",
    title: "Servicio UDH no disponible",
    text: "No se pudo verificar tus datos en este momento. Intenta nuevamente más tarde.",
    confirmButtonColor: "#f27474",
  });
};

/** Error genérico en el registro */
export const mostrarAlertaErrorRegistro = (mensaje) => {
  return Swal.fire({
    icon: "error",
    title: "Error en el registro",
    text: mensaje || "No se pudo registrar. Intenta nuevamente.",
    confirmButtonColor: "#d33",
  });
};
// Cuando aún no aceptan el plan
export const mostrarAlertaSolicitudPendiente = () => {
  return Swal.fire({
    icon: 'info',
    title: 'Solicitud pendiente',
    text: 'El docente aún no ha aceptado tu solicitud.',
    confirmButtonText: 'Entendido',
  });
};

// Cuando la conformidad del plan aún no está aprobada
export const mostrarAlertaConformidadPendiente = () => {
  return Swal.fire({
    icon: 'info',
    title: 'Conformidad pendiente',
    text: 'Tu asesor aún no ha aprobado el esquema plan.',
    confirmButtonText: 'Entendido',
  });
};

// Cuando aún no puede entrar al informe final
export const mostrarAlertaAccesoRestringidoInformeFinal = () => {
  return Swal.fire({
    icon: 'info',
    title: 'Acceso restringido',
    text: 'Aún no puedes acceder al Informe Final. Tu carta de término aún no ha sido aprobada.',
    confirmButtonText: 'Entendido',
  });
};

// --- Perfil Docente ---

// Error al cargar datos del perfil
export const mostrarErrorCargarPerfilDocente = (mensaje) => {
  return Swal.fire({
    icon: 'error',
    title: 'No se pudo cargar el perfil',
    text: mensaje || 'Intente nuevamente.',
  });
};

// Info: firma en procesamiento
export const mostrarInfoProcesandoFirma = () => {
  return Swal.fire({
    icon: 'info',
    title: 'Espera un momento',
    text: 'Estamos procesando tu firma.',
  });
};

// Faltan datos en el formulario
export const mostrarAlertaFaltanDatosPerfilDocente = () => {
  return Swal.fire({
    icon: 'warning',
    title: 'Faltan datos',
    text: 'Por favor complete todos los campos, incluyendo la firma digital.',
  });
};

// DNI inválido
export const mostrarAlertaDniInvalido = () => {
  return Swal.fire({
    icon: 'warning',
    title: 'DNI inválido',
    text: 'Debe contener exactamente 8 dígitos numéricos.',
  });
};

// Celular inválido
export const mostrarAlertaCelularInvalido = () => {
  return Swal.fire({
    icon: 'warning',
    title: 'Celular inválido',
    text: 'Debe contener exactamente 9 dígitos numéricos.',
  });
};
// Sin cambios al actualizar (celular u otro dato)
export const mostrarAlertaSinCambios = (mensaje = 'No se realizaron cambios.') => {
  return Swal.fire({
    icon: 'info',
    title: 'Sin cambios',
    text: mensaje,
    confirmButtonColor: '#3085d6',
  });
};

// Celular (u otro dato) actualizado correctamente
export const mostrarAlertaCelularActualizado = (
  mensaje = 'Celular actualizado correctamente.'
) => {
  return Swal.fire({
    icon: 'success',
    title: '¡Actualizado!',
    text: mensaje,
    confirmButtonColor: '#28a745',
  });
};

// Error al actualizar celular (u otro dato)
export const mostrarAlertaErrorActualizarCelular = (
  mensaje = 'Hubo un error al actualizar el celular.'
) => {
  return Swal.fire({
    icon: 'error',
    title: 'Error',
    text: mensaje,
    confirmButtonColor: '#d33',
  });
};

// No se encontró el id_usuario en localStorage
export const mostrarErrorSinIdUsuario = () => {
  return Swal.fire({
    icon: 'error',
    title: 'Error',
    text: 'No se encontró el ID del usuario. Inicie sesión nuevamente.',
  });
};

// Perfil de docente guardado correctamente
export const mostrarRegistroDocenteExitoso = () => {
  return Swal.fire({
    icon: 'success',
    title: 'Registro Exitoso',
    text: 'Su perfil se ha completado exitosamente.',
    timer: 2000,
    timerProgressBar: true,
    showConfirmButton: false,
    allowOutsideClick: false,
  });
};

// Error al registrar/actualizar docente
export const mostrarErrorRegistroDocente = () => {
  return Swal.fire({
    icon: 'error',
    title: 'Error',
    text: 'Hubo un error al registrar el docente.',
    confirmButtonColor: '#d33',
  });
};

// Confirmación para eliminar designación de supervisor
export const confirmarEliminacionDesignacionSupervisor = () => {
  return Swal.fire({
    title: '¿Eliminar designación?',
    text: 'Se quitará la designación del docente supervisor.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
  });
};

// Éxito al eliminar designación de supervisor
export const mostrarExitoEliminacionDesignacionSupervisor = () => {
  return Swal.fire({
    icon: 'success',
    title: 'Eliminado',
    text: 'La designación fue eliminada correctamente.',
    timer: 2000,
    showConfirmButton: false,
  });
};

// Error al eliminar designación de supervisor
export const mostrarErrorEliminacionDesignacionSupervisor = (mensaje) => {
  return Swal.fire({
    icon: 'error',
    title: 'Error',
    text: mensaje || 'No se pudo eliminar la designación.',
  });
};
// --- Informes finales ---

// Warning: no se pudieron obtener los integrantes del grupo
export const mostrarAlertaIntegrantesNoDisponibles = () => {
  return Swal.fire({
    icon: 'warning',
    title: 'Servidor UDH sin respuesta',
    text: 'No se pudieron obtener los integrantes del grupo. Intenta nuevamente más tarde.',
    confirmButtonText: 'Aceptar',
  });
};

// Error de conexión con el servidor UDH
export const mostrarAlertaErrorConexionUDH = () => {
  return Swal.fire({
    icon: 'error',
    title: 'Error de conexión',
    text: 'No se pudo conectar con el servidor de la UDH. Por favor, inténtalo más tarde.',
    confirmButtonText: 'Aceptar',
  });
};

// Éxito al aprobar informe final
export const mostrarExitoInformeAprobado = () => {
  return Swal.fire({
    icon: 'success',
    title: 'Informe aprobado',
    text: 'Los certificados fueron generados y guardados exitosamente.',
    confirmButtonText: 'Aceptar',
  });
};

// Error genérico al procesar el informe final
export const mostrarErrorProcesarInforme = () => {
  return Swal.fire({
    icon: 'error',
    title: 'Error',
    text: 'No se pudo procesar el informe.',
    confirmButtonText: 'Aceptar',
  });
};
// --- Líneas de Acción ---

// Confirmación antes de eliminar línea
export const confirmarEliminarLinea = () => {
  return Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará la línea de acción permanentemente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });
};

// Línea eliminada correctamente
export const mostrarLineaEliminada = () => {
  return Swal.fire({
    icon: 'success',
    title: '¡Eliminado!',
    text: 'La línea de acción ha sido eliminada.',
    confirmButtonColor: '#1a237e',
    timer: 2000,
    showConfirmButton: false
  });
};

// Error al eliminar línea
export const mostrarErrorEliminarLinea = () => {
  return Swal.fire({
    icon: 'error',
    title: 'Error',
    text: 'No se pudo eliminar la línea de acción.',
    confirmButtonColor: '#d33'
  });
};
// --- Programas Académicos ---

export const mostrarAlertaCamposIncompletosPrograma = () => {
  return Swal.fire({
    icon: 'warning',
    title: 'Campos incompletos',
    text: 'Por favor completa todos los campos.',
  });
};

export const mostrarAlertaCorreoProgramaInvalido = () => {
  return Swal.fire({
    icon: 'error',
    title: 'Correo inválido',
    text: 'Solo se permiten correos @gmail.com o @udh.edu.pe',
    confirmButtonColor: '#d33',
  });
};

export const mostrarAlertaWhatsappProgramaInvalido = () => {
  return Swal.fire({
    icon: 'error',
    title: 'Número inválido',
    text: 'El número de WhatsApp debe tener exactamente 9 dígitos.',
    confirmButtonColor: '#d33',
  });
};

export const mostrarAlertaProgramaCreado = () => {
  return Swal.fire({
    icon: 'success',
    title: 'Programa creado exitosamente',
    showConfirmButton: false,
    timer: 2000,
  });
};

export const mostrarAlertaCorreoProgramaDuplicado = () => {
  return Swal.fire({
    icon: 'error',
    title: 'Correo duplicado',
    text: 'Ya existe un usuario con ese correo.',
  });
};

export const mostrarAlertaErrorPrograma400 = (mensaje) => {
  return Swal.fire({
    icon: 'error',
    title: 'Error',
    text: mensaje || 'Ocurrió un error de validación.',
    confirmButtonColor: '#d33',
  });
};

export const mostrarAlertaErrorProgramaDesconocido = () => {
  return Swal.fire({
    icon: 'error',
    title: 'Error desconocido',
    text: 'Ocurrió un error inesperado.',
    confirmButtonColor: '#d33',
  });
};
// --- Eliminar Programa Académico ---

export const confirmarEliminarPrograma = () => {
  return Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará el programa académico de forma permanente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
  });
};

export const mostrarAlertaProgramaEliminado = () => {
  return Swal.fire({
    icon: 'success',
    title: 'Programa eliminado',
    text: 'El programa fue eliminado correctamente.',
    confirmButtonColor: '#1a237e',
  });
};

export const mostrarAlertaErrorEliminarPrograma = () => {
  return Swal.fire({
    icon: 'error',
    title: 'Error',
    text: 'Ocurrió un error al eliminar el programa.',
    confirmButtonColor: '#d33',
  });
};
// --- Registro de Docente ---

export const mostrarAlertaFaltanCamposDocente = () => {
  return Swal.fire({
    icon: 'warning',
    title: '¡Faltan campos!',
    text: 'Completa todos los campos incluyendo facultad y programa.',
  });
};

export const mostrarAlertaDocenteRegistrado = () => {
  return Swal.fire({
    icon: 'success',
    title: '¡Éxito!',
    text: 'Docente registrado exitosamente.',
  });
};

export const mostrarAlertaCorreoDuplicadoDocente = () => {
  return Swal.fire({
    icon: 'error',
    title: 'Correo duplicado',
    text: 'Ya existe un usuario registrado con ese correo.',
  });
};

export const mostrarErrorRegistrarDocente = (mensaje) => {
  return Swal.fire({
    icon: 'error',
    title: '¡Error!',
    text: mensaje || 'Error al registrar docente. Intenta nuevamente.',
  });
};
// --- Edición de Programa Académico ---

export const mostrarAlertaCamposIncompletosProgramaEdicion = () => {
  return Swal.fire({
    icon: 'warning',
    title: 'Campos incompletos',
    text: 'Completa todos los campos requeridos.',
  });
};

export const mostrarAlertaCorreoInvalidoPrograma = () => {
  return Swal.fire({
    icon: 'error',
    title: 'Correo inválido',
    text: 'El correo debe ser @gmail.com o @udh.edu.pe.',
  });
};

export const mostrarAlertaProgramaActualizado = () => {
  return Swal.fire({
    icon: 'success',
    title: 'Programa actualizado',
    showConfirmButton: false,
    timer: 1800,
  });
};

export const mostrarAlertaErrorActualizarPrograma = (mensaje) => {
  return Swal.fire({
    icon: 'error',
    title: 'Error',
    text: mensaje || 'No se pudo actualizar el programa.',
  });
};
// --- Eliminación de Docente ---

export const confirmarEliminarDocente = () => {
  return Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará al docente permanentemente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });
};

export const mostrarDocenteEliminado = () => {
  return Swal.fire({
    icon: 'success',
    title: '¡Docente eliminado!',
    text: 'El docente fue eliminado correctamente.',
    confirmButtonColor: '#1a237e',
    timer: 2000,
    showConfirmButton: false
  });
};

export const mostrarErrorEliminarDocente = (mensaje) => {
  return Swal.fire({
    icon: 'error',
    title: 'Error',
    text: mensaje || 'No se pudo eliminar el docente.',
    confirmButtonColor: '#d33'
  });
};
// --- Actualización de Docente ---

export const mostrarDocenteActualizado = () => {
  return Swal.fire({
    icon: 'success',
    title: 'Docente actualizado',
    text: 'Los datos del docente se actualizaron correctamente.',
    timer: 2000,
    showConfirmButton: false,
  });
};

export const mostrarErrorCorreoDuplicadoAlActualizarDocente = () => {
  return Swal.fire({
    icon: 'error',
    title: 'Correo duplicado',
    text: 'Ya existe otro usuario registrado con este correo.',
  });
};

export const mostrarErrorActualizarDocente = (mensaje) => {
  return Swal.fire({
    icon: 'error',
    title: 'Error',
    text: mensaje || 'No se pudo actualizar el docente.',
  });
};
// --- Eliminación de Labor Social ---

export const confirmarEliminarLabor = () => {
  return Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará el servicio social permanentemente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });
};

export const mostrarLaborEliminada = () => {
  return Swal.fire({
    icon: 'success',
    title: '¡Servicio social eliminado!',
    text: 'La labor fue eliminada correctamente.',
    confirmButtonColor: '#1a237e',
    timer: 2000,
    showConfirmButton: false
  });
};

export const mostrarErrorEliminarLabor = (mensaje) => {
  return Swal.fire({
    icon: 'error',
    title: 'Error',
    text: mensaje || 'No se pudo eliminar el servicio social.',
    confirmButtonColor: '#d33'
  });
};
// --- Eliminación de Facultad ---

export const confirmarEliminarFacultad = () => {
  return Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará la facultad permanentemente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });
};

export const mostrarFacultadEliminada = () => {
  return Swal.fire({
    icon: 'success',
    title: '¡Facultad eliminada!',
    text: 'La facultad fue eliminada correctamente.',
    confirmButtonColor: '#1a237e',
    timer: 2000,
    showConfirmButton: false
  });
};

export const mostrarErrorEliminarFacultad = (mensaje) => {
  return Swal.fire({
    icon: 'error',
    title: 'Error',
    text: mensaje || 'No se pudo eliminar la facultad.',
    confirmButtonColor: '#d33'
  });
};
// --- Grupo / Integrantes ---

export const mostrarErrorObtenerIntegrantesGrupo = (mensaje) => {
  return Swal.fire({
    icon: 'error',
    title: 'Error',
    text: mensaje || 'No se pudo cargar el grupo.',
  });
};
// --- Solicitud de Revisión del Plan Social ---

// Falta ID o token
export const mostrarErrorSesionInvalida = () => {
  return Swal.fire({
    icon: 'error',
    title: 'Sesión inválida',
    text: 'No se encontró el ID de usuario o el token. Inicia sesión nuevamente.',
    confirmButtonColor: '#d33',
  });
};

// No hay archivo seleccionado
export const mostrarErrorArchivoNoSeleccionado = () => {
  return Swal.fire({
    icon: 'warning',
    title: 'Archivo no seleccionado',
    text: 'Primero selecciona un archivo.',
    confirmButtonColor: '#f59e0b',
  });
};

// Error al enviar proyecto
export const mostrarErrorEnviarProyecto = (mensaje) => {
  return Swal.fire({
    icon: 'error',
    title: 'Error al enviar',
    text: mensaje || 'Ocurrió un error al enviar tu plan.',
    confirmButtonColor: '#d33',
  });
};

// Solicitud enviada correctamente
export const mostrarExitoSolicitudRevision = () => {
  return Swal.fire({
    icon: 'success',
    title: 'Revisión solicitada',
    text: 'Tu proyecto ha sido enviado correctamente al asesor para su revisión.',
    timer: 2500,
    showConfirmButton: false,
  });
};

// Evidencia seleccionada (solo mostrada al elegir archivo)
export const mostrarAlertaEvidenciaSeleccionada = () => {
  return Swal.fire({
    icon: 'success',
    title: 'Evidencia seleccionada',
    text: 'No se ha enviado aún. Presiona el botón "Enviar" para confirmar.',
    timer: 2000,
    showConfirmButton: false,
  });
};
export const mostrarAlertaSolicitudYaEnviada = () => {
  return Swal.fire({
    icon: "info",
    title: "Solicitud ya enviada",
    text: "Ya has enviado una solicitud. Espera la respuesta del docente.",
    confirmButtonText: "Entendido",
  });
};

export const mostrarAlertaSolicitudEnviada = () => {
  return Swal.fire({
    icon: "success",
    title: "Solicitud enviada",
    text: "Tu solicitud ha sido registrada correctamente.",
    showConfirmButton: false,
    timer: 2000,
  });
};

export const mostrarAlertaErrorEnviarSolicitud = (mensaje) => {
  return Swal.fire({
    icon: "error",
    title: "Error al enviar",
    text: mensaje || "Hubo un error al enviar la solicitud.",
    confirmButtonColor: "#d33",
  });
};
export const mostrarAlertaCompletarPerfilPrimeraVez = () => {
  return Swal.fire({
    title: '¡Bienvenido!',
    text: 'Antes de continuar, debes completar tu perfil.',
    icon: 'info',
    iconColor: '#39B49E',
    confirmButtonText: 'Aceptar',
    confirmButtonColor: '#011B4B',
    allowOutsideClick: false,
    allowEscapeKey: false,
  });
};
export const mostrarExitoSolicitudCartaTermino = () => {
  return Swal.fire({
    icon: 'success',
    title: 'Solicitud enviada',
    text: 'Tu carta de término ha sido solicitada correctamente.',
    timer: 2000,
    showConfirmButton: false
  });
};
export const mostrarErrorSolicitudCartaTermino = () => {
  return Swal.fire({
    icon: 'error',
    title: 'Error',
    text: 'Hubo un problema al solicitar la carta de término.'
  });
};
// --- Revisión de trabajos (Docente) ---

export const mostrarExitoTrabajoAceptado = () => {
  return Swal.fire({
    icon: 'success',
    title: '¡Trabajo aceptado!',
    text: 'Has aceptado supervisar el trabajo del estudiante.',
    confirmButtonColor: '#3085d6',
    confirmButtonText: 'Entendido'
  });
};

export const mostrarErrorGuardarCambiosTrabajo = (mensaje) => {
  return Swal.fire({
    icon: 'error',
    title: '¡Error!',
    text: mensaje || 'Ocurrió un problema al guardar los cambios o generar el documento.',
    confirmButtonColor: '#d33',
    confirmButtonText: 'Aceptar'
  });
};
// --- Perfil Docente / Carga inicial ---

export const mostrarAlertaCompletarPerfilDocente = () => {
  return Swal.fire({
    title: '¡Bienvenido!',
    text: 'Antes de continuar, debes completar tu perfil.',
    icon: 'info',
    confirmButtonText: 'Aceptar',
    allowOutsideClick: false,
    allowEscapeKey: false
  });
};

export const mostrarErrorObtenerTrabajosDocente = (mensaje) => {
  return Swal.fire({
    icon: 'error',
    title: 'Error al obtener trabajos sociales',
    text: mensaje || 'No se pudo obtener los trabajos sociales del docente.',
  });
};

export const mostrarErrorObtenerDatosDocente = (mensaje) => {
  return Swal.fire({
    icon: 'error',
    title: 'Error al obtener datos del docente',
    text: mensaje || 'No se pudo obtener la información del docente.',
  });
};

export const confirmarAceptarEstudianteTrabajo = () => {
  return Swal.fire({
    title: '¿Estás seguro de aceptar al estudiante?',
    text: 'Esta acción generará la carta de aceptación y no podrá ser revertida.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, aceptar',
    cancelButtonText: 'Cancelar'
  });
};

export const mostrarAlertaSinDatosGrupo = () => {
  return Swal.fire({
    icon: 'warning',
    title: 'Sin datos de grupo',
    text: 'No se encontraron integrantes del grupo. Intenta nuevamente más tarde.',
    confirmButtonText: 'Aceptar'
  });
};

export const mostrarErrorServidorUDHNoDisponible = () => {
  return Swal.fire({
    icon: 'error',
    title: 'Servidor de UDH no disponible',
    text: 'No se pudo contactar con el servidor de datos académicos. Inténtalo más tarde.',
    confirmButtonText: 'Aceptar'
  });
};

export const mostrarExitoCambioEstadoTrabajo = (nuevoEstado) => {
  const textoEstado = nuevoEstado === 'aceptado' ? 'aceptado' : 'rechazado';
  return Swal.fire({
    icon: 'success',
    title: `Trabajo ${textoEstado}`,
    text: `Has marcado este trabajo como ${nuevoEstado}.`,
    confirmButtonColor: '#3085d6',
    confirmButtonText: 'Entendido'
  });
};

export const mostrarErrorCambioEstadoTrabajo = (mensaje) => {
  return Swal.fire({
    icon: 'error',
    title: 'Error',
    text: mensaje || 'No se pudo actualizar el estado del trabajo.',
    confirmButtonColor: '#d33',
    confirmButtonText: 'Aceptar'
  });
};


export const mostrarExitoEleccionEliminada = () =>
  Swal.fire({
    icon: "success",
    title: "Eliminado",
    text: "La elección fue eliminada correctamente.",
    timer: 1500,
    timerProgressBar: true,
    showConfirmButton: false,
  });


export const mostrarErrorEliminarEleccion = () =>
  Swal.fire("Error", "No se pudo eliminar la elección.", "error");

export const mostrarInfoSinCartasGrupo = () =>
  Swal.fire("Sin cartas", "No se encontraron cartas de aceptación del grupo.", "info");

export const mostrarErrorCargarCartasGrupo = () =>
  Swal.fire("Error", "No se pudo cargar las cartas del grupo.", "error");

// Confirmación enviar solicitud
export const confirmarEnviarSolicitud = () =>
  Swal.fire({
    title: "¿Estás seguro?",
    text: "Una vez enviada la solicitud, no podrás modificar los datos seleccionados.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, enviar",
    cancelButtonText: "Cancelar",
  });

// Confirmación eliminar elección
export const confirmarEliminarEleccion = () =>
  Swal.fire({
    title: "¿Eliminar elección?",
    text:
      "Esto eliminará tu elección y podrás comenzar de nuevo. Se recomienda conversar previamente con el docente supervisor antes de realizar una nueva elección",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });


export const confirmarCambioRegistro = (registroHabilitadoActual) => {
  const accion = registroHabilitadoActual ? "deshabilitar" : "habilitar";

  return Swal.fire({
    title: "¿Confirmar acción?",
    text: `¿Estás seguro que deseas ${accion} el registro de estudiantes?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, confirmar",
    cancelButtonText: "Cancelar",
    reverseButtons: true,
    confirmButtonColor: "#2B77C0",
    cancelButtonColor: "#ef4444",
  });
};


export const mostrarAlertaFaltaIntegrantesGrupo = () =>
  Swal.fire({
    icon: "warning",
    title: "Grupo incompleto",
    text: "Si eliges la opción grupal, debes registrar al menos 1 integrante en tu grupo.",
    confirmButtonText: "Entendido",
    confirmButtonColor: "#f59e0b",
  });

// Toasts para validaciones de perfil alumno
export const toastCelularRequerido = () =>
  Toast.fire({
    icon: "warning",
    title: "Ingrese su número de celular",
    iconColor: "#f59e0b",
  });

export const toastModalidadRequerida = () =>
  Toast.fire({
    icon: "warning",
    title: "Seleccione una modalidad",
    iconColor: "#f59e0b",
  });

export const toastSedeRequerida = () =>
  Toast.fire({
    icon: "warning",
    title: "Seleccione una sede",
    iconColor: "#f59e0b",
  });

export const toastCelularInvalido = () =>
  Toast.fire({
    icon: "error",
    title: "El celular debe tener 9 dígitos",
    iconColor: "#dc2626",
  });