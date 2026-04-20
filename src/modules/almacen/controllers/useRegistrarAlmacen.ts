import { reactive, ref, watch } from 'vue'
import { almacenSchema } from '@/modules/almacen/schemas/almacen.schema'
import type { Almacen, CrearAlmacenDTO } from '@/modules/almacen/interfaces/almacen-interface'
import { useToast } from '@/composables/useToast'
import { useUbicacion } from '@/composables/useUbicacion'
import almacenAPI from '../api/almacenAPI'

interface FormAlmacen {
  nombre_almacen: string
  sucursal_id: number | null
  descripcion: string
}

export const useRegistrarAlmacen = (onSuccess: (almacen: Almacen) => void) => {
  const { showToast } = useToast()

  const {
    estados,
    ciudades,
    sucursalesOpciones,
    loadingEstados,
    loadingCiudades,
    loadingSucursales,
    estadoSeleccionado,
    ciudadSeleccionada,
    fetchEstados,
  } = useUbicacion()

  const dialog = ref(false)
  const loading = ref(false)
  const erroresForm = ref<Record<string, string>>({})

  const form = reactive<FormAlmacen>({
    nombre_almacen: '',
    sucursal_id: null,
    descripcion: '',
  })

  const resetForm = () => {
    form.nombre_almacen = ''
    form.sucursal_id = null
    form.descripcion = ''
  }

  const resetErrores = () => {
    erroresForm.value = {}
  }

  const resetUbicacion = () => {
    estadoSeleccionado.value = null
    ciudadSeleccionada.value = null
  }

  // Limpia sucursal al cambiar de ciudad
  watch(ciudadSeleccionada, (nuevo, anterior) => {
    if (anterior !== null) {
      form.sucursal_id = null
    }
  })

  // Limpia el error del campo cuando el usuario lo edita
  const camposValidados = ['nombre_almacen', 'sucursal_id', 'descripcion'] as const
  camposValidados.forEach((campo) => {
    watch(() => form[campo], () => {
      delete erroresForm.value[campo]
    })
  })

  const abrirModal = async () => {
    resetForm()
    resetErrores()
    resetUbicacion()
    dialog.value = true
    await fetchEstados()
  }

  const cerrarModal = () => {
    dialog.value = false
    setTimeout(() => {
      resetForm()
      resetErrores()
      resetUbicacion()
    }, 300)
  }

  const validarFormulario = (): CrearAlmacenDTO | null => {
    const resultado = almacenSchema.safeParse(form)

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
      nombre_almacen: resultado.data.nombre_almacen,
      sucursal_id: resultado.data.sucursal_id,
      descripcion: resultado.data.descripcion || undefined,
    }
  }

  const getMensajeError = (error: unknown): string => {
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const respuesta = (error as { response?: { data?: { message?: string } } })
        .response
      return respuesta?.data?.message ?? 'Error de conexión con el servidor'
    }
    return 'Error de conexión con el servidor'
  }

  const registrarAlmacen = async (): Promise<void> => {
    const datos = validarFormulario()
    if (!datos) {
      showToast('Por favor corrige los errores del formulario', 'warning')
      return
    }

    loading.value = true
    try {
      const { data } = await almacenAPI.post<Almacen>('/nuevo', datos)
      onSuccess(data)
      showToast('¡Almacén registrado con éxito!', 'success')
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
    sucursalesOpciones,
    loadingEstados,
    loadingCiudades,
    loadingSucursales,
    estadoSeleccionado,
    ciudadSeleccionada,
    abrirModal,
    cerrarModal,
    registrarAlmacen,
  }
}
