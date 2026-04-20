import { ref, watch } from 'vue'
import { actualizarClienteSchema } from '@/modules/cliente/schemas/ClienteSchema'
import type { Cliente, ActualizarClienteDTO } from '@/modules/cliente/interfaces/cliente-interface'
import { useToast } from '@/composables/useToast'
import clienteAPI from '../api/clienteAPI'

interface FormEditarCliente {
  nombre: string
  apellido_paterno: string
  apellido_materno: string
  correo: string
  telefono: string
}

export const useEditarCliente = (onSuccess: (cliente: Cliente) => void) => {
  const { showToast } = useToast()

  const dialog = ref(false)
  const loading = ref(false)
  const clienteSeleccionado = ref<Cliente | null>(null)
  const erroresForm = ref<Record<string, string>>({})

  const form = ref<FormEditarCliente>({
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    correo: '',
    telefono: '',
  })

  const resetErrores = () => {
    erroresForm.value = {}
  }

  watch(dialog, (abierto) => {
    if (!abierto) resetErrores()
  })

  const camposValidados = ['nombre', 'apellido_paterno', 'apellido_materno', 'telefono'] as const
  camposValidados.forEach((campo) => {
    watch(
      () => form.value[campo],
      () => delete erroresForm.value[campo]
    )
  })

  const abrirModal = (cliente: Cliente) => {
    clienteSeleccionado.value = cliente
    form.value = {
      nombre: cliente.nombre,
      apellido_paterno: cliente.apellido_paterno,
      apellido_materno: cliente.apellido_materno ?? '',
      correo: cliente.correo,
      telefono: cliente.telefono ?? '',
    }
    resetErrores()
    dialog.value = true
  }

  const cerrarModal = () => {
    dialog.value = false
  }

  const validarFormulario = (): ActualizarClienteDTO | null => {
    const resultado = actualizarClienteSchema.safeParse({
      nombre: form.value.nombre,
      apellido_paterno: form.value.apellido_paterno,
      apellido_materno: form.value.apellido_materno,
      telefono: form.value.telefono,
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
      nombre: resultado.data.nombre,
      apellido_paterno: resultado.data.apellido_paterno,
      apellido_materno: resultado.data.apellido_materno || null,
      telefono: resultado.data.telefono,
    }
  }

  const getMensajeError = (error: unknown): string => {
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const respuesta = (error as { response?: { data?: { message?: string } } }).response
      return respuesta?.data?.message ?? 'Error al conectar con el servidor'
    }
    return 'Error al conectar con el servidor'
  }

  const editarCliente = async (): Promise<void> => {
    if (!clienteSeleccionado.value) return

    const datos = validarFormulario()
    if (!datos) {
      showToast('Por favor corrige los errores del formulario', 'warning')
      return
    }

    loading.value = true
    try {
      const { data } = await clienteAPI.put<Cliente>(
        `/${clienteSeleccionado.value.cliente_id}`,
        datos
      )
      onSuccess(data)
      showToast('¡Cliente modificado con éxito!', 'success')
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
    clienteSeleccionado,
    abrirModal,
    cerrarModal,
    editarCliente,
  }
}
