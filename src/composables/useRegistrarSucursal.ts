import { reactive } from 'vue'
import { useZodValidation } from '@/composables/useZodValidation'
import { sucursalSchema } from '@/schemas/sucursal.schema'
import type { Sucursal } from '@/types/sucursal.types'

export const useRegistrarSucursal = () => {
  const { validate } = useZodValidation(sucursalSchema)

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
    empleado_id_supervisor: null as number | null,
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
    form.empleado_id_supervisor = null
  }

  const prepararDatos = () => ({
    nombre_sucursal: form.nombre_sucursal.trim(),
    ciudad_id: form.ciudad_id,
    colonia: form.colonia.trim(),
    codigo_postal: form.codigo_postal.trim(),
    calle: form.calle.trim(),
    numero_exterior: form.numero_exterior.trim(),
    numero_interior: form.numero_interior?.trim() || null,
    longitud: form.longitud ?? null,
    latitud: form.latitud ?? null,
    empleado_id_supervisor: form.empleado_id_supervisor ?? null,
  })

  const registrarSucursal = async (): Promise<Sucursal> => {
    const token = localStorage.getItem('token')
    const datos = prepararDatos()

    const response = await fetch('http://localhost:3000/sucursales/nuevo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(datos),
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Error al registrar sucursal')
    return data
  }

  return { form, resetForm, registrarSucursal, validate }
}