import { Bounce, toast, type TypeOptions } from 'react-toastify'

type ToastProps = {
    type?: TypeOptions,
    message?: string
}

export const showToast = ({ message, type } : ToastProps) => {
    toast(message , {
        type: type,
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition:  Bounce 
    })
}