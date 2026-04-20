import { ref, watch } from 'vue'
import { actualizarTransporteSchema } from '@/modules/transporte/schemas/TransporteSchema'
import { useToast } from '@/composables/useToast'
import type { Transporte } from '@/modules/transporte/interfaces/transporte-interface'
import transporteAPI from '../api/transporteAPI'
import empleadoAPI from '@/modules/empleado/api/empleadoAPI'

export interface Transportista {
  empleado_id: number
  nombre: string
  apellido_paterno: string
}

interface FormEditarTransporte {
  numero_serie: string
  empleado_id: number | null
  capacidad_carga: number | null
  unidad_medida: string
  placa: string
}

export const useEditarTransporte = (onSuccess: (transporte: Transporte) => void) => {
  const { showToast } = useToast()

  const dialog = ref(false)
  const loading = ref(false)
  const transporteSeleccionado = ref<Transporte | null>(null)
  const erroresForm = ref<Record<string, string>>({})

  const transportistas = ref<Transportista[]>([])
  const loadingTransportistas = ref(false)

  const fetchTransportistas = async () => {
    loadingTransportistas.value = true
    try {
      const { data } = await empleadoAPI.get('/transportistas')
      transportistas.value = Array.isArray(data) ? data : (data?.data ?? [])
    } catch {
      transportistas.value = []
    } finally {
      loadingTransportistas.value = false
    }
  }

  const form = ref<FormEditarTransporte>({
    numero_serie: '',
    empleado_id: null,
    capacidad_carga: null,
    unidad_medida: '',
    placa: '',
  })

  const resetErrores = () => {
    erroresForm.value = {}
  }

  watch(dialog, (abierto) => {
    if (!abierto) resetErrores()
  })

  watch(() => form.value.empleado_id, () => { delete erroresForm.value.empleado_id })
  watch(() => form.value.capacidad_carga, () => { delete erroresForm.value.capacidad_carga })
  watch(() => form.value.unidad_medida, () => { delete erroresForm.value.unidad_medida })
  watch(() => form.value.placa, () => { delete erroresForm.value.placa })

  const abrirModal = async (transporte: Transporte) => {
    transporteSeleccionado.value = transporte
    form.value = {
      numero_serie: transporte.numero_serie,
      empleado_id: transporte.empleado_id,
      capacidad_carga: Number(transporte.capacidad_carga),
      unidad_medida: transporte.unidad_medida,
      placa: transporte.placa || '',
    }
    resetErrores()
    await fetchTransportistas()
    dialog.value = true
  }

  const cerrarModal = () => {
    dialog.value = false
  }

  const validarFormulario = () => {
    const resultado = actualizarTransporteSchema.safeParse({
      empleado_id: form.value.empleado_id,
      capacidad_carga: form.value.capacidad_carga,
      unidad_medida: form.value.unidad_medida,
      placa: form.value.placa,
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
      empleado_id: resultado.data.empleado_id,
      capacidad_carga: resultado.data.capacidad_carga,
      unidad_medida: resultado.data.unidad_medida,
      placa: resultado.data.placa || undefined,
    }
  }

  const getMensajeError = (error: unknown): string => {
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const respuesta = (error as { response?: { data?: { message?: string } } }).response
      return respuesta?.data?.message ?? 'Error al conectar con el servidor'
    }
    return 'Error al conectar con el servidor'
  }

  const editarTransporte = async (): Promise<void> => {
    if (!transporteSeleccionado.value) return

    const datos = validarFormulario()
    if (!datos) {
      showToast('Por favor corrige los errores del formulario', 'warning')
      return
    }

    loading.value = true
    try {
      const { data } = await transporteAPI.put(
        `/${transporteSeleccionado.value.numero_serie}`,
        datos
      )
      onSuccess(data)
      showToast('¡Transporte modificado con éxito!', 'success')
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
    transporteSeleccionado,
    transportistas,
    loadingTransportistas,
    abrirModal,
    cerrarModal,
    editarTransporte,
  }
}
