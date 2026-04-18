import { ref, watch } from 'vue'
import { createAPI } from '@/api/base.api'

const ubicacionAPI = createAPI('http://localhost:3000/ubicacion')
const empleadoAPI = createAPI('http://localhost:3000/empleados')
const sucursalAPI = createAPI('http://localhost:3000/sucursales')

export interface Estado {
  estado_id: number
  nombre_estado: string
}

export interface Ciudad {
  ciudad_id: number
  nombre_ciudad: string
}

export interface Supervisor {
  empleado_id: number
  nombre: string
  apellido_paterno: string
}

export interface SucursalOpcion {
  sucursal_id: number
  nombre_sucursal: string
}

export const useUbicacion = () => {
  const estados = ref<Estado[]>([])
  const ciudades = ref<Ciudad[]>([])
  const sucursalesOpciones = ref<SucursalOpcion[]>([])
  const supervisores = ref<Supervisor[]>([])

  const loadingEstados = ref(false)
  const loadingCiudades = ref(false)
  const loadingSucursales = ref(false)
  const loadingSupervisores = ref(false)

  const estadoSeleccionado = ref<number | null>(null)
  const ciudadSeleccionada = ref<number | null>(null)
  const supervisorSeleccionado = ref<number | null>(null)

  const fetchEstados = async () => {
    loadingEstados.value = true
    try {
      const { data } = await ubicacionAPI.get('/estados')
      estados.value = Array.isArray(data) ? data : (data?.data ?? [])
    } catch {
      estados.value = []
    } finally {
      loadingEstados.value = false
    }
  }

  const fetchCiudades = async (estado_id: number) => {
    loadingCiudades.value = true
    ciudades.value = []
    try {
      const { data } = await ubicacionAPI.get(`/ciudades/${estado_id}`)
      ciudades.value = Array.isArray(data) ? data : (data?.data ?? [])
    } catch {
      ciudades.value = []
    } finally {
      loadingCiudades.value = false
    }
  }

  const fetchSucursalesPorCiudad = async (ciudad_id: number) => {
    loadingSucursales.value = true
    sucursalesOpciones.value = []
    try {
      const { data } = await sucursalAPI.get(`/por-ciudad?ciudad_id=${ciudad_id}`)
      sucursalesOpciones.value = Array.isArray(data) ? data : (data?.data ?? [])
    } catch {
      sucursalesOpciones.value = []
    } finally {
      loadingSucursales.value = false
    }
  }

  const fetchSupervisores = async () => {
    loadingSupervisores.value = true
    try {
      const { data } = await empleadoAPI.get('/supervisores')
      supervisores.value = Array.isArray(data) ? data : (data?.data ?? [])
    } catch {
      supervisores.value = []
    } finally {
      loadingSupervisores.value = false
    }
  }

  watch(estadoSeleccionado, (nuevo, anterior) => {
    if (anterior !== null) {
      ciudadSeleccionada.value = null
      sucursalesOpciones.value = []
    }
    if (nuevo) fetchCiudades(nuevo)
    else ciudades.value = []
  })

  watch(ciudadSeleccionada, (nuevo, anterior) => {
    if (anterior !== null) sucursalesOpciones.value = []
    if (nuevo) fetchSucursalesPorCiudad(nuevo)
  })

  return {
    estados,
    ciudades,
    sucursalesOpciones,
    supervisores,
    loadingEstados,
    loadingCiudades,
    loadingSucursales,
    loadingSupervisores,
    estadoSeleccionado,
    ciudadSeleccionada,
    supervisorSeleccionado,
    fetchEstados,
    fetchCiudades,
    fetchSucursalesPorCiudad,
    fetchSupervisores,
  }
}
