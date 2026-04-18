import { reactive } from 'vue'
import { useZodValidation } from '@/composables/useZodValidation'
import { sucursalSchema } from '@/modules/sucursal/schemas/SucursalSchema'
import { useToast } from '@/composables/useToast'
import type { Sucursal, CrearSucursalDTO } from '@/modules/sucursal/interfaces/sucursal-interface'
import sucursalAPI from '../api/sucursalAPI'

interface FormRegistrarSucursal {
  nombre_sucursal: string;
  ciudad_id: number | null;
  colonia: string;
  codigo_postal: string;
  calle: string;
  numero_exterior: string;
  numero_interior: string;
  longitud: number | undefined;
  latitud: number | undefined;
  empleado_id_supervisor: number | null;
}

export const useRegistrarSucursal = () => {
  const { validate } = useZodValidation(sucursalSchema)
  const { showToast } = useToast()

  const form = reactive<FormRegistrarSucursal>({
    nombre_sucursal: '',
    ciudad_id: null,
    colonia: '',
    codigo_postal: '',
    calle: '',
    numero_exterior: '',
    numero_interior: '',
    longitud: undefined,
    latitud: undefined,
    empleado_id_supervisor: null,
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

  const prepararDatos = (): CrearSucursalDTO => ({
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
    try {
      const { data } = await sucursalAPI.post<Sucursal>('/nuevo', prepararDatos()) // ✅ axios
      showToast('¡Sucursal registrada con éxito!', 'success')
      return data
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Error al registrar sucursal', 'error')
      throw error
    }
  }

  return { form, resetForm, registrarSucursal, validate }
}
