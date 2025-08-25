import { defineNuxtPlugin } from '#app'
import Toast, { POSITION, TYPE } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Toast, {
    position: POSITION.TOP_RIGHT,
    timeout: 5000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: 'button',
    icon: true,
    rtl: false,
    newestOnTop: true,
    maxToasts: 5,
    transition: 'Vue-Toastification__bounce',
    toastDefaults: {
      // Override defaults for each toast type
      [TYPE.ERROR]: {
        timeout: 8000,
        closeOnClick: true,
      },
      [TYPE.SUCCESS]: {
        timeout: 3000,
        hideProgressBar: true,
      }
    }
  })
})
