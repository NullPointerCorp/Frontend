import { reactive, watch } from 'vue'
import { useZodValidation } from '@/composables/useZodValidation'
import { paqueteSchema } from '@/schemas/paquete.schema'
import type { Paquete } from '@/types/paquete.types'

const preciosPorTamano: Record<string, number> = {
  'Pequeño': 5,
  'Mediano': 10,
  'Grande': 15,
  'Extra Grande': 20,
}

export const useRegistrarPaquete = () => {
  const { validate } = useZodValidation(paqueteSchema)

  const form = reactive({
    cliente_id: null as number | null,
    tamano: '' as string,
    forma: '' as string,
    precio: undefined as number | undefined,
    peso: undefined as number | undefined,
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

  const prepararDatos = () => ({
    cliente_id: form.cliente_id,
    tamano: form.tamano,
    forma: form.forma,
    precio: form.precio ?? null,
    peso: form.peso ?? null,
  })

  const registrarPaquete = async (): Promise<Paquete> => {
    const token = localStorage.getItem('token')
    const datos = prepararDatos()

    const response = await fetch('http://localhost:3000/paquetes/nuevo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(datos),
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Error al registrar paquete')
    return data
  }

  return { form, resetForm, registrarPaquete, validate, preciosPorTamano }
}