import { ref } from 'vue'
import type { Transporte } from '@/types/transporte.types'
import { useToast } from '@/composables/useToast'

const { showToast } = useToast()

export interface Transportista {
  empleado_id: number
  nombre: string
  apellido_paterno: string
}

export const useEditarTransporte = (onSuccess: (transporte: Transporte) => void) => {
  const dialog = ref(false)
  const loading = ref(false)
  const errorMessage = ref('')
  const transporteSeleccionado = ref<Transporte | null>(null)

  const transportistas = ref<Transportista[]>([])
  const loadingTransportistas = ref(false)

  const form = ref({
    numero_serie: '',
    empleado_id: null as number | null,
    capacidad_carga: null as number | null,
    unidad_medida: '',
    placa: '',
  })

  const fetchTransportistas = async () => {
    loadingTransportistas.value = true
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('http://localhost:3000/empleados/transportistas', {
        headers: { Authorization: `Bearer ${token}` },
      })
      transportistas.value = await res.json()
    } finally {
      loadingTransportistas.value = false
    }
  }

  const abrirModal = async (transporte: Transporte) => {
    transporteSeleccionado.value = transporte
    form.value = {
      numero_serie: transporte.numero_serie,
      empleado_id: transporte.empleado_id,
      capacidad_carga: transporte.capacidad_carga,
      unidad_medida: transporte.unidad_medida,
      placa: transporte.placa || '',
    }
    await fetchTransportistas()
    dialog.value = true
  }

  const editarTransporte = async () => {
    if (!transporteSeleccionado.value) return
    loading.value = true
    errorMessage.value = ''

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `http://localhost:3000/transporte/${transporteSeleccionado.value.numero_serie}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            empleado_id: form.value.empleado_id,
            capacidad_carga: form.value.capacidad_carga,
            unidad_medida: form.value.unidad_medida,
            placa: form.value.placa || undefined,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        errorMessage.value = data.message || 'Error al actualizar transporte'
        return
      }

      onSuccess(data)
      showToast('¡Transporte modificado con éxito!', 'success')
      dialog.value = false
    } catch (error) {
      errorMessage.value = 'Error al conectar con el servidor'
    } finally {
      loading.value = false
    }
  }

  return {
    dialog,
    loading,
    errorMessage,
    form,
    transporteSeleccionado,
    transportistas,
    loadingTransportistas,
    abrirModal,
    editarTransporte,
  }
}
