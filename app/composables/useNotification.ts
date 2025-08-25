import { useToast } from 'vue-toastification'

export const useNotification = () => {
  const toast = useToast()

  const showSuccess = (message: string, options?: any) => {
    toast.success(message, options)
  }

  const showError = (message: string, options?: any) => {
    toast.error(message, options)
  }

  const showWarning = (message: string, options?: any) => {
    toast.warning(message, options)
  }

  const showInfo = (message: string, options?: any) => {
    toast.info(message, options)
  }

  const showDefault = (message: string, options?: any) => {
    toast(message, options)
  }

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showDefault
  }
}
