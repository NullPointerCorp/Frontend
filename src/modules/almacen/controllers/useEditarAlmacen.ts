import { ref, watch } from 'vue'
import { actualizarAlmacenSchema } from '@/modules/almacen/schemas/almacen.schema'
import type { Almacen, ActualizarAlmacenDTO } from '@/modules/almacen/interfaces/almacen-interface'
import { useToast } from '@/composables/useToast'
import almacenAPI from '../api/almacenAPI'

interface FormEditarAlmacen {
  nombre_almacen: string
  descripcion: string
}

export const useEditarAlmacen = (onSuccess: (almacen: Almacen) => void) => {
  const { showToast } = useToast()

  const dialog = ref(false)
  const loading = ref(false)
  const almacenSeleccionado = ref<Almacen | null>(null)
  const erroresForm = ref<Record<string, string>>({})

  const form = ref<FormEditarAlmacen>({
    nombre_almacen: '',
    descripcion: '',
  })

  const resetErrores = () => {
    erroresForm.value = {}
  }

  watch(dialog, (abierto) => {
    if (!abierto) resetErrores()
  })

  const camposValidados = ['nombre_almacen', 'descripcion'] as const
  camposValidados.forEach((campo) => {
    watch(
      () => form.value[campo],
      () => delete erroresForm.value[campo]
    )
  })

  const abrirModal = (almacen: Almacen) => {
    almacenSeleccionado.value = almacen
    form.value = {
      nombre_almacen: almacen.nombre_almacen ?? '',
      descripcion: almacen.descripcion ?? '',
    }
    resetErrores()
    dialog.value = true
  }

  const cerrarModal = () => {
    dialog.value = false
  }

  const validarFormulario = (): ActualizarAlmacenDTO | null => {
    const resultado = actualizarAlmacenSchema.safeParse(form.value)

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
      descripcion: resultado.data.descripcion || undefined,
    }
  }

  const getMensajeError = (error: unknown): string => {
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const respuesta = (error as { response?: { data?: { message?: string } } })
        .response
      return respuesta?.data?.message ?? 'Error al conectar con el servidor'
    }
    return 'Error al conectar con el servidor'
  }

  const editarAlmacen = async (): Promise<void> => {
    if (!almacenSeleccionado.value) return

    const datos = validarFormulario()
    if (!datos) {
      showToast('Por favor corrige los errores del formulario', 'warning')
      return
    }

    loading.value = true
    try {
      const { data } = await almacenAPI.put<Almacen>(
        `/${almacenSeleccionado.value.almacen_id}`,
        datos
      )
      onSuccess(data)
      showToast('¡Almacén modificado con éxito!', 'success')
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
    almacenSeleccionado,
    abrirModal,
    cerrarModal,
    editarAlmacen,
  }
}
