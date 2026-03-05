import { reactive, ref, watch } from 'vue'
import { useZodValidation } from '@/composables/useZodValidation'
import { transporteSchema } from '@/schemas/transporte.schema'
import type { Transporte } from '@/types/transporte.types'

export interface TipoTransporte {
  tipo_id: number
  nombre_tipo: string
}

export interface SubtipoTransporte {
  subtipo_id: number
  tipo_id: number
  nombre_subtipo: string
}

export interface Transportista {
  empleado_id: number
  nombre: string
  apellido_paterno: string
}

export const useRegistrarTransporte = () => {
  const { validate } = useZodValidation(transporteSchema)
    
  const form = reactive({
    numero_serie: '',
    empleado_id: null as number | null,
    tipo_id: null as number | null,
    subtipo_id: null as number | null,
    capacidad_carga: null as number | null,
    unidad_medida: '',
    placa: '',
  })

  const tipos = ref<TipoTransporte[]>([])
  const subtipos = ref<SubtipoTransporte[]>([])
  const subtiposFiltrados = ref<SubtipoTransporte[]>([])
  const transportistas = ref<Transportista[]>([])
  const loadingTipos = ref(false)
  const loadingSubtipos = ref(false)
  const loadingTransportistas = ref(false)

  const fetchTipos = async () => {
    loadingTipos.value = true
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('http://localhost:3000/transporte/tipos', {
        headers: { Authorization: `Bearer ${token}` },
      })
      tipos.value = await res.json()
    } finally {
      loadingTipos.value = false
    }
  }

  const fetchSubtipos = async () => {
    loadingSubtipos.value = true
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('http://localhost:3000/transporte/subtipos', {
        headers: { Authorization: `Bearer ${token}` },
      })
      subtipos.value = await res.json()
    } finally {
      loadingSubtipos.value = false
    }
  }

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

  watch(() => form.tipo_id, (nuevo) => {
    form.subtipo_id = null
    if (nuevo) {
      subtiposFiltrados.value = subtipos.value.filter((s) => s.tipo_id === nuevo)
    } else {
      subtiposFiltrados.value = []
    }
  })

  const resetForm = () => {
    form.numero_serie = ''
    form.empleado_id = null
    form.tipo_id = null
    form.subtipo_id = null
    form.capacidad_carga = null
    form.unidad_medida = ''
    form.placa = ''
    subtiposFiltrados.value = []
  }

  const registrarTransporte = async (): Promise<Transporte> => {
    const token = localStorage.getItem('token')
    const response = await fetch('http://localhost:3000/transporte/nuevo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        numero_serie: form.numero_serie,
        empleado_id: form.empleado_id,
        subtipo_id: form.subtipo_id,
        capacidad_carga: form.capacidad_carga,
        unidad_medida: form.unidad_medida,
        placa: form.placa || undefined,
      }),
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Error al registrar transporte')
    return data
  }

  return {
    form,
    tipos,
    subtipos,
    subtiposFiltrados,
    transportistas,
    loadingTipos,
    loadingSubtipos,
    loadingTransportistas,
    resetForm,
    registrarTransporte,
    fetchTipos,
    fetchSubtipos,
    fetchTransportistas,
    validate,
  }
}
