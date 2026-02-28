import { useEffect } from "react";
import Swal from "sweetalert2";

const createToast = (
  position = "top-end",
  icon = "success",
  timer = 4000
) =>
  Swal.mixin({
    toast: true,
    position,
    showConfirmButton: false,
    timer,
    timerProgressBar: true,
    icon,
    customClass: {
      popup: "swal2-toast-custom",
    },
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });


export const useWelcomeToast = (
  flagKey = "showBienvenida",
  nameKey = "nombre_usuario"
) => {
  useEffect(() => {
    const mostrarBienvenida = localStorage.getItem(flagKey);
    const nombre = localStorage.getItem(nameKey);

    if (mostrarBienvenida === "true") {
      createToast("bottom-end", "success", 6000).fire({
        title: `Bienvenido ${nombre || ""}`,
      });

      localStorage.removeItem(flagKey);
    }
  }, [flagKey, nameKey]);
};

export const showTopSuccessToast = (title, text = "") => {
  createToast("top-end", "success").fire({ title, text });
};

export const showTopWarningToast = (title, text = "") => {
  createToast("top-end", "warning").fire({ title, text });
};

export const showTopErrorToast = (title, text = "") => {
  createToast("top-end", "error").fire({ title, text });
};

export const showBottomStartWarningToast = (title, text = "") => {
  createToast("bottom-start", "warning", 3500).fire({ title, text });
};
