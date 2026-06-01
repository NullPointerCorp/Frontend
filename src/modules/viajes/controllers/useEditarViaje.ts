import { reactive, ref, watch } from 'vue'
import { useToast } from '@/composables/useToast'
import viajeAPI from '../api/viajeAPI'
import type { EditarViajeDTO, Viaje, ViajeCatalogos } from '../interfaces/viaje-interface'

interface FormEditarViaje {
  numero_serie: string
  fecha_salida: string
  fecha_llegada: string
}

export const useEditarViaje = (onSuccess: (viaje: Viaje) => void) => {
  const { showToast } = useToast()

  const dialog = ref(false)
  const loading = ref(false)
  const loadingTransportes = ref(false)
  const viajeSeleccionado = ref<Viaje | null>(null)
  const erroresForm = ref<Record<string, string>>({})
  const transportes = ref<ViajeCatalogos['transportes']>([])

  const form = reactive<FormEditarViaje>({
    numero_serie: '',
    fecha_salida: '',
    fecha_llegada: '',
  })

  watch(dialog, (abierto) => {
    if (!abierto) erroresForm.value = {}
  })

  const fetchTransportes = async () => {
    if (!form.fecha_salida || !form.fecha_llegada) return
    loadingTransportes.value = true
    try {
      const { data } = await viajeAPI.get<ViajeCatalogos['transportes']>('/transportes-disponibles', {
        params: {
          fecha_salida: form.fecha_salida,
          fecha_llegada: form.fecha_llegada,
          excluir_viaje_id: viajeSeleccionado.value?.viaje_id,
        },
      })
      transportes.value = Array.isArray(data) ? data : []
      if (!transportes.value.some((t) => t.numero_serie === form.numero_serie)) {
        form.numero_serie = ''
      }
    } catch {
      transportes.value = []
    } finally {
      loadingTransportes.value = false
    }
  }

  watch(() => [form.fecha_salida, form.fecha_llegada], fetchTransportes)

  const nombreTransporte = (t: ViajeCatalogos['transportes'][0]) => {
    return t.placa ? `${t.numero_serie} - ${t.placa}` : t.numero_serie
  }

  const abrirModal = async (viaje: Viaje) => {
    viajeSeleccionado.value = viaje
    form.numero_serie = viaje.numero_serie
    form.fecha_salida = viaje.fecha_salida?.slice(0, 16) ?? ''
    form.fecha_llegada = (viaje.fecha_llegada ?? '').slice(0, 16)
    erroresForm.value = {}
    dialog.value = true
    await fetchTransportes()
  }

  const cerrarModal = () => {
    dialog.value = false
  }

  const validar = (): boolean => {
    const errores: Record<string, string> = {}

    if (!form.numero_serie) errores.numero_serie = 'Selecciona un transporte'
    if (!form.fecha_salida) errores.fecha_salida = 'La fecha de salida es requerida'
    else if (new Date(form.fecha_salida) < new Date()) errores.fecha_salida = 'La fecha de salida no puede ser en el pasado'
    if (!form.fecha_llegada) errores.fecha_llegada = 'La fecha de llegada es requerida'

    if (form.fecha_llegada && form.fecha_salida) {
      if (new Date(form.fecha_llegada) <= new Date(form.fecha_salida)) {
        errores.fecha_llegada = 'La fecha de llegada debe ser posterior a la fecha de salida'
      }
    }

    erroresForm.value = errores
    return Object.keys(errores).length === 0
  }

  const editarViaje = async () => {
    if (!viajeSeleccionado.value) return
    if (!validar()) {
      showToast('Por favor corrige los errores del formulario', 'warning')
      return
    }

    const datos: EditarViajeDTO = {
      numero_serie: form.numero_serie,
      fecha_salida: form.fecha_salida,
      fecha_llegada: form.fecha_llegada,
    }

    loading.value = true
    try {
      const { data } = await viajeAPI.put<Viaje>(
        `/${viajeSeleccionado.value.viaje_id}`,
        datos
      )
      onSuccess(data)
      showToast('Viaje actualizado con éxito', 'success')
      cerrarModal()
    } catch (error: unknown) {
      const respuesta = (error as { response?: { data?: { message?: string } } }).response
      showToast(respuesta?.data?.message ?? 'Error al actualizar viaje', 'error')
    } finally {
      loading.value = false
    }
  }

  return {
    dialog,
    loading,
    loadingTransportes,
    form,
    erroresForm,
    transportes,
    viajeSeleccionado,
    nombreTransporte,
    abrirModal,
    cerrarModal,
    editarViaje,
  }
}
