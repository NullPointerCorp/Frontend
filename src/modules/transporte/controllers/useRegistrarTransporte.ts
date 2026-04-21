import { reactive, ref, watch } from 'vue'
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
  numero_serie: string
  empleado_id: number | null
  tipo_id: number | null
  subtipo_id: number | null
  capacidad_carga: number | null
  unidad_medida: string
  placa: string
}

const formInicial = (): FormRegistrarTransporte => ({
  numero_serie: '',
  empleado_id: null,
  tipo_id: null,
  subtipo_id: null,
  capacidad_carga: null,
  unidad_medida: '',
  placa: '',
})

export const useRegistrarTransporte = (onSuccess: (transporte: Transporte) => void) => {
  const { showToast } = useToast()

  const dialog = ref(false)
  const loading = ref(false)
  const erroresForm = ref<Record<string, string>>({})

  const form = reactive<FormRegistrarTransporte>(formInicial())

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

  const fetchCatalogos = async () => {
    await Promise.all([fetchTipos(), fetchSubtipos(), fetchTransportistas()])
  }

  const resetForm = () => {
    Object.assign(form, formInicial())
    subtiposFiltrados.value = []
  }

  const resetErrores = () => {
    erroresForm.value = {}
  }

  watch(() => form.tipo_id, (nuevo) => {
    form.subtipo_id = null
    subtiposFiltrados.value = nuevo
      ? subtipos.value.filter((s) => s.tipo_id === nuevo)
      : []
    delete erroresForm.value.tipo_id
    delete erroresForm.value.subtipo_id
  })

  const camposTexto = ['numero_serie', 'unidad_medida', 'placa'] as const
  camposTexto.forEach((campo) => {
    watch(() => form[campo], () => { delete erroresForm.value[campo] })
  })

  const camposSelect = ['empleado_id', 'subtipo_id', 'capacidad_carga'] as const
  camposSelect.forEach((campo) => {
    watch(() => form[campo], () => { delete erroresForm.value[campo] })
  })

  const abrirModal = async () => {
    resetForm()
    resetErrores()
    dialog.value = true
    await fetchCatalogos()
  }

  const cerrarModal = () => {
    dialog.value = false
    setTimeout(() => {
      resetForm()
      resetErrores()
    }, 300)
  }

  const validarFormulario = (): CrearTransporteDTO | null => {
    const resultado = transporteSchema.safeParse(form)

    if (!resultado.success) {
      const campos = resultado.error.flatten().fieldErrors
      const errores: Record<string, string> = {}
      for (const [key, mensajes] of Object.entries(campos)) {
        errores[key] = mensajes?.[0] ?? ''
      }
      erroresForm.value = errores
      return null
    }

    return {
      numero_serie: resultado.data.numero_serie,
      empleado_id: resultado.data.empleado_id!,
      subtipo_id: resultado.data.subtipo_id!,
      capacidad_carga: resultado.data.capacidad_carga!,
      unidad_medida: resultado.data.unidad_medida,
      placa: resultado.data.placa || undefined,
    }
  }

  const getMensajeError = (error: unknown): string => {
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const respuesta = (error as { response?: { data?: { message?: string } } }).response
      return respuesta?.data?.message ?? 'Error al registrar transporte'
    }
    return 'Error al registrar transporte'
  }

  const registrarTransporte = async (): Promise<void> => {
    const datos = validarFormulario()
    if (!datos) {
      showToast('Por favor corrige los errores del formulario', 'warning')
      return
    }

    loading.value = true
    try {
      const { data } = await transporteAPI.post<Transporte>('/nuevo', datos)
      onSuccess(data)
      showToast('¡Transporte registrado con éxito!', 'success')
      cerrarModal()
    } catch (error: unknown) {
      showToast(getMensajeError(error), 'error')
    } finally {
      loading.value = false
    }
  }

  return {
    dialog,
    loading,
    form,
    erroresForm,
    tipos,
    subtiposFiltrados,
    transportistas,
    loadingTipos,
    loadingSubtipos,
    loadingTransportistas,
    abrirModal,
    cerrarModal,
    registrarTransporte,
  }
}
