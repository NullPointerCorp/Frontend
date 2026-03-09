import { ref, watch } from 'vue'

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
      const token = localStorage.getItem('token')
      const res = await fetch('http://localhost:3000/ubicacion/estados', {
        headers: { Authorization: `Bearer ${token}` }
      })
      estados.value = await res.json()
    } finally {
      loadingEstados.value = false
    }
  }

  const fetchCiudades = async (estado_id: number) => {
    loadingCiudades.value = true
    ciudades.value = []
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`http://localhost:3000/ubicacion/ciudades/${estado_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      ciudades.value = await res.json()
    } finally {
      loadingCiudades.value = false
    }
  }

  const fetchSucursalesPorCiudad = async (ciudad_id: number) => {
    loadingSucursales.value = true
    sucursalesOpciones.value = []
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`http://localhost:3000/sucursales/por-ciudad?ciudad_id=${ciudad_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      sucursalesOpciones.value = await res.json()
    } finally {
      loadingSucursales.value = false
    }
  }

  const fetchSupervisores = async () => {
    loadingSupervisores.value = true
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('http://localhost:3000/empleados/supervisores', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      supervisores.value = data
    } finally {
      loadingSupervisores.value = false
    }
  }

  // Cuando cambia el estado → limpia ciudad y sucursales
  watch(estadoSeleccionado, (nuevo, anterior) => {
    if (anterior !== null) {
      ciudadSeleccionada.value = null
      sucursalesOpciones.value = []
    }
    if (nuevo) fetchCiudades(nuevo)
    else ciudades.value = []
  })

  // Cuando cambia la ciudad → carga sucursales
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