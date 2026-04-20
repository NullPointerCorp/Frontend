import { ref, watch } from 'vue'
import { actualizarSucursalSchema } from '@/modules/sucursal/schemas/SucursalSchema'
import { useToast } from '@/composables/useToast'
import { useUbicacion } from '@/composables/useUbicacion'
import type { Sucursal, ActualizarSucursalDTO } from '@/modules/sucursal/interfaces/sucursal-interface'
import sucursalAPI from '../api/sucursalAPI'

interface FormEditarSucursal {
  nombre_sucursal: string
  colonia: string
  codigo_postal: string
  calle: string
  numero_exterior: string
  numero_interior: string
  longitud: number | undefined
  latitud: number | undefined
  empleado_id_supervisor: number | null
}

export const useEditarSucursal = (onSuccess: (sucursal: Sucursal) => void) => {
  const { showToast } = useToast()

  const { supervisores, loadingSupervisores, fetchSupervisores } = useUbicacion()

  const dialog = ref(false)
  const loading = ref(false)
  const sucursalSeleccionada = ref<Sucursal | null>(null)
  const erroresForm = ref<Record<string, string>>({})

  const form = ref<FormEditarSucursal>({
    nombre_sucursal: '',
    colonia: '',
    codigo_postal: '',
    calle: '',
    numero_exterior: '',
    numero_interior: '',
    longitud: undefined,
    latitud: undefined,
    empleado_id_supervisor: null,
  })

  const resetErrores = () => {
    erroresForm.value = {}
  }

  watch(dialog, (abierto) => {
    if (!abierto) resetErrores()
  })

  const camposTexto = [
    'nombre_sucursal', 'colonia', 'codigo_postal',
    'calle', 'numero_exterior', 'numero_interior',
  ] as const

  camposTexto.forEach((campo) => {
    watch(() => form.value[campo], () => {
      delete erroresForm.value[campo]
    })
  })

  const abrirModal = async (sucursal: Sucursal) => {
    sucursalSeleccionada.value = sucursal
    form.value = {
      nombre_sucursal: sucursal.nombre_sucursal ?? '',
      colonia: sucursal.colonia ?? '',
      codigo_postal: sucursal.codigo_postal ?? '',
      calle: sucursal.calle ?? '',
      numero_exterior: sucursal.numero_exterior ?? '',
      numero_interior: sucursal.numero_interior ?? '',
      longitud: sucursal.longitud ?? undefined,
      latitud: sucursal.latitud ?? undefined,
      empleado_id_supervisor: sucursal.empleado_id_supervisor ?? null,
    }
    resetErrores()
    await fetchSupervisores()
    dialog.value = true
  }

  const cerrarModal = () => {
    dialog.value = false
  }

  const validarFormulario = (): ActualizarSucursalDTO | null => {
    const resultado = actualizarSucursalSchema.safeParse(form.value)

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
      return respuesta?.data?.message ?? 'Error al conectar con el servidor'
    }
    return 'Error al conectar con el servidor'
  }

  const editarSucursal = async (): Promise<void> => {
    if (!sucursalSeleccionada.value) return

    const datos = validarFormulario()
    if (!datos) {
      showToast('Por favor corrige los errores del formulario', 'warning')
      return
    }

    loading.value = true
    try {
      const { data } = await sucursalAPI.put<Sucursal>(
        `/${sucursalSeleccionada.value.sucursal_id}`,
        datos
      )
      onSuccess({
        ...data,
        nombre_estado: data.nombre_estado ?? sucursalSeleccionada.value.nombre_estado,
        nombre_ciudad: data.nombre_ciudad ?? sucursalSeleccionada.value.nombre_ciudad,
      })
      showToast('¡Sucursal modificada con éxito!', 'success')
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
    sucursalSeleccionada,
    supervisores,
    loadingSupervisores,
    abrirModal,
    cerrarModal,
    editarSucursal,
  }
}
