import { reactive, watch } from 'vue'
import { useZodValidation } from '@/composables/useZodValidation'
import { paqueteSchema } from '@/modules/paquete/schemas/PaqueteSchema'
import type { Paquete, CrearPaqueteDTO } from '@/modules/paquete/interfaces/paquete-interface'
import { useToast } from '@/composables/useToast'
import paqueteAPI from '../api/paqueteAPI'

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

export const useRegistrarPaquete = () => {
  const { validate } = useZodValidation(paqueteSchema)
  const { showToast } = useToast()

  const form = reactive<FormRegistrarPaquete>({
    cliente_id: null,
    tamano: '',
    forma: '',
    precio: undefined,
    peso: undefined,
  })

  watch(() => form.tamano, (nuevo) => {
    form.precio = preciosPorTamano[nuevo] ?? undefined
  })

  const resetForm = () => {
    form.cliente_id = null
    form.tamano = ''
    form.forma = ''
    form.precio = undefined
    form.peso = undefined
  }

  const prepararDatos = (): CrearPaqueteDTO => ({
    cliente_id: form.cliente_id!,
    tamano: form.tamano,
    forma: form.forma,
    precio: form.precio ?? null,
    peso: form.peso ?? null,
  })

  const registrarPaquete = async (): Promise<Paquete> => {
    try {
      const { data } = await paqueteAPI.post<Paquete>('/nuevo', prepararDatos()) 
      showToast('¡Paquete registrado con éxito!', 'success')
      return data
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Error al registrar paquete', 'error')
      throw error
    }
  }

  return { form, resetForm, registrarPaquete, validate, preciosPorTamano }
}
