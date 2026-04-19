import { reactive, watch } from 'vue'
import { useZodValidation } from '@/composables/useZodValidation'
import { tipoPaqueteSchema } from '@/modules/tipo_paquete/schemas/TipoPaqueteSchema'
import type { TipoPaquete, CrearTipoPaqueteDTO } from '../interfaces/paquete-interface'
import { useToast } from '@/composables/useToast'
import paqueteAPI from '../api/tipo_paqueteAPI'

const preciosPorTamano: Record<string, number> = {
  'Pequeño': 5,
  'Mediano': 10,
  'Grande': 15,
  'Extra Grande': 20,
}

interface FormRegistrarPaquete {
  cliente_id: number | null;
  tamano: string;
  forma: string;
  precio: number | undefined;
  peso: number | undefined;
}

export const useRegistrarTipoPaquete = () => {
  const { validate } = useZodValidation(tipoPaqueteSchema)
  const { showToast } = useToast()

  const form = reactive<FormRegistrarPaquete>({
    cliente_id: null,
    tamano: '',
    forma: '',
    precio: undefined,
    peso: undefined,
  })

  const resetForm = () => {
    form.cliente_id = null
    form.tamano = ''
    form.forma = ''
    form.precio = undefined
    form.peso = undefined
  }

  const prepararDatos = (): CrearTipoPaqueteDTO => ({
    cliente_id: form.cliente_id!,
    tamano: form.tamano,
    forma: form.forma,
    precio: form.precio ?? null,
    peso: form.peso ?? null,
  })

  const registrarTipoPaquete = async (): Promise<TipoPaquete> => {
    try {
      const { data } = await paqueteAPI.post<TipoPaquete>('/nuevo', prepararDatos()) 
      showToast('¡Paquete registrado con éxito!', 'success')
      return data
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Error al registrar paquete', 'error')
      throw error
    }
  }

  return { form, resetForm, registrarTipoPaquete, validate, preciosPorTamano }
}
