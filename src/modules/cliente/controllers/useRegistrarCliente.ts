import { reactive, ref, watch } from 'vue'
import { clienteSchema } from '@/modules/cliente/schemas/ClienteSchema'
import type { Cliente, CrearClienteDTO } from '@/modules/cliente/interfaces/cliente-interface'
import { useToast } from '@/composables/useToast'
import clienteAPI from '../api/clienteAPI'

interface FormCliente {
  nombre: string
  apellido_paterno: string
  apellido_materno: string
  correo: string
  telefono: string
}

export const useRegistrarCliente = (onSuccess: (cliente: Cliente) => void) => {
  const { showToast } = useToast()

  const dialog = ref(false)
  const loading = ref(false)
  const erroresForm = ref<Record<string, string>>({})

  const form = reactive<FormCliente>({
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    correo: '',
    telefono: '',
  })

  const resetForm = () => {
    form.nombre = ''
    form.apellido_paterno = ''
    form.apellido_materno = ''
    form.correo = ''
    form.telefono = ''
  }

  const resetErrores = () => {
    erroresForm.value = {}
  }

  const camposValidados = ['nombre', 'apellido_paterno', 'apellido_materno', 'correo', 'telefono'] as const
  camposValidados.forEach((campo) => {
    watch(() => form[campo], () => {
      delete erroresForm.value[campo]
    })
  })

  const abrirModal = () => {
    resetForm()
    resetErrores()
    dialog.value = true
  }

  const cerrarModal = () => {
    dialog.value = false
    setTimeout(() => {
      resetForm()
      resetErrores()
    }, 300)
  }

  const validarFormulario = (): CrearClienteDTO | null => {
    const resultado = clienteSchema.safeParse(form)

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
      correo: resultado.data.correo.toLowerCase(),
      telefono: resultado.data.telefono,
    }
  }

  const getMensajeError = (error: unknown): string => {
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const respuesta = (error as { response?: { data?: { message?: string } } }).response
      return respuesta?.data?.message ?? 'Error al registrar cliente'
    }
    return 'Error al registrar cliente'
  }

  const registrarCliente = async (): Promise<void> => {
    const datos = validarFormulario()
    if (!datos) {
      showToast('Por favor corrige los errores del formulario', 'warning')
      return
    }

    loading.value = true
    try {
      const { data } = await clienteAPI.post<Cliente>('/nuevo', datos)
      onSuccess(data)
      showToast('¡Cliente registrado con éxito!', 'success')
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
    abrirModal,
    cerrarModal,
    registrarCliente,
  }
}
