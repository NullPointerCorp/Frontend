import { reactive } from 'vue'
import type { Sucursal } from '@/types/sucursal.types'

export const useRegistrarSucursal = () => {
  const form = reactive({
    nombre_sucursal: '',
    ciudad_id: null as number | null,
    colonia: '',
    codigo_postal: '',
    calle: '',
    numero_exterior: '',
    numero_interior: '',
    longitud: undefined as number | undefined,
    latitud: undefined as number | undefined,
  })

  const resetForm = () => {
    form.nombre_sucursal = ''
    form.ciudad_id = null
    form.colonia = ''
    form.codigo_postal = ''
    form.calle = ''
    form.numero_exterior = ''
    form.numero_interior = ''
    form.longitud = undefined
    form.latitud = undefined
  }

  const registrarSucursal = async (): Promise<Sucursal> => {
    const token = localStorage.getItem('token')
    const response = await fetch('http://localhost:3000/sucursales/nuevo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Error al registrar sucursal')
    return data
  }

  return { form, resetForm, registrarSucursal }
}