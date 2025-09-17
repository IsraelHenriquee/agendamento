export const useNotification = () => {
  const getToast = async () => {
    if (process.client) {
      const { useToast } = await import('vue-toastification')
      return useToast()
    }
    return null
  }

  const showSuccess = async (message: string, options?: any) => {
    const toast = await getToast()
    if (toast) {
      toast.success(message, options)
    }
  }

  const showError = async (message: string, options?: any) => {
    const toast = await getToast()
    if (toast) {
      toast.error(message, options)
    }
  }

  const showWarning = async (message: string, options?: any) => {
    const toast = await getToast()
    if (toast) {
      toast.warning(message, options)
    }
  }

  const showInfo = async (message: string, options?: any) => {
    const toast = await getToast()
    if (toast) {
      toast.info(message, options)
    }
  }

  const showDefault = async (message: string, options?: any) => {
    const toast = await getToast()
    if (toast) {
      toast(message, options)
    }
  }

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showDefault
  }
}
