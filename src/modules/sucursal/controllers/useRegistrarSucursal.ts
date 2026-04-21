import { reactive, ref, watch } from 'vue'
import { sucursalSchema } from '@/modules/sucursal/schemas/SucursalSchema'
import { useToast } from '@/composables/useToast'
import { useUbicacion } from '@/composables/useUbicacion'
import type { Sucursal, CrearSucursalDTO } from '@/modules/sucursal/interfaces/sucursal-interface'
import sucursalAPI from '../api/sucursalAPI'

interface FormRegistrarSucursal {
  nombre_sucursal: string
  ciudad_id: number | null
  colonia: string
  codigo_postal: string
  calle: string
  numero_exterior: string
  numero_interior: string
  longitud: number | undefined
  latitud: number | undefined
  empleado_id_supervisor: number | null
}

const formInicial = (): FormRegistrarSucursal => ({
  nombre_sucursal: '',
  ciudad_id: null,
  colonia: '',
  codigo_postal: '',
  calle: '',
  numero_exterior: '',
  numero_interior: '',
  longitud: undefined,
  latitud: undefined,
  empleado_id_supervisor: null,
})

export const useRegistrarSucursal = (onSuccess: (sucursal: Sucursal) => void) => {
  const { showToast } = useToast()

  const {
    estados,
    ciudades,
    supervisores,
    loadingEstados,
    loadingCiudades,
    loadingSupervisores,
    estadoSeleccionado,
    fetchEstados,
    fetchSupervisores,
  } = useUbicacion()

  const dialog = ref(false)
  const loading = ref(false)
  const erroresForm = ref<Record<string, string>>({})

  const form = reactive<FormRegistrarSucursal>(formInicial())

  const resetForm = () => Object.assign(form, formInicial())

  const resetErrores = () => {
    erroresForm.value = {}
  }

  const resetUbicacion = () => {
    estadoSeleccionado.value = null
  }

  watch(estadoSeleccionado, (_, anterior) => {
    if (anterior !== null) form.ciudad_id = null
  })

  const camposTexto = [
    'nombre_sucursal', 'colonia', 'codigo_postal',
    'calle', 'numero_exterior', 'numero_interior',
  ] as const

  camposTexto.forEach((campo) => {
    watch(() => form[campo], () => {
      delete erroresForm.value[campo]
    })
  })

  watch(() => form.ciudad_id, () => { delete erroresForm.value.ciudad_id })

  const abrirModal = async () => {
    resetForm()
    resetErrores()
    resetUbicacion()
    dialog.value = true
    await Promise.all([fetchEstados(), fetchSupervisores()])
  }

  const cerrarModal = () => {
    dialog.value = false
    setTimeout(() => {
      resetForm()
      resetErrores()
      resetUbicacion()
    }, 300)
  }

  const validarFormulario = (): CrearSucursalDTO | null => {
    const resultado = sucursalSchema.safeParse({
      ...form,
      ciudad_id: form.ciudad_id,
      empleado_id_supervisor: form.empleado_id_supervisor ?? null,
    })

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
      nombre_sucursal: resultado.data.nombre_sucursal.trim(),
      ciudad_id: resultado.data.ciudad_id,
      colonia: resultado.data.colonia.trim(),
      codigo_postal: resultado.data.codigo_postal.trim(),
      calle: resultado.data.calle.trim(),
      numero_exterior: resultado.data.numero_exterior.trim(),
      numero_interior: resultado.data.numero_interior?.trim() || null,
      longitud: resultado.data.longitud ?? null,
      latitud: resultado.data.latitud ?? null,
      empleado_id_supervisor: resultado.data.empleado_id_supervisor ?? null,
    }
  }

  const getMensajeError = (error: unknown): string => {
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const respuesta = (error as { response?: { data?: { message?: string } } }).response
      return respuesta?.data?.message ?? 'Error al registrar sucursal'
    }
    return 'Error al registrar sucursal'
  }

  const registrarSucursal = async (): Promise<void> => {
    const datos = validarFormulario()
    if (!datos) {
      showToast('Por favor corrige los errores del formulario', 'warning')
      return
    }

    loading.value = true
    try {
      const { data } = await sucursalAPI.post<Sucursal>('/nuevo', datos)
      onSuccess(data)
      showToast('¡Sucursal registrada con éxito!', 'success')
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
    estados,
    ciudades,
    supervisores,
    loadingEstados,
    loadingCiudades,
    loadingSupervisores,
    estadoSeleccionado,
    abrirModal,
    cerrarModal,
    registrarSucursal,
  }
}
