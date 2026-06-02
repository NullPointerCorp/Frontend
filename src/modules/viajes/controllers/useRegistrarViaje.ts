import { reactive, ref, watch } from 'vue'
import { useToast } from '@/composables/useToast'
import viajeAPI from '../api/viajeAPI'
import ubicacionAPI from '@/modules/envio/api/ubicacionAPI'
import sucursalAPI from '@/modules/sucursal/api/sucursalAPI'
import type { CrearViajeDTO, Viaje, ViajeCatalogos } from '../interfaces/viaje-interface'

const hoyInput = () => {
  const now = new Date()
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
  return now.toISOString().slice(0, 16)
}

const formInicial = (): CrearViajeDTO => ({
  numero_serie: '',
  sucursal_destino_id: null,
  fecha_salida: hoyInput(),
  fecha_llegada: '',
})

export const useRegistrarViaje = (onSuccess: (viaje: Viaje) => void) => {
  const { showToast } = useToast()

  const dialog = ref(false)
  const loading = ref(false)
  const loadingCatalogos = ref(false)
  const loadingTransportes = ref(false)
  const erroresForm = ref<Record<string, string>>({})
  const catalogos = ref<ViajeCatalogos | null>(null)
  const transportes = ref<ViajeCatalogos['transportes']>([])
  const estados = ref<any[]>([])
  const ciudades = ref<any[]>([])
  const sucursalesDestino = ref<any[]>([])
  const estadoDestino = ref<number | null>(null)
  const ciudadDestino = ref<number | null>(null)
  const loadingCiudades = ref(false)
  const loadingSucursales = ref(false)
  const form = reactive<CrearViajeDTO>(formInicial())

  const resetForm = () => {
    Object.assign(form, formInicial())
    erroresForm.value = {}
    estados.value = []
    ciudades.value = []
    sucursalesDestino.value = []
    estadoDestino.value = null
    ciudadDestino.value = null
  }

  const fetchCatalogos = async () => {
    loadingCatalogos.value = true
    try {
      const { data } = await viajeAPI.get<ViajeCatalogos>('/catalogos')
      catalogos.value = data
      const estadosRes = await ubicacionAPI.get('/estados')
      estados.value = Array.isArray(estadosRes.data) ? estadosRes.data : (estadosRes.data?.data ?? [])
    } catch {
      catalogos.value = null
      estados.value = []
    } finally {
      loadingCatalogos.value = false
    }
  }

  const fetchCiudadesDestino = async (estadoId: number | null) => {
    ciudadDestino.value = null
    form.sucursal_destino_id = null
    ciudades.value = []
    sucursalesDestino.value = []
    if (!estadoId) return

    loadingCiudades.value = true
    try {
      const { data } = await ubicacionAPI.get(`/ciudades/${estadoId}`)
      ciudades.value = Array.isArray(data) ? data : (data?.data ?? [])
    } finally {
      loadingCiudades.value = false
    }
  }

  const fetchSucursalesDestino = async (ciudadId: number | null) => {
    form.sucursal_destino_id = null
    sucursalesDestino.value = []
    if (!ciudadId) return

    loadingSucursales.value = true
    try {
      const { data } = await sucursalAPI.get(`/por-ciudad?ciudad_id=${ciudadId}`)
      const origenId = catalogos.value?.origen?.sucursal_id
      const lista = Array.isArray(data) ? data : (data?.data ?? [])
      sucursalesDestino.value = lista.filter((s: any) => s.sucursal_id !== origenId)
    } finally {
      loadingSucursales.value = false
    }
  }

  const fetchTransportesDisponibles = async () => {
    if (!form.fecha_salida || !form.fecha_llegada) {
      transportes.value = []
      form.numero_serie = ''
      return
    }
    loadingTransportes.value = true
    try {
      const { data } = await viajeAPI.get<ViajeCatalogos['transportes']>('/transportes-disponibles', {
        params: { fecha_salida: form.fecha_salida, fecha_llegada: form.fecha_llegada },
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

  watch(() => [form.fecha_salida, form.fecha_llegada], fetchTransportesDisponibles)

  const abrirModal = async () => {
    resetForm()
    dialog.value = true
    await fetchCatalogos()
  }

  const cerrarModal = () => {
    dialog.value = false
  }

  const validar = () => {
    const errores: Record<string, string> = {}
    if (!form.numero_serie) errores.numero_serie = 'Selecciona un transporte'
    if (!form.sucursal_destino_id) errores.sucursal_destino_id = 'Selecciona un destino'
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

  const registrarViaje = async () => {
    if (!validar()) {
      showToast('Por favor corrige los errores del formulario', 'warning')
      return
    }

    loading.value = true
    try {
      const { data } = await viajeAPI.post<Viaje>('/nuevo', {
        numero_serie: form.numero_serie,
        sucursal_destino_id: form.sucursal_destino_id,
        fecha_salida: form.fecha_salida,
        fecha_llegada: form.fecha_llegada || null,
      })
      onSuccess(data)
      showToast('Viaje registrado con exito', 'success')
      cerrarModal()
    } catch (error: unknown) {
      const respuesta = (error as { response?: { data?: { message?: string } } }).response
      showToast(respuesta?.data?.message ?? 'Error al registrar viaje', 'error')
    } finally {
      loading.value = false
    }
  }

  return {
    dialog,
    loading,
    loadingCatalogos,
    loadingTransportes,
    erroresForm,
    catalogos,
    transportes,
    estados,
    ciudades,
    sucursalesDestino,
    estadoDestino,
    ciudadDestino,
    loadingCiudades,
    loadingSucursales,
    form,
    fetchCiudadesDestino,
    fetchSucursalesDestino,
    abrirModal,
    cerrarModal,
    registrarViaje,
  }
}
