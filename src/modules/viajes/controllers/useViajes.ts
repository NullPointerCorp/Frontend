import { computed, ref } from 'vue'
import viajeAPI from '../api/viajeAPI'
import type { TipoFiltroViaje, Viaje } from '../interfaces/viaje-interface'
import { useConfirmar } from '@/composables/useConfirmar'
import { useToast } from '@/composables/useToast'

const todosLosViajes = ref<Viaje[]>([])
const search = ref('')
const page = ref(1)
const limit = ref(10)
const loading = ref(false)
const tipoFiltro = ref<TipoFiltroViaje>('salidas')
const filtroEstado = ref<string>('')
const fechaDesde = ref<string>('')
const fechaHasta = ref<string>('')

export const useViajes = () => {
  const { showToast } = useToast()
  const { dialog: dialogConfirmar, mensaje: mensajeConfirmar, textoAceptar, colorAceptar, confirmar, aceptar, cancelar } = useConfirmar()
  const viajesFiltrados = computed(() => {
    const q = search.value.toLowerCase().trim()
    return todosLosViajes.value.filter((v) => {
      if (q && !(
        v.viaje_id.toString().includes(q) ||
        v.numero_serie.toLowerCase().includes(q) ||
        v.transportista.toLowerCase().includes(q) ||
        v.origen.toLowerCase().includes(q) ||
        v.destino.toLowerCase().includes(q) ||
        (v.placa ?? '').toLowerCase().includes(q)
      )) return false

      if (filtroEstado.value && v.estado !== filtroEstado.value) return false

      if (fechaDesde.value && v.fecha_salida.slice(0, 10) < fechaDesde.value) return false
      if (fechaHasta.value && v.fecha_salida.slice(0, 10) > fechaHasta.value) return false

      return true
    })
  })

  const totalViajes = computed(() => viajesFiltrados.value.length)
  const totalPaginas = computed(() => Math.ceil(viajesFiltrados.value.length / limit.value))

  const viajesPaginados = computed(() => {
    const start = (page.value - 1) * limit.value
    return viajesFiltrados.value.slice(start, start + limit.value)
  })

  const fetchViajes = async () => {
    loading.value = true
    try {
      const { data } = await viajeAPI.get<Viaje[]>('/', {
        params: { tipo: tipoFiltro.value },
      })
      todosLosViajes.value = Array.isArray(data) ? data : []
    } catch {
      todosLosViajes.value = []
    } finally {
      loading.value = false
    }
  }

  const agregarViaje = (viaje: Viaje) => {
    todosLosViajes.value = [viaje, ...todosLosViajes.value]
  }

  const actualizarViaje = (viaje: Viaje) => {
    todosLosViajes.value = todosLosViajes.value.map((v) =>
      v.viaje_id === viaje.viaje_id ? viaje : v
    )
  }

  const cancelarViaje = async (item: Viaje) => {
    const confirmado = await confirmar(
      `¿Desea cancelar el viaje #${item.viaje_id} de ${item.origen} a ${item.destino}? Los envíos asignados volverán a estado "en espera".`,
      { textoAceptar: 'Cancelar', colorAceptar: 'error' }
    )
    if (!confirmado) return
    try {
      const { data } = await viajeAPI.patch(`/${item.viaje_id}/cancelar`)
      actualizarViaje(data)
      showToast('Viaje cancelado', 'success')
    } catch (error: any) {
      showToast(error.response?.data?.message ?? 'No se pudo cancelar el viaje', 'error')
    }
  }

  return {
    viajesPaginados,
    totalPaginas,
    totalViajes,
    page,
    limit,
    search,
    loading,
    tipoFiltro,
    filtroEstado,
    fechaDesde,
    fechaHasta,
    fetchViajes,
    agregarViaje,
    actualizarViaje,
    cancelarViaje,
    dialogConfirmar,
    mensajeConfirmar,
    textoAceptar,
    colorAceptar,
    aceptar,
    cancelar,
  }
}
