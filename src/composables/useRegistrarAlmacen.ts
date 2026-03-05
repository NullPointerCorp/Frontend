import { reactive } from 'vue'
import type { Almacen } from '@/types/almacen.types'

export const useRegistrarAlmacen = () => {
  const form = reactive({
    sucursal_id: null as number | null,
    nombre_almacen: '',
    descripcion: '',
  })

  const resetForm = () => {
    form.sucursal_id = null
    form.nombre_almacen = ''
    form.descripcion = ''
  }

  const registrarAlmacen = async (): Promise<Almacen> => {
    const token = localStorage.getItem('token')
    const response = await fetch('http://localhost:3000/almacenes/nuevo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Error al registrar almacén')
    return data
  }

  return { form, resetForm, registrarAlmacen }
}