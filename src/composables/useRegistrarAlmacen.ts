import { reactive } from 'vue'
import { useZodValidation } from '@/composables/useZodValidation'
import { almacenSchema } from '@/schemas/almacen.schema'
import type { Almacen } from '@/types/almacen.types'

export const useRegistrarAlmacen = () => {
  const { validate } = useZodValidation(almacenSchema)

  const form = reactive({
    nombre_almacen: '',
    sucursal_id: null as number | null,
    descripcion: '',
  })

  const resetForm = () => {
    form.nombre_almacen = ''
    form.sucursal_id = null
    form.descripcion = ''
  }

  const prepararDatos = () => ({
    nombre_almacen: form.nombre_almacen.trim(),
    sucursal_id: form.sucursal_id,
    descripcion: form.descripcion?.trim() || null,
  })

  const registrarAlmacen = async (): Promise<Almacen> => {
    const token = localStorage.getItem('token')
    const datos = prepararDatos()

    const response = await fetch('http://localhost:3000/almacenes/nuevo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(datos),
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Error al registrar almacén')
    return data
  }

  return { form, resetForm, registrarAlmacen, validate }
}