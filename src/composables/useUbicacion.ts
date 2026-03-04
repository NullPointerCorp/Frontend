import { ref, watch } from 'vue'

export interface Estado {
  estado_id: number
  nombre_estado: string
}

export interface Ciudad {
  ciudad_id: number
  nombre_ciudad: string
}

export interface Gerente {
  empleado_id: number
  nombre: string
  apellido_paterno: string
}

export const useUbicacion = () => {
  const estados = ref<Estado[]>([])
  const ciudades = ref<Ciudad[]>([])
  const gerentes = ref<Gerente[]>([])
  const loadingEstados = ref(false)
  const loadingCiudades = ref(false)
  const loadingGerentes = ref(false)
  const estadoSeleccionado = ref<number | null>(null)
  const gerenteSeleccionado = ref<number | null>(null)

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

  const fetchGerentes = async () => {
    loadingGerentes.value = true
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('http://localhost:3000/empleados/gerentes', {
        headers: { Authorization: `Bearer ${token}` }
      })
      gerentes.value = await res.json()
    } finally {
      loadingGerentes.value = false
    }
  }

  watch(estadoSeleccionado, (nuevo, anterior) => {
    if (nuevo) fetchCiudades(nuevo)
    else ciudades.value = []
  })

  return {
    estados,
    ciudades,
    gerentes,
    loadingEstados,
    loadingCiudades,
    loadingGerentes,
    estadoSeleccionado,
    gerenteSeleccionado,
    fetchEstados,
    fetchCiudades,
    fetchGerentes,
  }
}