import { ref } from 'vue'
import type { Transporte } from '@/modules/transporte/interfaces/transporte-interface'
import { useToast } from '@/composables/useToast'
import { useZodValidation } from '@/composables/useZodValidation'
import { actualizarTransporteSchema } from '@/modules/transporte/schemas/TransporteSchema'
import transporteAPI from '../api/transporteAPI'
import empleadoAPI from '@/modules/empleado/api/empleadoAPI'

export interface Transportista {
  empleado_id: number
  nombre: string
  apellido_paterno: string
}

interface FormEditarTransporte {
  numero_serie: string;
  empleado_id: number | null;
  capacidad_carga: number | null;
  unidad_medida: string;
  placa: string;
}

export const useEditarTransporte = (onSuccess: (transporte: Transporte) => void) => {
  const { validate } = useZodValidation(actualizarTransporteSchema)
  const { showToast } = useToast() 

  const dialog = ref(false)
  const loading = ref(false)
  const transporteSeleccionado = ref<Transporte | null>(null)
  const transportistas = ref<Transportista[]>([])
  const loadingTransportistas = ref(false)

  const form = ref<FormEditarTransporte>({
    numero_serie: '',
    empleado_id: null,
    capacidad_carga: null,
    unidad_medida: '',
    placa: '',
  })

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

  const abrirModal = async (transporte: Transporte) => {
    transporteSeleccionado.value = transporte
    form.value = {
      numero_serie: transporte.numero_serie,
      empleado_id: transporte.empleado_id,
      capacidad_carga: Number(transporte.capacidad_carga),
      unidad_medida: transporte.unidad_medida,
      placa: transporte.placa || '',
    }
    await fetchTransportistas()
    dialog.value = true
  }

  const editarTransporte = async () => { 
    if (!transporteSeleccionado.value) return

    loading.value = true
    try {
      const { data } = await transporteAPI.put( 
        `/${transporteSeleccionado.value.numero_serie}`,
        {
          empleado_id: form.value.empleado_id,
          capacidad_carga: form.value.capacidad_carga,
          unidad_medida: form.value.unidad_medida,
          placa: form.value.placa || undefined,
        }
      )
      onSuccess(data)
      showToast('¡Transporte modificado con éxito!', 'success')
      dialog.value = false
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Error al conectar con el servidor', 'error')
    } finally {
      loading.value = false
    }
  }

  return {
    dialog,
    loading,
    form,
    transporteSeleccionado,
    transportistas,
    loadingTransportistas,
    abrirModal,
    editarTransporte,
    validate,
  }
}
