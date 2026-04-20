import { reactive, ref, watch } from 'vue'
import { tipoPaqueteSchema } from '@/modules/tipo_paquete/schemas/TipoPaqueteSchema'
import type { TipoPaquete, CrearTipoPaqueteDTO } from '../interfaces/paquete-interface'
import { useToast } from '@/composables/useToast'
import paqueteAPI from '../api/tipo_paqueteAPI'

interface FormRegistrarPaquete {
  tamanio: string
  forma: string
  precio: number | undefined
}

const formInicial = (): FormRegistrarPaquete => ({
  tamanio: '',
  forma: '',
  precio: undefined,
})

export const useRegistrarTipoPaquete = (onSuccess: (paquete: TipoPaquete) => void) => {
  const { showToast } = useToast()

  const dialog = ref(false)
  const loading = ref(false)
  const erroresForm = ref<Record<string, string>>({})

  const form = reactive<FormRegistrarPaquete>(formInicial())

  const resetForm = () => Object.assign(form, formInicial())

  const resetErrores = () => {
    erroresForm.value = {}
  }

  watch(() => form.tamanio, () => { delete erroresForm.value.tamanio })
  watch(() => form.forma, () => { delete erroresForm.value.forma })
  watch(() => form.precio, () => { delete erroresForm.value.precio })

  const abrirModal = () => {
    resetForm()
    resetErrores()
    dialog.value = true
  }

  const cerrarModal = () => {
    dialog.value = false
    setTimeout(() => {
      resetForm()
      resetErrores()
    }, 300)
  }

  const validarFormulario = (): CrearTipoPaqueteDTO | null => {
    const resultado = tipoPaqueteSchema.safeParse(form)

    if (!resultado.success) {
      const campos = resultado.error.flatten().fieldErrors
      const errores: Record<string, string> = {}
      for (const [key, mensajes] of Object.entries(campos)) {
        errores[key] = mensajes?.[0] ?? ''
      }
      erroresForm.value = errores
      return null
    }

    return {
      tamanio: resultado.data.tamanio,
      forma: resultado.data.forma,
      precio: resultado.data.precio,
    }
  }

  const getMensajeError = (error: unknown): string => {
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const respuesta = (error as { response?: { data?: { message?: string } } }).response
      return respuesta?.data?.message ?? 'Error al registrar paquete'
    }
    return 'Error al registrar paquete'
  }

  const registrarTipoPaquete = async (): Promise<void> => {
    const datos = validarFormulario()
    if (!datos) {
      showToast('Por favor corrige los errores del formulario', 'warning')
      return
    }

    loading.value = true
    try {
      const { data } = await paqueteAPI.post<TipoPaquete>('/nuevo', datos)
      onSuccess(data)
      showToast('¡Paquete registrado con éxito!', 'success')
      cerrarModal()
    } catch (error: unknown) {
      showToast(getMensajeError(error), 'error')
    } finally {
      loading.value = false
    }
  }

  return {
    dialog,
    loading,
    form,
    erroresForm,
    abrirModal,
    cerrarModal,
    registrarTipoPaquete,
  }
}
