import { reactive, ref, watch } from 'vue'
import { useZodValidation } from '@/composables/useZodValidation'
import { transporteSchema } from '@/modules/transporte/schemas/TransporteSchema'
import { useToast } from '@/composables/useToast'
import type { Transporte, CrearTransporteDTO } from '@/modules/transporte/interfaces/transporte-interface'
import transporteAPI from '../api/transporteAPI'
import empleadoAPI from '@/modules/empleado/api/empleadoAPI'

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

interface FormRegistrarTransporte {
  numero_serie: string;
  empleado_id: number | null;
  tipo_id: number | null;
  subtipo_id: number | null;
  capacidad_carga: number | null;
  unidad_medida: string;
  placa: string;
}

export const useRegistrarTransporte = () => {
  const { validate } = useZodValidation(transporteSchema)
  const { showToast } = useToast()

  const form = reactive<FormRegistrarTransporte>({
    numero_serie: '',
    empleado_id: null,
    tipo_id: null,
    subtipo_id: null,
    capacidad_carga: null,
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
      const { data } = await transporteAPI.get('/tipos')
      tipos.value = Array.isArray(data) ? data : (data?.data ?? [])
    } catch {
      tipos.value = []
    } finally {
      loadingTipos.value = false
    }
  }

  const fetchSubtipos = async () => {
    loadingSubtipos.value = true
    try {
      const { data } = await transporteAPI.get('/subtipos')
      subtipos.value = Array.isArray(data) ? data : (data?.data ?? [])
    } catch {
      subtipos.value = []
    } finally {
      loadingSubtipos.value = false
    }
  }

  const fetchTransportistas = async () => {
    loadingTransportistas.value = true
    try {
      const { data } = await empleadoAPI.get('/transportistas')
      transportistas.value = Array.isArray(data) ? data : (data?.data ?? [])
    } catch {
      transportistas.value = []
    } finally {
      loadingTransportistas.value = false
    }
  }

  watch(() => form.tipo_id, (nuevo) => {
    form.subtipo_id = null
    subtiposFiltrados.value = nuevo
      ? subtipos.value.filter((s) => s.tipo_id === nuevo)
      : []
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

  const prepararDatos = (): CrearTransporteDTO => ({
    numero_serie: form.numero_serie,
    empleado_id: form.empleado_id!,
    subtipo_id: form.subtipo_id!,
    capacidad_carga: form.capacidad_carga!,
    unidad_medida: form.unidad_medida,
    placa: form.placa || undefined,
  })

  const registrarTransporte = async (): Promise<Transporte> => {
    try {
      const { data } = await transporteAPI.post<Transporte>('/nuevo', prepararDatos())
      showToast('¡Transporte registrado con éxito!', 'success')
      return data
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Error al registrar transporte', 'error')
      throw error
    }
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
