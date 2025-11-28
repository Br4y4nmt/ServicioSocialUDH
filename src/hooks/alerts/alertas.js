// src/hooks/alerts/alertas.js
import Swal from "sweetalert2";

/**
 * Alerta de recomendación para la evidencia (la de la cámara)
 */
export const mostrarRecomendacionEvidencia = () => {
  return Swal.fire({
    icon: "info",
    title: "Recomendación para la evidencia",
    text: "La evidencia fotográfica debe mostrar claramente al estudiante realizando la actividad correspondiente. Asegúrate de que la imagen sea nítida y representativa de la tarea realizada.",
    confirmButtonText: "Entendido",
  });
};

/**
 * Alerta: demasiado pronto para subir evidencia
 */
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
/**
 * Alerta: fecha vencida para subir evidencia
 */
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
