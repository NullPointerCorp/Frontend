import { ref } from 'vue'
import { useZodValidation } from '@/composables/useZodValidation'
import { actualizarSucursalSchema } from '@/schemas/sucursal.schema'
import { useToast } from '@/composables/useToast'
import type { Sucursal } from '@/types/sucursal.types'

const { showToast } = useToast()

export const useEditarSucursal = (onSuccess: (sucursal: Sucursal) => void) => {
  const { validate } = useZodValidation(actualizarSucursalSchema)

  const dialog = ref(false)
  const loading = ref(false)
  const errorMessage = ref('')
  const sucursalSeleccionada = ref<Sucursal | null>(null)

  const form = ref({
    nombre_sucursal: '',
    colonia: '',
    codigo_postal: '',
    calle: '',
    numero_exterior: '',
    numero_interior: '',
    longitud: undefined as number | undefined,
    latitud: undefined as number | undefined,
    empleado_id_supervisor: null as number | null,
  })

  const abrirModal = (sucursal: Sucursal) => {
    sucursalSeleccionada.value = sucursal
    form.value = {
      nombre_sucursal: sucursal.nombre_sucursal ?? '',
      colonia: sucursal.colonia ?? '',
      codigo_postal: sucursal.codigo_postal ?? '',
      calle: sucursal.calle ?? '',
      numero_exterior: sucursal.numero_exterior ?? '',
      numero_interior: sucursal.numero_interior ?? '',
      longitud: sucursal.longitud ?? undefined,
      latitud: sucursal.latitud ?? undefined,
      empleado_id_supervisor: sucursal.empleado_id_supervisor ?? null,
    }
    dialog.value = true
  }

  const prepararDatos = () => ({
    nombre_sucursal: form.value.nombre_sucursal.trim(),
    colonia: form.value.colonia.trim(),
    codigo_postal: form.value.codigo_postal.trim(),
    calle: form.value.calle.trim(),
    numero_exterior: form.value.numero_exterior.trim(),
    numero_interior: form.value.numero_interior?.trim() || null,
    longitud: form.value.longitud ?? null,
    latitud: form.value.latitud ?? null,
    empleado_id_supervisor: form.value.empleado_id_supervisor ?? null,
  })

  const editarSucursal = async (formRef: any) => {
    const { valid } = await formRef?.validate()

    if (!valid) {
      showToast('Por favor corrige los errores del formulario', 'warning')
      return
    }

    if (!sucursalSeleccionada.value) return

    loading.value = true
    errorMessage.value = ''

    try {
      const token = localStorage.getItem('token')
      const datos = prepararDatos()

      console.log('Enviando:', datos) // Para verificar

      const response = await fetch(
        `http://localhost:3000/sucursales/${sucursalSeleccionada.value.sucursal_id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(datos),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        errorMessage.value = data.message || 'Error al actualizar sucursal'
        return
      }

      onSuccess(data)
      showToast('¡Sucursal modificada con éxito!', 'success')
      dialog.value = false
    } catch (error) {
      errorMessage.value = 'Error al conectar con el servidor'
    } finally {
      loading.value = false
    }
  }

  return {
    dialog,
    loading,
    errorMessage,
    form,
    sucursalSeleccionada,
    abrirModal,
    editarSucursal,
    validate,
  }
}