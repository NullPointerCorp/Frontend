import { reactive } from 'vue'
import { useZodValidation } from '@/composables/useZodValidation'
import { clienteSchema } from '@/schemas/cliente.schema'
import type { Cliente } from '@/types/cliente.types'

export const useRegistrarCliente = () => {
  const { validate, validateAll } = useZodValidation(clienteSchema)

  const form = reactive({
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

  const prepararDatos = () => ({
    nombre: form.nombre.trim(),
    apellido_paterno: form.apellido_paterno.trim(),
    apellido_materno: form.apellido_materno.trim() || null,
    correo: form.correo.trim().toLowerCase(),
    telefono: form.telefono.trim() || null,
  })

  const registrarCliente = async (): Promise<Cliente> => {
    const token = localStorage.getItem('token')
    const datos = prepararDatos()
    
    console.log('Enviando:', datos)
    
    const response = await fetch('http://localhost:3000/clientes/nuevo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(datos),
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Error al registrar cliente')
    return data
  }

  return { form, resetForm, registrarCliente, validate, validateAll }
}