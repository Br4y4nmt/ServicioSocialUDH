import { useEffect } from 'react';
import Swal from 'sweetalert2';

export const useWelcomeToast = (
    flagKey = 'showBienvenida',
    nameKey = 'nombre_usuario'
    ) => {
    useEffect(() => {
        const mostrarBienvenida = localStorage.getItem(flagKey);
        const nombre = localStorage.getItem(nameKey);

        if (mostrarBienvenida === 'true') {
        const Toast = Swal.mixin({
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 6000,
            timerProgressBar: true,
            icon: 'success',
            customClass: {
            popup: 'swal2-toast-custom',
            },
            didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
        });

        Toast.fire({
            title: `Bienvenido ${nombre || ''}`,
        });

        localStorage.removeItem(flagKey);
        }
    }, [flagKey, nameKey]);
    };


export const showTopSuccessToast = (title, text = '') => {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end', 
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        icon: 'success',
        customClass: {
            popup: 'swal2-toast-custom',
        },
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
    });

    Toast.fire({
        title,
        text,
    });
};

