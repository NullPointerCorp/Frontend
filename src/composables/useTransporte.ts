import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Transporte } from '@/types/transporte.types'
import { useConfirmar } from '@/composables/useConfirmar'
import { useToast } from '@/composables/useToast'

const { showToast } = useToast()

const todosLosTransportes = ref<Transporte[]>([])
const search = ref('')
const page = ref(1)
const limit = ref(10)
const loading = ref(false)

export const useTransporte = () => {
  const router = useRouter()

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

  const totalPaginas = computed(() =>
    Math.ceil(transportesFiltrados.value.length / limit.value)
  )

  const transportesPaginados = computed(() => {
    const start = (page.value - 1) * limit.value
    return transportesFiltrados.value.slice(start, start + limit.value)
  })

  const fetchTransportes = async () => {
    loading.value = true
    try {
      const token = localStorage.getItem('token')
      if (!token) { router.push('/login'); return }
      const response = await fetch('http://localhost:3000/transporte', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) { router.push('/login'); return }
      const data = await response.json()
      todosLosTransportes.value = Array.isArray(data) ? data : []
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

    const token = localStorage.getItem('token')
    const response = await fetch(`http://localhost:3000/transporte/${item.numero_serie}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })

    const data = await response.json()

    if (!response.ok) {
      showToast('¡El transporte no se puede eliminar, ya que cuenta con registros asociados!', 'error')
      return
    }

    todosLosTransportes.value = todosLosTransportes.value.filter(
      (t) => t.numero_serie !== item.numero_serie
    )
    showToast('¡Transporte eliminado con éxito!', 'success')
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
