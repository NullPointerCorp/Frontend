import { reactive } from 'vue'
import { useZodValidation } from '@/composables/useZodValidation'
import { almacenSchema } from '@/modules/almacen/schemas/almacen.schema'
import type { Almacen, CrearAlmacenDTO } from '@/modules/almacen/interfaces/almacen-interface'
import { useToast } from '@/composables/useToast'
import almacenAPI from '../api/almacenAPI'

interface FormAlmacen {
  nombre_almacen: string;
  sucursal_id: number | null;
  descripcion: string;
}

export const useRegistrarAlmacen = () => {
  const { validate } = useZodValidation(almacenSchema)
  const { showToast } = useToast()

  const form = reactive<FormAlmacen>({
    nombre_almacen: '',
    sucursal_id: null,   
    descripcion: '',
  })

  const resetForm = () => {
    form.nombre_almacen = ''
    form.sucursal_id = null  
    form.descripcion = ''
  }

  const prepararDatos = (): CrearAlmacenDTO => ({
    nombre_almacen: form.nombre_almacen.trim(),
    sucursal_id: form.sucursal_id!,             
    descripcion: form.descripcion?.trim() || undefined,
  })

  const registrarAlmacen = async (): Promise<Almacen> => {
    try {
      const datos = prepararDatos()
      const { data } = await almacenAPI.post('/nuevo', datos)
      showToast(`¡Almacén "${form.nombre_almacen}" registrado con éxito!`, 'success')
      return data
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Error de conexión con el servidor', 'error')
      throw error
    }
  }

  return { form, resetForm, registrarAlmacen, validate }
}
