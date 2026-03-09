import { ref } from 'vue'

interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
}

const toasts = ref<Toast[]>([])

let id = 0

export function useToast() {

  const showToast = (
    message: string,
    type: Toast['type'] = 'success',
    duration = 3000
  ) => {
    const toastId = id++

    toasts.value.push({
      id: toastId,
      message,
      type,
    })

    setTimeout(() => {
      removeToast(toastId)
    }, duration)
  }

  const removeToast = (toastId: number) => {
    toasts.value = toasts.value.filter(t => t.id !== toastId)
  }

  return {
    toasts,
    showToast,
    removeToast,
  }
}