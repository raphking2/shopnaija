// utils/toast.js
import { toast } from 'react-toastify';

export const showToast = (message, type = 'info') => {
  toast(message, {
    type: type,
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};