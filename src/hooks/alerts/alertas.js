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

export const toastWarning = (title, opts = {}) =>
  Toast.fire({
    icon: "info",
    title: title || "Atención",
    iconColor: "#f59e0b",
    ...opts,
  });

export const alertconfirmacion = ({
  title = '¿Estás seguro?',
  text = 'Esta acción eliminará el programa académico de forma permanente.',
  icon = 'warning',
  confirmButtonText = 'Sí, eliminar',
  cancelButtonText = 'Cancelar',
  confirmButtonColor = '#d33',
  cancelButtonColor = '#083A59',
} = {}) => {
  return Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    confirmButtonColor,
    cancelButtonColor,
  });
};

export const alertError = (title, text, opts = {}) =>
  Swal.fire({
    icon: "error",
    title: title || "Error",
    text: text || "Ocurrió un error",
    confirmButtonColor: "#dc2626",
    timer: 2000,
    showConfirmButton: false,
    timerProgressBar: true,
    ...opts,
  });

export const alertInfo = (title, text, opts = {}) =>
  Swal.fire({
    icon: "info",
    title: title || "Información",
    text: text || "",
    confirmButtonText: opts.confirmButtonText || "Entendido",
    confirmButtonColor: opts.confirmButtonColor || '#3085d6',
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
    confirmButtonColor: "#28a745",
    timer: 2000,              
    showConfirmButton: false, 
    timerProgressBar: true, 
    ...opts,
  });

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

export const alertquestion = () => {
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
export const mostrarErrorEliminarEleccion = () =>
  Swal.fire("Error", "No se pudo eliminar la elección.", "error");

export const mostrarInfoSinCartasGrupo = () =>
  Swal.fire("Sin cartas", "No se encontraron cartas de aceptación del grupo.", "info");

export const mostrarErrorCargarCartasGrupo = () =>
  Swal.fire("Error", "No se pudo cargar las cartas del grupo.", "error");

