import { reactive } from 'vue'
import { useZodValidation } from '@/composables/useZodValidation'
import { clienteSchema } from '@/modules/cliente/schemas/ClienteSchema'
import type { Cliente, CrearClienteDTO } from '@/modules/cliente/interfaces/cliente-interface'
import { useToast } from '@/composables/useToast'
import clienteAPI from '../api/clienteAPI'

interface FormCliente {
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  correo: string;
  telefono: string;
}

export const useRegistrarCliente = () => {
  const { validate } = useZodValidation(clienteSchema)
  const { showToast } = useToast()

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

  const prepararDatos = (): CrearClienteDTO => ({
    nombre: form.nombre.trim(),
    apellido_paterno: form.apellido_paterno.trim(),
    apellido_materno: form.apellido_materno.trim() || null,
    correo: form.correo.trim().toLowerCase(),
    telefono: form.telefono.trim(),
  })

  const registrarCliente = async (): Promise<Cliente> => {
    try {
      const { data } = await clienteAPI.post<Cliente>('/nuevo', prepararDatos())
      showToast('¡Cliente registrado con éxito!', 'success')
      return data
    } catch (error: any) {
      showToast(
        error.response?.data?.message || 'Error al registrar cliente',
        'error'
      );
      throw error;
    }
  }

  return { form, resetForm, registrarCliente, validate }
}
