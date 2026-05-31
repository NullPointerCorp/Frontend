import { computed, ref } from 'vue'
import viajeAPI from '../api/viajeAPI'
import type { TipoFiltroViaje, Viaje } from '../interfaces/viaje-interface'

const todosLosViajes = ref<Viaje[]>([])
const search = ref('')
const page = ref(1)
const limit = ref(10)
const loading = ref(false)
const tipoFiltro = ref<TipoFiltroViaje>('salidas')

export const useViajes = () => {
  const viajesFiltrados = computed(() => {
    const q = search.value.toLowerCase().trim()
    return todosLosViajes.value.filter(
      (v) =>
        v.viaje_id.toString().includes(q) ||
        v.numero_serie.toLowerCase().includes(q) ||
        v.transportista.toLowerCase().includes(q) ||
        v.origen.toLowerCase().includes(q) ||
        v.destino.toLowerCase().includes(q) ||
        (v.placa ?? '').toLowerCase().includes(q)
    )
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

  return {
    viajesPaginados,
    totalPaginas,
    totalViajes,
    page,
    limit,
    search,
    loading,
    tipoFiltro,
    fetchViajes,
    agregarViaje,
  }
}
