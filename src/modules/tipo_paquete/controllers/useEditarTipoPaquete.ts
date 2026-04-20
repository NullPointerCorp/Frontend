import { ref, watch } from 'vue'
import { actualizarTipoPaqueteSchema } from '@/modules/tipo_paquete/schemas/TipoPaqueteSchema'
import type { TipoPaquete, ActualizarTipoPaqueteDTO } from '@/modules/tipo_paquete/interfaces/paquete-interface'
import { useToast } from '@/composables/useToast'
import tipopaqueteAPI from '../api/tipo_paqueteAPI'

interface FormEditarPaquete {
  tamanio: string
  forma: string
  precio: number | undefined
}

export const useEditarTipoPaquete = (onSuccess: (paquete: TipoPaquete) => void) => {
  const { showToast } = useToast()

  const dialog = ref(false)
  const loading = ref(false)
  const paqueteSeleccionado = ref<TipoPaquete | null>(null)
  const erroresForm = ref<Record<string, string>>({})

  const form = ref<FormEditarPaquete>({
    tamanio: '',
    forma: '',
    precio: undefined,
  })

  const resetErrores = () => {
    erroresForm.value = {}
  }

  watch(dialog, (abierto) => {
    if (!abierto) resetErrores()
  })

  watch(() => form.value.tamanio, () => { delete erroresForm.value.tamanio })
  watch(() => form.value.forma, () => { delete erroresForm.value.forma })
  watch(() => form.value.precio, () => { delete erroresForm.value.precio })

  const abrirModal = (paquete: TipoPaquete) => {
    paqueteSeleccionado.value = paquete
    form.value = {
      tamanio: paquete.tamanio ?? '',
      forma: paquete.forma ?? '',
      precio: paquete.precio ?? undefined,
    }
    resetErrores()
    dialog.value = true
  }

  const cerrarModal = () => {
    dialog.value = false
  }

  const validarFormulario = (): ActualizarTipoPaqueteDTO | null => {
    const resultado = actualizarTipoPaqueteSchema.safeParse({
      tamanio: form.value.tamanio,
      forma: form.value.forma,
      precio: form.value.precio,
    })

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
      return respuesta?.data?.message ?? 'Error al conectar con el servidor'
    }
    return 'Error al conectar con el servidor'
  }

  const editarTipoPaquete = async (): Promise<void> => {
    if (!paqueteSeleccionado.value) return

    const datos = validarFormulario()
    if (!datos) {
      showToast('Por favor corrige los errores del formulario', 'warning')
      return
    }

    loading.value = true
    try {
      const { data } = await tipopaqueteAPI.put<TipoPaquete>(
        `/${paqueteSeleccionado.value.tipo_paquete_id}`,
        datos
      )
      onSuccess(data)
      showToast('¡Paquete modificado con éxito!', 'success')
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
    paqueteSeleccionado,
    abrirModal,
    cerrarModal,
    editarTipoPaquete,
  }
}
