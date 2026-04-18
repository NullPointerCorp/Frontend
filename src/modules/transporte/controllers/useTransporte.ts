import { ref, computed } from 'vue'
import type { Transporte } from '@/modules/transporte/interfaces/transporte-interface'
import { useConfirmar } from '@/composables/useConfirmar'
import { useToast } from '@/composables/useToast'
import transporteAPI from '../api/transporteAPI'

const todosLosTransportes = ref<Transporte[]>([])
const search = ref('')
const page = ref(1)
const limit = ref(10)
const loading = ref(false)

export const useTransporte = () => {
  const { showToast } = useToast() 

  const { dialog: dialogConfirmar, mensaje: mensajeConfirmar, confirmar, aceptar, cancelar } = useConfirmar()

  const transportesFiltrados = computed(() => {
    const q = search.value.toLowerCase()
    return todosLosTransportes.value.filter(
      (t) =>
        t.numero_serie?.toLowerCase().includes(q) ||
        t.transportista?.toLowerCase().includes(q) ||
        t.tipo_transporte?.toLowerCase().includes(q) ||
        t.subtipo_transporte?.toLowerCase().includes(q) ||
        t.placa?.toLowerCase().includes(q)
    )
  })

  const totalTransportes = computed(() => transportesFiltrados.value.length)
  const totalPaginas = computed(() => Math.ceil(transportesFiltrados.value.length / limit.value))
  const transportesPaginados = computed(() => {
    const start = (page.value - 1) * limit.value
    return transportesFiltrados.value.slice(start, start + limit.value)
  })

  const fetchTransportes = async () => {
    loading.value = true
    try {
      const response = await transporteAPI.get<Transporte[]>('/')
      const data = response.data
      todosLosTransportes.value = Array.isArray(data) ? data : ((data as any)?.data ?? [])
    } catch {
      // interceptor maneja el error
    } finally {
      loading.value = false
    }
  }

  const agregarTransporte = (transporte: Transporte) => {
    todosLosTransportes.value = [...todosLosTransportes.value, transporte]
  }

  const actualizarTransporte = (transporte: Transporte) => {
    todosLosTransportes.value = todosLosTransportes.value.map((t) =>
      t.numero_serie === transporte.numero_serie ? transporte : t
    )
  }

  const eliminarTransporte = async (item: Transporte) => {
    const confirmado = await confirmar(
      `¿Desea eliminar el transporte ${item.numero_serie} - ${item.transportista}?`
    )
    if (!confirmado) return

    try {
      await transporteAPI.delete(`/${item.numero_serie}`) 
      todosLosTransportes.value = todosLosTransportes.value.filter(
        (t) => t.numero_serie !== item.numero_serie
      )
      showToast('¡Transporte eliminado con éxito!', 'success')
    } catch (error: any) {
      showToast(
        error.response?.data?.message || '¡El transporte no se puede eliminar!',
        'error'
      )
    }
  }

  return {
    transportesPaginados,
    totalPaginas,
    totalTransportes,
    page,
    limit,
    search,
    loading,
    fetchTransportes,
    agregarTransporte,
    actualizarTransporte,
    eliminarTransporte,
    dialogConfirmar,
    mensajeConfirmar,
    aceptar,
    cancelar,
  }
}
